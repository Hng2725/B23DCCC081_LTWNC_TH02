import assignmentsReducer, {
  addAssignment,
  bulkAddAssignments,
  deleteAssignment,
  toggleAssignment,
} from '../../features/assignments/assignmentsSlice'
import type { Assignment } from '../../features/assignments/assignmentTypes'

describe('Unit Tests: assignmentsSlice Reducer', () => {
  const initialState = {
    items: [
      {
        id: '1',
        subject: 'Lập trình Web',
        title: 'Bài tập 1',
        deadline: '2026-10-10',
        priority: 'high' as const,
        completed: false,
      },
    ],
    status: 'idle' as const,
    error: null,
  }

  it('handles addAssignment action', () => {
    const newAssignment = {
      subject: 'Toán rời rạc',
      title: 'Bài tập 2',
      deadline: '2026-10-12',
      priority: 'medium' as const,
    }

    const action = addAssignment(newAssignment)
    const state = assignmentsReducer(initialState, action)

    expect(state.items.length).toBe(2)
    expect(state.items[1].subject).toBe('Toán rời rạc')
    expect(state.items[1].title).toBe('Bài tập 2')
    expect(state.items[1].completed).toBe(false)
  })

  it('handles toggleAssignment action', () => {
    const state = assignmentsReducer(initialState, toggleAssignment('1'))
    expect(state.items[0].completed).toBe(true)

    const stateUntoggled = assignmentsReducer(state, toggleAssignment('1'))
    expect(stateUntoggled.items[0].completed).toBe(false)
  })

  it('handles deleteAssignment action', () => {
    const state = assignmentsReducer(initialState, deleteAssignment('1'))
    expect(state.items.length).toBe(0)
  })

  it('boundary case: toggleAssignment with non-existent id does not throw or mutate items', () => {
    const state = assignmentsReducer(initialState, toggleAssignment('non-existent-999'))
    expect(state.items.length).toBe(1)
    expect(state.items[0].completed).toBe(false)
  })

  it('boundary case: deleteAssignment with non-existent id leaves items intact', () => {
    const state = assignmentsReducer(initialState, deleteAssignment('non-existent-999'))
    expect(state.items.length).toBe(1)
  })

  it('handles bulkAddAssignments action', () => {
    const mockList: Assignment[] = [
      { id: '10', subject: 'OS', title: 'Task OS', deadline: '2026-10-20', priority: 'low', completed: true },
      { id: '11', subject: 'DB', title: 'Task DB', deadline: '2026-10-22', priority: 'medium', completed: false },
    ]

    const state = assignmentsReducer(initialState, bulkAddAssignments(mockList))
    expect(state.items.length).toBe(2)
    expect(state.status).toBe('succeeded')
  })
})
