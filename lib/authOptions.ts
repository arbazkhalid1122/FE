// lib/auth.ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import axios from "axios";

declare module "next-auth" {
  interface User {
    token?: string;
    role?: string;
    agreedTerms?: boolean;
    hasBusinessProfile?: boolean;
  }

  interface Session {
    accessToken?: string;
    user?: {
      id?: string;
      email?: string;
      name?: string;
      role?: string;
      agreedTerms?: boolean;
      hasBusinessProfile?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    agreedTerms?: boolean;
    hasBusinessProfile?: boolean;
    userId?: string;
    email?: string;
    name?: string;
    role?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/auth/signin`, {
            email: credentials?.email,
            password: credentials?.password,
          }, {
            headers: { "Content-Type": "application/json" }
          });

          const user = response.data;

          if (user?.token) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              token: user.token,
              role: user.role,
              agreedTerms: user.agreedTerms,
              hasBusinessProfile: user.hasBusinessProfile,
            } as any;
          }
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.token) {
        token.accessToken = user.token;
        token.agreedTerms = user.agreedTerms;
        token.hasBusinessProfile = user.hasBusinessProfile;
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken;
        session.user = {
          id: token.userId,
          email: token.email,
          name: token.name,
          role: token.role,
          agreedTerms: token.agreedTerms,
          hasBusinessProfile: token.hasBusinessProfile,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/validate-access-code",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
