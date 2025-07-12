"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { LogOut, Users, FileText, Package, Warehouse, MessageSquare, BarChart3 } from "lucide-react"
import { CreateSupportTicketDialog } from "@/components/create-support-ticket-dialog"
import type { User } from "@/lib/database"
import { LanguageSwitcher } from "@/components/language-switcher"
import { AIForecastingDashboard } from "@/components/ai-forecasting-dashboard"
import { AccountingModules } from "@/components/accounting-modules"
import { useTranslation } from "@/hooks/use-translation"
import { BiometricDevicesManager } from "@/components/biometric-devices-manager"


interface CompanyAdminDashboardProps {
  user: User
}

interface CompanyStats {
  totalEmployees: number
  totalInvoices: number
  totalInventoryItems: number
  totalWarehouses: number
  pendingInvoices: number
  totalRevenue: number
}

// Helper: safely parse JSON only when the response contains it
async function safeJson<T = unknown>(res: Response): Promise<T | null> {
  // 204 No Content  ➜ return null
  if (res.status === 204) return null as T

  const type = res.headers.get("content-type") ?? ""
  if (!type.includes("application/json")) {
    // Not JSON (could be HTML error page) – return null to let caller handle
    return null as T
  }

  try {
    return (await res.json()) as T
  } catch {
    return null as T
  }
}

export function CompanyAdminDashboard({ user }: CompanyAdminDashboardProps) {
  const { t, isRTL } = useTranslation()
  const [stats, setStats] = useState<CompanyStats>({
    totalEmployees: 0,
    totalInvoices: 0,
    totalInventoryItems: 0,
    totalWarehouses: 0,
    pendingInvoices: 0,
    totalRevenue: 0,
  })
  const [employees, setEmployees] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [inventory, setInventory] = useState<any[]>([])
  const [isSupportTicketOpen, setIsSupportTicketOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, employeesRes, invoicesRes, warehousesRes, inventoryRes] = await Promise.all([
        fetch("/api/company-admin/stats"),
        fetch("/api/company-admin/employees"),
        fetch("/api/company-admin/invoices"),
        fetch("/api/company-admin/warehouses"),
        fetch("/api/company-admin/inventory"),
      ])

      if (statsRes.ok) {
        const statsData = await safeJson<{ stats: CompanyStats }>(statsRes)
        if (statsData?.stats) setStats(statsData.stats)
      }

      if (employeesRes.ok) {
        const employeesData = await safeJson<{ employees: any[] }>(employeesRes)
        if (employeesData?.employees) setEmployees(employeesData.employees)
      }

      if (invoicesRes.ok) {
        const invoicesData = await safeJson<{ invoices: any[] }>(invoicesRes)
        if (invoicesData?.invoices) setInvoices(invoicesData.invoices)
      }

      if (warehousesRes.ok) {
        const warehousesData = await safeJson<{ warehouses: any[] }>(warehousesRes)
        if (warehousesData?.warehouses) setWarehouses(warehousesData.warehouses)
      }

      if (inventoryRes.ok) {
        const inventoryData = await safeJson<{ inventory: any[] }>(inventoryRes)
        if (inventoryData?.inventory) setInventory(inventoryData.inventory)
      } else {
        console.warn("One of the dashboard endpoints returned non-JSON data.")
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const canManage = (module: string) => {
    return user.permissions[`manage_${module}`] === true
  }

  const canView = (module: string) => {
    return user.permissions[`view_${module}`] === true
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? "rtl" : ""}`}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t("dashboard")}</h1>
                <p className="text-sm text-gray-500">
                  {t("welcome")}, {user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="default">Company Admin</Badge>
              <LanguageSwitcher />
              <Button variant="outline" onClick={() => setIsSupportTicketOpen(true)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                {t("logout")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("total")} {t("employees")}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("total")} {t("invoices")}
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalInvoices}</div>
              <p className="text-xs text-muted-foreground">{stats.pendingInvoices} pending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("warehouses")}</CardTitle>
              <Warehouse className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalWarehouses}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("inventory")} Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalInventoryItems}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("total")} {t("revenue")}
              </CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.totalRevenue.toLocaleString("en-US")}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="accounting" className="space-y-6">
          <TabsList>
            <TabsTrigger value="accounting">Accounting Modules</TabsTrigger>
            <TabsTrigger value="employees">{t("employees")}</TabsTrigger>
            <TabsTrigger value="invoices">{t("invoices")}</TabsTrigger>
            <TabsTrigger value="warehouses">{t("warehouses")}</TabsTrigger>
            <TabsTrigger value="inventory">{t("inventory")}</TabsTrigger>
            <TabsTrigger value="ai-forecasting">{t("ai_forecasting")}</TabsTrigger>
            <TabsTrigger value="biometric-devices">Biometric Devices</TabsTrigger>


          </TabsList>

          <TabsContent value="accounting">
            <AccountingModules user={user} canManage={canManage} canView={canView} />
          </TabsContent>

          <TabsContent value="employees">
            <Card>
              <CardHeader>
                <CardTitle>{t("employees")}</CardTitle>
                <CardDescription>Manage your company employees and their information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Employee management interface would be implemented here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle>{t("invoices")}</CardTitle>
                <CardDescription>View and manage company invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Invoice management interface would be implemented here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="warehouses">
            <Card>
              <CardHeader>
                <CardTitle>{t("warehouses")}</CardTitle>
                <CardDescription>Manage warehouse locations and assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Warehouse management interface would be implemented here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>{t("inventory")}</CardTitle>
                <CardDescription>Monitor inventory across all warehouses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Inventory management interface would be implemented here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="biometric-devices">
  <Card>
    <CardHeader>
      <CardTitle>Biometric Devices</CardTitle>
      <CardDescription>Manage biometric attendance devices linked to your company</CardDescription>
    </CardHeader>
    <CardContent>
      <BiometricDevicesManager user={user} />
    </CardContent>
  </Card>
</TabsContent>


          <TabsContent value="ai-forecasting">
            <Card>
              <CardHeader>
                <CardTitle>{t("ai_forecasting")}</CardTitle>
                <CardDescription>Advanced analytics and business intelligence for your company</CardDescription>
              </CardHeader>
              <CardContent>
                <AIForecastingDashboard user={user} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Support Ticket Dialog */}
      <CreateSupportTicketDialog
        open={isSupportTicketOpen}
        onOpenChange={setIsSupportTicketOpen}
        onSuccess={() => {
          setIsSupportTicketOpen(false)
          // Could show a success message here
        }}
      />
    </div>
  )
}
