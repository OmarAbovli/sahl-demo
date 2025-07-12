import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth"
import { createSession } from "@/lib/session"
import { sql } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { uniqueKey, password } = await request.json()

    console.log("Login attempt:", { uniqueKey, passwordLength: password?.length })

    if (!uniqueKey || !password) {
      return NextResponse.json({ error: "Unique key and password are required" }, { status: 400 })
    }

    // First, let's check if the user exists at all
    const userCheck = await sql`
      SELECT unique_key, email, role, is_active, expires_at, password_hash
      FROM users 
      WHERE unique_key = ${uniqueKey}
    `

    console.log("User check result:", {
      found: userCheck.length > 0,
      user:
        userCheck.length > 0
          ? {
              unique_key: userCheck[0].unique_key,
              email: userCheck[0].email,
              role: userCheck[0].role,
              is_active: userCheck[0].is_active,
              expires_at: userCheck[0].expires_at,
              has_password_hash: !!userCheck[0].password_hash,
            }
          : null,
    })

    if (userCheck.length === 0) {
      return NextResponse.json(
        {
          error: "User not found",
          debug: "No user exists with this unique key",
        },
        { status: 401 },
      )
    }

    const userRecord = userCheck[0]

    // Check if user is active
    if (!userRecord.is_active) {
      return NextResponse.json(
        {
          error: "Account is inactive",
          debug: "User account is deactivated",
        },
        { status: 401 },
      )
    }

    // Check if user is expired
    if (userRecord.expires_at && new Date(userRecord.expires_at) <= new Date()) {
      return NextResponse.json(
        {
          error: "Account has expired",
          debug: `Account expired on ${userRecord.expires_at}`,
        },
        { status: 401 },
      )
    }

    // Now try to authenticate
    const user = await authenticateUser(uniqueKey, password)

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid password",
          debug: "Password verification failed",
        },
        { status: 401 },
      )
    }

    await createSession(user)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        uniqueKey: user.unique_key,
        email: user.email,
        role: user.role,
        companyId: user.company_id,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        debug: error.message,
      },
      { status: 500 },
    )
  }
}
