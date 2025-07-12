"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

interface TaxManagementProps {
  user: any;
  canManage: boolean;
  canView: boolean;
}

interface TaxRule {
  id: number;
  name: string;
  rate: number;
  type: string;
  is_active: boolean;
}

interface Product {
  id: number;
  name: string;
  tax_rule_id?: number;
}

const mockTaxRules: TaxRule[] = [
  { id: 1, name: "VAT Standard", rate: 15, type: "VAT", is_active: true },
  { id: 2, name: "Service Tax", rate: 5, type: "Service", is_active: true },
  { id: 3, name: "Zero Rate", rate: 0, type: "VAT", is_active: false },
];

const mockProducts: Product[] = [
  { id: 1, name: "Product A", tax_rule_id: 1 },
  { id: 2, name: "Product B", tax_rule_id: 2 },
  { id: 3, name: "Service C" },
];

const mockReports = [
  { id: 1, period: "2024-05", type: "VAT", total: 1200, filed: false },
  { id: 2, period: "2024-04", type: "VAT", total: 900, filed: true },
];

export function TaxManagement({ user, canManage, canView }: TaxManagementProps) {
  const [tab, setTab] = useState("rules");
  const [taxRules, setTaxRules] = useState<TaxRule[]>(mockTaxRules);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<TaxRule>>({});
  const [editing, setEditing] = useState<TaxRule | null>(null);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [invoice, setInvoice] = useState({ amount: 1000, product_id: 1 });
  const [reports, setReports] = useState(mockReports);
  const [filingDocs, setFilingDocs] = useState<{ [key: number]: string }>({});
  const [reportFilters, setReportFilters] = useState({ type: "", period: "", filed: "" });
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState<string | null>(null);
  const [filingLoading, setFilingLoading] = useState<{ [key: number]: boolean }>({});
  const [filingError, setFilingError] = useState<{ [key: number]: string | null }>({});
  const { toast } = useToast();

  // Tax Rules logic
  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.rate || !form.type) return;
    const newRule: TaxRule = {
      id: taxRules.length + 1,
      name: form.name as string,
      rate: Number(form.rate),
      type: form.type as string,
      is_active: true,
    };
    setTaxRules([newRule, ...taxRules]);
    setShowForm(false);
    setForm({});
  }
  function startEdit(rule: TaxRule) {
    setEditing(rule);
    setForm(rule);
    setShowForm(false);
  }
  function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.rate || !form.type) return;
    setTaxRules(taxRules.map(r => r.id === editing!.id ? { ...editing!, ...form, rate: Number(form.rate) } : r));
    setEditing(null);
    setForm({});
  }
  function handleDelete(rule: TaxRule) {
    if (!window.confirm(`Delete tax rule '${rule.name}'?`)) return;
    setTaxRules(taxRules.filter(r => r.id !== rule.id));
  }
  function toggleActive(rule: TaxRule) {
    setTaxRules(taxRules.map(r => r.id === rule.id ? { ...r, is_active: !r.is_active } : r));
  }

  // Tax Assignment logic
  function handleAssign(productId: number, taxRuleId: number) {
    setProducts(products.map(p => p.id === productId ? { ...p, tax_rule_id: taxRuleId } : p));
  }

  // Tax Calculation logic
  const selectedProduct = products.find(p => p.id === Number(invoice.product_id));
  const selectedTaxRule = taxRules.find(r => r.id === selectedProduct?.tax_rule_id);
  const taxAmount = selectedTaxRule ? (invoice.amount * selectedTaxRule.rate) / 100 : 0;
  const totalAmount = invoice.amount + taxAmount;

  // Tax Filing logic
  function markFiled(reportId: number) {
    setReports(reports.map(r => r.id === reportId ? { ...r, filed: true } : r));
  }

  // Fetch reports with filters
  useEffect(() => {
    async function fetchReports() {
      setReportsLoading(true);
      setReportsError(null);
      try {
        const params = new URLSearchParams();
        if (reportFilters.type) params.append("type", reportFilters.type);
        if (reportFilters.period) params.append("period", reportFilters.period);
        if (reportFilters.filed) params.append("filed", reportFilters.filed);
        const res = await fetch(`/api/accounting/tax-reports?${params.toString()}`);
        const data = await res.json();
        if (data.reports) setReports(data.reports);
        else setReportsError(data.error || "Failed to fetch reports");
      } catch (e) {
        setReportsError("Failed to fetch reports");
      }
      setReportsLoading(false);
    }
    fetchReports();
  }, [reportFilters]);

  // File upload for tax filings
  async function handleDocUpload(reportId: number, e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setFilingLoading(fl => ({ ...fl, [reportId]: true }));
      setFilingError(fe => ({ ...fe, [reportId]: null }));
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/accounting/tax-filings/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          setFilingDocs(fd => ({ ...fd, [reportId]: data.url }));
          toast({ title: "Upload successful", description: file.name });
        } else {
          setFilingError(fe => ({ ...fe, [reportId]: data.error || "Upload failed" }));
          toast({ title: "Upload failed", description: data.error || "Upload failed", variant: "destructive" });
        }
      } catch (e) {
        setFilingError(fe => ({ ...fe, [reportId]: "Upload failed" }));
        toast({ title: "Upload failed", description: "Network error", variant: "destructive" });
      }
      setFilingLoading(fl => ({ ...fl, [reportId]: false }));
    }
  }

  // Export reports
  async function handleExport(format: string) {
    try {
      const res = await fetch(`/api/accounting/tax-reports/export?format=${format}`);
      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank");
        toast({ title: `Exported as ${format.toUpperCase()}`, description: data.url });
      }
    } catch (e) {
      toast({ title: "Export failed", description: "Network error", variant: "destructive" });
    }
  }

  return (
    <div className="space-y-6">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="rules">Tax Rules</TabsTrigger>
          <TabsTrigger value="assignment">Tax Assignment</TabsTrigger>
          <TabsTrigger value="calculation">Tax Calculation</TabsTrigger>
          <TabsTrigger value="reports">Tax Reports</TabsTrigger>
          <TabsTrigger value="filing">Tax Filing</TabsTrigger>
        </TabsList>
        {/* Tax Rules Tab */}
        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Tax Rules</CardTitle>
            </CardHeader>
            <CardContent>
              {canManage && !editing && (
                <Button onClick={() => setShowForm(!showForm)} className="mb-4">
                  {showForm ? "Cancel" : "Add Tax Rule"}
                </Button>
              )}
              {showForm && (
                <form onSubmit={handleAdd} className="grid grid-cols-2 gap-2 mb-4">
                  <Input name="name" placeholder="Tax Name" onChange={handleInput} required />
                  <Input name="rate" placeholder="Rate (%)" type="number" onChange={handleInput} required />
                  <Input name="type" placeholder="Type (e.g. VAT, Service)" onChange={handleInput} required />
                  <Button type="submit" className="col-span-2">Save</Button>
                </form>
              )}
              {editing && (
                <form onSubmit={handleEdit} className="grid grid-cols-2 gap-2 mb-4">
                  <Input name="name" placeholder="Tax Name" value={form.name || ''} onChange={handleInput} required />
                  <Input name="rate" placeholder="Rate (%)" type="number" value={form.rate || ''} onChange={handleInput} required />
                  <Input name="type" placeholder="Type (e.g. VAT, Service)" value={form.type || ''} onChange={handleInput} required />
                  <div className="col-span-2 flex gap-2">
                    <Button type="submit">Update</Button>
                    <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm({}); }}>Cancel</Button>
                  </div>
                </form>
              )}
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Rate (%)</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2">Status</th>
                      {canManage && <th className="text-left p-2">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {taxRules.length === 0 ? (
                      <tr><td colSpan={5}>No tax rules found.</td></tr>
                    ) : taxRules.map(rule => (
                      <tr key={rule.id} className="border-b">
                        <td className="p-2">{rule.name}</td>
                        <td className="p-2">{rule.rate}</td>
                        <td className="p-2">{rule.type}</td>
                        <td className="p-2">{rule.is_active ? 'Active' : 'Inactive'}</td>
                        {canManage && (
                          <td className="p-2 flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => startEdit(rule)}>Edit</Button>
                            <Button size="sm" variant={rule.is_active ? "secondary" : "default"} onClick={() => toggleActive(rule)}>{rule.is_active ? "Deactivate" : "Activate"}</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(rule)}>Delete</Button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Tax Assignment Tab */}
        <TabsContent value="assignment">
          <Card>
            <CardHeader>
              <CardTitle>Tax Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left p-2">Product/Service</th>
                      <th className="text-left p-2">Assigned Tax Rule</th>
                      {canManage && <th className="text-left p-2">Assign</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} className="border-b">
                        <td className="p-2">{product.name}</td>
                        <td className="p-2">{taxRules.find(r => r.id === product.tax_rule_id)?.name || 'None'}</td>
                        {canManage && (
                          <td className="p-2">
                            <select
                              value={product.tax_rule_id || ''}
                              onChange={e => handleAssign(product.id, Number(e.target.value))}
                              className="border rounded px-2 py-1"
                            >
                              <option value="">None</option>
                              {taxRules.map(rule => (
                                <option key={rule.id} value={rule.id}>{rule.name}</option>
                              ))}
                            </select>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Tax Calculation Tab */}
        <TabsContent value="calculation">
          <Card>
            <CardHeader>
              <CardTitle>Tax Calculation Demo</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col md:flex-row gap-2 mb-4 items-end">
                <div>
                  <label className="block text-xs mb-1">Product/Service</label>
                  <select
                    value={invoice.product_id}
                    onChange={e => setInvoice({ ...invoice, product_id: Number(e.target.value) })}
                    className="border rounded px-2 py-1"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs mb-1">Amount</label>
                  <Input
                    type="number"
                    value={invoice.amount}
                    onChange={e => setInvoice({ ...invoice, amount: Number(e.target.value) })}
                  />
                </div>
              </form>
              <div className="p-4 bg-gray-50 rounded">
                <div>Product: <strong>{selectedProduct?.name}</strong></div>
                <div>Tax Rule: <strong>{selectedTaxRule ? selectedTaxRule.name : 'None'}</strong></div>
                <div>Tax Rate: <strong>{selectedTaxRule ? selectedTaxRule.rate + '%' : '-'}</strong></div>
                <div>Tax Amount: <strong>{taxAmount.toFixed(2)}</strong></div>
                <div>Total Amount: <strong>{totalAmount.toFixed(2)}</strong></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Tax Reports Tab */}
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Tax Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <select className="border rounded px-2 py-1" value={reportFilters.type} onChange={e => setReportFilters(f => ({ ...f, type: e.target.value }))}>
                  <option value="">All Types</option>
                  <option value="VAT">VAT</option>
                  <option value="Service">Service</option>
                </select>
                <select className="border rounded px-2 py-1" value={reportFilters.period} onChange={e => setReportFilters(f => ({ ...f, period: e.target.value }))}>
                  <option value="">All Periods</option>
                  <option value="2024-05">2024-05</option>
                  <option value="2024-04">2024-04</option>
                </select>
                <select className="border rounded px-2 py-1" value={reportFilters.filed} onChange={e => setReportFilters(f => ({ ...f, filed: e.target.value }))}>
                  <option value="">All</option>
                  <option value="true">Filed</option>
                  <option value="false">Unfiled</option>
                </select>
                <Button size="sm" onClick={() => handleExport("csv")}>Export CSV</Button>
                <Button size="sm" onClick={() => handleExport("pdf")}>Export PDF</Button>
              </div>
              {reportsLoading ? <div>Loading...</div> : reportsError ? <div className="text-red-500">{reportsError}</div> : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left p-2">Period</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2">Total</th>
                      <th className="text-left p-2">Filed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.length === 0 ? (
                      <tr><td colSpan={4}>No reports found.</td></tr>
                    ) : reports.map(r => (
                      <tr key={r.id} className="border-b">
                        <td className="p-2">{r.period}</td>
                        <td className="p-2">{r.type}</td>
                        <td className="p-2">{r.total}</td>
                        <td className="p-2">{r.filed ? 'Yes' : 'No'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        {/* Tax Filing Tab */}
        <TabsContent value="filing">
          <Card>
            <CardHeader>
              <CardTitle>Tax Filing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left p-2">Period</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2">Filed</th>
                      <th className="text-left p-2">Upload Doc</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map(r => (
                      <tr key={r.id} className="border-b">
                        <td className="p-2">{r.period}</td>
                        <td className="p-2">{r.type}</td>
                        <td className="p-2">{r.filed ? 'Yes' : 'No'}</td>
                        <td className="p-2">
                          <input type="file" onChange={e => handleDocUpload(r.id, e)} disabled={filingLoading[r.id]} />
                          {filingLoading[r.id] && <div className="text-xs text-blue-600">Uploading...</div>}
                          {filingDocs[r.id] && (
                            <div className="text-xs mt-1">
                              <a href={`/api/accounting/tax-filings/download?file=${encodeURIComponent(filingDocs[r.id].split("/").pop() || "")}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download</a>
                            </div>
                          )}
                          {filingError[r.id] && <div className="text-xs text-red-500">{filingError[r.id]}</div>}
                        </td>
                        <td className="p-2">
                          {!r.filed && <Button size="sm" onClick={() => markFiled(r.id)}>Mark as Filed</Button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
