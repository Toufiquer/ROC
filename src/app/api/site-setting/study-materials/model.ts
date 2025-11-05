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
export interface IStudyMaterialsItem extends Document {
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

const studyMaterialsSchema = new Schema<IStudyMaterialsItem>(
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

// export model (collection name 'study-materials')
export default (mongoose.models.StudyMaterials as mongoose.Model<IStudyMaterialsItem>) || mongoose.model<IStudyMaterialsItem>('StudyMaterials', studyMaterialsSchema, 'study-materials');
