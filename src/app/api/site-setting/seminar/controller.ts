import { withDB } from '@/app/api/utils/db';
import Seminar from './model';

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
export async function createSeminar(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const seminarData = await req.json();

      // Accept both single or array
      const created = Array.isArray(seminarData) && seminarData.length > 0 ? await Seminar.insertMany(seminarData) : await Seminar.create(seminarData);

      return formatResponse(created, 'Seminar data created successfully', 201);
    } catch (error: unknown) {
      const err = error as { code: number; message: string; keyValue: number };
      if (err.code === 11000) {
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      return formatResponse(null, err.message || 'Failed to create Seminar data', 500);
    }
  });
}

// ✅ READ (GET)
export async function getSeminar(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const id = new URL(req.url).searchParams.get('id');
      if (id) {
        const item = await Seminar.findById(id);
        if (!item) return formatResponse([], 'No Seminar item found', 200);
        return formatResponse(item, 'Seminar item fetched successfully', 200);
      }

      const items = await Seminar.find().sort({ createdAt: 1 });
      if (!items || items.length === 0) return formatResponse([], 'No Seminar data found', 200);

      return formatResponse(items, 'All Seminar items fetched successfully', 200);
    } catch (error: unknown) {
      return formatResponse(null, (error as Error).message || 'Failed to fetch Seminar data', 500);
    }
  });
}

// ✅ UPDATE (PUT) – replace all Seminar items
export async function updateSeminar(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const seminarData = await req.json();

      if (!Array.isArray(seminarData) || seminarData.length === 0) {
        return formatResponse(null, 'Invalid or empty data array', 400);
      }

      // Replace entire collection with new data
      await Seminar.deleteMany({});
      const updated = await Seminar.insertMany(seminarData);

      return formatResponse(updated, 'Seminar data updated successfully', 200);
    } catch (error: unknown) {
      const err = error as { code: number; message: string; keyValue: number };
      if (err.code === 11000) {
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      return formatResponse(null, err.message || 'Failed to update Seminar data', 500);
    }
  });
}

// ✅ DELETE (optional)
export async function deleteSeminar(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { _id } = await req.json();
      if (!_id) return formatResponse(null, 'Missing _id in request body', 400);

      const deleted = await Seminar.findByIdAndDelete(_id);
      if (!deleted) return formatResponse(null, 'Seminar item not found', 404);

      return formatResponse({ deletedCount: 1 }, 'Seminar item deleted successfully', 200);
    } catch (error: unknown) {
      return formatResponse(null, (error as Error).message || 'Failed to delete Seminar data', 500);
    }
  });
}
