import type { CategoryIds } from '../utils/tpb/apibay.org.js'
import { tpbApi } from '../utils/tpb/apibay.org.js'

export default defineEventHandler(async (event) => {
  const { query, category = 'All' } = await readBody(event)

  if (!query) {
    return tpbApi.top100('all')
  }

  const categoryMap: Record<string, number> = {
    Audio: 100,
    Video: 200,
    Applications: 300,
    Games: 400,
  }

  return await tpbApi.search({ q: query, cat: categoryMap[category] as CategoryIds })
})
