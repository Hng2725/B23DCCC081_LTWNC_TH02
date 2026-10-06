import type { Assignment } from '../features/assignments/assignmentTypes'
import { isOverdue } from './date'

export interface StatsResult {
  total: number
  completed: number
  overdue: number
  pending: number
  bySubject: Record<string, { total: number; completed: number }>
}

export function calcStats(assignments: Assignment[]): StatsResult {
  const result: StatsResult = {
    total: assignments.length,
    completed: 0,
    overdue: 0,
    pending: 0,
    bySubject: {},
  }

  for (const item of assignments) {
    if (item.completed) {
      result.completed++
    } else if (isOverdue(item)) {
      result.overdue++
    } else {
      result.pending++
    }

    const sub = item.subject || 'Khác'
    if (!result.bySubject[sub]) {
      result.bySubject[sub] = { total: 0, completed: 0 }
    }
    result.bySubject[sub].total++
    if (item.completed) {
      result.bySubject[sub].completed++
    }
  }

  return result
}
