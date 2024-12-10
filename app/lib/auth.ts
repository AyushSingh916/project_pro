import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from "@/lib/prisma";

export const NEXT_AUTH = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password", placeholder: "password..." },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          // Fetch user from the database based on email
          const user = await db.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            return null; // User not found
          }

          // Check if the password matches (assuming plaintext comparison, replace with your actual method)
          if (credentials.password !== user.password) {
            return null; // Invalid password
          }

          // Return the user object with required fields
          return {
            id: user.username, // Make sure 'id' is included
            username: user.username,
            email: user.email,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null; // Return null in case of an error
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/signin', // Custom sign-in page
  },
  callbacks: {
    async signIn({ user } : any) {
      // Prevent sign-in for specific users (e.g., random@gmail.com)
      if (user.email === "random@gmail.com") {
        return false;
      }
      return true; // Allow other users to sign in
    },
    async jwt({ token, user } : any) {
      if (user) {
        token.userId = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token } : any) {
      if (session?.user) {
        session.user.id = token.userId;
        session.user.username = token.username;
      }
      return session;
    }
  },
};
