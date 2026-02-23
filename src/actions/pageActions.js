'use server';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Page } from "@/models/page";
import { DeletedLink } from "@/models/DeletedLink";
import { Event } from "@/models/Event";
import { User } from "@/models/User";
import { connectToDatabase } from "@/libs/mongoClient";
import { getServerSession } from "next-auth";
import { Education } from "@/models/Education";
import { WorkExperience } from "@/models/WorkExperience";
import { Project } from "@/models/Project";
import mongoose from "mongoose";

// Helper function to sanitize string input
function sanitizeString(str, maxLength = 1000) {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .slice(0, maxLength)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
}

// Helper function to sanitize URL
function sanitizeUrl(url) {
  if (typeof url !== 'string') return '';
  const trimmed = url.trim();
  // Only allow http, https, mailto, tel protocols
  if (trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('/')) {
    return trimmed.slice(0, 2000);
  }
  // If no protocol, assume https
  if (trimmed && !trimmed.includes(':')) {
    return 'https://' + trimmed.slice(0, 2000);
  }
  return '';
}

// Helper to sanitize skills data (categorized objects or arrays)
function sanitizeSkillsData(skillsData) {
  if (skillsData === null || skillsData === undefined) return {};

  // Old format: array of strings
  if (Array.isArray(skillsData)) {
    return {
      "All Skills": skillsData
        .slice(0, 50)
        .map(skill => ({
          name: sanitizeString(typeof skill === 'string' ? skill : (skill?.name || ''), 100),
          proficiency: (() => { const p = parseInt(skill?.proficiency, 10); return Math.min(100, Math.max(0, Number.isNaN(p) ? 80 : p)); })(),
        }))
        .filter(s => s.name.length > 0),
    };
  }

  // New format: { "Category Name": [{ name, proficiency }] }
  if (typeof skillsData === 'object') {
    const sanitized = {};
    const categoryKeys = Object.keys(skillsData).slice(0, 20); // max 20 categories
    for (const key of categoryKeys) {
      const safeKey = sanitizeString(key, 100);
      if (!safeKey) continue;
      const items = skillsData[key];
      if (!Array.isArray(items)) continue;
      sanitized[safeKey] = items
        .slice(0, 50)
        .map(item => ({
          name: sanitizeString(typeof item === 'string' ? item : (item?.name || ''), 100),
          proficiency: (() => { const p = parseInt(item?.proficiency, 10); return Math.min(100, Math.max(0, Number.isNaN(p) ? 80 : p)); })(),
        }))
        .filter(s => s.name.length > 0);
    }
    return sanitized;
  }

  return {};
}

export async function savePageSettings(formData) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  if (!session) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    const dataKeys = [
      'displayName', 'location',
      'bio', 'bgType', 'bgColor', 'bgImage',
    ];

    const dataToUpdate = {};
    for (const key of dataKeys) {
      if (formData.has(key)) {
        const value = formData.get(key);
        // Sanitize text inputs
        if (['displayName', 'location', 'bio'].includes(key)) {
          dataToUpdate[key] = sanitizeString(value, key === 'bio' ? 2000 : 200);
        } else if (['bgImage'].includes(key)) {
          dataToUpdate[key] = sanitizeUrl(value);
        } else {
          dataToUpdate[key] = value;
        }
      }
    }

    await Page.updateOne(
      { owner: session?.user?.email },
      dataToUpdate,
    );

    if (formData.has('avatar')) {
      const avatarLink = sanitizeUrl(formData.get('avatar'));
      if (avatarLink) {
        await User.updateOne(
          { email: session.user?.email },
          { image: avatarLink },
        );
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving settings:', error);
    return { success: false, message: error.message };
  }
}

