import { render, screen } from '@testing-library/react'
import { VirtualizedAssignmentList } from '../../features/assignments/components/VirtualizedAssignmentList'
import type { Assignment } from '../../features/assignments/assignmentTypes'

describe('Component Tests: VirtualizedAssignmentList', () => {
  const mockAssignments: Assignment[] = Array.from({ length: 50 }, (_, i) => ({
    id: `virt-${i}`,
    subject: 'Subject Virt',
    title: `Task Virt ${i}`,
    deadline: '2026-12-12',
    priority: 'medium',
    completed: false,
  }))

  it('renders virtualized list container', () => {
    render(
      <VirtualizedAssignmentList
        assignments={mockAssignments}
        onToggle={jest.fn()}
        onDelete={jest.fn()}
        onPin={jest.fn()}
      />,
    )

    expect(screen.getByTestId('virtualized-list')).toBeInTheDocument()
  })
})
