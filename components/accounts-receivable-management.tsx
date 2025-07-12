"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface AccountsReceivableManagementProps {
  canManage: boolean
  canView: boolean
  user: any
}

export function AccountsReceivableManagement({ canManage, canView, user }: AccountsReceivableManagementProps) {
  const [invoices, setInvoices] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [invoiceForm, setInvoiceForm] = useState<any>({})
  const [paymentForm, setPaymentForm] = useState<any>({})
  const [formLoading, setFormLoading] = useState(false)
  const { toast } = useToast()

  // Fetch invoices and payments
  useEffect(() => {
    if (canView) {
      fetchInvoices()
      fetchPayments()
    }
  }, [canView])

  async function fetchInvoices() {
    setLoading(true)
    try {
      const res = await fetch("/api/ar/sales-invoices")
      const data = await res.json()
      setInvoices(data.invoices || [])
    } finally {
      setLoading(false)
    }
  }
  async function fetchPayments() {
    setLoading(true)
    try {
      const res = await fetch("/api/ar/customer-payments")
      const data = await res.json()
      setPayments(data.payments || [])
    } finally {
      setLoading(false)
    }
  }

  // Placeholders for add/edit/delete dialogs
  function openAddInvoice() { setInvoiceForm({}); setSelectedInvoice(null); setShowInvoiceDialog(true) }
  function openEditInvoice(invoice: any) { setInvoiceForm(invoice); setSelectedInvoice(invoice); setShowInvoiceDialog(true) }
  function closeInvoiceDialog() { setShowInvoiceDialog(false); setInvoiceForm({}); setSelectedInvoice(null) }
  function openAddPayment() { setPaymentForm({}); setSelectedPayment(null); setShowPaymentDialog(true) }
  function openEditPayment(payment: any) { setPaymentForm(payment); setSelectedPayment(payment); setShowPaymentDialog(true) }
  function closePaymentDialog() { setShowPaymentDialog(false); setPaymentForm({}); setSelectedPayment(null) }

  if (!canView) {
    return <div className="p-8 text-center text-muted-foreground">You do not have access to Accounts Receivable module.</div>
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Sales Invoices</CardTitle>
          <CardDescription>Manage customer invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            {canManage && (
              <Button size="sm" onClick={openAddInvoice} className="ml-auto">
                <Plus className="h-4 w-4 mr-1" /> Add Invoice
              </Button>
            )}
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell as="th">Invoice #</TableCell>
                <TableCell as="th">Customer</TableCell>
                <TableCell as="th">Date</TableCell>
                <TableCell as="th">Total</TableCell>
                <TableCell as="th">Status</TableCell>
                <TableCell as="th">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map(inv => (
                <TableRow key={inv.id}>
                  <TableCell>{inv.invoice_number}</TableCell>
                  <TableCell>{inv.customer_id}</TableCell>
                  <TableCell>{inv.issue_date}</TableCell>
                  <TableCell>{Number(inv.total).toFixed(2)}</TableCell>
                  <TableCell>{inv.status}</TableCell>
                  <TableCell>
                    {canManage && (
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={() => openEditInvoice(inv)}><Edit className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost"><Trash2 className="h-4 w-4 text-red-600" /></Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer Payments</CardTitle>
          <CardDescription>Manage payments received from customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            {canManage && (
              <Button size="sm" onClick={openAddPayment} className="ml-auto">
                <Plus className="h-4 w-4 mr-1" /> Add Payment
              </Button>
            )}
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell as="th">Date</TableCell>
                <TableCell as="th">Customer</TableCell>
                <TableCell as="th">Amount</TableCell>
                <TableCell as="th">Invoice</TableCell>
                <TableCell as="th">Method</TableCell>
                <TableCell as="th">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map(pay => (
                <TableRow key={pay.id}>
                  <TableCell>{pay.payment_date}</TableCell>
                  <TableCell>{pay.customer_id}</TableCell>
                  <TableCell>{Number(pay.amount).toFixed(2)}</TableCell>
                  <TableCell>{pay.invoice_id}</TableCell>
                  <TableCell>{pay.method}</TableCell>
                  <TableCell>
                    {canManage && (
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={() => openEditPayment(pay)}><Edit className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost"><Trash2 className="h-4 w-4 text-red-600" /></Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invoice Dialog (placeholder) */}
      <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedInvoice ? "Edit Invoice" : "Add Invoice"}</DialogTitle>
          </DialogHeader>
          <div className="p-4">Form coming soon</div>
          <DialogFooter>
            <Button variant="outline" onClick={closeInvoiceDialog}>Cancel</Button>
            <Button disabled>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog (placeholder) */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedPayment ? "Edit Payment" : "Add Payment"}</DialogTitle>
          </DialogHeader>
          <div className="p-4">Form coming soon</div>
          <DialogFooter>
            <Button variant="outline" onClick={closePaymentDialog}>Cancel</Button>
            <Button disabled>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 