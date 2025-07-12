import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/session"
import { EmployeeDashboard } from "@/components/employee-dashboard"

export default async function EmployeePage() {
  try {
    const user = await requireAuth(["employee"])
    return <EmployeeDashboard user={user} />
  } catch (error) {
    redirect("/login")
  }
}
