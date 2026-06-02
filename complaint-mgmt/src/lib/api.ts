// API routes are served by the standalone backend if configured, otherwise fallback to Next.js native routes
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";
