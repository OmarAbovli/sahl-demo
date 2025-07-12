import bcrypt from "bcryptjs"
import { sql } from "./database"
import type { User } from "./database"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function generateUniqueKey(companyName: string, role: string): Promise<string> {
  const rolePrefix = role === "company_admin" ? "admin" : role === "employee" ? "emp" : "super"
  const randomNumber = Math.floor(100 + Math.random() * 900) // 3-digit random number

  let uniqueKey = `${companyName}${rolePrefix}${randomNumber}`

  // Ensure uniqueness
  let attempts = 0
  while (attempts < 10) {
    const existing = await sql`
      SELECT id FROM users WHERE unique_key = ${uniqueKey}
    `

    if (existing.length === 0) {
      return uniqueKey
    }

    // Generate new random number if key exists
    const newRandomNumber = Math.floor(100 + Math.random() * 900)
    uniqueKey = `${companyName}${rolePrefix}${newRandomNumber}`
    attempts++
  }

  throw new Error("Unable to generate unique key after multiple attempts")
}

// Update the authenticateUser function to add better debugging
export async function authenticateUser(uniqueKey: string, password: string): Promise<User | null> {
  try {
    console.log(`Attempting to authenticate user with key: ${uniqueKey}`)

    const users = await sql`
      SELECT * FROM users 
      WHERE unique_key = ${uniqueKey} 
      AND is_active = true 
      AND (expires_at IS NULL OR expires_at > NOW())
    `

    console.log(`Found ${users.length} users matching the criteria`)

    if (users.length === 0) {
      // Let's also check if the user exists but doesn't meet the criteria
      const allUsers = await sql`
        SELECT unique_key, is_active, expires_at FROM users 
        WHERE unique_key = ${uniqueKey}
      `

      if (allUsers.length > 0) {
        const user = allUsers[0]
        console.log(`User exists but failed criteria check:`, {
          is_active: user.is_active,
          expires_at: user.expires_at,
          is_expired: user.expires_at ? new Date(user.expires_at) <= new Date() : false,
        })
      } else {
        console.log(`No user found with unique_key: ${uniqueKey}`)
      }

      return null
    }

    const user = users[0] as User & { password_hash: string }
    console.log(`Verifying password for user: ${user.email}`)

    const isValidPassword = await verifyPassword(password, user.password_hash)
    console.log(`Password verification result: ${isValidPassword}`)

    if (!isValidPassword) {
      return null
    }

    // Update last login
    await sql`
      UPDATE users 
      SET last_login = NOW() 
      WHERE id = ${user.id}
    `

    console.log(`Authentication successful for user: ${user.email}`)

    // Remove password hash from returned user
    const { password_hash, ...userWithoutPassword } = user
    return userWithoutPassword as User
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

export function checkPermission(user: User, permission: string): boolean {
  if (user.role === "super_admin") {
    return true
  }

  if (user.role === "company_admin") {
    // Company admins have most permissions within their company
    const adminPermissions = [
      "view_employees",
      "manage_employees",
      "view_invoices",
      "manage_invoices",
      "view_inventory",
      "manage_inventory",
      "view_warehouses",
      "manage_warehouses",
      "view_reports",
      "contact_support",
    ]
    return adminPermissions.includes(permission)
  }

  // For employees, check custom permissions
  return user.permissions[permission] === true
}
