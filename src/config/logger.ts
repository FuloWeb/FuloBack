import winston, { createLogger, format, transports } from "winston";
import { addColors } from "winston/lib/winston/config/index.js";
import { customLevels } from "./custom_log_level.js";
const { combine, timestamp, printf, colorize, errors, json } = format;

const isDev = process.env.NODE_ENV !== "production";

const SENSITIVE_KEYS = /password|token|secret|authorization|cookie|apikey/i;
interface CustomLogger extends winston.Logger {
  error: winston.LeveledLogMethod;
  warn: winston.LeveledLogMethod;
  info: winston.LeveledLogMethod;
  http: winston.LeveledLogMethod;
  success: winston.LeveledLogMethod;
  debug: winston.LeveledLogMethod;
}

function redactKeys(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => {
      if (SENSITIVE_KEYS.test(k)) {
        return [k, "[REDACTED]"];
      }
      if (v && typeof v === "object") {
        return [k, redactKeys(v as Record<string, unknown>)];
      }
      return [k, v];
    }),
  );
}

addColors(customLevels.colors);

const sanitizeData = format((info) => {
  if (typeof info.message === "string") {
    info.message = info.message.replace(/[\r\n\x1b]/g, " ");
  }
  if (info.message && typeof info.message === "object") {
    info.message = redactKeys(info.message as Record<string, unknown>);
  }
  const { level, message, timestamp, stack, ...meta } = info;

  if (Object.keys(meta).length) {
    Object.assign(info, redactKeys(meta));
  }

  return info;
});

const prettyFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  const metaStr = Object.keys(meta).length
    ? "\n" + JSON.stringify(meta, null, 2)
    : "";

  return `${timestamp} [${level}]: ${stack || message}${metaStr}`;
});

export const logger = createLogger({
  levels: customLevels.levels,
  level: isDev ? "debug" : "info",
  format: combine(
    timestamp({
      format: process.env.LOG_TIMESTAMP_FORMAT || "YYYY-MM-DD HH:mm:ss",
    }),
    errors({ stack: isDev }),
    sanitizeData(),
    isDev ? combine(colorize({ all: true }), prettyFormat) : json(),
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new transports.File({
      filename: "logs/combined.log",
    }),
  ],
}) as CustomLogger;
