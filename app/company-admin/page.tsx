import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/session"
import { CompanyAdminDashboard } from "@/components/company-admin-dashboard"

export default async function CompanyAdminPage() {
  try {
    const user = await requireAuth(["company_admin"])
    return <CompanyAdminDashboard user={user} />
  } catch (error) {
    redirect("/login")
  }
}
