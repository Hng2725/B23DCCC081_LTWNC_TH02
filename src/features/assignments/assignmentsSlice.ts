import { createAsyncThunk, createSelector, createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import type { AsyncStatus } from '../../types/common'
import { getDaysLeft, isOverdue } from '../../utils/date'
import { isAssignmentArray } from '../../utils/typeGuards'
import type { FilterStatus } from '../filter/filterSlice'
import { fetchAssignmentsAPI } from './assignmentsAPI'
import type { Assignment, AssignmentId, NewAssignment, Priority } from './assignmentTypes'

interface AssignmentsState {
  items: Assignment[]
  status: AsyncStatus
  error: string | null
}

const initialState: AssignmentsState = {
  items: [],
  status: 'idle',
  error: null,
}

export const fetchAssignments = createAsyncThunk<
  Assignment[],
  void,
  { state: RootState; rejectValue: string }
>(
  'assignments/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAssignmentsAPI()
      if (!isAssignmentArray(response.data)) {
        return rejectWithValue('Dữ liệu trả về không hợp lệ')
      }
      return response.data
    } catch {
      return rejectWithValue('Không thể tải danh sách bài tập')
    }
  },
  {
    // Chỉ gọi API một lần (tránh gọi lại khi StrictMode chạy effect 2 lần)
    condition: (_, { getState }) => getState().assignments.status === 'idle',
  },
)

const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    addAssignment: {
      reducer(state, action: PayloadAction<Assignment>) {
        state.items.push(action.payload)
      },
      prepare(payload: NewAssignment) {
        return { payload: { ...payload, id: nanoid(), completed: false } }
      },
    },
    toggleAssignment(state, action: PayloadAction<AssignmentId>) {
      const item = state.items.find((a) => a.id === action.payload)
      if (item) item.completed = !item.completed
    },
    deleteAssignment(state, action: PayloadAction<AssignmentId>) {
      state.items = state.items.filter((a) => a.id !== action.payload)
    },
    bulkAddAssignments(state, action: PayloadAction<Assignment[]>) {
      state.items = action.payload
      state.status = 'succeeded'
    },
    resetAssignments(state) {
      state.items = []
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Đã xảy ra lỗi'
      })
  },
})

export const { addAssignment, toggleAssignment, deleteAssignment, bulkAddAssignments, resetAssignments } = assignmentsSlice.actions
export default assignmentsSlice.reducer

export function generateMockAssignments(count = 10000): Assignment[] {
  const subjects = ['Lập trình Web', 'Cơ sở dữ liệu', 'Toán rời rạc', 'Mạng máy tính', 'Kiến trúc máy tính', 'Hệ điều hành']
  const priorities: Priority[] = ['low', 'medium', 'high']
  const items: Assignment[] = []
  const now = new Date()

  for (let i = 1; i <= count; i++) {
    const daysOffset = (i % 30) - 10
    const d = new Date(now)
    d.setDate(d.getDate() + daysOffset)
    items.push({
      id: `mock-${i}`,
      subject: subjects[i % subjects.length],
      title: `Bài tập mẫu ${i}`,
      deadline: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
      priority: priorities[i % priorities.length],
      completed: i % 4 === 0,
    })
  }
  return items
}

// ----- Selectors -----
export const selectAllAssignments = (state: RootState) => state.assignments.items
export const selectAssignmentsStatus = (state: RootState) => state.assignments.status
export const selectAssignmentsError = (state: RootState) => state.assignments.error
export const selectFilterStatus = (state: RootState) => state.filter.status

function matchesFilter(assignment: Assignment, filter: FilterStatus): boolean {
  switch (filter) {
    case 'all':
      return true
    case 'pending':
      return !assignment.completed && getDaysLeft(assignment.deadline) >= 0
    case 'overdue':
      return isOverdue(assignment)
    case 'completed':
      return assignment.completed
  }
}

export const selectFilteredAssignments = createSelector(
  [selectAllAssignments, selectFilterStatus],
  (items, filter) =>
    items
      .filter((a) => matchesFilter(a, filter))
      .sort((a, b) => a.deadline.localeCompare(b.deadline)),
)

export const selectFilterCounts = createSelector(
  [selectAllAssignments],
  (items): Record<FilterStatus, number> => ({
    all: items.length,
    pending: items.filter((a) => matchesFilter(a, 'pending')).length,
    overdue: items.filter((a) => matchesFilter(a, 'overdue')).length,
    completed: items.filter((a) => matchesFilter(a, 'completed')).length,
  }),
)
