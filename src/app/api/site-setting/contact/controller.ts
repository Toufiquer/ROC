import { withDB } from '@/app/api/utils/db';
import Contact from './model';

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
export async function createContact(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const contactData = await req.json();

      // Accept both single or array
      const created = Array.isArray(contactData) && contactData.length > 0 ? await Contact.insertMany(contactData) : await Contact.create(contactData);

      return formatResponse(created, 'Contact data created successfully', 201);
    } catch (error: unknown) {
      const err = error as { code: number; message: string; keyValue: number };
      if (err.code === 11000) {
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      return formatResponse(null, err.message || 'Failed to create Contact data', 500);
    }
  });
}

// ✅ READ (GET)
export async function getContact(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const id = new URL(req.url).searchParams.get('id');
      if (id) {
        const item = await Contact.findById(id);
        if (!item) return formatResponse([], 'No Contact item found', 200);
        return formatResponse(item, 'Contact item fetched successfully', 200);
      }

      const items = await Contact.find().sort({ createdAt: 1 });
      if (!items || items.length === 0) return formatResponse([], 'No Contact data found', 200);

      return formatResponse(items, 'All Contact items fetched successfully', 200);
    } catch (error: unknown) {
      return formatResponse(null, (error as Error).message || 'Failed to fetch Contact data', 500);
    }
  });
}

// ✅ UPDATE (PUT) – replace all Contact items
export async function updateContact(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const contactData = await req.json();

      if (!Array.isArray(contactData) || contactData.length === 0) {
        return formatResponse(null, 'Invalid or empty data array', 400);
      }

      // Replace entire collection with new data
      await Contact.deleteMany({});
      const updated = await Contact.insertMany(contactData);

      return formatResponse(updated, 'Contact data updated successfully', 200);
    } catch (error: unknown) {
      const err = error as { code: number; message: string; keyValue: number };
      if (err.code === 11000) {
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      return formatResponse(null, err.message || 'Failed to update Contact data', 500);
    }
  });
}

// ✅ DELETE (optional)
export async function deleteContact(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { _id } = await req.json();
      if (!_id) return formatResponse(null, 'Missing _id in request body', 400);

      const deleted = await Contact.findByIdAndDelete(_id);
      if (!deleted) return formatResponse(null, 'Contact item not found', 404);

      return formatResponse({ deletedCount: 1 }, 'Contact item deleted successfully', 200);
    } catch (error: unknown) {
      return formatResponse(null, (error as Error).message || 'Failed to delete Contact data', 500);
    }
  });
}
