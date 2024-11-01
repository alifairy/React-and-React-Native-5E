/**
 * 判断是否为数字类型
 * @param num 需要进行判断的变量
 * @returns {boolean} true：数字类型；false：非数字类型
 */
export function isNumber(num) {
    return !(num === null) && !(num === undefined) && typeof (num) === 'number'
}

/**
 * 判断是否为字符串类型
 * @param str 需要判断的变量
 * @returns {boolean} true：字符串类型；false：非字符串类型
 */
export function isString(str) {
    return !(str === null) && !(str === undefined) && typeof (str) === 'string'
}

/**
 * 判断一个字符串是否为空。
 * 当传入的参数为 null 或 undefined 或 不为字符串 或 字符串的长度小于等于0，则该字符串为空；
 * 否则，字符串不为空
 * @param str 需要进行判断的字符串
 * @returns {boolean} true：空；false：非空
 */
export function stringIsNull(str) {
    return !(isString(str)) || str.length <= 0
}
