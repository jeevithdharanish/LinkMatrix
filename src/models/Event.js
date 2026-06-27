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

  // Visitor insight fields — captured from request headers since June 2026.
  // Older events simply lack these and are excluded from visitor-level analytics.
  referrer: { type: String, default: '' },     // raw Referer header of the view
  visitorHash: { type: String, default: '' },  // salted hash of ip+userAgent — anonymous visitor id
  country: { type: String, default: '' },      // ISO country code from edge geo headers
  city: { type: String, default: '' },
  userAgent: { type: String, default: '' },
  isOwner: { type: Boolean, default: false },  // logged-in page owner's own visit — excluded from stats

}, { timestamps: true });

export const Event = models?.Event || model('Event', EventSchema);