export async function savePageButtons(formData) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  if (!session) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    const buttonsValues = {};
    formData.forEach((value, key) => {
      // Sanitize each button URL/value
      buttonsValues[key] = ['email', 'mobile'].includes(key)
        ? sanitizeString(value, 200)
        : sanitizeUrl(value);
    });
    const dataToUpdate = { buttons: buttonsValues };
    await Page.updateOne(
      { owner: session?.user?.email },
      dataToUpdate,
    );
    return { success: true };
  } catch (error) {
    console.error('Error saving buttons:', error);
    return { success: false, message: error.message };
  }
}

export async function savePageLinks(links) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  if (!session) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    const page = await Page.findOne({ owner: session?.user?.email });
    if (!page) {
      return { success: false, message: 'Page not found.' };
    }
    const currentLinks = page.links || [];

    // Sanitize incoming links
    const sanitizedLinks = links.map(link => ({
      key: sanitizeString(link.key, 100),
      title: sanitizeString(link.title, 200),
      subtitle: sanitizeString(link.subtitle, 500),
      icon: link.icon ? sanitizeUrl(link.icon) : '',
      url: sanitizeUrl(link.url),
    }));

    // Find deleted links
    const newLinkUrls = sanitizedLinks.map(link => link.url);
    const deletedLinks = currentLinks.filter(link => !newLinkUrls.includes(link.url));

    // Store deleted links
    for (const deletedLink of deletedLinks) {
      const totalClicks = await Event.countDocuments({
        uri: deletedLink.url,
        type: 'click',
        page: page.uri
      });

      await DeletedLink.create({
        originalLinkId: deletedLink.key || deletedLink._id,
        title: deletedLink.title,
        url: deletedLink.url,
        icon: deletedLink.icon,
        subtitle: deletedLink.subtitle,
        pageUri: page.uri,
        owner: session.user.email,
        totalClicks: totalClicks,
        deletedAt: new Date()
      });
    }

    // Check for restored links
    const currentLinkUrls = currentLinks.map(link => link.url);
    const restoredLinks = sanitizedLinks.filter(link => !currentLinkUrls.includes(link.url));

    for (const restoredLink of restoredLinks) {
      await DeletedLink.deleteMany({
        url: restoredLink.url,
        pageUri: page.uri,
        owner: session.user.email
      });
    }

    // Update page with sanitized links
    await Page.updateOne(
      { owner: session?.user?.email },
      { links: sanitizedLinks },
    );

    return { success: true };
  } catch (error) {
    console.error('Error saving links:', error);
    return { success: false, message: error.message };
  }
}

export async function savePageEducation(uri, educationData) {
  await connectToDatabase();

  const session = await getServerSession(authOptions);
  if (!session) {
    return { success: false, message: 'Unauthorized' };
  }

  const userEmail = session.user.email;

  if (!uri || !Array.isArray(educationData)) {
    return { success: false, message: 'Invalid data provided.' };
  }

  const dbSession = await mongoose.startSession();
  try {
    dbSession.startTransaction();

    await Education.deleteMany({
      owner: userEmail,
      pageUri: uri,
    }, { session: dbSession });

    const educationDocsToInsert = educationData.map(eduItem => ({
      school: sanitizeString(eduItem.school, 200),
      degree: sanitizeString(eduItem.degree, 200),
      start: sanitizeString(eduItem.start, 50),
      end: sanitizeString(eduItem.end, 50),
      cgpa: sanitizeString(eduItem.cgpa || '', 20),
      description: sanitizeString(eduItem.description, 2000),
      owner: userEmail,
      pageUri: uri,
    }));

    if (educationDocsToInsert.length > 0) {
      await Education.insertMany(educationDocsToInsert, { session: dbSession });
    }

    await dbSession.commitTransaction();
    return { success: true };

  } catch (error) {
    await dbSession.abortTransaction();
    console.error('Error saving education:', error);
    return { success: false, message: error.message };
  } finally {
    dbSession.endSession();
  }
}

