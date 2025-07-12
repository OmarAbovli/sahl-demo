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

interface InventoryManagementProps {
  canManage: boolean
  canView: boolean
  user: any
}

export function InventoryManagement({ canManage, canView, user }: InventoryManagementProps) {
  const [products, setProducts] = useState<any[]>([])
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showProductDialog, setShowProductDialog] = useState(false)
  const [showWarehouseDialog, setShowWarehouseDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null)
  const [productForm, setProductForm] = useState<any>({})
  const [warehouseForm, setWarehouseForm] = useState<any>({})
  const [formLoading, setFormLoading] = useState(false)
  const { toast } = useToast()

  // Fetch products and warehouses
  useEffect(() => {
    if (canView) {
      fetchProducts()
      fetchWarehouses()
    }
  }, [canView])

  async function fetchProducts() {
    setLoading(true)
    try {
      const res = await fetch("/api/employee/inventory")
      const data = await res.json()
      setProducts(data.products || [])
    } finally {
      setLoading(false)
    }
  }
  async function fetchWarehouses() {
    setLoading(true)
    try {
      const res = await fetch("/api/employee/warehouses")
      const data = await res.json()
      setWarehouses(data.warehouses || [])
    } finally {
      setLoading(false)
    }
  }

  // Placeholders for add/edit/delete dialogs
  function openAddProduct() { setProductForm({}); setSelectedProduct(null); setShowProductDialog(true) }
  function openEditProduct(product: any) { setProductForm(product); setSelectedProduct(product); setShowProductDialog(true) }
  function closeProductDialog() { setShowProductDialog(false); setProductForm({}); setSelectedProduct(null) }
  function openAddWarehouse() { setWarehouseForm({}); setSelectedWarehouse(null); setShowWarehouseDialog(true) }
  function openEditWarehouse(warehouse: any) { setWarehouseForm(warehouse); setSelectedWarehouse(warehouse); setShowWarehouseDialog(true) }
  function closeWarehouseDialog() { setShowWarehouseDialog(false); setWarehouseForm({}); setSelectedWarehouse(null) }

  if (!canView) {
    return <div className="p-8 text-center text-muted-foreground">You do not have access to Inventory Management module.</div>
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>Manage inventory products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            {canManage && (
              <Button size="sm" onClick={openAddProduct} className="ml-auto">
                <Plus className="h-4 w-4 mr-1" /> Add Product
              </Button>
            )}
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell as="th">Name</TableCell>
                <TableCell as="th">SKU</TableCell>
                <TableCell as="th">Unit</TableCell>
                <TableCell as="th">Status</TableCell>
                <TableCell as="th">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map(prod => (
                <TableRow key={prod.id}>
                  <TableCell>{prod.name}</TableCell>
                  <TableCell>{prod.sku}</TableCell>
                  <TableCell>{prod.unit}</TableCell>
                  <TableCell>{prod.is_active ? "Active" : "Inactive"}</TableCell>
                  <TableCell>
                    {canManage && (
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={() => openEditProduct(prod)}><Edit className="h-4 w-4" /></Button>
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
          <CardTitle>Warehouses</CardTitle>
          <CardDescription>Manage inventory warehouses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            {canManage && (
              <Button size="sm" onClick={openAddWarehouse} className="ml-auto">
                <Plus className="h-4 w-4 mr-1" /> Add Warehouse
              </Button>
            )}
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell as="th">Name</TableCell>
                <TableCell as="th">Location</TableCell>
                <TableCell as="th">Status</TableCell>
                <TableCell as="th">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {warehouses.map(wh => (
                <TableRow key={wh.id}>
                  <TableCell>{wh.name}</TableCell>
                  <TableCell>{wh.location}</TableCell>
                  <TableCell>{wh.is_active ? "Active" : "Inactive"}</TableCell>
                  <TableCell>
                    {canManage && (
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={() => openEditWarehouse(wh)}><Edit className="h-4 w-4" /></Button>
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

      {/* Product Dialog (placeholder) */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProduct ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          <div className="p-4">Form coming soon</div>
          <DialogFooter>
            <Button variant="outline" onClick={closeProductDialog}>Cancel</Button>
            <Button disabled>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Warehouse Dialog (placeholder) */}
      <Dialog open={showWarehouseDialog} onOpenChange={setShowWarehouseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedWarehouse ? "Edit Warehouse" : "Add Warehouse"}</DialogTitle>
          </DialogHeader>
          <div className="p-4">Form coming soon</div>
          <DialogFooter>
            <Button variant="outline" onClick={closeWarehouseDialog}>Cancel</Button>
            <Button disabled>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
