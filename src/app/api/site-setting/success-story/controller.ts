import { withDB } from '@/app/api/utils/db';
import SuccessStory from './model';

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
export async function createSuccessStory(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const successStoryData = await req.json();

      // Accept both single or array
      const created = Array.isArray(successStoryData) && successStoryData.length > 0 ? await SuccessStory.insertMany(successStoryData) : await SuccessStory.create(successStoryData);

      return formatResponse(created, 'SuccessStory data created successfully', 201);
    } catch (error: unknown) {
      const err = error as { code: number; message: string; keyValue: number };
      if (err.code === 11000) {
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      return formatResponse(null, err.message || 'Failed to create SuccessStory data', 500);
    }
  });
}

// ✅ READ (GET)
export async function getSuccessStory(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const id = new URL(req.url).searchParams.get('id');
      if (id) {
        const item = await SuccessStory.findById(id);
        if (!item) return formatResponse([], 'No SuccessStory item found', 200);
        return formatResponse(item, 'SuccessStory item fetched successfully', 200);
      }

      const items = await SuccessStory.find().sort({ createdAt: 1 });
      if (!items || items.length === 0) return formatResponse([], 'No SuccessStory data found', 200);

      return formatResponse(items, 'All SuccessStory items fetched successfully', 200);
    } catch (error: unknown) {
      return formatResponse(null, (error as Error).message || 'Failed to fetch SuccessStory data', 500);
    }
  });
}

// ✅ UPDATE (PUT) – replace all SuccessStory items
export async function updateSuccessStory(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const successStoryData = await req.json();

      if (!Array.isArray(successStoryData) || successStoryData.length === 0) {
        return formatResponse(null, 'Invalid or empty data array', 400);
      }

      // Replace entire collection with new data
      await SuccessStory.deleteMany({});
      const updated = await SuccessStory.insertMany(successStoryData);

      return formatResponse(updated, 'SuccessStory data updated successfully', 200);
    } catch (error: unknown) {
      const err = error as { code: number; message: string; keyValue: number };
      if (err.code === 11000) {
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      return formatResponse(null, err.message || 'Failed to update SuccessStory data', 500);
    }
  });
}

// ✅ DELETE (optional)
export async function deleteSuccessStory(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { _id } = await req.json();
      if (!_id) return formatResponse(null, 'Missing _id in request body', 400);

      const deleted = await SuccessStory.findByIdAndDelete(_id);
      if (!deleted) return formatResponse(null, 'SuccessStory item not found', 404);

      return formatResponse({ deletedCount: 1 }, 'SuccessStory item deleted successfully', 200);
    } catch (error: unknown) {
      return formatResponse(null, (error as Error).message || 'Failed to delete SuccessStory data', 500);
    }
  });
}
