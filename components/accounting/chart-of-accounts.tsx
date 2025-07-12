"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { User } from "@/lib/database"

interface Account {
  id: number
  company_id: number
  name: string
  code?: string
  type: string
  parent_id?: number | null
  is_active: boolean
}

interface Props {
  user: User
}

export function ChartOfAccounts({ user }: Props) {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(false)
  const [newAccount, setNewAccount] = useState<Partial<Account>>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAccounts()
    // eslint-disable-next-line
  }, [])

  const fetchAccounts = async () => {
    if (!user.company_id) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/accounting/accounts?company_id=${user.company_id}`)
      if (!res.ok) throw new Error("Failed to fetch accounts")
      const data = await res.json()
      setAccounts(data)
    } catch (err: any) {
      setError(err.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!user.company_id || !newAccount.name || !newAccount.type) {
      setError("Name and type are required")
      return
    }
    setError(null)
    try {
      const res = await fetch(`/api/accounting/accounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id: user.company_id,
          name: newAccount.name,
          code: newAccount.code,
          type: newAccount.type,
          parent_id: newAccount.parent_id ?? null,
        }),
      })
      if (!res.ok) throw new Error("Failed to add account")
      setNewAccount({})
      fetchAccounts()
    } catch (err: any) {
      setError(err.message || "Unknown error")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chart of Accounts</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="mb-4 flex gap-2">
          <Input
            placeholder="Account Name"
            value={newAccount.name || ""}
            onChange={e => setNewAccount({ ...newAccount, name: e.target.value })}
          />
          <Input
            placeholder="Code"
            value={newAccount.code || ""}
            onChange={e => setNewAccount({ ...newAccount, code: e.target.value })}
          />
          <Input
            placeholder="Type (asset, liability, etc.)"
            value={newAccount.type || ""}
            onChange={e => setNewAccount({ ...newAccount, type: e.target.value })}
          />
          <Button onClick={handleAdd}>Add</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Type</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(acc => (
                <tr key={acc.id}>
                  <td>{acc.name}</td>
                  <td>{acc.code}</td>
                  <td>{acc.type}</td>
                  <td>{acc.is_active ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
