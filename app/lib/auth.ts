import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
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
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      async profile(profile) {
        const email = profile.email || "";
        const username = profile.login;
        const imageUrl = profile.avatar_url;

        let user = await db.user.findUnique({
          where: { email },
        });

        if (!user) {
          user = await db.user.create({
            data: {
              email,
              username,
              password: "", 
              imageUrl,
            },
          });
        }

        return { id: String(user.id), username: user.username, email: user.email };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      async profile(profile) {
        const email = profile.email || "";
        const username = profile.name.replace(/\s+/g, '').toLowerCase();
        const imageUrl = profile.picture;

        // Check if the user already exists
        let user = await db.user.findUnique({
          where: { email },
        });

        if (!user) {
          // Create a new user in the database
          user = await db.user.create({
            data: {
              email,
              username,
              password: "", // No password for OAuth users
              imageUrl,
            },
          });
        }

        return { id: String(user.id), username: user.username, email: user.email };
      }
    }),
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
