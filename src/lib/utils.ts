import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ellipsify(str = '', len = 4, delimiter = '..') {
  const strLen = str.length
  const limit = len * 2 + delimiter.length

  return strLen >= limit ? str.substring(0, len) + delimiter + str.substring(strLen - len, strLen) : str
}


export function calculateExpectedOut(
  amountIn: number,
  reserveIn: number,
  reserveOut: number,
  feeRate = 0.003 // 0.3% default
): number {
  const amountInAfterFee = amountIn * (1 - feeRate);

  const numerator = amountInAfterFee * reserveOut;
  const denominator = reserveIn + amountInAfterFee;

  const amountOut = numerator / denominator;

  return amountOut;
}
