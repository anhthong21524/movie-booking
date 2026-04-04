export type AppErrorCategory =
  | 'network'
  | 'timeout'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'validation'
  | 'conflict'
  | 'rate_limited'
  | 'server'
  | 'unknown'

export type AppErrorSurface = 'page' | 'section' | 'action'

export interface AppErrorValidationMap {
  [field: string]: string[]
}

export interface AppErrorMessageVm {
  title: string
  description: string
  retryLabel: string
}

export interface AppErrorInit {
  category: AppErrorCategory
  message: string
  statusCode?: number
  retryable?: boolean
  code?: string
  details?: unknown
  requestId?: string
  validation?: AppErrorValidationMap
}

export class AppError extends Error {
  override readonly name = 'AppError'
  readonly category: AppErrorCategory
  readonly statusCode?: number
  readonly retryable: boolean
  readonly code?: string
  readonly details?: unknown
  readonly requestId?: string
  readonly validation?: AppErrorValidationMap

  constructor(init: AppErrorInit) {
    super(init.message)
    this.category = init.category
    this.statusCode = init.statusCode
    this.retryable = init.retryable ?? false
    this.code = init.code
    this.details = init.details
    this.requestId = init.requestId
    this.validation = init.validation
  }
}
