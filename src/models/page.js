// import {model, models, Schema} from "mongoose";

// const PageSchema = new Schema({
//   uri: {type: String, required: true, min: 1, unique: true},
//   owner: {type: String, required: true},
//   displayName: {type: String, default: ''},
//   location: {type: String, default: ''},
//   bio: {type: String, default: ''},
//   bgType: {type: String, default: 'color'},
//   bgColor: {type: String, default: '#000'},
//   bgImage: {type: String, default: ''},
//   buttons: {type: Object, default: {}},
//   links: {type: Object, default: []},
// }, {timestamps: true});

// export const Page = models?.Page || model('Page', PageSchema);

import { model, models, Schema } from "mongoose";

// Skill item schema with name and proficiency
const SkillItemSchema = new Schema({
  name: { type: String, required: true },
  proficiency: { type: Number, default: 80, min: 0, max: 100 }
}, { _id: false });

// Skills category schema - each category contains an array of skills
const SkillsCategorySchema = new Schema({
  "Programming Languages": { type: [SkillItemSchema], default: [] },
  "Frontend Development": { type: [SkillItemSchema], default: [] },
  "Backend Development": { type: [SkillItemSchema], default: [] },
  "Tools & Technologies": { type: [SkillItemSchema], default: [] },
}, { _id: false, strict: false }); // strict: false allows additional categories

const PageSchema = new Schema({
  uri: { type: String, required: true, min: 1, unique: true },
  owner: { type: String, required: true },
  displayName: { type: String, default: "" },
  location: { type: String, default: "" },
  bio: { type: String, default: "" },
  bgType: { type: String, default: "color" },
  bgColor: { type: String, default: "#000" },
  bgImage: { type: String, default: "" },
  profileImage: { type: String, default: "" },
  buttons: { type: Object, default: {} },
  links: { type: Object, default: [] },
  // Categorized skills with proficiency
  // Format: { "Category Name": [{ name: "Skill", proficiency: 80 }, ...] }
  skills: { 
    type: Schema.Types.Mixed, 
    default: {} 
  },
  summary: { type: String, default: "" }

}, { timestamps: true });

// Use existing model or create new one (prevents OverwriteModelError)
export const Page = models?.Page || model("Page", PageSchema);
