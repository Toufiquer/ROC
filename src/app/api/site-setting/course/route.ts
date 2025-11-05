import { NextResponse } from 'next/server';
import { getCourse, createCourse, updateCourse, deleteCourse } from './controller';
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
  return safeCall(() => getCourse(req));
}

// ✅ POST
export async function POST(req: Request) {
  const limit = handleRateLimit(req);
  if (limit) return limit;
  return safeCall(() => createCourse(req));
}

// ✅ PUT
export async function PUT(req: Request) {
  const limit = handleRateLimit(req);
  if (limit) return limit;
  return safeCall(() => updateCourse(req));
}

// ✅ DELETE
export async function DELETE(req: Request) {
  const limit = handleRateLimit(req);
  if (limit) return limit;
  return safeCall(() => deleteCourse(req));
}
