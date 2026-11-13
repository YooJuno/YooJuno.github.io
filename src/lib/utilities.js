const entries = import.meta.glob('../content/utilities/*.json', { eager: true, import: 'default' })
const order = ['lidar-studio', 'map-editor', 'ubuntu-status-bar', 'volidge', 'capture-board-viewer', 'wifi-analyzer']

export const utilities = order.map(id => Object.values(entries).find(entry => entry.id === id))
export const getUtility = slug => utilities.find(utility => utility.id === slug)
