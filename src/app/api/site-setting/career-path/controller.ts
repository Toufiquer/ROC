import { withDB } from '@/app/api/utils/db';
import CareerPath from './model';

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
export async function createCareerPath(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const careerPathData = await req.json();

      // Accept both single or array
      const created = Array.isArray(careerPathData) && careerPathData.length > 0 ? await CareerPath.insertMany(careerPathData) : await CareerPath.create(careerPathData);

      return formatResponse(created, 'CareerPath data created successfully', 201);
    } catch (error: unknown) {
      const err = error as { code: number; message: string; keyValue: number };
      if (err.code === 11000) {
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      return formatResponse(null, err.message || 'Failed to create CareerPath data', 500);
    }
  });
}

// ✅ READ (GET)
export async function getCareerPath(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const id = new URL(req.url).searchParams.get('id');
      if (id) {
        const item = await CareerPath.findById(id);
        if (!item) return formatResponse([], 'No CareerPath item found', 200);
        return formatResponse(item, 'CareerPath item fetched successfully', 200);
      }

      const items = await CareerPath.find().sort({ createdAt: 1 });
      if (!items || items.length === 0) return formatResponse([], 'No CareerPath data found', 200);

      return formatResponse(items, 'All CareerPath items fetched successfully', 200);
    } catch (error: unknown) {
      return formatResponse(null, (error as Error).message || 'Failed to fetch CareerPath data', 500);
    }
  });
}

// ✅ UPDATE (PUT) – replace all CareerPath items
export async function updateCareerPath(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const careerPathData = await req.json();

      if (!Array.isArray(careerPathData) || careerPathData.length === 0) {
        return formatResponse(null, 'Invalid or empty data array', 400);
      }

      // Replace entire collection with new data
      await CareerPath.deleteMany({});
      const updated = await CareerPath.insertMany(careerPathData);

      return formatResponse(updated, 'CareerPath data updated successfully', 200);
    } catch (error: unknown) {
      const err = error as { code: number; message: string; keyValue: number };
      if (err.code === 11000) {
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      return formatResponse(null, err.message || 'Failed to update CareerPath data', 500);
    }
  });
}

// ✅ DELETE (optional)
export async function deleteCareerPath(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { _id } = await req.json();
      if (!_id) return formatResponse(null, 'Missing _id in request body', 400);

      const deleted = await CareerPath.findByIdAndDelete(_id);
      if (!deleted) return formatResponse(null, 'CareerPath item not found', 404);

      return formatResponse({ deletedCount: 1 }, 'CareerPath item deleted successfully', 200);
    } catch (error: unknown) {
      return formatResponse(null, (error as Error).message || 'Failed to delete CareerPath data', 500);
    }
  });
}
