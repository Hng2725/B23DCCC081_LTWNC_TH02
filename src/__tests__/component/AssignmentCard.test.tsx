import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AssignmentCard } from '../../features/assignments/components/AssignmentCard'
import type { Assignment } from '../../features/assignments/assignmentTypes'

describe('Component Tests: AssignmentCard (RTL + userEvent)', () => {
  const sampleAssignment: Assignment = {
    id: 'test-1',
    subject: 'Lập trình Web',
    title: 'Xây dựng Web App với React',
    deadline: '2026-12-31',
    priority: 'high',
    completed: false,
  }

  it('renders assignment information correctly', () => {
    render(
      <AssignmentCard assignment={sampleAssignment}>
        <div className="card__info">
          <AssignmentCard.Subject />
          <AssignmentCard.Priority />
          <AssignmentCard.Status />
          <AssignmentCard.Title />
          <AssignmentCard.Deadline />
        </div>
      </AssignmentCard>,
    )

    expect(screen.getByText('Lập trình Web')).toBeInTheDocument()
    expect(screen.getByText('Xây dựng Web App với React')).toBeInTheDocument()
    expect(screen.getByText('Ưu tiên: Cao')).toBeInTheDocument()
    expect(screen.getByText('Chưa hoàn thành')).toBeInTheDocument()
  })

  it('triggers onToggle handler when complete checkbox is clicked', async () => {
    const handleToggle = jest.fn()
    const handleDelete = jest.fn()

    render(
      <AssignmentCard assignment={sampleAssignment}>
        <AssignmentCard.Actions onToggle={handleToggle} onDelete={handleDelete} />
      </AssignmentCard>,
    )

    const checkbox = screen.getByRole('checkbox', { name: /Mark Xây dựng Web App với React as completed/i })
    expect(checkbox).not.toBeChecked()

    await userEvent.click(checkbox)
    expect(handleToggle).toHaveBeenCalledTimes(1)
    expect(handleToggle).toHaveBeenCalledWith('test-1')
  })

  it('triggers onPin handler when pin button is clicked', async () => {
    const handlePin = jest.fn()
    const handleToggle = jest.fn()
    const handleDelete = jest.fn()

    render(
      <AssignmentCard assignment={sampleAssignment}>
        <AssignmentCard.Actions onToggle={handleToggle} onDelete={handleDelete} onPin={handlePin} />
      </AssignmentCard>,
    )

    const pinBtn = screen.getByRole('button', { name: /Ghim Xây dựng Web App với React/i })
    await userEvent.click(pinBtn)

    expect(handlePin).toHaveBeenCalledTimes(1)
    expect(handlePin).toHaveBeenCalledWith('test-1')
  })
})
