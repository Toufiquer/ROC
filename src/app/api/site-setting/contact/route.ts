import { NextResponse } from 'next/server';
import { getContact, createContact, updateContact, deleteContact } from './controller';
import { handleRateLimit } from '../../utils/rate-limit';
import { IResponse } from '../../utils/utils';

const safeCall = async (fn: () => Promise<IResponse>) => {
  try {
    const result = await fn();
    return NextResponse.json({ data: result.data, message: result.message, ok: result.ok }, { status: result.status });
  } catch (error: unknown) {
    console.error('API Error:', error);
    return NextResponse.json({ data: null, message: (error as Error).message || 'Internal Server Error', ok: false }, { status: 500 });
  }
};

// ✅ GET
export async function GET(req: Request) {
  const limit = handleRateLimit(req);
  if (limit) return limit;
  return safeCall(() => getContact(req));
}

// ✅ POST
export async function POST(req: Request) {
  const limit = handleRateLimit(req);
  if (limit) return limit;
  return safeCall(() => createContact(req));
}

// ✅ PUT
export async function PUT(req: Request) {
  const limit = handleRateLimit(req);
  if (limit) return limit;
  return safeCall(() => updateContact(req));
}

// ✅ DELETE
export async function DELETE(req: Request) {
  const limit = handleRateLimit(req);
  if (limit) return limit;
  return safeCall(() => deleteContact(req));
}
