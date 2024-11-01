import JSEncrypt from 'jsencrypt'
import { stringIsNull } from "@/utils"
import { isNumber } from "@/utils"

/**
 * 文章归档：https://www.yuque.com/u27599042/coding_star/cl4dl599pdmtllw1
 * RSA 加密算法获取密钥对中的公钥使用的 key
 *
 * @type {string}
 */
export const PUBLIC_KEY = '-----BEGIN PUBLIC KEY-----\n'
    + 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKvxNNut7ncsuLvV354dmJtF9NCZOGwt\n'
    + 'egoJnO9hq8k9OlWdqUnBcBu7b9i1mP85URDxHxdOXWoc21meRLo2C0MCAwEAAQ==\n'
    + '-----END PUBLIC KEY-----'

/**
 * RSA 加密算法获取密钥对中的密钥使用的 key
 *
 * @type {string}
 */
export const PRIVATE_KEY = '-----BEGIN RSA PRIVATE KEY-----\n'
    + 'MIIBOwIBAAJBAKvxNNut7ncsuLvV354dmJtF9NCZOGwtegoJnO9hq8k9OlWdqUnB\n'
    + 'cBu7b9i1mP85URDxHxdOXWoc21meRLo2C0MCAwEAAQJBAIL8P+5StGWpdhnyNmZ3\n'
    + '2XgAdR4se2U9x8i5xgo+9+VXMLpYxxz90PRSnI5/QJzu0MTryIzOzVK3AnAcKACi\n'
    + 'L3ECIQD69L8eojyIVsTGXy/rbLjzFNpnh+/cy8JPmNUFvaSMLQIhAK9l6DmroHDW\n'
    + '4aznjQu5XxnR5WcQadLOWKHt5UXaf+svAiEApgcSAlRXM+Qj3xHOhDSzz642KFSY\n'
    + '7jyn2z1Dgb7LhCkCIAF0B7OKn36v2RjUpk+FjqspGQx8j1Pmz8cvsGmewNaTAiBW\n'
    + 'DrOeIHaFEVRgbi2lT2VplSX/hPrh4Dz+rcuDSlg/eA==\n'
    + '-----END RSA PRIVATE KEY-----'

/**
 * RSA 密钥对的 bit 数(密钥对的长度)。
 * 常用 1024、2048，密钥对的 bit 数，越大越安全，但是越大对服务器的消耗越大
 *
 * @type {number}
 */
let keySize = 1024

/**
 * keySize bit 数下的 RSA 密钥对所能够加密的最大明文大小。
 * RSA 算法一次能加密的明文长度与密钥长度(RSA 密钥对的 bit 数)成正比，
 * 默认情况下，Padding 方式为 OPENSSL_PKCS1_PADDING，RSA 算法会使
 * 用 11 字节的长度用于填充，所以默认情况下，RSA 所能够加密的最大明文大
 * 小为 (keySize / 8 - 11) byte
 *
 * @type {number}
 */
let maxEncryptPlainTextLen = 117

/**
 * keySize bit 数下的 RSA 密钥对所能够解密的最大密文大小。
 * (keySize / 8) byte
 *
 * @type {number}
 */
let maxDecryptCipherTextLen = 128

/**
 * 密钥长度为 1024 bit 下,通过公钥生成的密文字符串的长度
 *
 * @type {number}
 */
let cipherTextStrLen = 172

/**
 * 为 RSA 密钥对的 bit 数赋值，同时重新计算 keySize bit 数下的
 * RSA 密钥对所能够加密的最大明文大小、所能够解密的最大密文大小
 *
 * @param size RSA 密钥对的 bit 数
 */
export function setKeySize(size) {
  if (!isNumber(size) || size <= 0) {
    throw new TypeError("参数 {size} 需要是大于 0 的整数")
  }
  keySize = size
  maxEncryptPlainTextLen = keySize / 8 - 11
  maxDecryptCipherTextLen = keySize / 8
}

/**
 * 获取指定字符的 UTF8 字节大小
 * 代码来源: https://blog.csdn.net/csdn_yuan_/article/details/107428744
 *
 * @param charCode 字符编码
 * @return {number} 指定字符的 UTF8 字节大小
 */
export function getCharByteSizeUTF8(charCode) {
  if (!isNumber(charCode) || charCode < 0) {
    throw new TypeError("参数 {charCode} 需要是大于 0 的整数")
  }
  //字符代码在000000 – 00007F之间的，用一个字节编码
  if (charCode <= 0x007f) {
    return 1
  }
  //000080 – 0007FF之间的字符用两个字节
  else if (charCode <= 0x07ff) {
    return 2
  }
  //000800 – 00D7FF 和 00E000 – 00FFFF之间的用三个字节，注: Unicode在范围 D800-DFFF 中不存在任何字符
  else if (charCode <= 0xffff) {
    return 3
  }
  //010000 – 10FFFF之间的用4个字节
  else {
    return 4
  }
}

/**
 * 获取字符串的 UTF8 字节长度
 * 代码来源: https://blog.csdn.net/csdn_yuan_/article/details/107428744
 *
 * @param str 字符串
 * @returns {number} 字符串的 UTF8 字节长度
 */
