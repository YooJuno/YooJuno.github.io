const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

const readString = (value) => {
  if (value.startsWith('"') && value.endsWith('"')) {
    try {
      return JSON.parse(value)
    } catch {
      return value.slice(1, -1)
    }
  }
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1)
  return value
}

const readList = (value) => {
  try {
    const items = JSON.parse(value)
    if (Array.isArray(items) && items.every(item => typeof item === 'string')) return items
  } catch {
    return value.slice(1, -1).split(',').map(item => readString(item.trim())).filter(Boolean)
  }
  return value.slice(1, -1).split(',').map(item => readString(item.trim())).filter(Boolean)
}

export const parseFrontMatter = (raw) => {
  const cleaned = raw.replace(/^\uFEFF/, '')
  const match = cleaned.match(FRONT_MATTER)
  if (!match) return { data: {}, content: cleaned }
  const data = {}
  const lines = match[1].split('\n')

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex].trim()
    if (!line || line.startsWith('#')) continue
    const separator = line.indexOf(':')
    if (separator === -1) continue
    const key = line.slice(0, separator).trim()
    const value = line.slice(separator + 1).trim()
    if (!value) {
      const list = []
      let nextIndex = lineIndex + 1
      while (nextIndex < lines.length) {
        const next = lines[nextIndex].trim()
        if (!next) {
          nextIndex += 1
          continue
        }
        if (!next.startsWith('-')) break
        list.push(readString(next.replace(/^-+/, '').trim()))
        nextIndex += 1
      }
      data[key] = list.length ? list : ''
      if (list.length) lineIndex = nextIndex - 1
    } else if (value.startsWith('[') && value.endsWith(']')) {
      data[key] = readList(value)
    } else {
      data[key] = readString(value)
    }
  }

  return { data, content: cleaned.slice(match[0].length) }
}
