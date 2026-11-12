import portfolio from '../content/webservices/portfolio.json'
import cctv from '../content/webservices/cctv.json'
import video from '../content/webservices/video.json'
import btc from '../content/webservices/btc.json'
import hellog from '../content/webservices/hellog.json'
import moim from '../content/webservices/moim.json'
import mapEditor from '../content/webservices/map-editor.json'

export const webServices = [moim, mapEditor, portfolio, cctv, video, btc, hellog].map(service => {
  const site = service.site?.trim() || ''
  return { ...service, site, availability: site ? '웹 공개' : '웹 미공개' }
})
export const getWebService = id => webServices.find(service => service.id === id)
