Help me to write a proper prompt in details.

I am working with NextJS in Typescript and also implement PWA to my application.

I have some SSR page. inside '/app/site-setting-public' route.

1. about
2. career
3. career-path
4. contact
5. course
6. faq
7. ielts
8. our-team
9. private-batch-addmission
10. real-mock-test
11. seminar
12. study-materials
13. success-story


I have some admin page. inside '/app/site-setting-admin' route.

1. about
2. career
3. career-path
4. contact
5. course
6. faq
7. ielts
8. our-team
9. private-batch-addmission
10. real-mock-test
11. seminar
12. study-materials
13. success-story

here is one api example for only about inside 'app/api/site-setting/about'
1. route.ts 
```
import { NextResponse } from 'next/server';
import { getAbout, createAbout, updateAbout, deleteAbout } from './controller';
import { handleRateLimit } from '../../utils/rate-limit';
import { IResponse } from '../../utils/utils';

const safeCall = async (fn: () => Promise<IResponse>) => {
  try {
    const result = await fn();
    return NextResponse.json({ data: result.data, message: result.message, ok: result.ok }, { status: result.status });
  } catch (error: unknown) {
    console.error('API Error:', error);
    return NextResponse.json({ data: null, message: (error as Error).message || 'Internal Server Error', ok: false }, { status: 500 });
  }
};

// ✅ GET
export async function GET(req: Request) {
  const limit = handleRateLimit(req);
  if (limit) return limit;
  return safeCall(() => getAbout(req));
}

// ✅ POST
export async function POST(req: Request) {
  const limit = handleRateLimit(req);
  if (limit) return limit;
  return safeCall(() => createAbout(req));
}

// ✅ PUT
export async function PUT(req: Request) {
  const limit = handleRateLimit(req);
  if (limit) return limit;
  return safeCall(() => updateAbout(req));
}

// ✅ DELETE
export async function DELETE(req: Request) {
  const limit = handleRateLimit(req);
  if (limit) return limit;
  return safeCall(() => deleteAbout(req));
}

```

2. controller.ts 
```
import { withDB } from '@/app/api/utils/db';
import About from './model';

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
export async function createAbout(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const aboutData = await req.json();

      // Accept both single or array
      const created = Array.isArray(aboutData) && aboutData.length > 0 ? await About.insertMany(aboutData) : await About.create(aboutData);

      return formatResponse(created, 'About data created successfully', 201);
    } catch (error: unknown) {
      const err = error as { code: number; message: string; keyValue: number };
      if (err.code === 11000) {
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      return formatResponse(null, err.message || 'Failed to create About data', 500);
    }
  });
}

// ✅ READ (GET)
export async function getAbout(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const id = new URL(req.url).searchParams.get('id');
      if (id) {
        const item = await About.findById(id);
        if (!item) return formatResponse([], 'No About item found', 200);
        return formatResponse(item, 'About item fetched successfully', 200);
      }

      const items = await About.find().sort({ createdAt: 1 });
      if (!items || items.length === 0) return formatResponse([], 'No About data found', 200);

      return formatResponse(items, 'All About items fetched successfully', 200);
    } catch (error: unknown) {
      return formatResponse(null, (error as Error).message || 'Failed to fetch About data', 500);
    }
  });
}

// ✅ UPDATE (PUT) – replace all About items
export async function updateAbout(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const aboutData = await req.json();

      if (!Array.isArray(aboutData) || aboutData.length === 0) {
        return formatResponse(null, 'Invalid or empty data array', 400);
      }

      // Replace entire collection with new data
      await About.deleteMany({});
      const updated = await About.insertMany(aboutData);

      return formatResponse(updated, 'About data updated successfully', 200);
    } catch (error: unknown) {
      const err = error as { code: number; message: string; keyValue: number };
      if (err.code === 11000) {
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      return formatResponse(null, err.message || 'Failed to update About data', 500);
    }
  });
}

// ✅ DELETE (optional)
export async function deleteAbout(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { _id } = await req.json();
      if (!_id) return formatResponse(null, 'Missing _id in request body', 400);

      const deleted = await About.findByIdAndDelete(_id);
      if (!deleted) return formatResponse(null, 'About item not found', 404);

      return formatResponse({ deletedCount: 1 }, 'About item deleted successfully', 200);
    } catch (error: unknown) {
      return formatResponse(null, (error as Error).message || 'Failed to delete About data', 500);
    }
  });
}

```

3. model.ts 
```
import mongoose, { Schema, Document, Types } from 'mongoose';

interface IChildData {
  name: string;
  path?: string;
  icon?: string;
  image?: string;
  svg?: string;
  description?: string;
}

// Make _id required to satisfy mongoose's Document type
export interface IAboutItem extends Document {
  _id: Types.ObjectId;
  name: string;
  path?: string;
  icon?: string;
  image?: string;
  svg?: string;
  description?: string;
  childData?: IChildData[];
}

const childSchema = new Schema<IChildData>(
  {
    name: { type: String, required: true },
    path: { type: String },
    icon: String,
    image: String,
    svg: String,
    description: String,
  },
  { _id: false }, // disable _id on subdocuments if you don't want them
);

const aboutSchema = new Schema<IAboutItem>(
  {
    name: { type: String, required: true },
    path: String,
    icon: String,
    image: String,
    svg: String,
    description: String,
    childData: [childSchema],
  },
  { timestamps: true },
);

// export model (collection name 'about')
export default (mongoose.models.About as mongoose.Model<IAboutItem>) || mongoose.model<IAboutItem>('About', aboutSchema, 'about');

```


Now your task is You have generate the following api inside 'app/api/site-setting/' to store those data in mongoDB. (route.ts, controller.ts, model.ts)

2. career
3. career-path
4. contact
5. course
6. faq
7. ielts
8. our-team
9. private-batch-addmission
10. real-mock-test
11. seminar
12. study-materials
13. success-story