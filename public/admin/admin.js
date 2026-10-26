const status = document.getElementById('admin-status')
const message = document.getElementById('status-message')
const retry = document.getElementById('retry')
const local = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)

window.CMS_MANUAL_INIT = true
retry.addEventListener('click', () => window.location.reload())

const loadEditor = () => new Promise((resolve, reject) => {
  const script = document.createElement('script')
  script.src = 'https://unpkg.com/decap-cms@3.17.3/dist/decap-cms.js'
  script.integrity = 'sha384-RWRzuHfiZSWCt3nEvG7B0v3cMgM1C2UuJmgBSL92GQh4uXmNSkbcthql/mNBqvjr'
  script.crossOrigin = 'anonymous'
  script.onload = resolve
  script.onerror = () => reject(new Error('편집기를 불러오지 못했습니다. 네트워크 연결을 확인해주세요.'))
  document.head.append(script)
})

const start = async () => {
  const response = await fetch('/admin/settings.json', { cache: 'no-store' })
  if (!response.ok) throw new Error('관리자 설정 파일을 불러오지 못했습니다.')
  const settings = await response.json()
  const config = { load_config_file: true, local_backend: false }

  if (local) {
    document.getElementById('local-help').hidden = false
    message.textContent = '로컬 편집 서버를 확인하고 있습니다.'
    const proxy = 'http://127.0.0.1:8081/api/v1'
    const check = await fetch(proxy, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'info' }),
      signal: AbortSignal.timeout(3000),
    }).catch(() => null)
    if (!check?.ok) throw new Error('로컬 편집 서버가 실행되어 있지 않습니다.')
    const info = await check.json()
    if (info.type !== 'local_fs') throw new Error('파일 편집 모드가 필요합니다. MODE=fs로 편집 서버를 실행해주세요.')
    config.local_backend = { url: proxy, allowed_hosts: ['localhost', '127.0.0.1'] }
    config.publish_mode = 'simple'
    config.backend = { name: 'git-gateway' }
  } else {
    if (!settings.oauthBaseUrl) {
      message.textContent = 'GitHub 로그인 연결이 필요합니다.'
      document.getElementById('setup-help').hidden = false
      return
    }
    const endpoint = new URL(settings.oauthBaseUrl)
    if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password ||
        endpoint.pathname !== '/' || endpoint.search || endpoint.hash) {
      throw new Error('인증 서버 주소는 경로가 없는 HTTPS 주소여야 합니다.')
    }
    config.backend = { base_url: endpoint.origin }
    const health = await fetch(`${endpoint.origin}/health`, { signal: AbortSignal.timeout(5000) })
    if (!health.ok || !(await health.json()).ready) {
      document.getElementById('setup-help').hidden = false
      throw new Error('인증 서버의 GitHub OAuth 설정을 완료해주세요.')
    }
  }

  message.textContent = '편집기를 불러오고 있습니다.'
  if (!localStorage.getItem('cms.md-mode')) localStorage.setItem('cms.md-mode', 'raw')
  await loadEditor()
  const cms = window.CMS
  cms.registerPreviewStyle('/admin/preview.css')
  cms.registerPreviewTemplate('posts', ({ entry, widgetFor }) => {
    const data = entry.get('data')
    const create = window.h
    return create('main', { className: 'post-main' },
      create('header', { className: 'post-header' },
        create('div', { className: 'post-meta' },
          create('span', null, data.get('category')),
          create('time', null, String(data.get('date') || '').slice(0, 10))),
        create('h1', null, data.get('title')),
        create('div', { className: 'post-tags' },
          ...(data.get('tags')?.toArray() || []).map(tag => create('span', { key: tag }, `#${tag}`)))),
      create('article', { className: 'post-content' }, widgetFor('body')))
  })
  cms.registerEventListener({
    name: 'preSave',
    handler: ({ entry }) => {
      const data = entry.get('data')
      const path = entry.get('path')
      if (path && !entry.get('newRecord')) {
        const folder = path.split('/').at(-2)
        if (data.get('slug') !== folder) throw new Error('기존 글의 주소는 변경할 수 없습니다.')
      }
      return data
    },
  })
  await cms.init({ config })
  status.hidden = true
}

start().catch(error => {
  message.textContent = error.message
  retry.hidden = false
})
