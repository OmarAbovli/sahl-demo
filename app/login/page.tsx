import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { LoginForm } from "@/components/login-form"

export default async function LoginPage() {
  const user = await getSession()

  if (user) {
    // Redirect based on role
    switch (user.role) {
      case "super_admin":
        redirect("/super-admin")
      case "company_admin":
        redirect("/company-admin")
      case "employee":
        redirect("/employee")
      default:
        redirect("/login")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Accounting System Login</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Enter your unique key and password</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
