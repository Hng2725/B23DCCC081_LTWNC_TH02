import { configureStore } from '@reduxjs/toolkit'
import reduxLogger, { createLogger } from 'redux-logger'
import assignmentsReducer from '../features/assignments/assignmentsSlice'
import filterReducer from '../features/filter/filterSlice'

// Đảm bảo tương thích giữa ESM và CJS của redux-logger
const getLoggerMiddleware = () => {
  if (typeof createLogger === 'function') {
    return createLogger()
  }
  if (typeof (reduxLogger as any)?.createLogger === 'function') {
    return (reduxLogger as any).createLogger()
  }
  if (typeof (reduxLogger as any)?.default === 'function') {
    return (reduxLogger as any).default()
  }
  return typeof reduxLogger === 'function' ? reduxLogger : null
}

const loggerMiddleware = getLoggerMiddleware()

export const store = configureStore({
  reducer: {
    assignments: assignmentsReducer,
    filter: filterReducer,
  },
  middleware: (getDefaultMiddleware) => {
    const isDev = import.meta.env ? import.meta.env.DEV : process.env.NODE_ENV === 'development'
    if (isDev && loggerMiddleware) {
      return getDefaultMiddleware().concat(loggerMiddleware as any)
    }
    return getDefaultMiddleware()
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
