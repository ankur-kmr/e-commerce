import NextAuth, { type NextAuthConfig } from "next-auth";
// import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import { NextResponse } from "next/server";

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  // adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          type: 'email',
        },
        password: { type: 'password' },
      },
      async authorize(credentials) {  // From form data
        if (credentials == null) return null
  
        // Find user in database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        })
        // Check if user exists and password is correct
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          )
          // If password is correct, return user object
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            }
          }
        }
        // If user doesn't exist or password is incorrect, return null
        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      // Assign user fields to token
      if (user) {
        token.role = user.role;

        // If user has no name, use email as their default name
        if (user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0];

          // Update the user in the database with the new name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }
      }

      // Handle session updates (e.g., name change)
      if (session?.user.name && trigger === 'update') {
        token.name = session.user.name;
      }
      // console.log(token, 'token')
      return token;
    },
    async session({ session, trigger, token }: any) {
      session.user.id = token.sub
      session.user.name = token.name;
      session.user.role = token.role;
      
      // Optionally handle session updates (like name change)
      if (trigger === 'update' && token.name) {
        session.user.name = token.name
      }
      // console.log(session, 'session')
      return session;
    },
    authorized({ request, auth }: any) {

      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];
    
      // Get pathname from the req URL object
      const { pathname } = request.nextUrl;
    
      // Check if user is not authenticated and on a protected path
      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;

      // Check for cart cookie
      if (!request.cookies.get('sessionCartId')) {
        // Generate cart cookie
        const sessionCartId = crypto.randomUUID(); 
    
        // Clone the request headers
        const newRequestHeaders = new Headers(request.headers); 
    
        // Create a new response and add the new headers
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });
    
        // Set the newly generated sessionCartId in the response cookies
        response.cookies.set('sessionCartId', sessionCartId);

        console.log(auth, '(auth) <<---');
    
        // Return the response with the sessionCartId set
        return response;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(config);