export function getStrByteLenUTF8(str) {
  if (stringIsNull(str)) {
    throw new TypeError("参数 {str} 需要非空字符串")
  }
  // 获取字符串的字符长度
  const strLen = str.length
  // 保存字符串的字节长度
  let strByteLen = 0
  // 遍历判断字符串中的每个字符,统计字符串的 UTF8 字节长度
  for (let i = 0 ; i < strLen ; i++) {
    // 获取当前遍历字符的编码
    let charCode = str.charCodeAt(i);
    // 获取并记录当前遍历字符的 UTF8 字节大小
    strByteLen += getCharByteSizeUTF8(charCode)
  }
  return strByteLen
}

/**
 * 获取字符串的 UTF8 字节长度,同时获取按照指定的子字符串字节长度划分的子字符串数组
 * 代码参考: https://blog.csdn.net/csdn_yuan_/article/details/107428744
 *
 * @param str 字符串
 * @param subStrByteLen 子字符串字节长度
 * @return {[]} 按照指定的子字符串字节长度划分的子字符串数组
 */
export function getStrByteLenUTF8AndSubStrs(str, subStrByteLen) {
  if (stringIsNull(str)) {
    throw new TypeError("参数 {str} 需要非空字符串")
  }
  if (!isNumber(subStrByteLen) || subStrByteLen <= 0) {
    throw new TypeError("参数 {subStrByteLen} 需要是大于 0 的整数")
  }
  // 获取字符串的字符长度
  const strLen = str.length
  // 保存字符串的字节长度
  let strByteLen = 0
  // 记录上一次分隔的字符串的位置
  let preIdx = 0;
  // 记录当前子字符串的字节大小
  let subStrByteSize = 0;
  // 记录子字符串
  const subStrs = []
  // 遍历判断字符串中的每个字符,统计字符串的 UTF8 字节长度
  for (let i = 0 ; i < strLen ; i++) {
    // 获取当前遍历字符的编码
    let charCode = str.charCodeAt(i);
    // 获取并记录当前遍历字符的 UTF8 字节大小
    let charByteSizeUTF8 = getCharByteSizeUTF8(charCode)
    strByteLen += charByteSizeUTF8
    // 当前子字符串的字节大小
    subStrByteSize += charByteSizeUTF8
    // 子字符串达到切割长度
    if (subStrByteSize > subStrByteLen) {
      // 当前子字符串加入返回结果数组中
      subStrs.push(str.substring(preIdx, i))
      // 更新数据
      preIdx = i
      subStrByteSize = charByteSizeUTF8
    }
  }
  // 如果还有子字符串还为加入返回结果数组中
  if (subStrByteSize > 0) {
    subStrs.push(str.substring(preIdx))
  }
  return {
    strByteLen,
    subStrs
  }
}

/**
 * 使用公钥对明文进行加密(支持长文本)
 *
 * @param publicKey 公钥
 * @param plainText 明文
 * @returns {string} 明文加密后的密文
 */
export function encryptByPublicKey(publicKey, plainText) {
  if (stringIsNull(publicKey) || stringIsNull(plainText)) {
    throw new TypeError("参数 {publicKey} {plainText} 需要非空字符串")
  }
  // 获取明文字符串的字节大小和根据指定字节大小划分的子字符串数组
  const {
    strByteLen : plainTextByteSize,
    subStrs : plainTextSubStrArr
  } = getStrByteLenUTF8AndSubStrs(
      plainText,
      maxEncryptPlainTextLen
  )
  console.log(plainTextByteSize)
  // 明文加密后的完整密文
  let cipherText = ""
  // 对明文进行分段加密
  plainTextSubStrArr.forEach(subStr => {
    // 获取加密解密器
    const encryptor = new JSEncrypt()
    // 设置公钥
    encryptor.setPublicKey(publicKey)
    // 加密
    cipherText += encryptor.encrypt(subStr)
  })
  return cipherText
}

/**
 * 使用私钥对密文进行解密(支持长文本)
 * 注意: 此方法只适用于使用和上述加密方法逻辑相同的加密处理得到的密文的解密
 *
 * @param privateKey 密钥
 * @param cipherText 密文
 * @return {string} 密文解密后的明文
 */
export function decryptByPrivateKey(privateKey, cipherText) {
  if (stringIsNull(privateKey) || stringIsNull(cipherText)) {
    throw new TypeError("参数 {privateKey} {cipherText} 需要非空字符串")
  }
  // 获取密文的字符长度
  let cipherTextLen = cipherText.length
  // 计算分段解密的次数, cipherTextStrLen 每段密文长度
  let decryptCount = cipherTextLen / cipherTextStrLen
  // 解密后的完整明文
  let plainText = ""
  // 对密文进行分段解密
  for (let i = 0 ; i < decryptCount ; i++) {
    // 分段密文距离开始位置的偏移量
    let offSet = i * cipherTextStrLen
    let subCipherText = cipherText.substring(offSet, offSet + cipherTextLen)
    // 加密解密器
    const encryptor = new JSEncrypt()
    // 设置私钥
    encryptor.setPrivateKey(privateKey)
    // 解密
    plainText += encryptor.decrypt(subCipherText)
  }
  return plainText
}

export function encryptStr(text) {
  return encryptByPublicKey(PUBLIC_KEY, text)
}
export function decryptStr(text){
  return decryptByPrivateKey(PRIVATE_KEY, text)
}
