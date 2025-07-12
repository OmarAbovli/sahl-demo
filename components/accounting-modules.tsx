"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  FileText,
  Users,
  Package,
  ShoppingCart,
  Building,
  Calculator,
  TrendingUp,
  Settings,
  CreditCard,
  Banknote,
} from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import type { User } from "@/lib/database"
import { ChartOfAccounts } from "@/components/accounting/chart-of-accounts"
import { JournalEntries } from "@/components/accounting/journal-entries"
import { CashBankManagement } from "@/components/cash-bank-management"
import { FixedAssetsManagement } from "@/components/fixed-assets-management"
import { AccountsReceivableManagement } from "@/components/accounts-receivable-management"
import { AccountsPayableManagement } from "@/components/accounts-payable-management"
import { HRPayrollManagement } from "@/components/hr-payroll-management"
import { TaxManagement } from "@/components/tax-management"
import { SalesManagement } from "@/components/sales-management"
import { PurchasingManagement } from "@/components/purchasing-management"
import { InventoryManagementDashboard } from "@/components/inventory-management-dashboard"
import { FinancialReports } from "@/components/financial-reports"
import { useRouter } from "next/navigation"

interface AccountingModulesProps {
  user: User
  canManage: (module: string) => boolean
  canView: (module: string) => boolean
}

