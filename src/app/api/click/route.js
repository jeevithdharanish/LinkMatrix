import { Event } from "@/models/Event";
import { connectToDatabase } from "@/libs/mongoClient";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  const page = searchParams.get('page');
  const clickType = searchParams.get('clickType') || 'link';

  if (!url || !page) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
  }

  try {
    // Decode base64 URL safely
    let decodedUrl;
    try {
      decodedUrl = atob(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL encoding' }, { status: 400 });
    }

    // Validate clickType
    const validClickTypes = ['link', 'social', 'project'];
    const safeClickType = validClickTypes.includes(clickType) ? clickType : 'link';

    await Event.create({
      type: 'click',
      page: page,
      uri: decodedUrl,
      clickType: safeClickType,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}