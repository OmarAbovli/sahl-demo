"use client";

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ReportsView } from "@/components/reports-view"
import { AIForecastingDashboard } from "@/components/ai-forecasting-dashboard"
import { TaxManagement } from "@/components/tax-management"
import type { User } from "@/lib/database"

interface FinancialReportsProps {
  user: User
  canManage?: boolean
  canView?: boolean
}

export function FinancialReports({ user, canManage = true, canView = true }: FinancialReportsProps) {
  const [tab, setTab] = useState("overview")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Reports</CardTitle>
          <CardDescription>Business overview, analytics, and tax reports</CardDescription>
        </CardHeader>
      </Card>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="overview">Business Overview</TabsTrigger>
          <TabsTrigger value="analytics">AI & Analytics</TabsTrigger>
          <TabsTrigger value="tax">Tax Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <ReportsView user={user} />
        </TabsContent>
        <TabsContent value="analytics">
          <AIForecastingDashboard user={user} />
        </TabsContent>
        <TabsContent value="tax">
          <TaxManagement user={user} canManage={canManage} canView={canView} />
        </TabsContent>
      </Tabs>
    </div>
  )
} 