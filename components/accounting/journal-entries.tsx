"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useTranslation } from "@/hooks/use-translation"
import type { User } from "@/lib/database"

interface JournalEntryLine {
  id?: number
  account_id: number
  debit: number
  credit: number
  description?: string
}

interface JournalEntry {
  id?: number
  date: string
  description?: string
  lines: JournalEntryLine[]
}

interface JournalEntriesProps {
  user: User
  canManage: boolean
  canView: boolean
  accounts: { id: number; name: string }[]
}

export function JournalEntries({ user, canManage, canView, accounts }: JournalEntriesProps) {
  const { t } = useTranslation()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [editing, setEditing] = useState<JournalEntry | null>(null)
  const [form, setForm] = useState<JournalEntry>({ date: "", description: "", lines: [] })
  const [error, setError] = useState("")

  useEffect(() => {
    if (canView) fetchEntries()
    // eslint-disable-next-line
  }, [canView])

  async function fetchEntries() {
    setLoading(true)
    const res = await fetch("/api/accounting/journal-entries")
    const data = await res.json()
    setEntries(data)
    setLoading(false)
  }

  function openAdd() {
    setEditing(null)
    setForm({ date: "", description: "", lines: [{ account_id: accounts[0]?.id || 0, debit: 0, credit: 0 }] })
    setShowDialog(true)
  }

  function openEdit(entry: JournalEntry) {
    setEditing(entry)
    setForm({ ...entry, lines: entry.lines.map(l => ({ ...l })) })
    setShowDialog(true)
  }

  async function saveEntry() {
    setLoading(true)
    setError("")
    const method = editing ? "PUT" : "POST"
    // Ensure correct field for API
    const payload = {
      ...form,
      entry_date: form.entry_date || form.date || "",
      date: undefined, // remove if present
    }
    const res = await fetch("/api/accounting/journal-entries", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      setShowDialog(false)
      fetchEntries()
    } else {
      const data = await res.json()
      setError(data.error || t("operation_failed"))
    }
    setLoading(false)
  }

  async function deleteEntry(id: number) {
    if (!window.confirm(t("delete_entry_confirm"))) return
    setLoading(true)
    await fetch("/api/accounting/journal-entries", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    fetchEntries()
    setLoading(false)
  }

  function updateLine(idx: number, field: keyof JournalEntryLine, value: any) {
    setForm(f => ({
      ...f,
      lines: f.lines.map((l, i) => (i === idx ? { ...l, [field]: value } : l)),
    }))
  }

  function addLine() {
    setForm(f => ({
      ...f,
      lines: [...f.lines, { account_id: accounts[0]?.id || 0, debit: 0, credit: 0 }],
    }))
  }

  function removeLine(idx: number) {
    setForm(f => ({
      ...f,
      lines: f.lines.filter((_, i) => i !== idx),
    }))
  }

  if (!canView) return <div className="text-muted-foreground">{t("no_access")}</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{t("journal_entries")}</h2>
        {canManage && <Button onClick={openAdd}>{t("add_entry")}</Button>}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("entries_list")}</CardTitle>
          <CardDescription>{t("journal_entries_desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>{t("loading")}</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th>{t("date")}</th>
                  <th>{t("description")}</th>
                  <th>{t("lines")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(entries) && entries.map((entry) => (
                  <tr key={entry.id} className="border-b">
                    <td>{entry.entry_date}</td>
                    <td>{entry.description}</td>
                    <td>{entry.lines.length}</td>
                    <td>
                      {canManage && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => openEdit(entry)}>{t("edit")}</Button>
                          <Button size="sm" variant="ghost" onClick={() => deleteEntry(entry.id!)}>{t("delete")}</Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? t("edit_entry") : t("add_entry")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            <Input placeholder={t("description")} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            <div>
              <div className="font-medium mb-2">{t("lines")}</div>
              {form.lines.map((line, idx) => (
                <div key={idx} className="flex gap-2 mb-2 items-center">
                  <select value={line.account_id} onChange={e => updateLine(idx, "account_id", Number(e.target.value))} className="border rounded px-2 py-1">
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.name}</option>
                    ))}
                  </select>
                  <Input type="number" placeholder={t("debit")} value={line.debit} onChange={e => updateLine(idx, "debit", Number(e.target.value))} />
                  <Input type="number" placeholder={t("credit")} value={line.credit} onChange={e => updateLine(idx, "credit", Number(e.target.value))} />
                  <Input placeholder={t("description")} value={line.description || ""} onChange={e => updateLine(idx, "description", e.target.value)} />
                  {form.lines.length > 2 && <Button size="sm" variant="ghost" onClick={() => removeLine(idx)}>-</Button>}
                </div>
              ))}
              <Button size="sm" variant="outline" onClick={addLine}>{t("add")}</Button>
            </div>
            {error && (
              <div className="text-red-500 mb-2">{error}</div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={saveEntry} disabled={loading}>{t("save")}</Button>
            <Button variant="ghost" onClick={() => setShowDialog(false)}>{t("cancel")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
