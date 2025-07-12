import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/database";
import { hasPermission } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!hasPermission(session, 'ap.manage')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const companyId = session.company_id;
  const invoiceId = Number(params.id);
  const { new_status } = await req.json();
  const invoice = await db.purchase_invoices.findFirst({ where: { id: invoiceId, company_id: companyId } });
  if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await db.purchase_invoices.update({ where: { id: invoiceId, company_id: companyId }, data: { status: new_status } });
  await db.purchase_invoice_status_history.create({ data: { invoice_id: invoiceId, old_status: invoice.status, new_status, changed_by: session.user_id } });
  return NextResponse.json({ success: true });
} 