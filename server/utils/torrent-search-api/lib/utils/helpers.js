export const uniqueName = name => name.toString().toLowerCase()
export const isString = value => typeof value === 'string'
export const isObject = value => typeof value === 'object'
export const isArray = value => value instanceof Array
export const oneArgument = args => args.length === 1
export const twoArguments = args => args.length === 2
export const silentRejection = fn => fn.catch(() => null)
export const isClass = fn => /^class/.test(fn.toString())
export const humanizeSize = bytes => {
  const thresh = 1000
  if (bytes < thresh) {
    return `${bytes} B`
  }
  const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let u = -1
  do {
    bytes /= thresh
    ++u
  } while (bytes >= thresh)
  return `${bytes.toFixed(1)} ${units[u]}`
}