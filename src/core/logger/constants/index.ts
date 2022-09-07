export enum LOG_LEVEL {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  NOTICE = 'notice',
}

export enum LOG_COLOR {
  ERROR = '\x1b[91m',
  WARN = '\x1b[33m',
  INFO = '\x1b[36m',
  DEBUG = '\x1b[95m',
  NOTICE = '\x1b[90m',
  RESET = '\x1b[0m',
}
