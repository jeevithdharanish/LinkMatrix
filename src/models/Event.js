import { model, models, Schema } from "mongoose";

const EventSchema = new Schema({
  type: { type: String, enum: ['view', 'click'], required: true },
  page: { type: String, required: true },
  uri: { type: String, required: true },
  
  // Add 'project' to the enum list
  clickType: { 
    type: String, 
    enum: ['link', 'social', 'project'], // Now supports all 3 types
    default: 'link' 
  }, 

}, { timestamps: true });

export const Event = models?.Event || model('Event', EventSchema);