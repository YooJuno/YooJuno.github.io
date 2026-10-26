const cookieName = '__Host-cms-oauth-state'
const cookieOptions = 'Path=/; HttpOnly; Secure; SameSite=Lax'

const randomToken = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  return btoa(String.fromCharCode(...bytes)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}

const scriptValue = value => JSON.stringify(value).replaceAll('<', '\\u003c')

const complete = (origin, outcome, payload, status = 200) => {
  const nonce = randomToken()
  const result = `authorization:github:${outcome}:${JSON.stringify(payload)}`
  const html = `<!doctype html><html lang="ko"><head><meta charset="UTF-8"><meta name="robots" content="noindex,nofollow"><meta name="viewport" content="width=device-width,initial-scale=1"><title>블로그 관리자 인증</title></head><body><p>인증 결과를 관리자 화면에 전달하고 있습니다. 이 창은 닫아도 됩니다.</p><script nonce="${nonce}">
const origin = ${scriptValue(origin)};
const result = ${scriptValue(result)};
if (window.opener) {
  const receive = event => {
    if (event.origin !== origin || event.source !== window.opener || event.data !== 'authorizing:github') return;
    window.removeEventListener('message', receive);
    window.opener.postMessage(result, origin);
  };
  window.addEventListener('message', receive);
  window.opener.postMessage('authorizing:github', origin);
}
</script></body></html>`
  return new Response(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff',
      'Set-Cookie': `${cookieName}=; Max-Age=0; ${cookieOptions}`,
      'Content-Security-Policy': `default-src 'none'; script-src 'nonce-${nonce}'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'`,
    },
  })
}

const github = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: { Accept: 'application/json', 'User-Agent': 'YooJuno-Blog-CMS', ...options.headers },
    signal: AbortSignal.timeout(15000),
  })
  if (!response.ok) throw new Error('GitHub 인증을 확인하지 못했습니다. 다시 시도해주세요.')
  return response.json()
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const origin = env.CMS_ORIGIN
    const configured = Boolean(origin && env.ALLOWED_LOGIN && env.GITHUB_REPO &&
      env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET)

    if (url.pathname === '/health' && request.method === 'GET') {
      return Response.json({ ready: configured }, {
        status: configured ? 200 : 503,
        headers: {
          'Access-Control-Allow-Origin': origin || 'https://yoojuno.github.io',
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff',
          Vary: 'Origin',
        },
      })
    }
    if (request.method !== 'GET') return new Response('Method not allowed', { status: 405 })
    if (!configured) return new Response('GitHub OAuth 설정이 필요합니다.', { status: 503 })
    if (new URL(origin).origin !== origin || !origin.startsWith('https://')) {
      return new Response('CMS_ORIGIN 설정을 확인해주세요.', { status: 503 })
    }

    if (url.pathname === '/auth') {
      if (url.searchParams.get('provider') !== 'github' || url.searchParams.get('site_id') !== new URL(origin).host) {
        return new Response('허용되지 않은 인증 요청입니다.', { status: 403 })
      }
      const state = randomToken()
      const authorize = new URL('https://github.com/login/oauth/authorize')
      authorize.search = new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        redirect_uri: `${url.origin}/callback`,
        scope: 'public_repo',
        state,
        allow_signup: 'false',
      }).toString()
      return new Response(null, {
        status: 302,
        headers: {
          Location: authorize.href,
          'Cache-Control': 'no-store',
          'Referrer-Policy': 'no-referrer',
          'Set-Cookie': `${cookieName}=${state}; Max-Age=600; ${cookieOptions}`,
        },
      })
    }

    if (url.pathname !== '/callback') return new Response('Not found', { status: 404 })
    const fail = (message, status = 400) => complete(origin, 'error', { message }, status)
    const cookies = (request.headers.get('Cookie') || '').split(';').map(value => value.trim())
    const state = cookies.find(value => value.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1)
    if (!state || url.searchParams.get('state') !== state) return fail('인증 요청이 만료되었거나 올바르지 않습니다.')
    if (url.searchParams.has('error')) return fail('GitHub 로그인이 취소되었습니다.')
    const code = url.searchParams.get('code')
    if (!code) return fail('인증 코드가 없습니다.')

    try {
      const credentials = await github('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          redirect_uri: `${url.origin}/callback`,
          code,
        }),
      })
      if (typeof credentials.access_token !== 'string' || credentials.error) return fail('GitHub 인증에 실패했습니다.')
      const options = { headers: { Authorization: `Bearer ${credentials.access_token}` } }
      const user = await github('https://api.github.com/user', options)
      if (user.login?.toLowerCase() !== env.ALLOWED_LOGIN.toLowerCase()) return fail('관리자 계정만 로그인할 수 있습니다.', 403)
      const repository = await github(`https://api.github.com/repos/${env.GITHUB_REPO}`, options)
      if (!repository.permissions?.push) return fail('블로그 저장소에 쓰기 권한이 없습니다.', 403)
      return complete(origin, 'success', { token: credentials.access_token, provider: 'github' })
    } catch {
      return fail('GitHub에 연결하지 못했습니다. 잠시 후 다시 시도해주세요.', 502)
    }
  },
}
