'use server';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/libs/mongoClient";
import { getServerSession } from "next-auth";
import { Page } from '@/models/page';

export default async function grabUsername({ username }) {
  await connectToDatabase();

  // Validate username format
  if (!username || typeof username !== 'string') {
    return { success: false, message: 'Username is required.' };
  }

  const trimmed = username.trim().toLowerCase();

  if (!/^[a-z0-9_-]{3,30}$/.test(trimmed)) {
    return { success: false, message: 'Username must be 3-30 characters, lowercase alphanumeric, hyphens, or underscores only.' };
  }

  // Auth check BEFORE creating anything
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { success: false, message: 'You must be logged in.' };
  }

  // Check if username is already taken
  const existingPageDoc = await Page.findOne({ uri: trimmed });
  if (existingPageDoc) {
    return false;
  }

  // Check if user already has a page
  const existingUserPage = await Page.findOne({ owner: session.user.email });
  if (existingUserPage) {
    return { success: false, message: 'You already have a page.' };
  }

  const newPage = await Page.create({
    uri: trimmed,
    owner: session.user.email,
  });

  return { success: true, uri: newPage.uri };
}