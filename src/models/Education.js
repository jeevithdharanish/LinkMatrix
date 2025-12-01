// models/Education.js
import { model, models, Schema } from "mongoose";

const EducationSchema = new Schema({
  school: { type: String, default: '' },
  degree: { type: String, default: '' },
  start: { type: String, default: '' },
  end: { type: String, default: '' },
  cgpa: { type: String, default: '' }, // CGPA or GPA
  description: { type: String, default: '' },
  owner: { type: String, required: true }, // The email of the user who owns this entry
  pageUri: { type: String, required: true }, // The 'uri' of the page this links to
}, { timestamps: true });

export const Education = models?.Education || model('Education', EducationSchema);