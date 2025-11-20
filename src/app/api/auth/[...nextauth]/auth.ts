import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import { compare } from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";

export const config = {
  logger: {
    error(code, metadata) {
      console.error(code, metadata);
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (!user || !user.password) return null;

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;

        // Return user object with id as string and without password
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          console.log("Google sign-in attempt for:", user.email);
          
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
            include:  { accounts: true }
          });

          if (!existingUser) {
            console.log("Creating new user for:", user.email);
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || "",
                image: user.image,
                password: null,
              },
            });
            console.log("User created successfully");
            return true;
          } else {
            console.log("User already exists:", user.email);
            const existingGoogleAccount = existingUser.accounts.find(
              (acc: any) => acc.provider === 'google' && acc.providerAccountId === account.providerAccountId
            )
            if(existingGoogleAccount) {
              console.log("Existing Google account found for user:", user.email);
              return true;
            }

            if(existingUser.password) {
              // linking existing users google auth to their accounts table

              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  refresh_token: account.refresh_token, 
                  access_token: account.access_token, 
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  session_state: account.session_state
                }
              })

              await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                  name: existingUser.name || user.name,
                  image: existingUser.image || user.image
                }
              });
              return true;
            }
          }
          return true;
        } catch (error) {
          console.error("Error in Google sign-in callback:", error);
          return false;
        }
      }
      return true;
    },

    async redirect({ url, baseUrl }) {
      if(url.includes('/api/auth/callback/google')) {
        return `${baseUrl}/dashboard`;
      }

      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      
      // For Google OAuth users, get the user ID from database
      if (account?.provider === "google" && token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email },
          });
          if (dbUser) {
            token.id = dbUser.id.toString();
          }
        } catch (error) {
          console.error("Error fetching user in JWT callback:", error);
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthOptions;

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config);
}
