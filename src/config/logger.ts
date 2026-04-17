import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf, colorize, errors, json } = format;

const isDev = process.env.NODE_ENV !== "production";

const SENSITIVE_KEYS = /password|token|secret|authorization|cookie|apikey/i;

function redactKeys(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => {
      if (SENSITIVE_KEYS.test(k)) return [k, "[REDACTED]"];
      if (v && typeof v === "object") return [k, redactKeys(v as Record<string, unknown>)];
      return [k, v];
    })
  );
}

const sanitizeData = format((info) => {
  if (typeof info.message === "string") {
    info.message = info.message.replace(/[\r\n\x1b]/g, " ");
  }

  if (info.message && typeof info.message === "object") {
    info.message = redactKeys(info.message as Record<string, unknown>);
  }

  const { level, message, timestamp, stack, ...meta } = info;
  if (Object.keys(meta).length) {
    const redacted = redactKeys(meta);
    Object.assign(info, redacted);
  }

  return info;
});

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

export const logger = createLogger({
  level: isDev ? "debug" : "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: isDev }),
    sanitizeData(),
    isDev
      ? combine(logFormat, colorize({ all: true }))
      : json()
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
});