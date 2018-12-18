/* @flow */

const inBrowser =
  typeof window !== 'undefined' &&
  Object.prototype.toString.call(window) !== '[object Object]'
const UA = inBrowser && window.navigator.userAgent.toLowerCase()
const isIE9 = UA && UA.indexOf('msie 9.0') > 0

export const MODEL_NOTIFY_EVENT: string = '__VUE_VALIDATOR_MODEL_NOTIFY_EVENT__'

export function warn (msg: string, err?: Error) {
  if (window.console) {
    console.warn('[vue-validator] ' + msg)
    if (err) {
      console.warn(err.stack)
    }
  }
}

export function looseEqual (a: any, b: any): boolean {
  return a === b || (
    isObject(a) && isObject(b)
      ? JSON.stringify(a) === JSON.stringify(b)
      : false
  )
}

export function getClass (el: any): string {
  let classname: string | Object = el.className
  if (typeof classname === 'object') {
    classname = classname.baseVal || ''
  }
  return classname
}

export function setClass (el: any, cls: string): void {
  if (isIE9 && !/svg$/.test(el.namespaceURI)) {
    el.className = cls
  } else {
    el.setAttribute('class', cls)
  }
}

export function addClass (el: any, cls: string): void {
  if (el.classList) {
    el.classList.add(cls)
  } else {
    const cur = ' ' + getClass(el) + ' '
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      setClass(el, (cur + cls).trim())
    }
  }
}

export function removeClass (el: any, cls: string): void {
  if (el.classList) {
    el.classList.remove(cls)
  } else {
    let cur = ' ' + getClass(el) + ' '
    const tar = ' ' + cls + ' '
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ')
    }
    setClass(el, cur.trim())
  }
  if (!el.className) {
    el.removeAttribute('class')
  }
}

export function toggleClasses (el: any, key: string, fn: Function): void {
  if (!el) { return }

  key = key.trim()
  if (key.indexOf(' ') === -1) {
    fn(el, key)
    return
  }

  const keys = key.split(/\s+/)
  for (let i = 0, l = keys.length; i < l; i++) {
    fn(el, keys[i])
  }
}

export function triggerEvent (el: any, event: string, fn: Function): void {
  const e: any = document.createEvent('HTMLEvents')
  e.initEvent(event, true, true)
  fn && fn(e)
  el.dispatchEvent(e)
}

// TODO: should be defined strict type
export function mapValidation (results: Array<any> | Object): Object {
  const res: Object = {}

  normalizeMap(results).forEach(({ key, val }) => {
    res[key] = function mappedValidation () {
      const validation = this.$validation
      if (!this._isMounted) {
        return null
      }
      const paths = val.split('.')
      const first = paths.shift()
      if (first !== '$validation') {
        warn(`unknown validation result path: ${val}`)
        return null
      }
      let path
      let value = validation
      do {
        path = paths.shift()
        value = value[path]
      } while (paths.length > 0)
      return value
    }
  })

  return res
}

function isObject (obj: Object): boolean {
  return obj !== null && typeof obj === 'object'
}

// TODO: should be defined strict type
function normalizeMap (map: Array<any> | Object): Array<any> {
  return Array.isArray(map)
    ? map.map((key: any) => ({ key, val: key }))
    : Object.keys(map).map((key: any) => ({ key, val: map[key] }))
}
