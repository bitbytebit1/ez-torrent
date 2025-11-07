export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.query) {
    return { description: [] }
  }

  return $fetch(`https://imdb.iamidiotareyoutoo.com/search?q=${body.query}`)
})
