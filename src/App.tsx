import { lazy, Suspense, useCallback, useState } from 'react'
import { Modal } from './components/Modal'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import type { NewAssignment } from './features/assignments/assignmentTypes'
import { AssignmentForm } from './features/assignments/components/AssignmentForm'
import { AssignmentList } from './features/assignments/components/AssignmentList'
import { useAssignments } from './features/assignments/useAssignments'
import { FilterBar } from './features/filter/components/FilterBar'

// React.lazy và Suspense cho trang/component Thống kê
const StatsView = lazy(() => import('./features/stats/StatsView'))

function MainContent() {
  const { theme, toggleTheme } = useTheme()
  const {
    assignments,
    allItems,
    status,
    error,
    filter,
    counts,
    searchQuery,
    setSearchQuery,
    isStressTestActive,
    add,
    toggle,
    remove,
    changeFilter,
    pin,
    toggleStressTest,
  } = useAssignments()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [isVirtualizedView, setIsVirtualizedView] = useState(false)

  const closeForm = useCallback(() => setIsFormOpen(false), [])

  const handleAdd = useCallback(
    (data: NewAssignment) => {
      add(data)
      closeForm()
    },
    [add, closeForm],
  )

  const handleToggleStressTest = useCallback(() => {
    if (!isStressTestActive) {
      toggleStressTest()
      setIsVirtualizedView(true)
    } else {
      toggleStressTest()
      setIsVirtualizedView(false)
    }
  }, [isStressTestActive, toggleStressTest])

  return (
    <main className="container">
      <header className="header">
        <div className="header__title-group">
          <h1>Student Deadline Tracker</h1>
          <span className="badge badge--info">{allItems.length} bài tập</span>
        </div>

        <div className="header__actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={toggleTheme}
            aria-label="Đổi giao diện"
          >
            {theme === 'light' ? '🌙 Chế độ tối' : '☀️ Chế độ sáng'}
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => setShowStats((prev) => !prev)}
          >
            {showStats ? '📋 Danh sách bài tập' : '📊 Thống kê'}
          </button>

          <button
            type="button"
            className={isStressTestActive ? 'btn-danger' : 'btn-warning'}
            onClick={handleToggleStressTest}
            title={
              isStressTestActive
                ? 'Tắt chế độ 10.000 bài tập và quay về danh sách mặc định'
                : 'Tạo 10.000 bài tập mẫu để stress test hiệu năng'
            }
          >
            {isStressTestActive ? '⚡ Tắt chế độ 10.000 bài tập' : '⚡ Tạo 10.000 bài tập mẫu'}
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={() => setIsFormOpen(true)}
          >
            + Thêm bài tập
          </button>
        </div>
      </header>

      {showStats ? (
        <Suspense fallback={<p className="message">Đang tải dữ liệu thống kê...</p>}>
          <StatsView assignments={allItems} />
        </Suspense>
      ) : (
        <>
          <FilterBar
            current={filter}
            counts={counts}
            onChange={changeFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {allItems.length >= 100 && (
            <div className="view-mode-banner">
              <span>Đang ở chế độ danh sách lớn ({assignments.length} kết quả).</span>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isVirtualizedView}
                  onChange={(e) => setIsVirtualizedView(e.target.checked)}
                />{' '}
                Bật Virtualization (react-window)
              </label>
            </div>
          )}

          <AssignmentList
            assignments={assignments}
            status={status}
            error={error}
            onToggle={toggle}
            onDelete={remove}
            onPin={pin}
            isVirtualized={isVirtualizedView}
          />
        </>
      )}

      <Modal open={isFormOpen} title="Thêm bài tập" onClose={closeForm}>
        <AssignmentForm onAdd={handleAdd} onCancel={closeForm} />
      </Modal>
    </main>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <MainContent />
    </ThemeProvider>
  )
}
