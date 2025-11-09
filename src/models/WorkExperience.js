import { model, models, Schema } from "mongoose";

const WorkExperienceSchema = new Schema({
  company: { type: String, default: '' },
  role: { type: String, default: '' },
  start: { type: String, default: '' },
  end: { type: String, default: '' },
  bullets: { type: [String], default: [] },
  
  // Links to the user and their page
  owner: { type: String, required: true },
  pageUri: { type: String, required: true },
}, { timestamps: true });

export const WorkExperience = models?.WorkExperience || model('WorkExperience', WorkExperienceSchema);