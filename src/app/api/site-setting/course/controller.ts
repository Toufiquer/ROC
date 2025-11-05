import { withDB } from '@/app/api/utils/db';
import Course from './model';

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
export async function createCourse(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const courseData = await req.json();

      // Accept both single or array
      const created = Array.isArray(courseData) && courseData.length > 0 ? await Course.insertMany(courseData) : await Course.create(courseData);

      return formatResponse(created, 'Course data created successfully', 201);
    } catch (error: unknown) {
      const err = error as { code: number; message: string; keyValue: number };
      if (err.code === 11000) {
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      return formatResponse(null, err.message || 'Failed to create Course data', 500);
    }
  });
}

// ✅ READ (GET)
export async function getCourse(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const id = new URL(req.url).searchParams.get('id');
      if (id) {
        const item = await Course.findById(id);
        if (!item) return formatResponse([], 'No Course item found', 200);
        return formatResponse(item, 'Course item fetched successfully', 200);
      }

      const items = await Course.find().sort({ createdAt: 1 });
      if (!items || items.length === 0) return formatResponse([], 'No Course data found', 200);

      return formatResponse(items, 'All Course items fetched successfully', 200);
    } catch (error: unknown) {
      return formatResponse(null, (error as Error).message || 'Failed to fetch Course data', 500);
    }
  });
}

// ✅ UPDATE (PUT) – replace all Course items
export async function updateCourse(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const courseData = await req.json();

      if (!Array.isArray(courseData) || courseData.length === 0) {
        return formatResponse(null, 'Invalid or empty data array', 400);
      }

      // Replace entire collection with new data
      await Course.deleteMany({});
      const updated = await Course.insertMany(courseData);

      return formatResponse(updated, 'Course data updated successfully', 200);
    } catch (error: unknown) {
      const err = error as { code: number; message: string; keyValue: number };
      if (err.code === 11000) {
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      return formatResponse(null, err.message || 'Failed to update Course data', 500);
    }
  });
}

// ✅ DELETE (optional)
export async function deleteCourse(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { _id } = await req.json();
      if (!_id) return formatResponse(null, 'Missing _id in request body', 400);

      const deleted = await Course.findByIdAndDelete(_id);
      if (!deleted) return formatResponse(null, 'Course item not found', 404);

      return formatResponse({ deletedCount: 1 }, 'Course item deleted successfully', 200);
    } catch (error: unknown) {
      return formatResponse(null, (error as Error).message || 'Failed to delete Course data', 500);
    }
  });
}
