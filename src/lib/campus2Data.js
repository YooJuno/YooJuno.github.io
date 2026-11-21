export const CAMPUS2_TITLE = 'Campus2 3D 점군'
export const CAMPUS2_DATA = {
  structureUrl: '/content/point-clouds/campus2/structure.pcd',
  ground: {
    url: '/content/point-clouds/campus2/ground.pcd',
    tileSize: 0.1,
  },
  floors: [
    { level: 5, color: '#76aaff' },
    { level: 6, color: '#61ccef' },
    { level: 7, color: '#62ddb1' },
    { level: 8, color: '#bce579' },
    { level: 9, color: '#ffc46d' },
    { level: 10, color: '#ff938b' },
  ],
  poster: {
    src: '/content/images/blog/elevator-lio/campus2-floor-detail.jpg',
    alt: 'Campus2 5~10층 점군의 측면도',
  },
}
