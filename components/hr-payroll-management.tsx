"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface HRPayrollManagementProps {
  user: any;
  canManage: boolean;
  canView: boolean;
}

export function HRPayrollManagement({ user, canManage, canView }: HRPayrollManagementProps) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<any>({});
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<any>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [debts, setDebts] = useState<any[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number|null>(null);

  useEffect(() => {
    if (canView) fetchEmployees();
  }, [canView]);

  async function fetchEmployees() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/employee/employees");
      const data = await res.json();
      if (data.employees) setEmployees(data.employees);
      else setError(data.error || "Failed to fetch employees");
    } catch (e) {
      setError("Failed to fetch employees");
    }
    setLoading(false);
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/employee/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.employee) {
        setEmployees([data.employee, ...employees]);
        setShowAdd(false);
        setForm({});
      } else {
        setError(data.error || "Failed to add employee");
      }
    } catch (e) {
      setError("Failed to add employee");
    }
  }

  function startEdit(emp: any) {
    setEditing(emp);
    setForm(emp);
    setShowAdd(false);
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`/api/employee/employees/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.employee) {
        setEmployees(employees.map(emp => emp.id === editing.id ? data.employee : emp));
        setEditing(null);
        setForm({});
      } else {
        setError(data.error || "Failed to update employee");
      }
    } catch (e) {
      setError("Failed to update employee");
    }
  }

  async function openDetails(emp: any) {
    setSelectedEmployee(emp);
    setDetailsLoading(true);
    setDetailsError(null);
    try {
      // Fetch attendance logs
      const attRes = await fetch(`/api/company-admin/attendance-logs?company_id=${user.company_id}`);
      const attData = await attRes.json();
      setAttendance(Array.isArray(attData) ? attData.filter((a: any) => a.employee_id === emp.id) : []);
      // Fetch debts (deductions/advances)
      const debtsRes = await fetch(`/api/employee/debts`);
      const debtsData = await debtsRes.json();
      setDebts(Array.isArray(debtsData.debts) ? debtsData.debts.filter((d: any) => d.employee_id === emp.id) : []);
    } catch (e) {
      setDetailsError("Failed to load details");
    }
    setDetailsLoading(false);
  }

  function closeDetails() {
    setSelectedEmployee(null);
    setAttendance([]);
    setDebts([]);
    setDetailsError(null);
  }

  async function handleDelete(emp: any) {
    if (!window.confirm(`Are you sure you want to delete employee ${emp.first_name} ${emp.last_name}?`)) return;
    setDeletingId(emp.id);
    setError(null);
    try {
      const res = await fetch(`/api/employee/employees/${emp.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setEmployees(employees.filter(e => e.id !== emp.id));
      } else {
        setError(data.error || "Failed to delete employee");
      }
    } catch (e) {
      setError("Failed to delete employee");
    }
    setDeletingId(null);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>HR & Payroll Management</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          {canManage && !editing && (
            <Button onClick={() => setShowAdd(!showAdd)} className="mb-4">
              {showAdd ? "Cancel" : "Add Employee"}
            </Button>
          )}
          {showAdd && (
            <form onSubmit={handleAdd} className="grid grid-cols-2 gap-2 mb-4">
              <Input name="employee_number" placeholder="Employee Number" onChange={handleInput} required />
              <Input name="first_name" placeholder="First Name" onChange={handleInput} required />
              <Input name="last_name" placeholder="Last Name" onChange={handleInput} required />
              <Input name="position" placeholder="Position" onChange={handleInput} />
              <Input name="department" placeholder="Department" onChange={handleInput} />
              <Input name="salary" placeholder="Salary" type="number" onChange={handleInput} />
              <Input name="hire_date" placeholder="Hire Date (YYYY-MM-DD)" onChange={handleInput} />
              <Button type="submit" className="col-span-2">Save</Button>
            </form>
          )}
          {editing && (
            <form onSubmit={handleEdit} className="grid grid-cols-2 gap-2 mb-4">
              <Input name="employee_number" placeholder="Employee Number" value={form.employee_number || ''} onChange={handleInput} required />
              <Input name="first_name" placeholder="First Name" value={form.first_name || ''} onChange={handleInput} required />
              <Input name="last_name" placeholder="Last Name" value={form.last_name || ''} onChange={handleInput} required />
              <Input name="position" placeholder="Position" value={form.position || ''} onChange={handleInput} />
              <Input name="department" placeholder="Department" value={form.department || ''} onChange={handleInput} />
              <Input name="salary" placeholder="Salary" type="number" value={form.salary || ''} onChange={handleInput} />
              <Input name="hire_date" placeholder="Hire Date (YYYY-MM-DD)" value={form.hire_date || ''} onChange={handleInput} />
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
                  <th className="text-left p-2">#</th>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Position</th>
                  <th className="text-left p-2">Department</th>
                  <th className="text-left p-2">Salary</th>
                  <th className="text-left p-2">Hire Date</th>
                  {canManage && <th className="text-left p-2">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7}>Loading...</td></tr>
                ) : employees.length === 0 ? (
                  <tr><td colSpan={7}>No employees found.</td></tr>
                ) : employees.map((emp, idx) => (
                  <tr key={emp.id} className="border-b">
                    <td className="p-2">{emp.employee_number}</td>
                    <td className="p-2">{emp.first_name} {emp.last_name}</td>
                    <td className="p-2">{emp.position}</td>
                    <td className="p-2">{emp.department}</td>
                    <td className="p-2">{emp.salary}</td>
                    <td className="p-2">{emp.hire_date ? emp.hire_date.substring(0, 10) : ''}</td>
                    {canManage && (
                      <td className="p-2">
                        <Button size="sm" variant="outline" onClick={() => startEdit(emp)}>Edit</Button>
                        <Button size="sm" className="ml-2" onClick={() => openDetails(emp)}>View Details</Button>
                        <Button size="sm" className="ml-2" variant="destructive" onClick={() => handleDelete(emp)} disabled={deletingId === emp.id}>{deletingId === emp.id ? 'Deleting...' : 'Delete'}</Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <Dialog open={!!selectedEmployee} onOpenChange={closeDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
          </DialogHeader>
          {detailsLoading ? (
            <div>Loading...</div>
          ) : detailsError ? (
            <div className="text-red-500">{detailsError}</div>
          ) : selectedEmployee && (
            <div className="space-y-4">
              <div>
                <strong>Name:</strong> {selectedEmployee.first_name} {selectedEmployee.last_name}<br/>
                <strong>Position:</strong> {selectedEmployee.position}<br/>
                <strong>Department:</strong> {selectedEmployee.department}<br/>
                <strong>Salary:</strong> {selectedEmployee.salary}<br/>
                <strong>Hire Date:</strong> {selectedEmployee.hire_date ? selectedEmployee.hire_date.substring(0, 10) : ''}<br/>
              </div>
              <div>
                <strong>Attendance Logs:</strong>
                <div className="max-h-32 overflow-y-auto border rounded p-2 mt-1">
                  {attendance.length === 0 ? 'No attendance records.' : (
                    <ul>
                      {attendance.map((a, i) => (
                        <li key={a.id || i}>{a.attendance_time} ({a.device_user_id})</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div>
                <strong>Deductions/Advances:</strong>
                <div className="max-h-32 overflow-y-auto border rounded p-2 mt-1">
                  {debts.length === 0 ? 'No deductions or advances.' : (
                    <ul>
                      {debts.map((d, i) => (
                        <li key={d.id || i}>{d.description || d.status} - {d.remaining_amount} ({d.status})</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div>
                <strong>Payroll Summary:</strong><br/>
                Salary: {selectedEmployee.salary || 0}<br/>
                Total Deductions: {debts.reduce((sum, d) => sum + (Number(d.remaining_amount) || 0), 0)}<br/>
                <strong>Net Pay: {(selectedEmployee.salary || 0) - debts.reduce((sum, d) => sum + (Number(d.remaining_amount) || 0), 0)}</strong>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 