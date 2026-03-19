import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db } from "./db"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const admin = await db.adminUser.findUnique({
          where: { email: credentials.email.toLowerCase() },
        })
        if (!admin) return null
        const valid = await bcrypt.compare(credentials.password, admin.password)
        if (!valid) return null
        await db.adminUser.update({
          where: { id: admin.id },
          data: { lastLogin: new Date() },
        })
        return { id: String(admin.id), email: admin.email, name: admin.name }
      },
    }),
  ],
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = "admin"
      }
      return token
    },
    session({ session, token }) {
      if (token && session.user) {
        ;(session.user as Record<string, unknown>).id = token.id
        ;(session.user as Record<string, unknown>).role = token.role
      }
      return session
    },
  },
}
