export const customLevels = {
  levels: { error: 0, warn: 1, info: 2, http: 3, debug: 4 },
  colors: {
    error: process.env.LOG_COLOR_ERROR || "red",
    warn: process.env.LOG_COLOR_WARN || "yellow",
    info: process.env.LOG_COLOR_INFO || "cyan",
    http: process.env.LOG_COLOR_HTTP || "magenta",
    debug: process.env.LOG_COLOR_DEBUG || "gray",
  },
};