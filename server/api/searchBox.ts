export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.query) {
    return { description: [] }
  }

  // const response = await $fetch(`https://imdb.iamidiotareyoutoo.com/search?q=${body.query}`).catch(() => null)
  return { description: [] }
})
