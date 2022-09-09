export enum COLOR {
  BLACK = `\x1b[30m`,
  RED = `\x1b[31m`,
  GREEN = `\x1b[32m`,
  YELLOW = `\x1b[33m`,
  BLUE = `\x1b[34m`,
  MAGENTA = `\x1b[35m`,
  CYAN = `\x1b[36m`,
  LIGHT_GREY = `\x1b[90m`,
  LIGHT_RED = `\x1b[91m`,
  LIGHT_GREEN = `\x1b[92m`,
  LIGHT_YELLOW = `\x1b[93m`,
  LIGHT_BLUE = `\x1b[94m`,
  LIGHT_MAGENTA = `\x1b[95m`,
  LIGHT_CYAN = `\x1b[96m`,
  LIGHT_WHITE = `\x1b[97m`,
  RESET = '\x1b[0m',
}

export enum LOG_LEVEL {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  NOTICE = 'notice',
}

export const LOG_COLOR = {
  ERROR: COLOR.LIGHT_RED,
  WARN: COLOR.YELLOW,
  INFO: COLOR.CYAN,
  DEBUG: COLOR.LIGHT_MAGENTA,
  NOTICE: COLOR.LIGHT_GREY,
  RESET: COLOR.RESET,
}
