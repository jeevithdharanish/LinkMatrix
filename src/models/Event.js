import { model, models, Schema } from "mongoose";

const EventSchema = new Schema({
  type: { type: String, enum: ['view', 'click'], required: true },
  page: { type: String, required: true },
  uri: { type: String, required: true },
  
  // --- ADD THIS LINE ---
  clickType: { type: String, enum: ['link', 'social'] }, // Stores if it was a 'link' or 'social' click

}, { timestamps: true });

export const Event = models?.Event || model('Event', EventSchema);