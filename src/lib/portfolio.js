import PROFILE from '../content/portfolio/profile.json'
import PROFILE_FACTS from '../content/portfolio/background.json'
import SUPPLEMENTARY_RECORDS from '../content/portfolio/records.json'
import { createPortfolioEntries } from './portfolioMarkdown.js'

const projectModules = import.meta.glob('../content/portfolio/projects/**/index.md', {
  eager: true, query: '?raw', import: 'default',
})
const careerModules = import.meta.glob('../content/portfolio/careers/**/index.md', {
  eager: true, query: '?raw', import: 'default',
})
const assets = import.meta.glob('../content/portfolio/**/*.{png,jpg,jpeg,webp,svg,gif,avif,pdf,mp4,webm,PNG,JPG,JPEG,WEBP,SVG,GIF,AVIF,PDF,MP4,WEBM}', {
  eager: true, query: '?url', import: 'default',
})

export const PROJECTS = createPortfolioEntries(projectModules, assets, 'project')
export const EXPERIENCES = createPortfolioEntries(careerModules, assets, 'career')
export { PROFILE, PROFILE_FACTS, SUPPLEMENTARY_RECORDS }
