import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)', // This includes all routes except static files and _next
    '/api/(.*)',                  // Include all API routes
  ],
};