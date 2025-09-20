import Transmission from 'transmission'

// Create a new Transmission client instance
export default defineEventHandler(async (event) => {
  const { host, port, username, password } = useRuntimeConfig().transmission
  const transmission = new Transmission({
    host, // Your Transmission host (change if needed)
    port, // Transmission RPC port
    username, // Your Transmission RPC username
    password, // Your Transmission RPC password
  })

  function getTransmissionStats () {
    return new Promise((resolve, reject) => {
      transmission.sessionStats((err, result) => {
        if (err) {
          // reject(err)
          return []
        } else {
          resolve(result)
        }
      })
    })
  }

  return await getTransmissionStats()
})
