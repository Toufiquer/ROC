import { withDB } from '@/app/api/utils/db';
import PrivateBatchAddmission from './model';

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
export async function createPrivateBatchAddmission(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const privateBatchAddmissionData = await req.json();

      // Accept both single or array
      const created = Array.isArray(privateBatchAddmissionData) && privateBatchAddmissionData.length > 0 ? await PrivateBatchAddmission.insertMany(privateBatchAddmissionData) : await PrivateBatchAddmission.create(privateBatchAddmissionData);

      return formatResponse(created, 'PrivateBatchAddmission data created successfully', 201);
    } catch (error: unknown) {
      const err = error as { code: number; message: string; keyValue: number };
      if (err.code === 11000) {
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      return formatResponse(null, err.message || 'Failed to create PrivateBatchAddmission data', 500);
    }
  });
}

// ✅ READ (GET)
export async function getPrivateBatchAddmission(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const id = new URL(req.url).searchParams.get('id');
      if (id) {
        const item = await PrivateBatchAddmission.findById(id);
        if (!item) return formatResponse([], 'No PrivateBatchAddmission item found', 200);
        return formatResponse(item, 'PrivateBatchAddmission item fetched successfully', 200);
      }

      const items = await PrivateBatchAddmission.find().sort({ createdAt: 1 });
      if (!items || items.length === 0) return formatResponse([], 'No PrivateBatchAddmission data found', 200);

      return formatResponse(items, 'All PrivateBatchAddmission items fetched successfully', 200);
    } catch (error: unknown) {
      return formatResponse(null, (error as Error).message || 'Failed to fetch PrivateBatchAddmission data', 500);
    }
  });
}

// ✅ UPDATE (PUT) – replace all PrivateBatchAddmission items
export async function updatePrivateBatchAddmission(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const privateBatchAddmissionData = await req.json();

      if (!Array.isArray(privateBatchAddmissionData) || privateBatchAddmissionData.length === 0) {
        return formatResponse(null, 'Invalid or empty data array', 400);
      }

      // Replace entire collection with new data
      await PrivateBatchAddmission.deleteMany({});
      const updated = await PrivateBatchAddmission.insertMany(privateBatchAddmissionData);

      return formatResponse(updated, 'PrivateBatchAddmission data updated successfully', 200);
    } catch (error: unknown) {
      const err = error as { code: number; message: string; keyValue: number };
      if (err.code === 11000) {
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      return formatResponse(null, err.message || 'Failed to update PrivateBatchAddmission data', 500);
    }
  });
}

// ✅ DELETE (optional)
export async function deletePrivateBatchAddmission(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { _id } = await req.json();
      if (!_id) return formatResponse(null, 'Missing _id in request body', 400);

      const deleted = await PrivateBatchAddmission.findByIdAndDelete(_id);
      if (!deleted) return formatResponse(null, 'PrivateBatchAddmission item not found', 404);

      return formatResponse({ deletedCount: 1 }, 'PrivateBatchAddmission item deleted successfully', 200);
    } catch (error: unknown) {
      return formatResponse(null, (error as Error).message || 'Failed to delete PrivateBatchAddmission data', 500);
    }
  });
}
