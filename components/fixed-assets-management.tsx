"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table"
import { Plus, Edit, Trash2, Archive } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface FixedAssetsManagementProps {
  canManage: boolean
  canView: boolean
  user: any
}

export function FixedAssetsManagement({ canManage, canView, user }: FixedAssetsManagementProps) {
  const [assets, setAssets] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showAssetDialog, setShowAssetDialog] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<any>(null)
  const [assetForm, setAssetForm] = useState<any>({})
  const [formLoading, setFormLoading] = useState(false)
  const { toast } = useToast()

  // Fetch assets
  useEffect(() => {
    if (canView) fetchAssets()
  }, [canView])

  async function fetchAssets() {
    setLoading(true)
    try {
      const res = await fetch("/api/accounting/fixed-assets")
      const data = await res.json()
      setAssets(data.assets || [])
    } finally {
      setLoading(false)
    }
  }

  // Asset dialog handlers
  function openAddAsset() {
    setAssetForm({ status: "active" }); setSelectedAsset(null); setShowAssetDialog(true)
  }
  function openEditAsset(asset: any) {
    setAssetForm(asset); setSelectedAsset(asset); setShowAssetDialog(true)
  }
  function closeAssetDialog() {
    setShowAssetDialog(false); setAssetForm({}); setSelectedAsset(null)
  }
  async function submitAssetForm() {
    setFormLoading(true)
    try {
      const method = selectedAsset ? "PUT" : "POST"
      const url = selectedAsset ? `/api/accounting/fixed-assets/${selectedAsset.id}` : "/api/accounting/fixed-assets"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assetForm),
      })
      if (!res.ok) throw new Error("Failed to save asset")
      toast({ title: "Asset saved" })
      fetchAssets(); closeAssetDialog()
    } catch (e) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" })
    } finally {
      setFormLoading(false)
    }
  }
  async function handleDeleteAsset(asset: any) {
    if (!window.confirm("Delete this asset?")) return
    setFormLoading(true)
    try {
      const res = await fetch(`/api/accounting/fixed-assets/${asset.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete asset")
      toast({ title: "Asset deleted" })
      fetchAssets()
    } catch (e) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" })
    } finally {
      setFormLoading(false)
    }
  }

  // Placeholders for depreciation and disposal dialogs
  const [showDepDialog, setShowDepDialog] = useState(false)
  const [depAsset, setDepAsset] = useState<any>(null)
  const [depRecords, setDepRecords] = useState<any[]>([])
  const [depLoading, setDepLoading] = useState(false)
  const [depError, setDepError] = useState("")
  const [depForm, setDepForm] = useState<any>({})
  const [depFormLoading, setDepFormLoading] = useState(false)

  async function openDepreciation(asset: any) {
    setDepAsset(asset)
    setShowDepDialog(true)
    setDepForm({})
    setDepLoading(true)
    setDepError("")
    try {
      const res = await fetch(`/api/accounting/fixed-assets/${asset.id}/depreciation`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to fetch records")
      setDepRecords(data.records || [])
    } catch (e) {
      setDepError((e as Error).message)
    } finally {
      setDepLoading(false)
    }
  }
  function closeDepDialog() {
    setShowDepDialog(false); setDepAsset(null); setDepRecords([]); setDepForm({})
  }
  async function submitDepForm() {
    if (!depAsset) return
    setDepFormLoading(true)
    try {
      const res = await fetch(`/api/accounting/fixed-assets/${depAsset.id}/depreciation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(depForm),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to add record")
      toast({ title: "Depreciation record added" })
      // Refresh records
      const res2 = await fetch(`/api/accounting/fixed-assets/${depAsset.id}/depreciation`)
      const data2 = await res2.json()
      setDepRecords(data2.records || [])
      setDepForm({})
    } catch (e) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" })
    } finally {
      setDepFormLoading(false)
    }
  }

  const [showDisposalDialog, setShowDisposalDialog] = useState(false)
  const [disposalAsset, setDisposalAsset] = useState<any>(null)
  const [disposalForm, setDisposalForm] = useState<any>({ disposal_type: "sale" })
  const [disposalLoading, setDisposalLoading] = useState(false)

  function openDisposal(asset: any) {
    setDisposalAsset(asset)
    setDisposalForm({ disposal_type: "sale" })
    setShowDisposalDialog(true)
  }
  function closeDisposalDialog() {
    setShowDisposalDialog(false); setDisposalAsset(null); setDisposalForm({ disposal_type: "sale" })
  }
  async function submitDisposalForm() {
    if (!disposalAsset) return
    setDisposalLoading(true)
    try {
      const res = await fetch(`/api/accounting/fixed-assets/${disposalAsset.id}/disposal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(disposalForm),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to dispose/sell asset")
      toast({ title: "Asset disposed/sold" })
      fetchAssets(); closeDisposalDialog()
    } catch (e) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" })
    } finally {
      setDisposalLoading(false)
    }
  }

  if (!canView) {
    return <div className="p-8 text-center text-muted-foreground">You do not have access to Fixed Assets module.</div>
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Fixed Assets</CardTitle>
          <CardDescription>Manage your company’s fixed assets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            {canManage && (
              <Button size="sm" onClick={openAddAsset} className="ml-auto">
                <Plus className="h-4 w-4 mr-1" /> Add Asset
              </Button>
            )}
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell as="th">Name</TableCell>
                <TableCell as="th">Code</TableCell>
                <TableCell as="th">Cost</TableCell>
                <TableCell as="th">Status</TableCell>
                <TableCell as="th">Purchase Date</TableCell>
                <TableCell as="th">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assets.map(asset => (
                <TableRow key={asset.id}>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>{asset.asset_code || "-"}</TableCell>
                  <TableCell>{Number(asset.cost).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={asset.status === "active" ? "default" : "outline"}>{asset.status}</Badge>
                  </TableCell>
                  <TableCell>{asset.purchase_date || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" onClick={() => openEditAsset(asset)}><Edit className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDeleteAsset(asset)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => openDepreciation(asset)} title="Depreciation"><Archive className="h-4 w-4 text-blue-600" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => openDisposal(asset)} title="Dispose/Sell"><Archive className="h-4 w-4 text-orange-600" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Asset Dialog */}
      <Dialog open={showAssetDialog} onOpenChange={setShowAssetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedAsset ? "Edit Asset" : "Add Asset"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={assetForm.name}
                onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="asset_code" className="text-right">Code</Label>
              <Input
                id="asset_code"
                value={assetForm.asset_code}
                onChange={(e) => setAssetForm({ ...assetForm, asset_code: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cost" className="text-right">Cost</Label>
              <Input
                id="cost"
                type="number"
                value={assetForm.cost}
                onChange={(e) => setAssetForm({ ...assetForm, cost: parseFloat(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="purchase_date" className="text-right">Purchase Date</Label>
              <Input
                id="purchase_date"
                type="date"
                value={assetForm.purchase_date}
                onChange={(e) => setAssetForm({ ...assetForm, purchase_date: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <select
                id="status"
                value={assetForm.status}
                onChange={(e) => setAssetForm({ ...assetForm, status: e.target.value })}
                className="col-span-3"
              >
                <option value="active">Active</option>
                <option value="disposed">Disposed</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeAssetDialog}>Cancel</Button>
            <Button onClick={submitAssetForm} disabled={formLoading}>
              {formLoading ? "Saving..." : "Save Asset"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Depreciation Dialog */}
      <Dialog open={showDepDialog} onOpenChange={setShowDepDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Depreciation Records for {depAsset?.name}</DialogTitle>
          </DialogHeader>
          {depLoading ? (
            <div className="p-4">Loading...</div>
          ) : depError ? (
            <div className="p-4 text-red-600">{depError}</div>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell as="th">Period Start</TableCell>
                    <TableCell as="th">Period End</TableCell>
                    <TableCell as="th">Amount</TableCell>
                    <TableCell as="th">Created</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {depRecords.map(rec => (
                    <TableRow key={rec.id}>
                      <TableCell>{rec.period_start}</TableCell>
                      <TableCell>{rec.period_end}</TableCell>
                      <TableCell>{Number(rec.depreciation_amount).toFixed(2)}</TableCell>
                      <TableCell>{rec.created_at}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-6">
                <h4 className="font-medium mb-2">Add Depreciation Record</h4>
                <div className="grid grid-cols-4 items-center gap-4 mb-2">
                  <Label htmlFor="dep-period-start" className="text-right">Period Start</Label>
                  <Input id="dep-period-start" type="date" value={depForm.period_start || ""} onChange={e => setDepForm(f => ({ ...f, period_start: e.target.value }))} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4 mb-2">
                  <Label htmlFor="dep-period-end" className="text-right">Period End</Label>
                  <Input id="dep-period-end" type="date" value={depForm.period_end || ""} onChange={e => setDepForm(f => ({ ...f, period_end: e.target.value }))} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4 mb-2">
                  <Label htmlFor="dep-amount" className="text-right">Amount</Label>
                  <Input id="dep-amount" type="number" value={depForm.depreciation_amount || ""} onChange={e => setDepForm(f => ({ ...f, depreciation_amount: parseFloat(e.target.value) }))} className="col-span-3" />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={closeDepDialog}>Close</Button>
                  <Button onClick={submitDepForm} disabled={depFormLoading}>{depFormLoading ? "Saving..." : "Add Record"}</Button>
                </DialogFooter>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dispose/Sell Dialog */}
      <Dialog open={showDisposalDialog} onOpenChange={setShowDisposalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dispose/Sell Asset: {disposalAsset?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="disposal-date" className="text-right">Disposal Date</Label>
              <Input id="disposal-date" type="date" value={disposalForm.disposal_date || ""} onChange={e => setDisposalForm(f => ({ ...f, disposal_date: e.target.value }))} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="disposal-type" className="text-right">Type</Label>
              <select id="disposal-type" value={disposalForm.disposal_type} onChange={e => setDisposalForm(f => ({ ...f, disposal_type: e.target.value }))} className="col-span-3">
                <option value="sale">Sale</option>
                <option value="write_off">Write Off</option>
              </select>
            </div>
            {disposalForm.disposal_type === "sale" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sale-amount" className="text-right">Sale Amount</Label>
                <Input id="sale-amount" type="number" value={disposalForm.sale_amount || ""} onChange={e => setDisposalForm(f => ({ ...f, sale_amount: parseFloat(e.target.value) }))} className="col-span-3" />
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="disposal-notes" className="text-right">Notes</Label>
              <Input id="disposal-notes" value={disposalForm.notes || ""} onChange={e => setDisposalForm(f => ({ ...f, notes: e.target.value }))} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDisposalDialog}>Cancel</Button>
            <Button onClick={submitDisposalForm} disabled={disposalLoading}>{disposalLoading ? "Saving..." : "Dispose/Sell"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 