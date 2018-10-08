/**
 * Created by jiachenpan on 16/11/18.
 */

/**
 * 非法用户名
 * @author Pan
 * @param {String} str - 字符串
 * @returns {Boolean}
 */
export function isvalidUsername(str) {
  const validReg = /^[a-zA-Z0-9_-]{4,16}$/
  return validReg.test(str.trim())
}

/**
 * 合法uri
 * @author Pan
 * @param {String} str - 字符串
 * @returns {Boolean}
 */
export function validateURL(textval) {
  const urlRegex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlRegex.test(textval)
}

/**
 * 小写字母
 * @author Pan
 * @param {String} str - 字符串
 * @returns {Boolean}
 */
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * 大写字母
 * @author Pan
 * @param {String} str - 字符串
 * @returns {Boolean}
 */
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * 大小写字母
 * @author Pan
 * @param {String} str - 字符串
 * @returns {Boolean}
 */
export function validateAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * validate email
 * @author Reza Haidari
 * @param {String} email - 邮箱
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}
