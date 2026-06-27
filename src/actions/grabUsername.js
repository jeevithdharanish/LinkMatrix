'use server';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/mongoClient";
import { getServerSession } from "next-auth";
import { Page } from '@/models/Page';

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

  // Atomic upsert — race-safe username claim
  // The unique index on `owner` (in the Page schema) enforces one-page-per-user
  // at the DB level, so the separate findOne check is no longer needed.
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
    // Only treat code 11000 (duplicate key) as a known conflict
    if (error.code === 11000) {
      // Determine which key caused the conflict
      const keyPattern = error.keyPattern || {};
      if (keyPattern.owner) {
        return { success: false, message: 'You already have a page.' };
      }
      if (keyPattern.uri) {
        return { success: false, message: 'Username is already taken.' };
      }
      // Fallback for duplicate key with unknown field
      return { success: false, message: 'Username is already taken.' };
    }
    console.error('Error claiming username:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}