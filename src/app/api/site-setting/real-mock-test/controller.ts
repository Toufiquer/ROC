import { withDB } from '@/app/api/utils/db';
import RealMockTest from './model';

interface IResponse {
  data: unknown;
  message: string;
  status: number;
  ok?: boolean;
}

const formatResponse = (data: unknown, message: string, status: number): IResponse => ({
  data,
  message,
  status,
  ok: status >= 200 && status < 300,
});

// ✅ CREATE (POST)
export async function createRealMockTest(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const realMockTestData = await req.json();

      // Accept both single or array
      const created = Array.isArray(realMockTestData) && realMockTestData.length > 0 ? await RealMockTest.insertMany(realMockTestData) : await RealMockTest.create(realMockTestData);

      return formatResponse(created, 'RealMockTest data created successfully', 201);
    } catch (error: unknown) {
      const err = error as { code: number; message: string; keyValue: number };
      if (err.code === 11000) {
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      return formatResponse(null, err.message || 'Failed to create RealMockTest data', 500);
    }
  });
}

// ✅ READ (GET)
export async function getRealMockTest(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const id = new URL(req.url).searchParams.get('id');
      if (id) {
        const item = await RealMockTest.findById(id);
        if (!item) return formatResponse([], 'No RealMockTest item found', 200);
        return formatResponse(item, 'RealMockTest item fetched successfully', 200);
      }

      const items = await RealMockTest.find().sort({ createdAt: 1 });
      if (!items || items.length === 0) return formatResponse([], 'No RealMockTest data found', 200);

      return formatResponse(items, 'All RealMockTest items fetched successfully', 200);
    } catch (error: unknown) {
      return formatResponse(null, (error as Error).message || 'Failed to fetch RealMockTest data', 500);
    }
  });
}

// ✅ UPDATE (PUT) – replace all RealMockTest items
export async function updateRealMockTest(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const realMockTestData = await req.json();

      if (!Array.isArray(realMockTestData) || realMockTestData.length === 0) {
        return formatResponse(null, 'Invalid or empty data array', 400);
      }

      // Replace entire collection with new data
      await RealMockTest.deleteMany({});
      const updated = await RealMockTest.insertMany(realMockTestData);

      return formatResponse(updated, 'RealMockTest data updated successfully', 200);
    } catch (error: unknown) {
      const err = error as { code: number; message: string; keyValue: number };
      if (err.code === 11000) {
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      return formatResponse(null, err.message || 'Failed to update RealMockTest data', 500);
    }
  });
}

// ✅ DELETE (optional)
export async function deleteRealMockTest(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { _id } = await req.json();
      if (!_id) return formatResponse(null, 'Missing _id in request body', 400);

      const deleted = await RealMockTest.findByIdAndDelete(_id);
      if (!deleted) return formatResponse(null, 'RealMockTest item not found', 404);

      return formatResponse({ deletedCount: 1 }, 'RealMockTest item deleted successfully', 200);
    } catch (error: unknown) {
      return formatResponse(null, (error as Error).message || 'Failed to delete RealMockTest data', 500);
    }
  });
}
