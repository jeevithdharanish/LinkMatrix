import { model, models, Schema } from "mongoose";

const DeletedLinkSchema = new Schema({
  originalLinkId: String, // Reference to original link
  title: String,
  url: String,
  icon: String,
  subtitle: String,
  pageUri: String, // Which page it belonged to
  owner: String, // Email of the owner
  deletedAt: { type: Date, default: Date.now },
  totalClicks: { type: Number, default: 0 },
}, { timestamps: true });

export const DeletedLink = models?.DeletedLink || model('DeletedLink', DeletedLinkSchema);