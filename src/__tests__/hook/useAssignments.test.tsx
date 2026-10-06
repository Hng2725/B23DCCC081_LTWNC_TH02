import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { useAssignments } from '../../features/assignments/useAssignments'
import assignmentsReducer from '../../features/assignments/assignmentsSlice'
import filterReducer from '../../features/filter/filterSlice'

function createTestStore() {
  return configureStore({
    reducer: {
      assignments: assignmentsReducer,
      filter: filterReducer,
    },
  })
}

describe('Custom Hook Test: useAssignments', () => {
  it('provides assignment state and action methods', async () => {
    const store = createTestStore()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    )

    const { result } = renderHook(() => useAssignments(), { wrapper })

    expect(result.current.assignments).toBeDefined()
    expect(result.current.filter).toBe('all')

    act(() => {
      result.current.add({
        subject: 'Khai phá dữ liệu',
        title: 'Báo cáo giữa kỳ',
        deadline: '2026-11-15',
        priority: 'high',
      })
    })

    expect(result.current.allItems.some((item) => item.title === 'Báo cáo giữa kỳ')).toBe(true)

    const addedItem = result.current.allItems.find((item) => item.title === 'Báo cáo giữa kỳ')!

    act(() => {
      result.current.toggle(addedItem.id)
    })

    const updatedItem = result.current.allItems.find((item) => item.id === addedItem.id)!
    expect(updatedItem.completed).toBe(true)

    act(() => {
      result.current.changeFilter('completed')
    })

    expect(result.current.filter).toBe('completed')

    act(() => {
      result.current.createStressTestData()
    })

    expect(result.current.allItems.length).toBe(10000)
  })
})
