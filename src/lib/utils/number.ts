/**
 * 將數字或字串數字加上千分位逗號
 * @param value - 數字或字串數字
 * @returns 格式化後的字串，例如：1,234,567
 * @example
 * formatNumberWithCommas(1234567) // "1,234,567"
 * formatNumberWithCommas("1234567") // "1,234,567"
 * formatNumberWithCommas(1234.56) // "1,234.56"
 */
export function formatNumberWithCommas(value: number | string): string {
  // 將輸入轉換為數字
  const num = typeof value === 'string' ? parseFloat(value) : value
  
  // 檢查是否為有效數字
  if (isNaN(num)) {
    return '0'
  }
  
  // 使用 toLocaleString 加上千分位
  return num.toLocaleString('en-US')
}

/**
 * 將數字格式化為縮寫形式（適用於大數字顯示）
 * @param value - 數字或字串數字
 * @returns 格式化後的字串，例如：1.2K, 3.4M
 * @example
 * formatNumberShort(1234) // "1.2K"
 * formatNumberShort(1234567) // "1.2M"
 * formatNumberShort(999) // "999"
 */
export function formatNumberShort(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(num)) {
    return '0'
  }
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  
  return num.toString()
}
