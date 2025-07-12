"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SalesManagementProps {
  user: any;
  canManage: boolean;
  canView: boolean;
}

export function SalesManagement({ user, canManage, canView }: SalesManagementProps) {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>({ items: [] });
  const [editing, setEditing] = useState<any>(null);
  const [showDetails, setShowDetails] = useState<any>(null);
  const [statusHistory, setStatusHistory] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAll();
  }, [filterStatus]);

  async function fetchAll() {
    setLoading(true);
    setError(null);
    try {
      let url = "/api/ar/sales-invoices";
      const res = await fetch(url);
      let data = await res.json();
      if (Array.isArray(data)) data = { invoices: data };
      let invoices = data.invoices || data;
      if (filterStatus) invoices = invoices.filter((inv: any) => inv.status === filterStatus);
      setInvoices(invoices);
      // Fetch customers
      const custRes = await fetch("/api/ar/customers");
      setCustomers(await custRes.json());
      // Fetch products
      const prodRes = await fetch("/api/ar/products");
      setProducts(await prodRes.json());
    } catch (e) {
      setError("Failed to fetch data");
    }
    setLoading(false);
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleItemChange(idx: number, field: string, value: any) {
    const items = [...form.items];
    items[idx] = { ...items[idx], [field]: value };
    setForm({ ...form, items });
  }

  function addItem() {
    setForm({ ...form, items: [...(form.items || []), { product_id: "", quantity: 1, price: 0 }] });
  }

  function removeItem(idx: number) {
    const items = [...form.items];
    items.splice(idx, 1);
    setForm({ ...form, items });
  }

  function startEdit(inv: any) {
    setEditing(inv);
    setForm({ ...inv, items: inv.items || [] });
    setShowForm(true);
  }

  function startAdd() {
    setEditing(null);
    setForm({ items: [] });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const method = editing ? "PUT" : "POST";
      const url = editing ? `/api/ar/sales-invoices/${editing.id}` : "/api/ar/sales-invoices";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.id || data.invoice) {
        setShowForm(false);
        fetchAll();
      } else {
        setError(data.error || "Failed to save invoice");
      }
    } catch (e) {
      setError("Failed to save invoice");
    }
  }

  async function handleDelete(inv: any) {
    if (!window.confirm("Delete this invoice?")) return;
    setError(null);
    try {
      await fetch(`/api/ar/sales-invoices/${inv.id}`, { method: "DELETE" });
      fetchAll();
    } catch (e) {
      setError("Failed to delete invoice");
    }
  }

  async function openDetails(inv: any) {
    setShowDetails(inv);
    // Fetch status history
    try {
      const res = await fetch(`/api/ar/sales-invoices/${inv.id}`);
      const invoice = await res.json();
      setStatusHistory(invoice.status_history || []);
    } catch {
      setStatusHistory([]);
    }
  }

  async function updateStatus(inv: any, new_status: string) {
    setError(null);
    try {
      await fetch(`/api/ar/sales-invoices/${inv.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_status }),
      });
      fetchAll();
    } catch (e) {
      setError("Failed to update status");
    }
  }

  // Calculate totals
  const calcTotals = (items: any[]) => {
    let subtotal = 0;
    let tax = 0;
    for (const item of items) {
      const prod = products.find((p: any) => p.id == item.product_id);
      const price = item.price || prod?.price || 0;
      subtotal += price * (item.quantity || 1);
      // (Optional: add tax calculation here)
    }
    return { subtotal, tax, total: subtotal + tax };
  };

  // Dashboard summary
  const totalSales = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const statusCounts = invoices.reduce((acc, inv) => {
    acc[inv.status] = (acc[inv.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Dashboard summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Total Sales</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{totalSales}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Invoices</CardTitle></CardHeader>
          <CardContent>
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status}>{status}: {count}</div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
          <CardContent>
            {canManage && <Button onClick={startAdd}>Create Invoice</Button>}
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex gap-2 items-center mb-2">
        <label>Status:</label>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border rounded px-2 py-1">
          <option value="">All</option>
          <option value="draft">Draft</option>
          <option value="confirmed">Confirmed</option>
          <option value="delivered">Delivered</option>
          <option value="paid">Paid</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table of invoices */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="text-left p-2">#</th>
              <th className="text-left p-2">Customer</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Total</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5}>Loading...</td></tr>
            ) : invoices.length === 0 ? (
              <tr><td colSpan={5}>No invoices found.</td></tr>
            ) : invoices.map((inv, idx) => (
              <tr key={inv.id} className="border-b">
                <td className="p-2">{inv.invoice_number || inv.id}</td>
                <td className="p-2">{customers.find((c: any) => c.id === inv.customer_id)?.name || inv.client_name || "-"}</td>
                <td className="p-2">{inv.status}</td>
                <td className="p-2">{inv.total || 0}</td>
                <td className="p-2 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openDetails(inv)}>View</Button>
                  {canManage && <Button size="sm" variant="outline" onClick={() => startEdit(inv)}>Edit</Button>}
                  {canManage && <Button size="sm" variant="destructive" onClick={() => handleDelete(inv)}>Delete</Button>}
                  {canManage && (
                    <select value={inv.status} onChange={e => updateStatus(inv, e.target.value)} className="border rounded px-2 py-1">
                      <option value="draft">Draft</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="delivered">Delivered</option>
                      <option value="paid">Paid</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Invoice Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Invoice" : "Create Invoice"}</DialogTitle>
          </DialogHeader>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label>Customer</label>
              <select name="customer_id" value={form.customer_id || ""} onChange={handleInput} required className="border rounded px-2 py-1 w-full">
                <option value="">Select customer</option>
                {customers.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Items</label>
              <table className="min-w-full text-xs mb-2">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {(form.items || []).map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td>
                        <select value={item.product_id || ""} onChange={e => handleItemChange(idx, "product_id", e.target.value)} className="border rounded px-2 py-1">
                          <option value="">Select</option>
                          {products.map((p: any) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </td>
                      <td><Input type="number" value={item.quantity || 1} min={1} onChange={e => handleItemChange(idx, "quantity", Number(e.target.value))} /></td>
                      <td><Input type="number" value={item.price || products.find((p: any) => p.id == item.product_id)?.price || 0} onChange={e => handleItemChange(idx, "price", Number(e.target.value))} /></td>
                      <td><Button size="sm" variant="destructive" onClick={() => removeItem(idx)} type="button">Remove</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Button size="sm" onClick={addItem} type="button">Add Item</Button>
            </div>
            <div>
              <label>Status</label>
              <select name="status" value={form.status || "draft"} onChange={handleInput} className="border rounded px-2 py-1 w-full">
                <option value="draft">Draft</option>
                <option value="confirmed">Confirmed</option>
                <option value="delivered">Delivered</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <strong>Totals:</strong> {(() => { const t = calcTotals(form.items || []); return `Subtotal: ${t.subtotal} | Tax: ${t.tax} | Total: ${t.total}` })()}
            </div>
            <Button type="submit">Save</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Invoice Details Modal */}
      <Dialog open={!!showDetails} onOpenChange={() => setShowDetails(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
          </DialogHeader>
          {showDetails && (
            <div className="space-y-2">
              <div><strong>Invoice #:</strong> {showDetails.invoice_number || showDetails.id}</div>
              <div><strong>Customer:</strong> {customers.find((c: any) => c.id === showDetails.customer_id)?.name || showDetails.client_name || "-"}</div>
              <div><strong>Status:</strong> {showDetails.status}</div>
              <div><strong>Total:</strong> {showDetails.total || 0}</div>
              <div><strong>Items:</strong>
                <ul className="list-disc ml-6">
                  {(showDetails.items || []).map((item: any, idx: number) => (
                    <li key={idx}>{products.find((p: any) => p.id == item.product_id)?.name || "-"} x {item.quantity} @ {item.price}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Status History:</strong>
                <ul className="list-disc ml-6">
                  {statusHistory.length === 0 ? <li>No history</li> : statusHistory.map((h: any, idx: number) => (
                    <li key={idx}>{h.old_status} → {h.new_status} by User {h.changed_by} at {h.changed_at}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 
