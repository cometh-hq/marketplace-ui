export function smartRounding(
  numberToRoundStr: string,
  decimalNumbers: number
): string {
  const roundDecimalPart = (decimalPart: string, decimals: number): string => {
    if (decimalPart.length <= decimals) {
      return decimalPart
    }

    let result = decimalPart.substring(0, decimals)
    if (parseInt(decimalPart[decimals]) >= 5) {
      let i = decimals - 1
      while (i >= 0 && result[i] === "9") {
        result = result.substring(0, i) + "0" + result.substring(i + 1)
        i--
      }

      if (i >= 0) {
        result =
          result.substring(0, i) +
          (parseInt(result[i]) + 1).toString() +
          result.substring(i + 1)
      } else {
        return "1" + result
      }
    }

    return result
  }

  let decimalPointIndex = numberToRoundStr.indexOf(".")

  // If there's no decimal point, return the string as is
  if (decimalPointIndex === -1) {
    return numberToRoundStr
  }

  let integerPart = numberToRoundStr.slice(0, decimalPointIndex)
  let decimalPart = numberToRoundStr.slice(decimalPointIndex + 1)
  let leadingZeros = decimalPart.length - decimalPart.replace(/^0*/, "").length
  let totalDecimals = leadingZeros + decimalNumbers

  // For numbers greater than or equal to one, use classic rounding
  if (integerPart !== "0") {
    let roundedDecimalPart = roundDecimalPart(decimalPart, decimalNumbers)
    let carryOver = false

    if (roundedDecimalPart.length > totalDecimals) {
      integerPart = (BigInt(integerPart) + BigInt(1)).toString()
      roundedDecimalPart = roundedDecimalPart.substring(1)
      carryOver = true
    }

    return `${integerPart}.${carryOver ? "0".repeat(decimalNumbers) : roundedDecimalPart}`
  }

  // For numbers less than one, apply special rounding considering leading zeros
  let roundedDecimalPart = roundDecimalPart(decimalPart, totalDecimals)
  if (roundedDecimalPart.length > totalDecimals) {
    return `1`
  }

  return `0.${roundedDecimalPart}`
}

export function trimDecimals(
  stringNumber: string,
  maxDecimals: number
): string {
  const decimalPointIndex = stringNumber.indexOf(".")

  // If there's no decimal point or maxDecimals is zero, return the string as is
  if (decimalPointIndex === -1 || maxDecimals === 0) {
    return stringNumber
  }

  const integerPart = stringNumber.slice(0, decimalPointIndex)
  let decimalPart = stringNumber.slice(decimalPointIndex + 1)

  // If the decimal part is longer than maxDecimals, trim it
  if (decimalPart.length > maxDecimals) {
    decimalPart = decimalPart.substring(0, maxDecimals)
  }

  return `${integerPart}.${decimalPart}`
}
