import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export async function middleware(request:NextRequest) {
  const token = await getToken({req: request});
  // console.log("token, middleware", token);
  
  const url = request.nextUrl;

  // console.log("url, middleware", url.pathname);
  
  if(token && (
    url.pathname.startsWith('/signIn') ||
    url.pathname.startsWith('/signUp') ||
    url.pathname.startsWith('/verify') 
  )) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/signIn',
    '/signUp',
    '/',
    '/dashboard/:path*',
    '/verify/:path*'
  ],
}
