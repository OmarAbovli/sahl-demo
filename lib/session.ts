import { cookies } from "next/headers"
import { sql } from "./database"
import type { User } from "./database"

export async function createSession(user: User) {
  const sessionToken = generateSessionToken()
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  // Store session in database (you might want to create a sessions table)
  // For now, we'll use cookies with the user ID
  const cookieStore = await cookies()
  cookieStore.set(
    "session",
    JSON.stringify({
      userId: user.id,
      uniqueKey: user.unique_key,
      role: user.role,
      companyId: user.company_id,
      expiresAt: expiresAt.toISOString(),
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
    },
  )
}

export async function getSession(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return null
    }

    const sessionData = JSON.parse(sessionCookie.value)

    // Check if session is expired
    if (new Date(sessionData.expiresAt) < new Date()) {
      await destroySession()
      return null
    }

    // Get fresh user data
    const users = await sql`
      SELECT * FROM users 
      WHERE id = ${sessionData.userId} 
      AND is_active = true 
      AND (expires_at IS NULL OR expires_at > NOW())
    `

    if (users.length === 0) {
      await destroySession()
      return null
    }

    const { password_hash, ...user } = users[0]
    return user as User
  } catch (error) {
    console.error("Session error:", error)
    return null
  }
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}

function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export async function requireAuth(allowedRoles?: string[]): Promise<User> {
  const user = await getSession()

  if (!user) {
    throw new Error("Authentication required")
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new Error("Insufficient permissions")
  }

  return user
}
