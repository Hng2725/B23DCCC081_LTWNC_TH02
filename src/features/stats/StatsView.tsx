import { useMemo } from 'react'
import type { Assignment } from '../assignments/assignmentTypes'
import { calcStats } from '../../utils/stats'

interface StatsViewProps {
  assignments: Assignment[]
}

export function StatsView({ assignments }: StatsViewProps) {
  const stats = useMemo(() => calcStats(assignments), [assignments])

  return (
    <section className="stats-container" aria-label="Thống kê bài tập">
      <h2>📊 Thống Kê Bài Tập</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-card__number">{stats.total}</span>
          <span className="stat-card__label">Tổng số bài tập</span>
        </div>
        <div className="stat-card stat-card--success">
          <span className="stat-card__number">{stats.completed}</span>
          <span className="stat-card__label">Đã hoàn thành</span>
        </div>
        <div className="stat-card stat-card--warning">
          <span className="stat-card__number">{stats.pending}</span>
          <span className="stat-card__label">Đang thực hiện</span>
        </div>
        <div className="stat-card stat-card--danger">
          <span className="stat-card__number">{stats.overdue}</span>
          <span className="stat-card__label">Quá hạn</span>
        </div>
      </div>

      <div className="stats-by-subject">
        <h3>Theo môn học</h3>
        {Object.keys(stats.bySubject).length === 0 ? (
          <p className="message">Chưa có dữ liệu môn học.</p>
        ) : (
          <div className="subject-list">
            {Object.entries(stats.bySubject).map(([sub, info]) => {
              const percent = info.total > 0 ? Math.round((info.completed / info.total) * 100) : 0
              return (
                <div key={sub} className="subject-item">
                  <div className="subject-item__info">
                    <strong>{sub}</strong>
                    <span>
                      {info.completed}/{info.total} xong ({percent}%)
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar__fill" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default StatsView
