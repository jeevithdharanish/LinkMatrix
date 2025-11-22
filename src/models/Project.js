import { model, models, Schema } from "mongoose";

const ProjectSchema = new Schema({
  title: { type: String, default: '' },
  techStacks: { type: String, default: '' }, 
  timeTaken: { type: String, default: '' },
  summary: { type: String, default: '' },

  // --- ADD THESE TWO LINES ---
  githubLink: { type: String, default: '' },
  liveLink: { type: String, default: '' },
  
  // Links to the user and their page
  owner: { type: String, required: true },
  pageUri: { type: String, required: true },
}, { timestamps: true });

export const Project = models?.Project || model('Project', ProjectSchema);