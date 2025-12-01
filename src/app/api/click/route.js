// import { Event } from '@/models/Event';
// import { Page } from '@/models/page';
// import mongoose from "mongoose";

// function parseUserAgent(userAgent) {
//   const ua = userAgent.toLowerCase();
  
//   // Detect device type
//   let deviceType = 'desktop';
//   let isMobile = false;
  
//   if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
//     deviceType = 'mobile';
//     isMobile = true;
//   } else if (/tablet|ipad/i.test(ua)) {
//     deviceType = 'tablet';
//   }
  
//   // Detect browser - more specific detection
//   let browser = 'unknown';
//   if (ua.includes('edg/') || ua.includes('edge/')) {
//     browser = 'edge';
//   } else if (ua.includes('chrome/') && !ua.includes('chromium')) {
//     browser = 'chrome';
//   } else if (ua.includes('firefox/')) {
//     browser = 'firefox';
//   } else if (ua.includes('safari/') && !ua.includes('chrome')) {
//     browser = 'safari';
//   } else if (ua.includes('opera/') || ua.includes('opr/')) {
//     browser = 'opera';
//   }
  
//   // Detect OS
//   let os = 'unknown';
//   if (ua.includes('windows nt')) {
//     os = 'windows';
//   } else if (ua.includes('mac os x') || ua.includes('macos')) {
//     os = 'macos';
//   } else if (ua.includes('android')) {
//     os = 'android';
//   } else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) {
//     os = 'ios';
//   } else if (ua.includes('linux') && !ua.includes('android')) {
//     os = 'linux';
//   }
  
//   return { deviceType, browser, os, isMobile };
// }

// export async function POST(req) {
//   await mongoose.connect(process.env.MONGO_URI);
  
//   const url = new URL(req.url);
//   const clickedLink = atob(url.searchParams.get('url'));
//   const pageUri = url.searchParams.get('page');
  
//   // Get user agent from headers
//   const userAgent = req.headers.get('user-agent') || '';
//   const deviceInfo = parseUserAgent(userAgent);

//   console.log('Device Info:', deviceInfo); // Debug log
//   console.log('User Agent:', userAgent); // Debug log

//   // Find the page
//   const page = await Page.findOne({ uri: pageUri });

//   // Find the link in the page's links array
//   const clickedLinkData = page.links.find(link => link.url === clickedLink);

//   // Use the title if found, otherwise use "Deleted Link"
//   const linkTitle = clickedLinkData ? clickedLinkData.title : "Deleted Link";

//   // Save the event with device info
//   const event = await Event.create({
//     type: 'click',
//     uri: clickedLink,
//     page: pageUri,
//     title: linkTitle,
//     deviceInfo: {
//       userAgent,
//       deviceType: deviceInfo.deviceType,
//       browser: deviceInfo.browser,
//       os: deviceInfo.os,
//       isMobile: deviceInfo.isMobile
//     }
//   });

//   console.log('Created event:', event); // Debug log

//   return Response.json(true);
// }
import { Event } from "@/models/Event";
import { connectToDatabase } from "@/libs/mongoClient";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  const page = searchParams.get('page');
  
  // --- READ THE NEW PARAM ---
  // Default to 'link' if not specified
  const clickType = searchParams.get('clickType') || 'link'; 

  if (!url || !page) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
  }

  try {
    // --- SAVE THE NEW FIELD ---
    await Event.create({
      type: 'click',
      page: page,
      uri: atob(url),     // Decode the URL
      clickType: clickType, // Save the click type
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}