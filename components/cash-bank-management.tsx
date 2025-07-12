"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

interface CashBankManagementProps {
  canManage: boolean
  canView: boolean
  user: any
}

export function CashBankManagement({ canManage, canView, user }: CashBankManagementProps) {
  const [accounts, setAccounts] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showAccountDialog, setShowAccountDialog] = useState(false)
  const [showTransactionDialog, setShowTransactionDialog] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<any>(null)
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const { toast } = useToast()
  const [accountForm, setAccountForm] = useState<any>({})
  const [transactionForm, setTransactionForm] = useState<any>({})
  const [formLoading, setFormLoading] = useState(false)

  const [filter, setFilter] = useState({
    account_id: "",
    type: "",
    reference: "",
    date_from: "",
    date_to: ""
  })

  const filteredTransactions = transactions.filter(tx => {
    if (filter.account_id && String(tx.account_id) !== filter.account_id) return false
    if (filter.type && tx.transaction_type !== filter.type) return false
    if (filter.reference && !(tx.reference || "").toLowerCase().includes(filter.reference.toLowerCase())) return false
    if (filter.date_from && tx.transaction_date < filter.date_from) return false
    if (filter.date_to && tx.transaction_date > filter.date_to) return false
    return true
  })

  const [reconAccountId, setReconAccountId] = useState("")
  const [reconDateFrom, setReconDateFrom] = useState("")
  const [reconDateTo, setReconDateTo] = useState("")
  const [showReconciled, setShowReconciled] = useState(false)

  const reconciliationTransactions = transactions.filter(tx => {
    if (!reconAccountId || String(tx.account_id) === reconAccountId || String(tx.from_account_id) === reconAccountId || String(tx.to_account_id) === reconAccountId) {
      if (reconDateFrom && tx.transaction_date < reconDateFrom) return false
      if (reconDateTo && tx.transaction_date > reconDateTo) return false
      if (!showReconciled && tx.is_reconciled) return false
      if (showReconciled && !tx.is_reconciled) return false
      return true
    }
    return false
  })

  // Fetch accounts
  useEffect(() => {
    if (canView) fetchAccounts()
  }, [canView])

  // Fetch transactions
  useEffect(() => {
    if (canView) fetchTransactions()
  }, [canView])

  async function fetchAccounts() {
    setLoading(true)
    try {
      const res = await fetch("/api/accounting/cash-bank/accounts")
      const data = await res.json()
      setAccounts(data.accounts || [])
    } finally {
      setLoading(false)
    }
  }

  async function fetchTransactions() {
    setLoading(true)
    try {
      const res = await fetch("/api/accounting/cash-bank/transactions")
      const data = await res.json()
      setTransactions(data.transactions || [])
    } finally {
      setLoading(false)
    }
  }

  // Account dialog handlers
  function openAddAccount() {
    setAccountForm({ type: "cash" }); setSelectedAccount(null); setShowAccountDialog(true)
  }
  function openEditAccount(account: any) {
    setAccountForm(account); setSelectedAccount(account); setShowAccountDialog(true)
  }
  function closeAccountDialog() {
    setShowAccountDialog(false); setAccountForm({}); setSelectedAccount(null)
  }

  // Add 'transfer' to transaction types
  // Add validation logic to submitAccountForm and submitTransactionForm
  // Prevent deleting accounts with transactions
  // Add bank reconciliation placeholder

  // Helper: check if account has transactions
  function accountHasTransactions(accountId: number) {
    return transactions.some(tx => String(tx.account_id) === String(accountId) || String(tx.to_account_id) === String(accountId))
  }

  // Update handleDeleteAccount
  async function handleDeleteAccount(account: any) {
    if (accountHasTransactions(account.id)) {
      toast({ title: "Cannot delete account", description: "This account has transactions and cannot be deleted.", variant: "destructive" })
      return
    }
    if (!window.confirm("Delete this account?")) return
    setFormLoading(true)
    try {
      const res = await fetch(`/api/accounting/cash-bank/accounts/${account.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete account")
      toast({ title: "Account deleted" })
      fetchAccounts()
    } catch (e) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" })
    } finally {
      setFormLoading(false)
    }
  }

  // Validation for account form
  function validateAccountForm() {
    if (!accountForm.name || !accountForm.type) return "Name and type are required."
    if (accountForm.balance !== undefined && accountForm.balance < 0) return "Balance cannot be negative."
    return null
  }

  // Validation for transaction form
  function validateTransactionForm() {
    if (!transactionForm.transaction_type) return "Transaction type is required."
    if (!transactionForm.transaction_date) return "Date is required."
    if (transactionForm.transaction_type === "transfer") {
      if (!transactionForm.from_account_id || !transactionForm.to_account_id) return "Both source and destination accounts are required."
      if (transactionForm.from_account_id === transactionForm.to_account_id) return "Source and destination accounts must be different."
      if (!transactionForm.amount || transactionForm.amount <= 0) return "Amount must be positive."
      // Prevent negative balance for transfer
      const fromAccount = accounts.find(a => String(a.id) === String(transactionForm.from_account_id))
      if (fromAccount && fromAccount.balance !== undefined && fromAccount.balance < transactionForm.amount) return "Insufficient funds in source account."
    } else {
      if (!transactionForm.account_id) return "Account is required."
      if (!transactionForm.amount || transactionForm.amount <= 0) return "Amount must be positive."
      // Prevent negative balance for withdrawal
      if (transactionForm.transaction_type === "withdrawal") {
        const account = accounts.find(a => String(a.id) === String(transactionForm.account_id))
        if (account && account.balance !== undefined && account.balance < transactionForm.amount) return "Insufficient funds for withdrawal."
      }
    }
    return null
  }

  // Update submitAccountForm
  async function submitAccountForm() {
    const validationError = validateAccountForm()
    if (validationError) {
      toast({ title: "Validation Error", description: validationError, variant: "destructive" })
      return
    }
    setFormLoading(true)
    try {
      const method = selectedAccount ? "PUT" : "POST"
      const url = selectedAccount ? `/api/accounting/cash-bank/accounts/${selectedAccount.id}` : "/api/accounting/cash-bank/accounts"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(accountForm),
      })
      if (!res.ok) throw new Error("Failed to save account")
      toast({ title: "Account saved" })
      fetchAccounts(); closeAccountDialog()
    } catch (e) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" })
    } finally {
      setFormLoading(false)
    }
  }

  // Update submitTransactionForm
  async function submitTransactionForm() {
    const validationError = validateTransactionForm()
    if (validationError) {
      toast({ title: "Validation Error", description: validationError, variant: "destructive" })
      return
    }
    setFormLoading(true)
    try {
      const method = selectedTransaction ? "PUT" : "POST"
      const url = selectedTransaction ? `/api/accounting/cash-bank/transactions/${selectedTransaction.id}` : "/api/accounting/cash-bank/transactions"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionForm),
      })
      if (!res.ok) throw new Error("Failed to save transaction")
      toast({ title: "Transaction saved" })
      fetchTransactions(); closeTransactionDialog()
    } catch (e) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" })
    } finally {
      setFormLoading(false)
    }
  }

  // Transaction dialog handlers
  function openAddTransaction() {
    setTransactionForm({ transaction_type: "deposit", transaction_date: new Date().toISOString().slice(0,10) }); setSelectedTransaction(null); setShowTransactionDialog(true)
  }
  function openEditTransaction(tx: any) {
    setTransactionForm(tx); setSelectedTransaction(tx); setShowTransactionDialog(true)
  }
  function closeTransactionDialog() {
    setShowTransactionDialog(false); setTransactionForm({}); setSelectedTransaction(null)
  }

  // Update transaction dialog for transfer
  // ... in the transaction dialog form ...
  // If transaction_type === 'transfer', show from_account_id and to_account_id fields
  // Else, show account_id field
  // ...
  // Add a Card for Bank Reconciliation (placeholder)

  // Totals
  const totalCash = accounts.filter(a => a.type === "cash").reduce((sum, a) => sum + (a.balance || 0), 0)
  const totalBank = accounts.filter(a => a.type === "bank").reduce((sum, a) => sum + (a.balance || 0), 0)

  async function markReconciled(tx: any, reconciled: boolean) {
    setFormLoading(true)
    try {
      const res = await fetch(`/api/accounting/cash-bank/transactions/${tx.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_reconciled: reconciled }),
      })
      if (!res.ok) throw new Error("Failed to update reconciliation status")
      toast({ title: reconciled ? "Marked as reconciled" : "Marked as unreconciled" })
      fetchTransactions()
    } catch (e) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" })
    } finally {
      setFormLoading(false)
    }
  }

  // Add missing handleDeleteTransaction if not present
  async function handleDeleteTransaction(tx: any) {
    if (!window.confirm("Delete this transaction?")) return
    setFormLoading(true)
    try {
      const res = await fetch(`/api/accounting/cash-bank/transactions/${tx.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete transaction")
      toast({ title: "Transaction deleted" })
      fetchTransactions()
    } catch (e) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" })
    } finally {
      setFormLoading(false)
    }
  }

  if (!canView) {
    return <div className="p-8 text-center text-muted-foreground">You do not have access to Cash & Bank module.</div>
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Cash & Bank Accounts</CardTitle>
          <CardDescription>Manage your cash and bank accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Badge variant="outline">Total Cash: {totalCash.toFixed(2)}</Badge>
            <Badge variant="outline">Total Bank: {totalBank.toFixed(2)}</Badge>
            {canManage && (
              <Button size="sm" onClick={openAddAccount} className="ml-auto">
                <Plus className="h-4 w-4 mr-1" /> Add Account
              </Button>
            )}
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell as="th">Name</TableCell>
                <TableCell as="th">Type</TableCell>
                <TableCell as="th">Account #</TableCell>
                <TableCell as="th">Bank</TableCell>
                <TableCell as="th">Status</TableCell>
                <TableCell as="th">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map(account => (
                <TableRow key={account.id}>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>{account.type}</TableCell>
                  <TableCell>{account.account_number || "-"}</TableCell>
                  <TableCell>{account.bank_name || "-"}</TableCell>
                  <TableCell>{account.is_active ? "Active" : "Inactive"}</TableCell>
                  <TableCell>
                    {canManage && (
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={() => openEditAccount(account)}><Edit className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDeleteAccount(account)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
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
          <CardTitle>Transactions</CardTitle>
          <CardDescription>View and manage cash/bank transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4 items-end">
            <div>
              <Label htmlFor="filter-account">Account</Label>
              <select
                id="filter-account"
                value={filter.account_id}
                onChange={e => setFilter(f => ({ ...f, account_id: e.target.value }))}
                className="min-w-[120px]"
              >
                <option value="">All</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>{account.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="filter-type">Type</Label>
              <select
                id="filter-type"
                value={filter.type}
                onChange={e => setFilter(f => ({ ...f, type: e.target.value }))}
                className="min-w-[120px]"
              >
                <option value="">All</option>
                <option value="deposit">Deposit</option>
                <option value="withdrawal">Withdrawal</option>
              </select>
            </div>
            <div>
              <Label htmlFor="filter-reference">Reference</Label>
              <Input
                id="filter-reference"
                value={filter.reference}
                onChange={e => setFilter(f => ({ ...f, reference: e.target.value }))}
                placeholder="Search reference"
              />
            </div>
            <div>
              <Label htmlFor="filter-date-from">From</Label>
              <Input
                id="filter-date-from"
                type="date"
                value={filter.date_from}
                onChange={e => setFilter(f => ({ ...f, date_from: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="filter-date-to">To</Label>
              <Input
                id="filter-date-to"
                type="date"
                value={filter.date_to}
                onChange={e => setFilter(f => ({ ...f, date_to: e.target.value }))}
              />
            </div>
            <Button variant="ghost" onClick={() => setFilter({ account_id: "", type: "", reference: "", date_from: "", date_to: "" })}>Clear</Button>
            {canManage && (
              <Button size="sm" onClick={openAddTransaction} className="ml-auto">
                <Plus className="h-4 w-4 mr-1" /> Add Transaction
              </Button>
            )}
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell as="th">Date</TableCell>
                <TableCell as="th">Account</TableCell>
                <TableCell as="th">Type</TableCell>
                <TableCell as="th">Amount</TableCell>
                <TableCell as="th">Reference</TableCell>
                <TableCell as="th">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.map(tx => (
                <TableRow key={tx.id}>
                  <TableCell>{tx.transaction_date}</TableCell>
                  <TableCell>{accounts.find(a => a.id === tx.account_id)?.name || "-"}</TableCell>
                  <TableCell>{tx.transaction_type}</TableCell>
                  <TableCell>{Number(tx.amount).toFixed(2)}</TableCell>
                  <TableCell>{tx.reference || "-"}</TableCell>
                  <TableCell>
                    {canManage && (
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={() => openEditTransaction(tx)}><Edit className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDeleteTransaction(tx)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
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
          <CardTitle>Bank Reconciliation</CardTitle>
          <CardDescription>Match your bank statement with system transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4 items-end">
            <div>
              <Label htmlFor="recon-account">Account</Label>
              <select
                id="recon-account"
                value={reconAccountId}
                onChange={e => setReconAccountId(e.target.value)}
                className="min-w-[120px]"
              >
                <option value="">All</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>{account.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="recon-date-from">From</Label>
              <Input
                id="recon-date-from"
                type="date"
                value={reconDateFrom}
                onChange={e => setReconDateFrom(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="recon-date-to">To</Label>
              <Input
                id="recon-date-to"
                type="date"
                value={reconDateTo}
                onChange={e => setReconDateTo(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="show-reconciled" checked={showReconciled} onChange={e => setShowReconciled(e.target.checked)} />
              <Label htmlFor="show-reconciled">Show Reconciled</Label>
            </div>
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell as="th">Date</TableCell>
                <TableCell as="th">Account</TableCell>
                <TableCell as="th">Type</TableCell>
                <TableCell as="th">Amount</TableCell>
                <TableCell as="th">Reference</TableCell>
                <TableCell as="th">Status</TableCell>
                <TableCell as="th">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reconciliationTransactions.map(tx => (
                <TableRow key={tx.id}>
                  <TableCell>{tx.transaction_date}</TableCell>
                  <TableCell>{accounts.find(a => a.id === tx.account_id)?.name || "-"}</TableCell>
                  <TableCell>{tx.transaction_type}</TableCell>
                  <TableCell>{Number(tx.amount).toFixed(2)}</TableCell>
                  <TableCell>{tx.reference || "-"}</TableCell>
                  <TableCell>{tx.is_reconciled ? "Reconciled" : "Unreconciled"}</TableCell>
                  <TableCell>
                    {canManage && (
                      <Button size="sm" variant={tx.is_reconciled ? "outline" : "default"} onClick={() => markReconciled(tx, !tx.is_reconciled)}>
                        {tx.is_reconciled ? "Unreconcile" : "Reconcile"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Account Dialog */}
      <Dialog open={showAccountDialog} onOpenChange={setShowAccountDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedAccount ? "Edit Account" : "Add Account"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={accountForm.name}
                onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Type</Label>
              <select
                id="type"
                value={accountForm.type}
                onChange={(e) => setAccountForm({ ...accountForm, type: e.target.value })}
                className="col-span-3"
              >
                <option value="cash">Cash</option>
                <option value="bank">Bank</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="account_number" className="text-right">Account #</Label>
              <Input
                id="account_number"
                value={accountForm.account_number}
                onChange={(e) => setAccountForm({ ...accountForm, account_number: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bank_name" className="text-right">Bank</Label>
              <Input
                id="bank_name"
                value={accountForm.bank_name}
                onChange={(e) => setAccountForm({ ...accountForm, bank_name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="balance" className="text-right">Balance</Label>
              <Input
                id="balance"
                type="number"
                value={accountForm.balance}
                onChange={(e) => setAccountForm({ ...accountForm, balance: parseFloat(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is_active" className="text-right">Status</Label>
              <select
                id="is_active"
                value={accountForm.is_active ? "active" : "inactive"}
                onChange={(e) => setAccountForm({ ...accountForm, is_active: e.target.value === "active" })}
                className="col-span-3"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeAccountDialog}>Cancel</Button>
            <Button onClick={submitAccountForm} disabled={formLoading}>
              {formLoading ? "Saving..." : "Save Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transaction Dialog */}
      <Dialog open={showTransactionDialog} onOpenChange={setShowTransactionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTransaction ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="transaction_date" className="text-right">Date</Label>
              <Input
                id="transaction_date"
                type="date"
                value={transactionForm.transaction_date}
                onChange={(e) => setTransactionForm({ ...transactionForm, transaction_date: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="account_id" className="text-right">Account</Label>
              <select
                id="account_id"
                value={transactionForm.account_id}
                onChange={(e) => setTransactionForm({ ...transactionForm, account_id: e.target.value })}
                className="col-span-3"
              >
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>{account.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="transaction_type" className="text-right">Type</Label>
              <select
                id="transaction_type"
                value={transactionForm.transaction_type}
                onChange={(e) => setTransactionForm({ ...transactionForm, transaction_type: e.target.value })}
                className="col-span-3"
              >
                <option value="deposit">Deposit</option>
                <option value="withdrawal">Withdrawal</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={transactionForm.amount}
                onChange={(e) => setTransactionForm({ ...transactionForm, amount: parseFloat(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reference" className="text-right">Reference</Label>
              <Input
                id="reference"
                value={transactionForm.reference}
                onChange={(e) => setTransactionForm({ ...transactionForm, reference: e.target.value })}
                className="col-span-3"
              />
            </div>
            {transactionForm.transaction_type === 'transfer' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="from_account_id" className="text-right">From Account</Label>
                  <select
                    id="from_account_id"
                    value={transactionForm.from_account_id}
                    onChange={(e) => setTransactionForm({ ...transactionForm, from_account_id: e.target.value })}
                    className="col-span-3"
                  >
                    {accounts.map(account => (
                      <option key={account.id} value={account.id}>{account.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="to_account_id" className="text-right">To Account</Label>
                  <select
                    id="to_account_id"
                    value={transactionForm.to_account_id}
                    onChange={(e) => setTransactionForm({ ...transactionForm, to_account_id: e.target.value })}
                    className="col-span-3"
                  >
                    {accounts.map(account => (
                      <option key={account.id} value={account.id}>{account.name}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeTransactionDialog}>Cancel</Button>
            <Button onClick={submitTransactionForm} disabled={formLoading}>
              {formLoading ? "Saving..." : "Save Transaction"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* TODO: Add filtering, searching, and better error/loading states */}
    </div>
  )
} 