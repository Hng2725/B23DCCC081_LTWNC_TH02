import { act } from '@testing-library/react'
import { usePinStore } from '../../features/assignments/usePinStore'

describe('Unit Tests: usePinStore (Zustand)', () => {
  beforeEach(() => {
    act(() => {
      usePinStore.setState({ pinnedIds: [] })
    })
  })

  it('toggles pin status correctly', () => {
    expect(usePinStore.getState().isPinned('1')).toBe(false)

    act(() => {
      usePinStore.getState().togglePin('1')
    })

    expect(usePinStore.getState().pinnedIds).toContain('1')
    expect(usePinStore.getState().isPinned('1')).toBe(true)

    act(() => {
      usePinStore.getState().togglePin('1')
    })

    expect(usePinStore.getState().pinnedIds).not.toContain('1')
    expect(usePinStore.getState().isPinned('1')).toBe(false)
  })
})
