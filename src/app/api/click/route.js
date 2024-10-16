import { Event } from '@/models/Event';
import { Page } from '@/models/page';
import mongoose from "mongoose";

export async function POST(req) {
  await mongoose.connect(process.env.MONGO_URI);
  
  const url = new URL(req.url);
  const clickedLink = atob(url.searchParams.get('url'));
  const pageUri = url.searchParams.get('page');

  // Find the page
  const page = await Page.findOne({ uri: pageUri });

  // Find the link in the page's links array
  const clickedLinkData = page.links.find(link => link.url === clickedLink);

  // Use the title if found, otherwise use "Deleted Link"
  const linkTitle = clickedLinkData ? clickedLinkData.title : "Deleted Link";

  // Save the event with the title
  await Event.create({
    type: 'click',
    uri: clickedLink,
    page: pageUri,
    title: linkTitle,  // Save the title for deleted links
  });

  return Response.json(true);
}
