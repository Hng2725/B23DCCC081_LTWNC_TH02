import { render, screen } from '@testing-library/react'
import { StatsView } from '../../features/stats/StatsView'
import type { Assignment } from '../../features/assignments/assignmentTypes'

describe('Component Tests: StatsView', () => {
  const mockAssignments: Assignment[] = [
    { id: '1', subject: 'Lập trình Web', title: 'Task 1', deadline: '2026-10-10', priority: 'high', completed: true },
    { id: '2', subject: 'Lập trình Web', title: 'Task 2', deadline: '2026-10-15', priority: 'medium', completed: false },
    { id: '3', subject: 'Cơ sở dữ liệu', title: 'Task 3', deadline: '2026-09-01', priority: 'low', completed: false },
  ]

  it('renders stats grid and subject breakdown correctly', () => {
    render(<StatsView assignments={mockAssignments} />)

    expect(screen.getByText('📊 Thống Kê Bài Tập')).toBeInTheDocument()
    expect(screen.getByText('Tổng số bài tập')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('Đã hoàn thành')).toBeInTheDocument()
    expect(screen.getAllByText('1').length).toBeGreaterThan(0)
    expect(screen.getByText('Lập trình Web')).toBeInTheDocument()
    expect(screen.getByText('Cơ sở dữ liệu')).toBeInTheDocument()
  })

  it('renders empty message when no subject data is available', () => {
    render(<StatsView assignments={[]} />)
    expect(screen.getByText('Chưa có dữ liệu môn học.')).toBeInTheDocument()
  })
})
