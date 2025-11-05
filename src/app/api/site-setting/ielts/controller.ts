import { withDB } from '@/app/api/utils/db';
import Ielts from './model';

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
export async function createIelts(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const ieltsData = await req.json();

      // Accept both single or array
      const created = Array.isArray(ieltsData) && ieltsData.length > 0 ? await Ielts.insertMany(ieltsData) : await Ielts.create(ieltsData);

      return formatResponse(created, 'Ielts data created successfully', 201);
    } catch (error: unknown) {
      const err = error as { code: number; message: string; keyValue: number };
      if (err.code === 11000) {
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      return formatResponse(null, err.message || 'Failed to create Ielts data', 500);
    }
  });
}

// ✅ READ (GET)
export async function getIelts(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const id = new URL(req.url).searchParams.get('id');
      if (id) {
        const item = await Ielts.findById(id);
        if (!item) return formatResponse([], 'No Ielts item found', 200);
        return formatResponse(item, 'Ielts item fetched successfully', 200);
      }

      const items = await Ielts.find().sort({ createdAt: 1 });
      if (!items || items.length === 0) return formatResponse([], 'No Ielts data found', 200);

      return formatResponse(items, 'All Ielts items fetched successfully', 200);
    } catch (error: unknown) {
      return formatResponse(null, (error as Error).message || 'Failed to fetch Ielts data', 500);
    }
  });
}

// ✅ UPDATE (PUT) – replace all Ielts items
export async function updateIelts(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const ieltsData = await req.json();

      if (!Array.isArray(ieltsData) || ieltsData.length === 0) {
        return formatResponse(null, 'Invalid or empty data array', 400);
      }

      // Replace entire collection with new data
      await Ielts.deleteMany({});
      const updated = await Ielts.insertMany(ieltsData);

      return formatResponse(updated, 'Ielts data updated successfully', 200);
    } catch (error: unknown) {
      const err = error as { code: number; message: string; keyValue: number };
      if (err.code === 11000) {
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      return formatResponse(null, err.message || 'Failed to update Ielts data', 500);
    }
  });
}

// ✅ DELETE (optional)
export async function deleteIelts(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { _id } = await req.json();
      if (!_id) return formatResponse(null, 'Missing _id in request body', 400);

      const deleted = await Ielts.findByIdAndDelete(_id);
      if (!deleted) return formatResponse(null, 'Ielts item not found', 404);

      return formatResponse({ deletedCount: 1 }, 'Ielts item deleted successfully', 200);
    } catch (error: unknown) {
      return formatResponse(null, (error as Error).message || 'Failed to delete Ielts data', 500);
    }
  });
}
