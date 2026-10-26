import { config } from './env.js';

export function isOriginAllowed(origin: string | undefined): boolean {
  // Allow requests with no origin (e.g. mobile apps, curl, Postman, internal calls)
  if (!origin) return true;

  // Exact match from configured allowedOrigins
  if (config.allowedOrigins.includes(origin)) return true;

  // Support Render production and PR preview subdomains
  if (origin.endsWith('.onrender.com')) return true;

  // Support all localhost and 127.0.0.1 ports (5173, 5174, 5175, 3000, etc.)
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;

  return false;
}

export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
