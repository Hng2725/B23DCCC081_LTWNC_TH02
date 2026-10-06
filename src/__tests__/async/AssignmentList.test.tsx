import { render, screen } from '@testing-library/react'
import { AssignmentList } from '../../features/assignments/components/AssignmentList'
import type { Assignment } from '../../features/assignments/assignmentTypes'

describe('Async Tests: AssignmentList (Mock States)', () => {
  const mockToggle = jest.fn()
  const mockDelete = jest.fn()
  const mockPin = jest.fn()

  it('renders loading indicator when status is loading', () => {
    render(
      <AssignmentList
        assignments={[]}
        status="loading"
        error={null}
        onToggle={mockToggle}
        onDelete={mockDelete}
        onPin={mockPin}
      />,
    )

    expect(screen.getByText('Đang tải...')).toBeInTheDocument()
  })

  it('renders error message when status is failed', () => {
    render(
      <AssignmentList
        assignments={[]}
        status="failed"
        error="Không thể tải danh sách bài tập"
        onToggle={mockToggle}
        onDelete={mockDelete}
        onPin={mockPin}
      />,
    )

    expect(screen.getByText('Không thể tải danh sách bài tập')).toBeInTheDocument()
  })

  it('renders list of assignments when status is succeeded', () => {
    const assignments: Assignment[] = [
      { id: '1', subject: 'Web', title: 'Bài tập 1', deadline: '2026-10-15', priority: 'high', completed: false },
      { id: '2', subject: 'Math', title: 'Bài tập 2', deadline: '2026-10-16', priority: 'low', completed: true },
    ]

    render(
      <AssignmentList
        assignments={assignments}
        status="succeeded"
        error={null}
        onToggle={mockToggle}
        onDelete={mockDelete}
        onPin={mockPin}
      />,
    )

    expect(screen.getByText('Bài tập 1')).toBeInTheDocument()
    expect(screen.getByText('Bài tập 2')).toBeInTheDocument()
  })
})
