import { withDB } from '@/app/api/utils/db';
import Career from './model';

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
export async function createCareer(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const careerData = await req.json();

      // Accept both single or array
      const created = Array.isArray(careerData) && careerData.length > 0 ? await Career.insertMany(careerData) : await Career.create(careerData);

      return formatResponse(created, 'Career data created successfully', 201);
    } catch (error: unknown) {
      const err = error as { code: number; message: string; keyValue: number };
      if (err.code === 11000) {
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      return formatResponse(null, err.message || 'Failed to create Career data', 500);
    }
  });
}

// ✅ READ (GET)
export async function getCareer(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const id = new URL(req.url).searchParams.get('id');
      if (id) {
        const item = await Career.findById(id);
        if (!item) return formatResponse([], 'No Career item found', 200);
        return formatResponse(item, 'Career item fetched successfully', 200);
      }

      const items = await Career.find().sort({ createdAt: 1 });
      if (!items || items.length === 0) return formatResponse([], 'No Career data found', 200);

      return formatResponse(items, 'All Career items fetched successfully', 200);
    } catch (error: unknown) {
      return formatResponse(null, (error as Error).message || 'Failed to fetch Career data', 500);
    }
  });
}

// ✅ UPDATE (PUT) – replace all Career items
export async function updateCareer(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const careerData = await req.json();

      if (!Array.isArray(careerData) || careerData.length === 0) {
        return formatResponse(null, 'Invalid or empty data array', 400);
      }

      // Replace entire collection with new data
      await Career.deleteMany({});
      const updated = await Career.insertMany(careerData);

      return formatResponse(updated, 'Career data updated successfully', 200);
    } catch (error: unknown) {
      const err = error as { code: number; message: string; keyValue: number };
      if (err.code === 11000) {
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      return formatResponse(null, err.message || 'Failed to update Career data', 500);
    }
  });
}

// ✅ DELETE (optional)
export async function deleteCareer(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { _id } = await req.json();
      if (!_id) return formatResponse(null, 'Missing _id in request body', 400);

      const deleted = await Career.findByIdAndDelete(_id);
      if (!deleted) return formatResponse(null, 'Career item not found', 404);

      return formatResponse({ deletedCount: 1 }, 'Career item deleted successfully', 200);
    } catch (error: unknown) {
      return formatResponse(null, (error as Error).message || 'Failed to delete Career data', 500);
    }
  });
}
