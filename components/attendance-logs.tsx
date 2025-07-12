"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { User } from "@/lib/database"

interface AttendanceLog {
  id: number
  company_id: number
  employee_id: number | null
  device_user_id: number
  attendance_time: string
  attendance_type: number
  raw_log_id: number
  first_name?: string
  last_name?: string
  employee_number?: string
}

interface Props {
  user: User
}

export function AttendanceLogs({ user }: Props) {
  const [logs, setLogs] = useState<AttendanceLog[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLogs()
    // eslint-disable-next-line
  }, [])

  const fetchLogs = async () => {
    if (!user.company_id) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/company-admin/attendance-logs?company_id=${user.company_id}&limit=100`)
      if (!res.ok) throw new Error("Failed to fetch attendance logs")
      const data = await res.json()
      setLogs(data)
    } catch (err: any) {
      setError(err.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Logs</CardTitle>
        <CardDescription>Recent biometric attendance records</CardDescription>
      </CardHeader>
      {error && <p className="text-red-500 p-4">{error}</p>}
      {loading ? (
        <p className="p-4">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Device User ID</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Raw Log ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.first_name || "-"} {log.last_name || ""} <span className="text-xs text-gray-400">{log.employee_number || ""}</span></TableCell>
                  <TableCell>{log.device_user_id}</TableCell>
                  <TableCell>{new Date(log.attendance_time).toLocaleString()}</TableCell>
                  <TableCell>{log.attendance_type === 0 ? "Check-in" : log.attendance_type === 1 ? "Check-out" : log.attendance_type}</TableCell>
                  <TableCell>{log.raw_log_id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  )
}
