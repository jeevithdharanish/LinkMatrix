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

  // Check if user already has a page
  const existingUserPage = await Page.findOne({ owner: session.user.email });
  if (existingUserPage) {
    return { success: false, message: 'You already have a page.' };
  }

  // Atomic upsert — race-safe username claim
  try {
    const existing = await Page.findOneAndUpdate(
      { uri: trimmed },
      { $setOnInsert: { uri: trimmed, owner: session.user.email } },
      { upsert: true, new: false }
    );

    // If existing is not null, a doc with this uri already existed → taken
    if (existing) {
      return { success: false, message: 'Username is already taken.' };
    }

    return { success: true, uri: trimmed };
  } catch (error) {
    // Handle duplicate key race (E11000)
    if (error.code === 11000 || error.name === 'MongoServerError') {
      return { success: false, message: 'Username is already taken.' };
    }
    console.error('Error claiming username:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}