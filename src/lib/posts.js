import entries, { postLoaders } from 'virtual:blog-index'

export const posts = entries

const loadedPosts = new Map()
const pendingPosts = new Map()
let searchText = null
let searchRequest = null

const normalizeSlug = value => {
  let normalized = String(value || '').trim().replace(/^\/+|\/+$/g, '')
  try {
    normalized = decodeURIComponent(normalized)
  } catch {
    return normalized.toLowerCase()
  }
  return normalized.toLowerCase()
}

export const getPostBySlug = slug => {
  const target = normalizeSlug(slug)
  return posts.find(post => normalizeSlug(post.slug) === target)
}

export const getLoadedPost = slug => {
  const post = getPostBySlug(slug)
  return post ? loadedPosts.get(post.slug) : null
}

export const loadPostBySlug = slug => {
  const post = getPostBySlug(slug)
  if (!post) return Promise.resolve(null)
  if (loadedPosts.has(post.slug)) return Promise.resolve(loadedPosts.get(post.slug))
  if (!pendingPosts.has(post.slug)) {
    const request = postLoaders[post.slug]()
      .then(module => {
        loadedPosts.set(post.slug, module.default)
        return module.default
      })
      .finally(() => pendingPosts.delete(post.slug))
    pendingPosts.set(post.slug, request)
  }
  return pendingPosts.get(post.slug)
}

export const getCachedSearchText = () => searchText

export const loadSearchText = () => {
  if (searchText) return Promise.resolve(searchText)
  if (!searchRequest) {
    searchRequest = import('virtual:blog-search')
      .then(module => {
        searchText = module.default
        return searchText
      })
      .finally(() => { searchRequest = null })
  }
  return searchRequest
}
