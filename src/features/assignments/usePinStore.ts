import { create } from 'zustand'

interface PinState {
  pinnedIds: string[]
  togglePin: (id: string) => void
  isPinned: (id: string) => boolean
}

export const usePinStore = create<PinState>((set, get) => ({
  pinnedIds: [],
  togglePin: (id: string) =>
    set((state) => {
      const exists = state.pinnedIds.includes(id)
      return {
        pinnedIds: exists
          ? state.pinnedIds.filter((pinnedId) => pinnedId !== id)
          : [...state.pinnedIds, id],
      }
    }),
  isPinned: (id: string) => get().pinnedIds.includes(id),
}))
