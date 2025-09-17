import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import axios from "axios";

export async function middleware(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

  // Allow requests to public routes
  const isPublicRoute = 
    pathname === "/sign-in" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/validate-access-code") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/create-profile") ||
    pathname.startsWith("/terms-and-conditions") ||
    pathname.startsWith("/static") || // Static files
    pathname.startsWith("/_next") ||
      pathname.match(/\.(.*)$/) || // allow static file extensions like .png, .jpg, .css, etc.
    pathname === "/favicon.ico";

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Redirect to /sign-in if not authenticated
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Check if user has verified their OTP (agreedTerms should be true after OTP verification)
  if (token.agreedTerms === false && pathname !== "/validate-access-code") {
    return NextResponse.redirect(new URL("/validate-access-code", req.url));
  }

  // Check if user needs to create business profile first
  // Fetch fresh user data from backend to get updated hasBusinessProfile status
  if (token.accessToken && pathname !== "/create-profile" && pathname !== "/terms-and-conditions") {
    try {
      const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'https://envoyx-backend.vercel.app'}/auth/user`, {
        headers: {
          'Authorization': `Bearer ${token.accessToken}`,
        },
      });
      
      // If user hasn't created business profile, redirect to create-profile
      if (userResponse.data.hasBusinessProfile === false) {
        return NextResponse.redirect(new URL("/create-profile", req.url));
      }
      
      // If user has business profile but hasn't agreed to terms, redirect to terms
      if (userResponse.data.hasBusinessProfile === true && userResponse.data.agreedTerms === false) {
        return NextResponse.redirect(new URL("/terms-and-conditions", req.url));
      }
    } catch (error) {
      console.error('Error fetching user data in middleware:', error);
      // If we can't fetch user data, fall back to token values
      if (token.hasBusinessProfile === false) {
        return NextResponse.redirect(new URL("/create-profile", req.url));
      }
      if (token.hasBusinessProfile === true && token.agreedTerms === false) {
        return NextResponse.redirect(new URL("/terms-and-conditions", req.url));
      }
    }
  }

  return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // If there's an error, allow the request to proceed to avoid blocking the app
    return NextResponse.next();
  }
}
