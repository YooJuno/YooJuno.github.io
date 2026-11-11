import json

import numpy as np


def wrap_angle(angle):
    return np.arctan2(np.sin(angle), np.cos(angle))


def motion(state, speed, yaw_rate, time_step):
    position_x, position_y, heading = state
    return np.array([
        position_x + speed * time_step * np.cos(heading),
        position_y + speed * time_step * np.sin(heading),
        wrap_angle(heading + yaw_rate * time_step),
    ])


def predict(state, covariance, speed, yaw_rate, time_step, control_covariance):
    heading = state[2]
    transition_jacobian = np.array([
        [1.0, 0.0, -speed * time_step * np.sin(heading)],
        [0.0, 1.0, speed * time_step * np.cos(heading)],
        [0.0, 0.0, 1.0],
    ])
    control_jacobian = np.array([
        [time_step * np.cos(heading), 0.0],
        [time_step * np.sin(heading), 0.0],
        [0.0, time_step],
    ])
    predicted_state = motion(state, speed, yaw_rate, time_step)
    predicted_covariance = (
        transition_jacobian @ covariance @ transition_jacobian.T
        + control_jacobian @ control_covariance @ control_jacobian.T
    )
    return predicted_state, 0.5 * (predicted_covariance + predicted_covariance.T)


def correct_position(state, covariance, measurement, measurement_covariance, gate=9.21):
    observation_jacobian = np.array([
        [1.0, 0.0, 0.0],
        [0.0, 1.0, 0.0],
    ])
    innovation = measurement - observation_jacobian @ state
    innovation_covariance = (
        observation_jacobian @ covariance @ observation_jacobian.T
        + measurement_covariance
    )
    normalized_innovation = float(
        innovation @ np.linalg.solve(innovation_covariance, innovation)
    )
    if normalized_innovation > gate:
        return state, covariance, normalized_innovation, False
    cross_covariance = covariance @ observation_jacobian.T
    kalman_gain = np.linalg.solve(innovation_covariance, cross_covariance.T).T
    corrected_state = state + kalman_gain @ innovation
    corrected_state[2] = wrap_angle(corrected_state[2])
    residual_map = np.eye(3) - kalman_gain @ observation_jacobian
    corrected_covariance = (
        residual_map @ covariance @ residual_map.T
        + kalman_gain @ measurement_covariance @ kalman_gain.T
    )
    corrected_covariance = 0.5 * (corrected_covariance + corrected_covariance.T)
    return corrected_state, corrected_covariance, normalized_innovation, True


def simulate(seed=7, inject_outlier=True):
    generator = np.random.default_rng(seed)
    time_step = 0.1
    speed_std = 0.08
    yaw_rate_std = 0.02
    position_std = 0.30
    control_covariance = np.diag([speed_std**2, yaw_rate_std**2])
    measurement_covariance = np.eye(2) * position_std**2
    truth = np.zeros(3)
    dead_reckoning = np.zeros(3)
    estimate = np.zeros(3)
    covariance = np.diag([0.04, 0.04, np.deg2rad(10.0)**2])
    dead_errors = []
    fused_errors = []
    accepted_updates = 0
    rejected_updates = 0

    for step in range(1, 601):
        truth = motion(truth, 1.0, 0.15, time_step)
        measured_speed = 1.0 + generator.normal(0.0, speed_std)
        measured_yaw_rate = 0.15 + generator.normal(0.0, yaw_rate_std)
        dead_reckoning = motion(dead_reckoning, measured_speed, measured_yaw_rate, time_step)
        estimate, covariance = predict(
            estimate, covariance, measured_speed, measured_yaw_rate,
            time_step, control_covariance,
        )
        if step % 10 == 0:
            measurement = truth[:2] + generator.normal(0.0, position_std, size=2)
            if inject_outlier and step == 300:
                measurement += np.array([5.0, -5.0])
            estimate, covariance, _, accepted = correct_position(
                estimate, covariance, measurement, measurement_covariance,
            )
            accepted_updates += int(accepted)
            rejected_updates += int(not accepted)
        dead_errors.append(np.sum((dead_reckoning[:2] - truth[:2])**2))
        fused_errors.append(np.sum((estimate[:2] - truth[:2])**2))

    return {
        'seed': seed,
        'duration_seconds': 60,
        'dead_reckoning_rmse_m': round(float(np.sqrt(np.mean(dead_errors))), 4),
        'ekf_rmse_m': round(float(np.sqrt(np.mean(fused_errors))), 4),
        'accepted_position_updates': accepted_updates,
        'rejected_position_updates': rejected_updates,
    }


if __name__ == '__main__':
    print(json.dumps(simulate(), indent=2))
