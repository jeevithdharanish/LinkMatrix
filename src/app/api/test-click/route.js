import { Event } from '@/models/Event';
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Create a test event
    const testEvent = await Event.create({
      type: 'click',
      uri: 'https://test.com',
      page: 'test-page',
      title: 'Test Link',
      deviceInfo: {
        userAgent: 'Test User Agent',
        deviceType: 'desktop',
        browser: 'chrome',
        os: 'windows',
        isMobile: false
      }
    });

    console.log('Test event created:', testEvent);
    
    return Response.json({ success: true, event: testEvent });
  } catch (error) {
    console.error('Test click error:', error);
    return Response.json({ success: false, error: error.message });
  }
}