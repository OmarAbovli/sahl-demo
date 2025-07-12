import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { db } from '@/lib/database';
import { hasPermission } from '@/lib/auth';

// GET: List supplier payments for the current company
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!hasPermission(session, 'ap.view')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const companyId = session.company_id;
  const payments = await db.supplier_payments.findMany({ where: { company_id: companyId } });
  return NextResponse.json(payments);
}

// POST: Create a new supplier payment
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!hasPermission(session, 'ap.manage')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const companyId = session.company_id;
  const data = await req.json();
  // TODO: Validate data
  const payment = await db.supplier_payments.create({
    data: { ...data, company_id: companyId, created_by: session.user_id },
  });
  return NextResponse.json(payment);
}
