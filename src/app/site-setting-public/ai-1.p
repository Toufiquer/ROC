I am working on a NextJS 14 (App Router) project with TypeScript, MongoDB (Mongoose), and PWA support.
I already have one API completed for the "about" section inside:

app/api/site-setting/about/route.ts
app/api/site-setting/about/controller.ts
app/api/site-setting/about/model.ts


Here is the structure and logic reference that MUST be followed exactly:

✅ API Behavior Rules

The API supports GET, POST, PUT, DELETE

GET returns:

All documents if no ID is provided

Single document if id is passed in URL search parameter

POST creates either:

One document

OR multiple documents if array input is given

PUT replaces the entire collection, meaning:

First deletes all existing documents

Then inserts the new list sent from client

DELETE deletes a single item by _id

All responses return:

{ data, message, ok, status }


Must use Mongoose model

Must use withDB() wrapper

Must use handleRateLimit() from ../../utils/rate-limit

✅ Model Rules

Every item includes:

name: string (required)
path?: string
icon?: string
image?: string
svg?: string
description?: string
childData?: Array<childSchema>


childData follows:

name: string (required)
path?: string
icon?: string
image?: string
svg?: string
description?: string

✅ Example Reference (Do NOT rewrite, just follow logic)

I am providing the completed "about" API as reference (structure must match):
https://pastebin.com/raw/Z9D8U8Mg

🎯 Your Task

Generate the FULL code for the following sections, using the SAME API logic & schema pattern as the "about" API:

1. career
2. career-path
3. contact
4. course
5. faq
6. ielts
7. our-team
8. private-batch-addmission
9. real-mock-test
10. seminar
11. study-materials
12. success-story


For each section, create:

app/api/site-setting/<section>/model.ts
app/api/site-setting/<section>/controller.ts
app/api/site-setting/<section>/route.ts

⚠️ Rules to Follow:

Replace only the model name and MongoDB collection name for each section.

Keep file structure, function names, logic, and CRUD format unchanged.

Make sure the model interface name, Mongoose model name & collection name all match the section name in PascalCase.

Make sure controller function names also match the section name, for example:

createCareer, getCareer, updateCareer, deleteCareer

DO NOT shorten code

DO NOT skip any files

DO NOT modify logic

Provide the output grouped by section, like:

### career
// route.ts
// controller.ts
// model.ts

### career-path
// route.ts
// controller.ts
// model.ts
...