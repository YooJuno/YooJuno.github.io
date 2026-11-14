import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ROUTE_META } from '../src/lib/routeMeta.js'

export function validateUtilities(root) {
  const directory = path.join(root, 'src/content/utilities')
  const ids = new Set()
  let screens = 0
  let examples = 0
  for (const filename of fs.readdirSync(directory).filter(name => name.endsWith('.json'))) {
    const entry = JSON.parse(fs.readFileSync(path.join(directory, filename), 'utf8'))
    const check = (valid, message) => {
      if (!valid) throw new Error(`${filename}: ${message}`)
    }
    for (const field of ['id', 'title', 'summary', 'purpose', 'github', 'revision', 'distributionNote', 'buildUrl']) {
      check(typeof entry[field] === 'string' && entry[field].trim(), `${field} 값을 확인하세요.`)
    }
    check(entry.id === filename.slice(0, -5) && !ids.has(entry.id), '파일 이름과 ID 또는 중복 ID를 확인하세요.')
    ids.add(entry.id)
    check(entry.route === `/utilities/${entry.id}` && ROUTE_META[entry.route], '라우트와 메타데이터를 확인하세요.')
    check(entry.summary.length <= 110, '요약은 110자 이내로 작성하세요.')
    check(/^[a-f0-9]{40}$/.test(entry.revision), '확인한 전체 커밋 SHA를 입력하세요.')
    check(['published', 'local'].includes(entry.sourceState), '소스 공개 상태를 확인하세요.')
    if (entry.sourceState === 'local') {
      check(/^[a-f0-9]{64}$/.test(entry.sourceSnapshot), '로컬 작업본의 SHA-256을 입력하세요.')
      check(typeof entry.sourceNote === 'string' && entry.sourceNote.trim(), '로컬 작업본의 검토 범위를 설명하세요.')
    }
    check(Array.isArray(entry.platforms) && entry.platforms.length, '지원 환경을 입력하세요.')
    for (const field of ['tech', 'overview', 'screens', 'features', 'architecture', 'decisions', 'limitations', 'sources', 'examples', 'compatibility']) {
      check(Array.isArray(entry[field]) && entry[field].length, `${field} 항목을 입력하세요.`)
    }
    check(entry.examples.length <= 3, '사용 예시는 핵심 작업 3개 이내로 작성하세요.')
    const exampleTitles = new Set()
    for (const example of entry.examples) {
      for (const field of ['title', 'input', 'result', 'note']) {
        check(typeof example[field] === 'string' && example[field].trim(), `사용 예시의 ${field} 값을 입력하세요.`)
      }
      check(!exampleTitles.has(example.title), '사용 예시 제목이 중복되었습니다.')
      exampleTitles.add(example.title)
      check(Array.isArray(example.steps) && example.steps.length > 0 && example.steps.length <= 5, '사용 예시의 조작 순서는 1–5단계로 작성하세요.')
      check(example.steps.every(step => typeof step === 'string' && step.trim()), '사용 예시의 조작 설명을 입력하세요.')
    }
    examples += entry.examples.length
    for (const target of entry.compatibility) {
      for (const field of ['environment', 'format', 'note']) {
        check(typeof target[field] === 'string' && target[field].trim(), `지원 환경의 ${field} 값을 입력하세요.`)
      }
    }
    for (const field of ['github', 'site', 'downloadUrl', 'buildUrl']) {
      if (entry[field]) check(new URL(entry[field]).protocol === 'https:', `${field}는 실제 HTTPS 주소여야 합니다.`)
    }
    const screenIds = new Set()
    for (const screen of entry.screens) {
      check(screen.id && !screenIds.has(screen.id), '중복 화면 ID를 확인하세요.')
      screenIds.add(screen.id)
      check(screen.title && screen.alt && screen.caption && Array.isArray(screen.annotations), '화면 제목·대체 텍스트·출처 설명을 확인하세요.')
      check(screen.image.startsWith('/content/images/'), '화면 이미지는 public/content/images 안에서 관리하세요.')
      const imagePath = path.resolve(root, 'public', `.${screen.image}`)
      check(imagePath.startsWith(path.resolve(root, 'public/content/images') + path.sep), '이미지 경로 범위를 확인하세요.')
      check(fs.existsSync(imagePath), `이미지가 없습니다: ${screen.image}`)
      const bytes = fs.readFileSync(imagePath)
      check(bytes.subarray(0, 8).toString('hex') === '89504e470d0a1a0a', '화면 캡처는 PNG로 저장하세요.')
      check(bytes.readUInt32BE(16) === screen.width && bytes.readUInt32BE(20) === screen.height, `이미지 원본 크기를 확인하세요: ${screen.image}`)
      screens += 1
    }
  }
  return { entries: ids.size, screens, examples }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = validateUtilities(fileURLToPath(new URL('../', import.meta.url)))
  console.log(`유틸리티 ${result.entries}개·화면 ${result.screens}개·사용 예시 ${result.examples}개: 목적·주소·이미지·지원 환경 확인 완료`)
}
