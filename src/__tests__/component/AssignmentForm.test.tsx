import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AssignmentForm } from '../../features/assignments/components/AssignmentForm'

describe('Component Tests: AssignmentForm (RTL + userEvent)', () => {
  it('displays validation error messages when submitting empty form', async () => {
    const handleAdd = jest.fn()
    const handleCancel = jest.fn()

    render(<AssignmentForm onAdd={handleAdd} onCancel={handleCancel} />)

    const submitButton = screen.getByRole('button', { name: 'Thêm' })
    await userEvent.click(submitButton)

    expect(screen.getByText('Vui lòng nhập môn học')).toBeInTheDocument()
    expect(screen.getByText('Vui lòng nhập tên bài tập')).toBeInTheDocument()
    expect(screen.getByText('Vui lòng chọn hạn nộp')).toBeInTheDocument()
    expect(handleAdd).not.toHaveBeenCalled()
  })

  it('submits form with valid data and calls onAdd with trimmed values', async () => {
    const handleAdd = jest.fn()
    const handleCancel = jest.fn()

    render(<AssignmentForm onAdd={handleAdd} onCancel={handleCancel} />)

    const subjectInput = screen.getByLabelText('Môn học')
    const titleInput = screen.getByLabelText('Tên bài tập')
    const deadlineInput = screen.getByLabelText('Hạn nộp')
    const prioritySelect = screen.getByLabelText('Độ ưu tiên')
    const submitButton = screen.getByRole('button', { name: 'Thêm' })

    await userEvent.type(subjectInput, '   Cơ sở dữ liệu   ')
    await userEvent.type(titleInput, '   Báo cáo đồ án   ')
    await userEvent.type(deadlineInput, '2026-11-20')
    await userEvent.selectOptions(prioritySelect, 'high')

    await userEvent.click(submitButton)

    expect(handleAdd).toHaveBeenCalledTimes(1)
    expect(handleAdd).toHaveBeenCalledWith({
      subject: 'Cơ sở dữ liệu',
      title: 'Báo cáo đồ án',
      deadline: '2026-11-20',
      priority: 'high',
    })
  })
})