export function AccountingModules({ user, canManage, canView }: AccountingModulesProps) {
  const { t, isRTL, language } = useTranslation()
  const [activeModule, setActiveModule] = useState<string | null>(null)
  const [accounts, setAccounts] = useState<any[]>([])
  const router = useRouter()

  console.log('activeModule:', activeModule);

  const accountingModules = [
    {
      id: "general_ledger",
      name: t("general_ledger"),
      description: t("general_ledger_desc"),
      icon: BookOpen,
      features: [
        "Chart of Accounts structure",
        "Manual and automated journal entries",
        "Auto-posting from other modules",
        "Balance calculations and analysis",
      ],
      arabicFeatures: [
        "هيكل دليل الحسابات",
        "قيود اليومية اليدوية والآلية",
        "الترحيل التلقائي من الوحدات الأخرى",
        "حسابات الأرصدة والتحليل",
      ],
    },
    {
      id: "accounts_receivable",
      name: t("accounts_receivable"),
      description: t("accounts_receivable_desc"),
      icon: FileText,
      features: [
        "Issue sales invoices",
        "Track customer receivables",
        "Record customer payments",
        "Overdue invoice alerts",
        "Generate aging reports",
      ],
      arabicFeatures: [
        "إصدار فواتير المبيعات",
        "تتبع مستحقات العملاء",
        "تسجيل مدفوعات العملاء",
        "تنبيهات الفواتير المتأخرة",
        "إنشاء تقارير الأعمار",
      ],
    },
    {
      id: "accounts_payable",
      name: t("accounts_payable"),
      description: t("accounts_payable_desc"),
      icon: CreditCard,
      features: [
        "Enter purchase invoices",
        "Register supplier payments",
        "Schedule payments",
        "Analyze supplier balances",
        "Generate payable aging reports",
      ],
      arabicFeatures: [
        "إدخال فواتير المشتريات",
        "تسجيل مدفوعات الموردين",
        "جدولة المدفوعات",
        "تحليل أرصدة الموردين",
        "إنشاء تقارير أعمار الدائنين",
      ],
    },
    {
      id: "inventory_management",
      name: t("inventory"),
      description: t("inventory_management_desc"),
      icon: Package,
      features: [
        "Manage products, units, and warehouses",
        "Inter-warehouse transfers",
        "Low-stock alerts",
        "Stocktaking and inventory reports",
        "Inventory cost calculation (Average, FIFO)",
      ],
      arabicFeatures: [
        "إدارة المنتجات والوحدات والمستودعات",
        "التحويلات بين المستودعات",
        "تنبيهات نقص المخزون",
        "جرد المخزون والتقارير",
        "حساب تكلفة المخزون (متوسط، الوارد أولاً)",
      ],
    },
    {
      id: "purchasing",
      name: t("purchases"),
      description: t("purchasing_desc"),
      icon: ShoppingCart,
      features: [
        "Create and compare purchase orders",
        "Goods receipt and delivery tracking",
        "Link to suppliers and inventory",
        "Purchase analytics and reporting",
      ],
      arabicFeatures: [
        "إنشاء ومقارنة أوامر الشراء",
        "تتبع استلام البضائع والتسليم",
        "ربط الموردين والمخزون",
        "تحليلات وتقارير المشتريات",
      ],
    },
    {
      id: "sales",
      name: t("sales"),
      description: t("sales_desc"),
      icon: TrendingUp,
      features: [
        "Create quotations and sales orders",
        "Deliver products and issue invoices",
        "Link sales to inventory and customers",
        "Sales analytics and forecasting",
      ],
      arabicFeatures: [
        "إنشاء عروض الأسعار وأوامر البيع",
        "تسليم المنتجات وإصدار الفواتير",
        "ربط المبيعات بالمخزون والعملاء",
        "تحليلات وتوقعات المبيعات",
      ],
    },
    {
      id: "hr_payroll",
      name: t("hr_payroll"),
      description: t("hr_payroll_desc"),
      icon: Users,
      features: [
        "Manage employee records and salaries",
        "Handle deductions and allowances",
        "Integrate with attendance systems",
        "Generate payroll reports and pay slips",
      ],
      arabicFeatures: [
        "إدارة سجلات الموظفين والرواتب",
        "التعامل مع الخصومات والبدلات",
        "التكامل مع أنظمة الحضور",
        "إنشاء تقارير الرواتب وقسائم الدفع",
      ],
    },
    {
      id: "cash_bank",
      name: t("cash_bank"),
      description: t("cash_bank_desc"),
      icon: Banknote,
      features: [
        "Record cash and bank transactions",
        "Bank reconciliation",
        "Manage cheques and transfers",
        "Track balances and cash flow",
      ],
      arabicFeatures: [
        "تسجيل المعاملات النقدية والمصرفية",
        "التسوية المصرفية",
        "إدارة الشيكات والتحويلات",
        "تتبع الأرصدة والتدفق النقدي",
      ],
    },
    {
      id: "fixed_assets",
      name: t("fixed_assets"),
      description: t("fixed_assets_desc"),
      icon: Building,
      features: [
        "Register and track assets",
        "Auto-calculate depreciation",
        "Generate asset reports",
        "Asset disposal and sale handling",
      ],
      arabicFeatures: [
        "تسجيل وتتبع الأصول",
        "حساب الإهلاك التلقائي",
        "إنشاء تقارير الأصول",
        "التعامل مع التخلص من الأصول وبيعها",
      ],
    },
    {
      id: "tax_management",
      name: t("tax_management"),
      description: t("tax_management_desc"),
      icon: Calculator,
      features: [
        "Set tax rules per product/service",
        "Automatically calculate tax on transactions",
        "Generate tax reports",
        "Support electronic filing",
      ],
      arabicFeatures: [
        "تحديد قواعد الضرائب لكل منتج/خدمة",
        "حساب الضرائب تلقائياً على المعاملات",
        "إنشاء تقارير الضرائب",
        "دعم التقديم الإلكتروني",
      ],
    },
    {
      id: "financial_reports",
      name: t("financial_reports"),
      description: t("financial_reports_desc"),
      icon: FileText,
      features: [
        "Income Statement (P&L)",
        "Balance Sheet",
        "Cash Flow Statement",
        "Customer and supplier reports",
        "Financial KPIs dashboard",
      ],
      arabicFeatures: [
        "قائمة الدخل (الأرباح والخسائر)",
        "الميزانية العمومية",
        "قائمة التدفق النقدي",
        "تقارير العملاء والموردين",
        "لوحة مؤشرات الأداء المالي",
      ],
    },
    {
      id: "roles_permissions",
      name: t("roles_permissions"),
      description: t("roles_permissions_desc"),
      icon: Settings,
      features: [
        "Define user roles (Admin, Accountant, HR)",
        "Control access per module or action",
        "Audit trail for user activity",
        "Permission inheritance and delegation",
      ],
      arabicFeatures: [
        "تحديد أدوار المستخدمين (مدير، محاسب، موارد بشرية)",
        "التحكم في الوصول لكل وحدة أو إجراء",
        "سجل المراجعة لنشاط المستخدم",
        "وراثة الصلاحيات والتفويض",
      ],
    },
  ]

  useEffect(() => {
    if (activeModule === "general_ledger" && user.company_id) {
      fetch(`/api/accounting/accounts?company_id=${user.company_id}`)
        .then(res => res.json())
        .then(setAccounts)
    }
  }, [activeModule, user.company_id])

  const getPermissionBadge = (moduleId: string) => {
    if (canManage(moduleId)) {
      return (
        <Badge variant="default" className="permission-full">
          {t("full_access")}
        </Badge>
      )
    } else if (canView(moduleId)) {
      return (
        <Badge variant="secondary" className="permission-view">
          {t("view_only")}
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="permission-none">
          {t("no_access")}
        </Badge>
      )
    }
  }

  const renderModuleDetails = (module: any) => {
    if (!module || !module.id || !module.name || !module.icon) return null;
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <module.icon className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle>{module.name}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </div>
            </div>
            {getPermissionBadge(module.id)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">{t("features")}</h4>
              <ul className="space-y-1">
                {(isRTL ? module.arabicFeatures : module.features).map((feature: string, index: number) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="w-1 h-1 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-xs text-muted-foreground">
              {t("features_available").replace("{count}", String((isRTL ? module.arabicFeatures : module.features).length))}
            </div>
            <div className="flex gap-2 pt-4 border-t">
              {canView(module.id) && (
                <Button variant="outline" size="sm">
                  {t("view")} {module.name}
                </Button>
              )}
              {canManage(module.id) && (
                <Button size="sm">
                  {t("manage")} {module.name}
                </Button>
              )}
              {!canView(module.id) && (
                <Button variant="ghost" size="sm" disabled>
                  {t("request_access")}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderGeneralLedgerPanel = () => (
    <div className="space-y-6">
      <Tabs defaultValue="coa">
        <TabsList>
          <TabsTrigger value="coa">{t("chart_of_accounts")}</TabsTrigger>
          <TabsTrigger value="journal">{t("journal_entries")}</TabsTrigger>
        </TabsList>
        <TabsContent value="coa">
          <ChartOfAccounts user={user} />
        </TabsContent>
        <TabsContent value="journal">
          <JournalEntries
            user={user}
            canManage={canManage("general_ledger")}
            canView={canView("general_ledger")}
            accounts={accounts}
          />
        </TabsContent>
      </Tabs>
      <Button className="mt-4" variant="outline" onClick={() => setActiveModule(null)}>{t("close")}</Button>
    </div>
  )

  // Conditional rendering for module panels
  if (activeModule) {
    const module = accountingModules.find(m => m.id === activeModule)
    if (!module) return null
    let Panel = null
    switch (activeModule) {
      case "general_ledger":
        Panel = (
          <div className="space-y-6">
            <Tabs defaultValue="coa">
              <TabsList>
                <TabsTrigger value="coa">{t("chart_of_accounts")}</TabsTrigger>
                <TabsTrigger value="journal">{t("journal_entries")}</TabsTrigger>
              </TabsList>
              <TabsContent value="coa">
                <ChartOfAccounts user={user} />
              </TabsContent>
              <TabsContent value="journal">
                <JournalEntries
                  user={user}
                  canManage={canManage("general_ledger")}
                  canView={canView("general_ledger")}
                  accounts={accounts}
                />
              </TabsContent>
            </Tabs>
            <Button className="mt-4" variant="outline" onClick={() => setActiveModule(null)}>{t("back")}</Button>
          </div>
        )
        break
      case "accounts_receivable":
        Panel = <AccountsReceivableManagement canManage={canManage('accounts_receivable')} canView={canView('accounts_receivable')} user={user} />
        break
      case "accounts_payable":
        Panel = <AccountsPayableManagement canManage={canManage('accounts_payable')} canView={canView('accounts_payable')} user={user} />
        break
      case "inventory_management":
        Panel = <InventoryManagementDashboard user={user} />
        break
      case "purchasing":
        Panel = <PurchasingManagement canManage={canManage('purchasing')} canView={canView('purchasing')} user={user} />
        break
      case "sales":
        Panel = <SalesManagement canManage={canManage('sales')} canView={canView('sales')} user={user} />
        break
      case "hr_payroll":
        Panel = <HRPayrollManagement canManage={canManage('hr_payroll')} canView={canView('hr_payroll')} user={user} />
        break
      case "cash_bank":
        Panel = <CashBankManagement canManage={canManage('cash_bank')} canView={canView('cash_bank')} user={user} />
        break
      case "fixed_assets":
        Panel = <FixedAssetsManagement canManage={canManage('fixed_assets')} canView={canView('fixed_assets')} user={user} />
        break
      case "tax_management":
        Panel = <TaxManagement canManage={canManage('tax_management')} canView={canView('tax_management')} user={user} />
        break
      case "financial_reports":
        Panel = <FinancialReports user={user} canManage={canManage('financial_reports')} canView={canView('financial_reports')} />
        break
      case "roles_permissions":
        Panel = <div style={{fontWeight: 'bold'}}>{t("roles_permissions")}</div>
        break
      default:
        Panel = null
    }
    return (
      <div className="py-8">
        {Panel}
        <Button className="mt-4" variant="outline" onClick={() => setActiveModule(null)}>{t("back")}</Button>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${isRTL ? "rtl" : ""}`}>
      <div>
        <h2 className="text-2xl font-bold mb-2">{t("accounting_modules")}</h2>
        <p className="text-muted-foreground">
          {t("accounting_modules_desc")}
        </p>
      </div>

      {/* Debug: Show active module and always render panel */}
      {/* <div>
        <p>{t("active_module")}: {activeModule}</p>
        ...
      </div> */}

      {/* Remove Tabs for debugging */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accountingModules.map((module) => {
          const Icon = module.icon
          const hasAccess = canView(module.id) || canManage(module.id)

          return (
            <Card
              key={module.id}
              className={`account-card cursor-pointer transition-all ${
                hasAccess ? "hover:shadow-md" : "opacity-60 border-red-500"
              }`}
              onClick={() => {
                if (hasAccess) setActiveModule(module.id)
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon className={`h-5 w-5 ${hasAccess ? "text-blue-600" : "text-gray-400"}`} />
                  {getPermissionBadge(module.id)}
                  {!hasAccess && (
                    <Badge variant="destructive">No Access</Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{module.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                <div className="text-xs text-muted-foreground">
                  {(isRTL ? module.arabicFeatures : module.features).length} features available
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Access Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{t("access_summary")}</CardTitle>
          <CardDescription>{t("access_summary_desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {accountingModules.filter((m) => canManage(m.id)).length}
              </div>
              <div className="text-sm text-green-700">{t("full_access")}</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {accountingModules.filter((m) => canView(m.id) && !canManage(m.id)).length}
              </div>
              <div className="text-sm text-yellow-700">{t("view_only")}</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {accountingModules.filter((m) => !canView(m.id)).length}
              </div>
              <div className="text-sm text-red-700">{t("no_access")}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
