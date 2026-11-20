# DDDMR Navigation 그림과 출처

글의 구현 설명은 2026년 11월 6~9일에 확인한 다음 소스 스냅샷에 근거한다. [DDDMR Navigation `02f3bfe`](https://github.com/dfl-rlab/dddmr_navigation/tree/02f3bfe56217ac4e99f3af1e273cc3cbcb2024e4)

## 직접 그린 개념도

- `stack.svg` — 저장 지도의 재사용과 플래너 입력.
- `mapping-workflow.svg` — 거리 영상, 특징 정합, 포즈 그래프.
- `mcl-workflow.svg` — 입자 예측과 관측 갱신, 재표본화.

## 공식 문서 그림

Copyright (c) 2025, Robotics Lab - Dubai Future Labs. BSD 3-Clause. 공식 그림은 원본 바이트를 유지했으며, 같은 스냅샷의 라이선스 전문은 `LICENSE-dddmr-documentation.txt`에 있다.

| 로컬 파일 | 원본 | SHA-256 |
| --- | --- | --- |
| `demo-architecture.png` | [dddmr_navigation/navigation_diagram.png](https://raw.githubusercontent.com/dfl-rlab/dddmr_documentation_materials/d681db90715905ba264f4cac9930dde0d95a426c/dddmr_navigation/navigation_diagram.png) | `c19a239c1b94cbc291098360adce11ed0100ae8d3b456833da177ba3a318d422` |
| `demo-submap.png` | [dddmr_mcl_3dl/mcl_3dl_submap_illustration.png](https://raw.githubusercontent.com/dfl-rlab/dddmr_documentation_materials/d681db90715905ba264f4cac9930dde0d95a426c/dddmr_mcl_3dl/mcl_3dl_submap_illustration.png) | `4108f17fde73dc425b04968a9bd7362c22367f427f82c966ea0281b70e13c7c3` |
| `demo-global-plan.png` | [global_planner/global_plan.png](https://raw.githubusercontent.com/dfl-rlab/dddmr_documentation_materials/d681db90715905ba264f4cac9930dde0d95a426c/global_planner/global_plan.png) | `7c9c346999e4a70ef67e2d3fc82de62c749c584275af404c49b698b45ddd606f` |
| `demo-local-plan.png` | [local_planner/local_planner_play_ground_annotated.png](https://raw.githubusercontent.com/dfl-rlab/dddmr_documentation_materials/d681db90715905ba264f4cac9930dde0d95a426c/local_planner/local_planner_play_ground_annotated.png) | `a4cd23fa67057998d74d377b6fc5131d790585b530a925f5315f6facca05cac3` |
| `LICENSE-dddmr-documentation.txt` | [LICENSE](https://raw.githubusercontent.com/dfl-rlab/dddmr_documentation_materials/d681db90715905ba264f4cac9930dde0d95a426c/LICENSE) | `6dfbf9cb772f99eab643b92876797ea3f8d242e287aeeb5bba325f0dfeb11155` |

## XT32 재생 자료

실험 자료 묶음 `xt32_improvement_20261106/`을 기준으로 한 상대 경로다. 그림 파일은 원본 바이트를 유지했다. 지도와 MCL 출력은 추정 결과이며 참고 2D 지도도 같은 기록의 추정치다.

| 로컬 파일 | 실험 자료 상대 경로 | SHA-256 |
| --- | --- | --- |
| `xt32-full-map.png` | `previews/full_map_20261109.png` | `a257362f2bc191b8dc7fbb55ee4483eb198c80c08a1def57b61b4e9271d2bb78` |
| `xt32-map-comparison.png` | `mapping_quality_audit_20261109/mapping_failure_comparison.png` | `6800c9fafe9ecaadda159f4358355fb0bc764a5e2250535949942abcee3ffca4` |
| `xt32-revisit-overlap.png` | `mapping/fixed_full_20261109/overlap_quality/revisit_examples.png` | `ddce0f220778e2ccd2cc9df79317d40cc924e300d1762034a8de1bb08b3dd589` |
| `xt32-mcl-jump.png` | `trials/full_dense_imu_resolution_seed17/evidence/jump_at_570s.png` | `2ca5def545277fcb1607150d04d3299efa5862f794438b6330d8ec54d81c9755` |
| `xt32-mcl-consistency.png` | `trials/full_dense_imu_resolution_seed17/quality/keyframe_consistency.png` | `10f15624b0136831bed05f0892ba7945386683f979c577651169e21f8b36de4b` |
| `xt32-first-loop.png` | `root_cause_20261109/first_loop_cause.png` | `a0b4c7ebb0b87f7962851780ef9f1fc531bbc90905cf670bec88223384b9c3b1` |
| `xt32-partial-heading.png` | `root_cause_20261109/historical_fanning_timeline.png` | `1c1c163d0ff41bb60f71bf6b805cccf4315c96ca5fdc4b5700a9dc8f8297a50e` |
| `xt32-partial-overlap.png` | `root_cause_20261109/structural_collapse_timeline.png` | `70006c2732da36d40beac3e6a91990b5554f913a7cbc23c20aaa7def55f03f82` |

수치와 판정은 다음 기록에서 확인했다.

- `REPORT_20261109.txt` — 원본 입력, V1 지도 내보내기, 전체 MCL 재생.
- `mapping_quality_audit_20261109/REPORT.txt` — 전체 지도 형상 비교, 링 진단 정정.
- `root_cause_20261109/first_loop_replay/same_solver_comparison.json` — 관측과 솔버를 고정한 ICP 초기값 비교.
- `root_cause_20261109/CHECKPOINT.json` — 부분 재생 중단 시점과 구조 불일치 판정.
