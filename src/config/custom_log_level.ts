export const customLevels = {
  levels: { error: 0, warn: 1, info: 2, http: 3, success: 4, debug: 5 },
  colors: {
    error: process.env.LOG_COLOR_ERROR || "red",
    warn: process.env.LOG_COLOR_WARN || "yellow",
    info: process.env.LOG_COLOR_INFO || "cyan",
    http: process.env.LOG_COLOR_HTTP || "magenta",
    success: process.env.LOG_COLOR_SUCESS || "green",
    debug: process.env.LOG_COLOR_DEBUG || "gray",
  },
};
