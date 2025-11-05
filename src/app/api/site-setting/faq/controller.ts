import { withDB } from '@/app/api/utils/db';
import Faq from './model';

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
export async function createFaq(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const faqData = await req.json();

      // Accept both single or array
      const created = Array.isArray(faqData) && faqData.length > 0 ? await Faq.insertMany(faqData) : await Faq.create(faqData);

      return formatResponse(created, 'Faq data created successfully', 201);
    } catch (error: unknown) {
      const err = error as { code: number; message: string; keyValue: number };
      if (err.code === 11000) {
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      return formatResponse(null, err.message || 'Failed to create Faq data', 500);
    }
  });
}

// ✅ READ (GET)
export async function getFaq(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const id = new URL(req.url).searchParams.get('id');
      if (id) {
        const item = await Faq.findById(id);
        if (!item) return formatResponse([], 'No Faq item found', 200);
        return formatResponse(item, 'Faq item fetched successfully', 200);
      }

      const items = await Faq.find().sort({ createdAt: 1 });
      if (!items || items.length === 0) return formatResponse([], 'No Faq data found', 200);

      return formatResponse(items, 'All Faq items fetched successfully', 200);
    } catch (error: unknown) {
      return formatResponse(null, (error as Error).message || 'Failed to fetch Faq data', 500);
    }
  });
}

// ✅ UPDATE (PUT) – replace all Faq items
export async function updateFaq(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const faqData = await req.json();

      if (!Array.isArray(faqData) || faqData.length === 0) {
        return formatResponse(null, 'Invalid or empty data array', 400);
      }

      // Replace entire collection with new data
      await Faq.deleteMany({});
      const updated = await Faq.insertMany(faqData);

      return formatResponse(updated, 'Faq data updated successfully', 200);
    } catch (error: unknown) {
      const err = error as { code: number; message: string; keyValue: number };
      if (err.code === 11000) {
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      return formatResponse(null, err.message || 'Failed to update Faq data', 500);
    }
  });
}

// ✅ DELETE (optional)
export async function deleteFaq(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { _id } = await req.json();
      if (!_id) return formatResponse(null, 'Missing _id in request body', 400);

      const deleted = await Faq.findByIdAndDelete(_id);
      if (!deleted) return formatResponse(null, 'Faq item not found', 404);

      return formatResponse({ deletedCount: 1 }, 'Faq item deleted successfully', 200);
    } catch (error: unknown) {
      return formatResponse(null, (error as Error).message || 'Failed to delete Faq data', 500);
    }
  });
}
