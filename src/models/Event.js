import { model, models, Schema } from "mongoose";

const EventSchema = new Schema({
  type: String, // click or view
  page: String, // for example "dawid"
  uri: String, // /dawid | https://
  title: String, // stores the title of the link (important for deleted links)
  deviceInfo: {
    userAgent: String,
    deviceType: String, // mobile, tablet, desktop
    browser: String, // chrome, firefox, safari, etc.
    os: String, // windows, macos, android, ios, etc.
    isMobile: Boolean,
  }
}, { timestamps: true });

export const Event = models?.Event || model('Event', EventSchema);
