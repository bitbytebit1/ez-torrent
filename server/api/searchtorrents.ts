import torrentSearchApi from 'torrent-search-api'

torrentSearchApi.enablePublicProviders()
export default defineEventHandler(async (event) => {
  const { query, category = 'All' } = await readBody(event)
  return await torrentSearchApi.search(query, category, 100)
})
