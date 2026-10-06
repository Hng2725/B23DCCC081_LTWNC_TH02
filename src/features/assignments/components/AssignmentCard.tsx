import { createContext, memo, useContext, type ReactNode } from 'react'
import { formatDate, formatDaysLeft, getDaysLeft, isOverdue } from '../../../utils/date'
import { PRIORITY_LABELS, type Assignment, type AssignmentId } from '../assignmentTypes'
import { usePinStore } from '../usePinStore'

const AssignmentContext = createContext<{ assignment: Assignment; isPinned: boolean } | null>(null)

function useAssignmentContext() {
  const context = useContext(AssignmentContext)
  if (!context) {
    throw new Error('Các component AssignmentCard.* phải nằm trong <AssignmentCard>')
  }
  return context
}

interface RootProps {
  assignment: Assignment
  children: ReactNode
}

function BaseAssignmentCard({ assignment, children }: RootProps) {
  const isPinned = usePinStore((state) => state.pinnedIds.includes(assignment.id))

  const className = [
    'card',
    isPinned && 'card--pinned',
    assignment.completed && 'card--done',
    isOverdue(assignment) && 'card--overdue',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <AssignmentContext.Provider value={{ assignment, isPinned }}>
      <li className={className} data-testid={`card-${assignment.id}`}>
        {children}
      </li>
    </AssignmentContext.Provider>
  )
}

function Subject() {
  const { assignment } = useAssignmentContext()
  return <span className="card__subject">{assignment.subject}</span>
}

function Title() {
  const { assignment } = useAssignmentContext()
  return <span className="card__title">{assignment.title}</span>
}

function Deadline() {
  const { assignment } = useAssignmentContext()
  const { deadline } = assignment
  return (
    <span className="card__deadline">
      Hạn: {formatDate(deadline)} —{' '}
      <b className={isOverdue(assignment) ? 'text-danger' : ''}>{formatDaysLeft(getDaysLeft(deadline))}</b>
    </span>
  )
}

function Priority() {
  const { assignment } = useAssignmentContext()
  return <span className={`badge badge--${assignment.priority}`}>Ưu tiên: {PRIORITY_LABELS[assignment.priority]}</span>
}

function Status() {
  const { assignment, isPinned } = useAssignmentContext()
  return (
    <div className="card__badges">
      {isPinned && <span className="badge badge--pinned">📌 Đã ghim</span>}
      {assignment.completed ? (
        <span className="badge badge--done">Đã hoàn thành</span>
      ) : isOverdue(assignment) ? (
        <span className="badge badge--overdue">Quá hạn</span>
      ) : (
        <span className="badge">Chưa hoàn thành</span>
      )}
    </div>
  )
}

interface ActionsProps {
  onToggle: (id: AssignmentId) => void
  onDelete: (id: AssignmentId) => void
  onPin?: (id: AssignmentId) => void
}

function Actions({ onToggle, onDelete, onPin }: ActionsProps) {
  const { assignment, isPinned } = useAssignmentContext()
  const togglePinStore = usePinStore((state) => state.togglePin)

  const handlePin = () => {
    if (onPin) {
      onPin(assignment.id)
    } else {
      togglePinStore(assignment.id)
    }
  }

  const handleDelete = () => {
    if (window.confirm(`Xoá bài tập "${assignment.title}"?`)) onDelete(assignment.id)
  }

  return (
    <div className="card__actions">
      <div className="card__actions-left">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={assignment.completed}
            onChange={() => onToggle(assignment.id)}
            aria-label={`Mark ${assignment.title} as completed`}
          />{' '}
          Hoàn thành
        </label>
        <button
          type="button"
          className={`btn-pin ${isPinned ? 'btn-pin--active' : ''}`}
          onClick={handlePin}
          title={isPinned ? 'Bỏ ghim bài tập' : 'Ghim bài tập'}
          aria-label={`Ghim ${assignment.title}`}
        >
          {isPinned ? '📌 Đã ghim' : '📌 Ghim'}
        </button>
      </div>

      <button type="button" className="btn-delete" onClick={handleDelete} aria-label={`Xoá ${assignment.title}`}>
        Xoá
      </button>
    </div>
  )
}

const AssignmentCardMemo = memo(BaseAssignmentCard)

export const AssignmentCard = Object.assign(AssignmentCardMemo, {
  Subject,
  Title,
  Deadline,
  Priority,
  Status,
  Actions,
})