// Updated to support categorized skills with proficiency
export async function savePageSkills(uri, skillsData) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, message: 'Unauthorized. Please log in.' };
    }

    if (!uri) {
      return { success: false, message: 'URI is required.' };
    }

    if (skillsData === null || skillsData === undefined) {
      return { success: false, message: 'Invalid skills data format.' };
    }

    // Sanitize skills data before persisting
    const sanitizedSkills = sanitizeSkillsData(skillsData);

    const result = await Page.updateOne(
      { owner: session.user.email, uri: uri },
      { $set: { skills: sanitizedSkills } }
    );

    if (result.matchedCount === 0) {
      return { success: false, message: 'Page not found or permission denied.' };
    }

    return { success: true };

  } catch (error) {
    console.error('Error saving skills:', error);
    return { success: false, message: error.message };
  }
}

export async function savePageWorkExperience(uri, workData) {
  await connectToDatabase();

  const session = await getServerSession(authOptions);
  if (!session) {
    return { success: false, message: 'Unauthorized' };
  }
  const userEmail = session.user.email;

  if (!uri || !Array.isArray(workData)) {
    return { success: false, message: 'Invalid data provided.' };
  }

  const dbSession = await mongoose.startSession();
  try {
    dbSession.startTransaction();

    await WorkExperience.deleteMany({
      owner: userEmail,
      pageUri: uri,
    }, { session: dbSession });

    const workDocsToInsert = workData.map(item => ({
      company: sanitizeString(item.company, 200),
      role: sanitizeString(item.role, 200),
      start: sanitizeString(item.start, 50),
      end: sanitizeString(item.end, 50),
      bullets: (item.bullets || []).map(b => sanitizeString(b, 500)).slice(0, 20),
      owner: userEmail,
      pageUri: uri,
    }));

    if (workDocsToInsert.length > 0) {
      await WorkExperience.insertMany(workDocsToInsert, { session: dbSession });
    }

    await dbSession.commitTransaction();
    return { success: true };

  } catch (error) {
    await dbSession.abortTransaction();
    console.error('Error saving work experience:', error);
    return { success: false, message: error.message };
  } finally {
    dbSession.endSession();
  }
}

export async function savePageSummary(uri, summary) {
  await connectToDatabase();

  const session = await getServerSession(authOptions);
  if (!session) {
    return { success: false, message: 'Unauthorized' };
  }

  if (!uri || typeof summary !== 'string') {
    return { success: false, message: 'Invalid data' };
  }

  try {
    const sanitizedSummary = sanitizeString(summary, 5000);

    const result = await Page.updateOne(
      { owner: session.user.email, uri: uri },
      { $set: { summary: sanitizedSummary } }
    );

    if (result.matchedCount === 0) {
      return { success: false, message: 'Page not found' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving summary:', error);
    return { success: false, message: error.message };
  }
}

export async function savePageProject(uri, projectData) {
  await connectToDatabase();

  const session = await getServerSession(authOptions);
  if (!session) {
    return { success: false, message: 'Unauthorized' };
  }
  const userEmail = session.user.email;

  if (!uri || !Array.isArray(projectData)) {
    return { success: false, message: 'Invalid data provided.' };
  }

  const dbSession = await mongoose.startSession();
  try {
    dbSession.startTransaction();

    await Project.deleteMany({
      owner: userEmail,
      pageUri: uri,
    }, { session: dbSession });

    const projectDocsToInsert = projectData.map(item => ({
      title: sanitizeString(item.title, 200),
      techStacks: sanitizeString(item.techStacks, 500),
      timeTaken: sanitizeString(item.timeTaken, 100),
      summary: sanitizeString(item.summary, 3000),
      githubLink: sanitizeUrl(item.githubLink),
      liveLink: sanitizeUrl(item.liveLink),
      owner: userEmail,
      pageUri: uri,
    }));

    if (projectDocsToInsert.length > 0) {
      await Project.insertMany(projectDocsToInsert, { session: dbSession });
    }

    await dbSession.commitTransaction();
    return { success: true };

  } catch (error) {
    await dbSession.abortTransaction();
    console.error('Error saving projects:', error);
    return { success: false, message: error.message };
  } finally {
    dbSession.endSession();
  }
}
