import torrentSearchApi from 'torrent-search-api'

torrentSearchApi.enablePublicProviders()
export default defineEventHandler(async (event) => {
  const { query } = await readBody(event)
  //   return await await PirateBay.search(query)
  return await torrentSearchApi.search(query, 'All', 100)
})
