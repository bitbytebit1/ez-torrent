import torrentSearchApi from 'torrent-search-api'
import Transmission from 'transmission'

torrentSearchApi.enablePublicProviders()

export default defineEventHandler(async (event) => {
  const { host, port, username, password, directory } = useRuntimeConfig().transmission
  const transmission = new Transmission({
    host, // Your Transmission host (change if needed)
    port, // Transmission RPC port
    username, // Your Transmission RPC username
    password, // Your Transmission RPC password
  })
  const { torrent } = await readBody(event)
  // Magnet link you want to add

  const magnetLink = await torrentSearchApi.getMagnet(torrent)

  // console.log(magnetLink)
  // Add the magnet link
  function addTorrent (title, magnet) {
    console.log('Adding torrent...', title)
    return new Promise((resolve, reject) => {
      transmission.addUrl(magnet, {
        'download-dir': directory,
      }, (err, result) => {
        if (err) {
          return reject(err)
        }

        const id = result.id
        resolve(true)
      })
    })
  }
  return await addTorrent(torrent.title, magnetLink)
})
