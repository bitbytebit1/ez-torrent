import format from 'string-format'

export function trim (value) {
  return typeof value === 'string' ? value.trim() : value
}

export function reverse (value) {
  return typeof value === 'string'
    ? value.split('').reverse().join('')
    : value
}

export function slice (value, start, end) {
  return typeof value === 'string' ? value.slice(start, end) : value
}

export function replace (value, searchValue, replaceValue) {
  return typeof value === 'string' ? value.replace(searchValue, replaceValue || '') : value
}

export function substr (value, from, length) {
  return typeof value === 'string' ? value.substr(from, length) : value
}

export function int (value) {
  const intValue = Number.parseInt(value)
  return Number.isNaN(intValue) ? value : intValue
}

export function split (value, char, index) {
  if (typeof value === 'string') {
    if (char === '%SPECIAL_CHAR%') {
      char = '|'
    }
    const results = value.split(char)
    if (results[index] !== undefined) {
      return results[index]
    }
  }
  return value
}

export function formatStr (value, formatStr) {
  return format(formatStr, value)
}

export function until (value, str) {
  return typeof value === 'string' && value.indexOf(str) > 0 ? value.substr(0, value.indexOf(str)) : value
}

export function match (value, str) {
  return typeof value === 'string' && value.match(new RegExp(str)) !== null
    ? value.match(new RegExp(str))[1]
    : value
}

export function decodeURIComponentFn (value) {
  return typeof value === 'string' ? decodeURIComponent(value) : value
}
