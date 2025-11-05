export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'RESOURCE_NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'INTERNAL_SERVER_ERROR'
  | 'UNKNOWN_ERROR'

export interface ApiError extends Error {
  name: 'ApiError'
  message: string
  status: number
  errorCode: ErrorCode
  cause?: Error
}

export interface ApiListResponse<T> {
  data: T[]
}

export interface ApiItemResponse<T> {
  data: T
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}
