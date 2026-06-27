import { Event } from "@/models/Event";
import { Page } from "@/models/Page";
import { connectToDatabase } from "@/lib/mongoClient";
import { getVisitorMeta, isBot } from "@/lib/track";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
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

    const visitorMeta = getVisitorMeta(req.headers);
    if (isBot(visitorMeta.userAgent)) {
      return NextResponse.json({ success: true });
    }

    // Flag the owner's own clicks so analytics can exclude them
    const [session, pageDoc] = await Promise.all([
      getServerSession(authOptions).catch(() => null),
      Page.findOne({ uri: page }).select('owner').lean(),
    ]);
    const isOwner = !!session?.user?.email && session.user.email === pageDoc?.owner;

    await Event.create({
      type: 'click',
      page: page,
      uri: decodedUrl,
      clickType: safeClickType,
      ...visitorMeta,
      isOwner,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
