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

const EducationSchema = new Schema({
  school: { type: String, default: "" },
  degree: { type: String, default: "" },
  start: { type: String, default: "" },
  end: { type: String, default: "" },
  description: { type: String, default: "" },
}, { _id: false });

const PageSchema = new Schema({
  uri: { type: String, required: true, min: 1, unique: true },
  owner: { type: String, required: true },
  displayName: { type: String, default: "" },
  location: { type: String, default: "" },
  bio: { type: String, default: "" },
  bgType: { type: String, default: "color" },
  bgColor: { type: String, default: "#000" },
  bgImage: { type: String, default: "" },
  buttons: { type: Object, default: {} },
  links: { type: Object, default: [] },

  // 🆕 Added Education section
  education: {
    type: [EducationSchema],
    default: [],
  },

}, { timestamps: true });

export const Page = models?.Page || model("Page", PageSchema);
