import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";

import { env } from "~/env";
import { db } from "~/server/db";
import { type PrismaClient } from "@prisma/client";
import { addContact, sendVerificationRequest } from "~/lib/resend";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
    };
  }
}


export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/authentication/login",
    newUser: "/auth/register",
    verifyRequest: '/account/registered'
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async session({ session, user }) {
      if (user) {
        session.user.id = user.id
      }
      return session
    },
    async signIn({ user, email }) {
      if (email) // it's an email sign in
      {
        if (email.verificationRequest) // User is log in using magic link
        {
          const dbUser = await db.user.findFirst({
            where: {
              email: user.email
            }
          });

          if (!dbUser) throw new Error("User not found");

          if (!dbUser.emailSubscriptionId && dbUser.email) {
            const contactId = await addContact(dbUser.email);
            await db.user.update({
              where: {
                id: dbUser.id
              },
              data: {
                emailSubscriptionId: contactId
              }
            });
          }
        }
      }
      return true
    }
  },
  adapter: PrismaAdapter(db as PrismaClient),
  providers: [
    EmailProvider({
      from: env.EMAIL_FROM,
      sendVerificationRequest,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    })
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
