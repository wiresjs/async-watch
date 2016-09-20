
/**
 * Watches object property
 *
 * @export
 * @param {*} obj
 * @param {string} path
 * @param {{ (...args): any }} closure
 */
export function AsyncWatch(obj: any, path: string, closure: { (...args): any })

/**
 * Subscrubes to multiple watchers
 *
 * @export
 * @param {any[]} watchers
 * @param {{ (...args): any }} closure
 */
export function AsyncSubscribe(watchers: any[], closure: { (...args): any })


/**
 * Watches arrays
 *
 * @export
 * @param {*} obj
 * @param {string} path
 * @param {{ (...args): any }} closure
 */
export function AsyncWatchArray(obj: any, path: string, closure: { (...args): any })
