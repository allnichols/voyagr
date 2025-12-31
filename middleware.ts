export { default } from "next-auth/middleware";

export const config = {
    matcher: [
        // API routes
        "/api/trips/:path*",
        "/api/user/:path*",
        
        // pages
        "/dashboard/:path*",
    ]
}