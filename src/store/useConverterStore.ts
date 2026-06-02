import { create } from 'zustand'
import { convertText, type ConversionResult } from '@/utils/motaConverter'

type ConverterStore = {
  input: string
  result: ConversionResult | null
  error: string
  setInput: (value: string) => void
  applyExample: (value: string) => void
}

function buildConversionState(input: string): Pick<ConverterStore, 'result' | 'error'> {
  const trimmedInput = input.trim()

  if (!trimmedInput) {
    return {
      result: null,
      error: '',
    }
  }

  try {
    return {
      result: convertText(trimmedInput),
      error: '',
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知错误'
    return {
      result: null,
      error: `转换失败：${message}`,
    }
  }
}

export const useConverterStore = create<ConverterStore>((set) => ({
  input: '',
  result: null,
  error: '',
  setInput: (value) =>
    set({
      input: value,
      ...buildConversionState(value),
    }),
  applyExample: (value) =>
    set({
      input: value,
      ...buildConversionState(value),
    }),
}))
