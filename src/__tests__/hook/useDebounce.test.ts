import { act, renderHook } from '@testing-library/react'
import { useDebounce } from '../../hooks/useDebounce'

describe('Custom Hook Test: useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('returns initial value immediately and delays value updates', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 300 },
    })

    // Giá trị ban đầu trả về ngay lập tức
    expect(result.current).toBe('initial')

    // Cập nhật prop value
    rerender({ value: 'updated text', delay: 300 })

    // Trước khi hết 300ms, giá trị vẫn là 'initial'
    expect(result.current).toBe('initial')

    // Tua thời gian 299ms
    act(() => {
      jest.advanceTimersByTime(299)
    })
    expect(result.current).toBe('initial')

    // Tua thời gian thêm 1ms (đủ 300ms)
    act(() => {
      jest.advanceTimersByTime(1)
    })
    expect(result.current).toBe('updated text')
  })
})
