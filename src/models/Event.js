import { model, models, Schema } from "mongoose";

const EventSchema = new Schema({
  type: String, // click or view
  page: String, // for example "dawid"
  uri: String, // /dawid | https://
  title: String, // stores the title of the link (important for deleted links)
}, { timestamps: true });

export const Event = models?.Event || model('Event', EventSchema);
