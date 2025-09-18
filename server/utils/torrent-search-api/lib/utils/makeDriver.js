export default function makeDriver (requestFn) {
  return ({ url }, callback) => {
    requestFn(url)
      .then((response) => {
        callback(null, response)
      })
      .catch((error) => {
        callback(error)
      })
  }
}
