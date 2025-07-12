"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LogOut, Lock, Users, FileText, Package, Warehouse, BarChart3, CreditCard } from "lucide-react"
import { EmployeesManagement } from "@/components/employees-management"
import { InvoicesManagement } from "@/components/invoices-management"
import { InventoryManagement } from "@/components/inventory-management"
import { WarehousesManagement } from "@/components/warehouses-management"
import { ReportsView } from "@/components/reports-view"
import { DebtManagement } from "@/components/debt-management"
import { AccountingModules } from "@/components/accounting-modules"
import type { User } from "@/lib/database"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useTranslation } from "@/hooks/use-translation"

interface EmployeeDashboardProps {
  user: User
}

type ActiveModule =
  | "overview"
  | "accounting"
  | "employees"
  | "invoices"
  | "inventory"
  | "warehouses"
  | "reports"
  | "debts"

export function EmployeeDashboard({ user }: EmployeeDashboardProps) {
  const { t, isRTL } = useTranslation()
  const [permissions, setPermissions] = useState<string[]>([])
  const [activeModule, setActiveModule] = useState<ActiveModule>("overview")
  const router = useRouter()

  useEffect(() => {
    // Get user permissions
    const userPermissions = Object.keys(user.permissions).filter((permission) => user.permissions[permission] === true)
    setPermissions(userPermissions)
  }, [user.permissions])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const hasPermission = (permission: string) => {
    return permissions.includes(permission)
  }

  const canManage = (module: string) => {
    return permissions.includes(`manage_${module}`)
  }

  const canView = (module: string) => {
    return permissions.includes(`view_${module}`)
  }

  const getModuleIcon = (module: string) => {
    switch (module) {
      case "employees":
        return Users
      case "invoices":
        return FileText
      case "inventory":
        return Package
      case "warehouses":
        return Warehouse
      case "reports":
        return BarChart3
      case "debts":
        return CreditCard
      default:
        return Package
    }
  }

  const permissionDisplayName = (permission: string) => {
    const key = `permission_${permission}`
    return t(key as any) || permission.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const availableModules = [
    { id: "accounting", name: t("accounting_modules"), description: t("access_complete_accounting_modules") },
    { id: "employees", name: t("employees"), description: t("manage_employee_info") },
    { id: "invoices", name: t("invoices"), description: t("handle_company_invoices") },
    { id: "inventory", name: t("inventory"), description: t("track_inventory_items") },
    { id: "warehouses", name: t("warehouses"), description: t("manage_warehouse_locations") },
    { id: "reports", name: t("reports"), description: t("view_business_reports") },
    { id: "debts", name: t("debt_management"), description: t("track_manage_debts") },
  ].filter(
    (module) => module.id === "accounting" || canView(module.id) || (module.id === "debts" && canView("invoices")),
  )

  const renderActiveModule = () => {
    switch (activeModule) {
      case "accounting":
        return <AccountingModules user={user} canManage={canManage} canView={canView} />
      case "employees":
        return <EmployeesManagement user={user} canManage={canManage("employees")} />
      case "invoices":
        return <InvoicesManagement user={user} canManage={canManage("invoices")} />
      case "inventory":
        return <InventoryManagement user={user} canManage={canManage("inventory")} />
      case "warehouses":
        return <WarehousesManagement user={user} canManage={canManage("warehouses")} />
      case "reports":
        return <ReportsView user={user} />
      case "debts":
        return <DebtManagement user={user} canManage={canManage("invoices")} />
      default:
        return renderOverview()
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>{t("account_information")}</CardTitle>
          <CardDescription>{t("account_details_permissions")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">{t("email")}</label>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium">{t("unique_key")}</label>
              <p className="text-sm text-muted-foreground font-mono">{user.unique_key}</p>
            </div>
            <div>
              <label className="text-sm font-medium">{t("role")}</label>
              <p className="text-sm text-muted-foreground">{t("employee")}</p>
            </div>
            <div>
              <label className="text-sm font-medium">{t("account_expires")}</label>
              <p className="text-sm text-muted-foreground">
                {user.expires_at ? new Date(user.expires_at).toLocaleDateString() : t("never")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>{t("your_permissions", { permissions: t("permissions") })}</CardTitle>
          <CardDescription>{t("what_you_can_access")}</CardDescription>
        </CardHeader>
        <CardContent>
          {permissions.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {permissions.map((permission) => (
                <Badge key={permission} variant="outline" className="justify-center">
                  {permissionDisplayName(permission)}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Lock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t("no_permissions_assigned")}</p>
              <p className="text-sm">{t("contact_admin_request_access")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableModules.map((module) => {
          const Icon = getModuleIcon(module.id)
          const hasManagePermission = canManage(module.id) || (module.id === "debts" && canManage("invoices"))
          return (
            <Card
              key={module.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveModule(module.id as ActiveModule)}
            >
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  {module.name}
                </CardTitle>
                <CardDescription>
                  {module.id === "accounting"
                    ? t("access")
                    : hasManagePermission
                    ? t("manage")
                    : t("view")}
                  {" "}
                  {module.description.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{module.description}</p>
                <div className="mt-2">
                  <Badge variant={hasManagePermission || module.id === "accounting" ? "default" : "secondary"}>
                    {hasManagePermission || module.id === "accounting" ? t("full_access") : t("view_only")}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {permissions.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Access Granted</h3>
            <p className="text-muted-foreground mb-4">You don't have permissions to access any modules yet.</p>
            <p className="text-sm text-muted-foreground">
              Please contact your company administrator to request access to specific areas of the system.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? "rtl" : ""}`}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {activeModule !== "overview" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveModule("overview")}
                    className="text-blue-600"
                  >
                    ← {t("back")} to {t("overview")}
                  </Button>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {activeModule === "overview"
                      ? `Employee ${t("dashboard")}`
                      : availableModules.find((m) => m.id === activeModule)?.name || `Employee ${t("dashboard")}`}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {t("welcome")}, {user.email}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Employee</Badge>
              <LanguageSwitcher />
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                {t("logout")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{renderActiveModule()}</main>
    </div>
  )
}
