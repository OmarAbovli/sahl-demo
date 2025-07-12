import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface PurchasingManagementProps {
  user: any;
  canManage: boolean;
  canView: boolean;
}

export function PurchasingManagement({ user, canManage, canView }: PurchasingManagementProps) {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [taxRules, setTaxRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>({ items: [] });
  const [editing, setEditing] = useState<any>(null);
  const [showDetails, setShowDetails] = useState<any>(null);
  const [statusHistory, setStatusHistory] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSupplier, setFilterSupplier] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [topSuppliers, setTopSuppliers] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  useEffect(() => {
    fetchAll();
    fetchAnalytics();
  }, [filterStatus, filterSupplier, filterDateFrom, filterDateTo, page, pageSize]);

  async function fetchAll() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append("limit", String(pageSize));
      params.append("offset", String((page - 1) * pageSize));
      if (filterStatus) params.append("status", filterStatus);
      if (filterSupplier) params.append("supplier_id", filterSupplier);
      if (filterDateFrom) params.append("date_from", filterDateFrom);
      if (filterDateTo) params.append("date_to", filterDateTo);
      let url = `/api/ap/purchase-invoices?${params.toString()}`;
      const res = await fetch(url);
      const data = await res.json();
      setInvoices(data.invoices || []);
      setTotal(data.total || 0);
      // Fetch suppliers
      const suppRes = await fetch("/api/ap/suppliers");
      setSuppliers(await suppRes.json());
      // Fetch products
      const prodRes = await fetch("/api/ap/products");
      setProducts(await prodRes.json());
      // Fetch tax rules
      const taxRes = await fetch("/api/accounting/tax-rules");
      const taxData = await taxRes.json();
      setTaxRules(taxData.rules || []);
    } catch (e) {
      setError("Failed to fetch data");
    }
    setLoading(false);
  }

  async function fetchAnalytics() {
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    try {
      const [analyticsRes, suppliersRes, productsRes] = await Promise.all([
        fetch('/api/ap/purchase-invoices/analytics?period=month'),
        fetch('/api/ap/top-suppliers'),
        fetch('/api/ap/top-products'),
      ]);
      const analyticsData = await analyticsRes.json();
      const suppliersData = await suppliersRes.json();
      const productsData = await productsRes.json();
      setAnalytics(analyticsData.analytics || []);
      setTopSuppliers(suppliersData.top_suppliers || []);
      setTopProducts(productsData.top_products || []);
    } catch (e) {
      setAnalyticsError('Failed to fetch analytics');
    }
    setAnalyticsLoading(false);
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
      const url = editing ? `/api/ap/purchase-invoices/${editing.id}` : "/api/ap/purchase-invoices";
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
      await fetch(`/api/ap/purchase-invoices/${inv.id}`, { method: "DELETE" });
      fetchAll();
    } catch (e) {
      setError("Failed to delete invoice");
    }
  }

  async function openDetails(inv: any) {
    setShowDetails(inv);
    // Fetch status history (mock for now)
    setStatusHistory(inv.status_history || []);
  }

  async function updateStatus(inv: any, new_status: string) {
    setError(null);
    try {
      await fetch(`/api/ap/purchase-invoices/${inv.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_status }),
      });
      fetchAll();
    } catch (e) {
      setError("Failed to update status");
    }
  }

  // Calculate totals with line-item tax
  const calcTotals = (items: any[]) => {
    let subtotal = 0;
    let tax = 0;
    for (const item of items) {
      const prod = products.find((p: any) => p.id == item.product_id);
      const price = item.price || prod?.price || 0;
      const qty = item.quantity || 1;
      subtotal += price * qty;
      const taxRule = taxRules.find((t: any) => t.id == item.tax_rule_id);
      if (taxRule) tax += (price * qty * taxRule.rate) / 100;
    }
    return { subtotal, tax, total: subtotal + tax };
  };

  // More analytics
  const purchasesByPeriod = invoices.reduce((acc, inv) => {
    const period = inv.issue_date ? inv.issue_date.slice(0, 7) : "Unknown";
    acc[period] = (acc[period] || 0) + (inv.total || 0);
    return acc;
  }, {} as Record<string, number>);
  const supplierTotals = invoices.reduce((acc, inv) => {
    const sid = inv.supplier_id;
    acc[sid] = (acc[sid] || 0) + (inv.total || 0);
    return acc;
  }, {} as Record<string, number>);
  const topSuppliersLocal = Object.entries(supplierTotals).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const productTotals = invoices.flatMap(inv => inv.items || []).reduce((acc, item) => {
    acc[item.product_id] = (acc[item.product_id] || 0) + (item.price || 0) * (item.quantity || 1);
    return acc;
  }, {} as Record<string, number>);
  const topProductsLocal = Object.entries(productTotals).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const avgInvoice = invoices.length ? (invoices.reduce((sum, inv) => sum + (inv.total || 0), 0) / invoices.length) : 0;

  // Export, bulk actions, PDF download
  async function handleExport(format: string, ids?: number[]) {
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append("status", filterStatus);
      if (filterSupplier) params.append("supplier_id", filterSupplier);
      if (filterDateFrom) params.append("date_from", filterDateFrom);
      if (filterDateTo) params.append("date_to", filterDateTo);
      if (ids && ids.length) params.append("ids", ids.join(","));
      params.append("format", format);
      const res = await fetch(`/api/ap/purchase-invoices/export?${params.toString()}`);
      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank");
        toast({ title: `Exported as ${format.toUpperCase()}`, description: data.url });
      }
    } catch (e) {
      toast({ title: "Export failed", description: "Network error", variant: "destructive" });
    }
  }
  async function handleBulkDelete() {
    if (!window.confirm("Delete selected invoices?")) return;
    for (const id of selected) {
      await handleDelete({ id });
    }
    setSelected([]);
  }
  async function handleBulkStatus(new_status: string) {
    for (const id of selected) {
      await updateStatus({ id }, new_status);
    }
    setSelected([]);
  }
  async function handleDownloadPDF(id: number) {
    try {
      const res = await fetch(`/api/ap/purchase-invoices/${id}/pdf`);
      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank");
        toast({ title: "PDF generated", description: data.url });
      }
    } catch (e) {
      toast({ title: "PDF failed", description: "Network error", variant: "destructive" });
    }
  }

  return (
    <div className="space-y-6">
      {/* Dashboard summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Total Purchases</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{invoices.reduce((sum, inv) => sum + (inv.total || 0), 0)}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Invoices</CardTitle></CardHeader>
          <CardContent>
            {Object.entries(invoices.reduce((acc, inv) => { acc[inv.status] = (acc[inv.status] || 0) + 1; return acc; }, {} as Record<string, number>)).map(([status, count]) => (
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
      {/* More analytics cards (real data) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Purchases by Period</CardTitle></CardHeader>
          <CardContent>
            {analyticsLoading ? 'Loading...' : analyticsError ? <span className="text-red-500">{analyticsError}</span> : (
              analytics.map((row: any) => (
                <div key={row.period}>{row.period}: {row.total}</div>
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Top Suppliers</CardTitle></CardHeader>
          <CardContent>
            {analyticsLoading ? 'Loading...' : analyticsError ? <span className="text-red-500">{analyticsError}</span> : (
              topSuppliersLocal.map(([supplier_id, total]: any) => (
                <div key={supplier_id}>{suppliers.find((s: any) => s.id == supplier_id)?.name || supplier_id}: {total}</div>
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Top Products</CardTitle></CardHeader>
          <CardContent>
            {analyticsLoading ? 'Loading...' : analyticsError ? <span className="text-red-500">{analyticsError}</span> : (
              topProductsLocal.map(([product_id, total]: any) => (
                <div key={product_id}>{products.find((p: any) => p.id == product_id)?.name || product_id}: {total}</div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      {/* Export and Bulk Actions */}
      <div className="flex gap-2 items-center my-2 flex-wrap">
        <Button size="sm" onClick={() => handleExport("csv")}>Export CSV</Button>
        <Button size="sm" onClick={() => handleExport("pdf")}>Export PDF</Button>
        {selected.length > 0 && (
          <>
            <Button size="sm" variant="destructive" onClick={handleBulkDelete}>Delete Selected</Button>
            <Button size="sm" onClick={() => handleBulkStatus("paid")}>Mark Paid</Button>
            <Button size="sm" onClick={() => handleExport("csv", selected)}>Export Selected CSV</Button>
            <Button size="sm" onClick={() => handleExport("pdf", selected)}>Export Selected PDF</Button>
          </>
        )}
      </div>
      {/* Advanced Filters */}
      <div className="flex gap-2 items-center mb-2 flex-wrap">
        <label>Status:</label>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border rounded px-2 py-1">
          <option value="">All</option>
          <option value="draft">Draft</option>
          <option value="confirmed">Confirmed</option>
          <option value="received">Received</option>
          <option value="paid">Paid</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <label>Supplier:</label>
        <select value={filterSupplier} onChange={e => setFilterSupplier(e.target.value)} className="border rounded px-2 py-1">
          <option value="">All</option>
          {suppliers.map((s: any) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <label>Date From:</label>
        <Input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)} className="w-auto" />
        <label>Date To:</label>
        <Input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)} className="w-auto" />
      </div>
      {/* Pagination Controls */}
      <div className="flex gap-2 items-center my-2">
        <Button size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
        <span>Page {page} of {Math.ceil(total / pageSize) || 1}</span>
        <Button size="sm" onClick={() => setPage(p => (p * pageSize < total ? p + 1 : p))} disabled={page * pageSize >= total}>Next</Button>
        <label>Page Size:</label>
        <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }} className="border rounded px-2 py-1">
          {[10, 20, 50, 100].map(sz => <option key={sz} value={sz}>{sz}</option>)}
        </select>
        <span>Total: {total}</span>
      </div>
      {/* Table of invoices */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="p-2"><input type="checkbox" checked={selected.length === invoices.length && invoices.length > 0} onChange={e => setSelected(e.target.checked ? invoices.map(inv => inv.id) : [])} /></th>
              <th className="text-left p-2">#</th>
              <th className="text-left p-2">Supplier</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Total</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6}>Loading...</td></tr>
            ) : invoices.length === 0 ? (
              <tr><td colSpan={6}>No invoices found.</td></tr>
            ) : invoices.map((inv, idx) => (
              <tr key={inv.id} className="border-b">
                <td className="p-2"><input type="checkbox" checked={selected.includes(inv.id)} onChange={e => setSelected(sel => e.target.checked ? [...sel, inv.id] : sel.filter(id => id !== inv.id))} /></td>
                <td className="p-2">{inv.invoice_number || inv.id}</td>
                <td className="p-2">{suppliers.find((s: any) => s.id === inv.supplier_id)?.name || inv.supplier_name || "-"}</td>
                <td className="p-2">{inv.status}</td>
                <td className="p-2">{inv.total || 0}</td>
                <td className="p-2 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openDetails(inv)}>View</Button>
                  {canManage && <Button size="sm" variant="outline" onClick={() => startEdit(inv)}>Edit</Button>}
                  {canManage && <Button size="sm" variant="destructive" onClick={() => handleDelete(inv)}>Delete</Button>}
                  <Button size="sm" variant="outline" onClick={() => handleDownloadPDF(inv.id)}>Download PDF</Button>
                  {canManage && (
                    <select value={inv.status} onChange={e => updateStatus(inv, e.target.value)} className="border rounded px-2 py-1">
                      <option value="draft">Draft</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="received">Received</option>
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
              <label>Supplier</label>
              <select name="supplier_id" value={form.supplier_id || ""} onChange={handleInput} required className="border rounded px-2 py-1 w-full">
                <option value="">Select supplier</option>
                {suppliers.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
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
                    <th>Tax</th>
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
                      <td>
                        <select value={item.tax_rule_id || ""} onChange={e => handleItemChange(idx, "tax_rule_id", e.target.value)} className="border rounded px-2 py-1">
                          <option value="">None</option>
                          {taxRules.map((t: any) => (
                            <option key={t.id} value={t.id}>{t.name} ({t.rate}%)</option>
                          ))}
                        </select>
                      </td>
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
                <option value="received">Received</option>
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
              <div><strong>Supplier:</strong> {suppliers.find((s: any) => s.id === showDetails.supplier_id)?.name || showDetails.supplier_name || "-"}</div>
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