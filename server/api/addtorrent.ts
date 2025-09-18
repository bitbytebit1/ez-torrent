import Transmission from 'transmission'

export default defineEventHandler(async (event) => {
  const { host, port, username, password, directory } = useRuntimeConfig().transmission
  const transmission = new Transmission({
    host, // Your Transmission host (change if needed)
    port, // Transmission RPC port
    username, // Your Transmission RPC username
    password, // Your Transmission RPC password
  })
  const { torrent } = await readBody(event)

  console.log('Adding torrent...', torrent.title)
  return new Promise((resolve, reject) => {
    transmission.addUrl(torrent.magnet, {
      'download-dir': directory,
    }, (err, result) => {
      if (err) {
        return reject(err)
      }

      resolve(true)
    })
  })
})
