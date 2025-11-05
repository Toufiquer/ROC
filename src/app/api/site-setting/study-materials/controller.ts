import { withDB } from '@/app/api/utils/db';
import StudyMaterials from './model';

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
export async function createStudyMaterials(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const studyMaterialsData = await req.json();

      // Accept both single or array
      const created = Array.isArray(studyMaterialsData) && studyMaterialsData.length > 0 ? await StudyMaterials.insertMany(studyMaterialsData) : await StudyMaterials.create(studyMaterialsData);

      return formatResponse(created, 'StudyMaterials data created successfully', 201);
    } catch (error: unknown) {
      const err = error as { code: number; message: string; keyValue: number };
      if (err.code === 11000) {
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      return formatResponse(null, err.message || 'Failed to create StudyMaterials data', 500);
    }
  });
}

// ✅ READ (GET)
export async function getStudyMaterials(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const id = new URL(req.url).searchParams.get('id');
      if (id) {
        const item = await StudyMaterials.findById(id);
        if (!item) return formatResponse([], 'No StudyMaterials item found', 200);
        return formatResponse(item, 'StudyMaterials item fetched successfully', 200);
      }

      const items = await StudyMaterials.find().sort({ createdAt: 1 });
      if (!items || items.length === 0) return formatResponse([], 'No StudyMaterials data found', 200);

      return formatResponse(items, 'All StudyMaterials items fetched successfully', 200);
    } catch (error: unknown) {
      return formatResponse(null, (error as Error).message || 'Failed to fetch StudyMaterials data', 500);
    }
  });
}

// ✅ UPDATE (PUT) – replace all StudyMaterials items
export async function updateStudyMaterials(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const studyMaterialsData = await req.json();

      if (!Array.isArray(studyMaterialsData) || studyMaterialsData.length === 0) {
        return formatResponse(null, 'Invalid or empty data array', 400);
      }

      // Replace entire collection with new data
      await StudyMaterials.deleteMany({});
      const updated = await StudyMaterials.insertMany(studyMaterialsData);

      return formatResponse(updated, 'StudyMaterials data updated successfully', 200);
    } catch (error: unknown) {
      const err = error as { code: number; message: string; keyValue: number };
      if (err.code === 11000) {
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      return formatResponse(null, err.message || 'Failed to update StudyMaterials data', 500);
    }
  });
}

// ✅ DELETE (optional)
export async function deleteStudyMaterials(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { _id } = await req.json();
      if (!_id) return formatResponse(null, 'Missing _id in request body', 400);

      const deleted = await StudyMaterials.findByIdAndDelete(_id);
      if (!deleted) return formatResponse(null, 'StudyMaterials item not found', 404);

      return formatResponse({ deletedCount: 1 }, 'StudyMaterials item deleted successfully', 200);
    } catch (error: unknown) {
      return formatResponse(null, (error as Error).message || 'Failed to delete StudyMaterials data', 500);
    }
  });
}
