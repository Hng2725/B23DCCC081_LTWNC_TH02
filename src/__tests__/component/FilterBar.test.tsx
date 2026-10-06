import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterBar } from '../../features/filter/components/FilterBar'
import type { FilterStatus } from '../../features/filter/filterSlice'

describe('Component Tests: FilterBar', () => {
  const counts: Record<FilterStatus, number> = {
    all: 5,
    pending: 3,
    overdue: 1,
    completed: 1,
  }

  it('renders search input and filter option buttons', () => {
    render(<FilterBar current="all" counts={counts} onChange={jest.fn()} searchQuery="" />)

    expect(screen.getByPlaceholderText(/Tìm kiếm theo tên bài tập/i)).toBeInTheDocument()
    expect(screen.getByText('Tất cả (5)')).toBeInTheDocument()
    expect(screen.getByText('Chưa hoàn thành (3)')).toBeInTheDocument()
    expect(screen.getByText('Quá hạn (1)')).toBeInTheDocument()
    expect(screen.getByText('Đã hoàn thành (1)')).toBeInTheDocument()
  })

  it('calls onChange when a filter button is clicked', async () => {
    const handleChange = jest.fn()
    render(<FilterBar current="all" counts={counts} onChange={handleChange} searchQuery="" />)

    await userEvent.click(screen.getByText('Quá hạn (1)'))
    expect(handleChange).toHaveBeenCalledWith('overdue')
  })

  it('calls onSearchChange when typing into search input', async () => {
    const handleSearchChange = jest.fn()
    render(
      <FilterBar
        current="all"
        counts={counts}
        onChange={jest.fn()}
        searchQuery=""
        onSearchChange={handleSearchChange}
      />,
    )

    const searchInput = screen.getByPlaceholderText(/Tìm kiếm/i)
    await userEvent.type(searchInput, 'React')

    expect(handleSearchChange).toHaveBeenCalled()
  })
})
