export default class CryptoJS {
  public static CfsEnCode(codeStr: string): string {
    let num = 30
    let num2 = num - codeStr.length
    if (num2 > 1) {
      for (let m: number = 1; m <= num2; m++) {
        codeStr += String.fromCharCode(0x15)
      }
    }
    let num3 = 1.0
    for (let i: number = 1; i <= num; i++) {
      if (num <= codeStr.length) {
        const result = codeStr.charCodeAt(i - 1)
        const num5: number = num + result * i
        num3 *= num5
      }
    }
    codeStr = new Number(num3).toPrecision(15).toString().toUpperCase()
    let str: string = ``
    for (let j: number = 1; j <= codeStr.length; j++) {
      let length = 3
      if (codeStr.length - j < 2) {
        length = codeStr.length - j + 1
      }
      str += CryptoJS.CfsCode(codeStr.substring(j - 1, j - 1 + length))
    }
    let str2: string = ``
    for (let k: number = 20; k <= str.length - 0x12; k += 2) {
      str2 += str.substring(k - 1, k)
    }
    return str2
  }
  private static CfsCode(value: string): string {
    let number: string = ``
    for (let i: number = 1; i <= value.length; i++) {
      number += value.charCodeAt(i - 1)
    }
    return parseInt(number).toString(16).toUpperCase()
  }
}
