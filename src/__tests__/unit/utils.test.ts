import { addDays, formatDate, formatDaysLeft, getDaysLeft, isOverdue } from '../../utils/date'
import { calcStats } from '../../utils/stats'
import type { Assignment } from '../../features/assignments/assignmentTypes'

describe('Unit Tests: Date & Stats Utilities', () => {
  describe('formatDate', () => {
    it('formats YYYY-MM-DD to DD/MM/YYYY', () => {
      expect(formatDate('2026-10-06')).toBe('06/10/2026')
    })
  })

  describe('formatDaysLeft', () => {
    it('returns correct Vietnamese string based on remaining days', () => {
      expect(formatDaysLeft(3)).toBe('Còn 3 ngày')
      expect(formatDaysLeft(0)).toBe('Hôm nay là hạn chót')
      expect(formatDaysLeft(-2)).toBe('Quá hạn 2 ngày')
    })
  })

  describe('getDaysLeft', () => {
    it('returns positive days for future deadline', () => {
      const today = new Date('2026-10-06')
      const deadline = '2026-10-10'
      expect(getDaysLeft(deadline, today)).toBe(4)
    })

    it('returns 0 for today deadline', () => {
      const today = new Date('2026-10-06')
      const deadline = '2026-10-06'
      expect(getDaysLeft(deadline, today)).toBe(0)
    })

    it('returns negative days for past deadline', () => {
      const today = new Date('2026-10-06')
      const deadline = '2026-10-02'
      expect(getDaysLeft(deadline, today)).toBe(-4)
    })
  })

  describe('isOverdue', () => {
    it('returns true when assignment is incomplete and past deadline', () => {
      const item: Assignment = {
        id: '1',
        subject: 'Math',
        title: 'HW1',
        deadline: addDays(-2),
        priority: 'high',
        completed: false,
      }
      expect(isOverdue(item)).toBe(true)
    })

    it('returns false when assignment is completed even if past deadline', () => {
      const item: Assignment = {
        id: '2',
        subject: 'Math',
        title: 'HW2',
        deadline: addDays(-5),
        priority: 'low',
        completed: true,
      }
      expect(isOverdue(item)).toBe(false)
    })

    it('returns false when deadline is in the future', () => {
      const item: Assignment = {
        id: '3',
        subject: 'Web',
        title: 'Lab 1',
        deadline: addDays(3),
        priority: 'medium',
        completed: false,
      }
      expect(isOverdue(item)).toBe(false)
    })
  })

  describe('calcStats', () => {
    it('correctly calculates total, completed, overdue, and pending counts', () => {
      const mockAssignments: Assignment[] = [
        { id: '1', subject: 'Web', title: 'Task 1', deadline: addDays(2), priority: 'high', completed: false },
        { id: '2', subject: 'Web', title: 'Task 2', deadline: addDays(-3), priority: 'medium', completed: false },
        { id: '3', subject: 'DB', title: 'Task 3', deadline: addDays(-1), priority: 'low', completed: true },
      ]

      const stats = calcStats(mockAssignments)

      expect(stats.total).toBe(3)
      expect(stats.completed).toBe(1)
      expect(stats.overdue).toBe(1)
      expect(stats.pending).toBe(1)
      expect(stats.bySubject['Web'].total).toBe(2)
      expect(stats.bySubject['DB'].completed).toBe(1)
    })

    it('handles empty assignment array boundary case', () => {
      const stats = calcStats([])
      expect(stats.total).toBe(0)
      expect(stats.completed).toBe(0)
      expect(stats.overdue).toBe(0)
      expect(stats.pending).toBe(0)
      expect(Object.keys(stats.bySubject).length).toBe(0)
    })
  })
})
