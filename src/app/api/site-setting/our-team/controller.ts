import { withDB } from '@/app/api/utils/db';
import OurTeam from './model';

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
export async function createOurTeam(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const ourTeamData = await req.json();

      // Accept both single or array
      const created = Array.isArray(ourTeamData) && ourTeamData.length > 0 ? await OurTeam.insertMany(ourTeamData) : await OurTeam.create(ourTeamData);

      return formatResponse(created, 'OurTeam data created successfully', 201);
    } catch (error: unknown) {
      const err = error as { code: number; message: string; keyValue: number };
      if (err.code === 11000) {
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      return formatResponse(null, err.message || 'Failed to create OurTeam data', 500);
    }
  });
}

// ✅ READ (GET)
export async function getOurTeam(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const id = new URL(req.url).searchParams.get('id');
      if (id) {
        const item = await OurTeam.findById(id);
        if (!item) return formatResponse([], 'No OurTeam item found', 200);
        return formatResponse(item, 'OurTeam item fetched successfully', 200);
      }

      const items = await OurTeam.find().sort({ createdAt: 1 });
      if (!items || items.length === 0) return formatResponse([], 'No OurTeam data found', 200);

      return formatResponse(items, 'All OurTeam items fetched successfully', 200);
    } catch (error: unknown) {
      return formatResponse(null, (error as Error).message || 'Failed to fetch OurTeam data', 500);
    }
  });
}

// ✅ UPDATE (PUT) – replace all OurTeam items
export async function updateOurTeam(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const ourTeamData = await req.json();

      if (!Array.isArray(ourTeamData) || ourTeamData.length === 0) {
        return formatResponse(null, 'Invalid or empty data array', 400);
      }

      // Replace entire collection with new data
      await OurTeam.deleteMany({});
      const updated = await OurTeam.insertMany(ourTeamData);

      return formatResponse(updated, 'OurTeam data updated successfully', 200);
    } catch (error: unknown) {
      const err = error as { code: number; message: string; keyValue: number };
      if (err.code === 11000) {
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      return formatResponse(null, err.message || 'Failed to update OurTeam data', 500);
    }
  });
}

// ✅ DELETE (optional)
export async function deleteOurTeam(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { _id } = await req.json();
      if (!_id) return formatResponse(null, 'Missing _id in request body', 400);

      const deleted = await OurTeam.findByIdAndDelete(_id);
      if (!deleted) return formatResponse(null, 'OurTeam item not found', 404);

      return formatResponse({ deletedCount: 1 }, 'OurTeam item deleted successfully', 200);
    } catch (error: unknown) {
      return formatResponse(null, (error as Error).message || 'Failed to delete OurTeam data', 500);
    }
  });
}
