'use server';
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {Page} from "@/models/page";
import {DeletedLink} from "@/models/DeletedLink";
import {Event} from "@/models/Event";
import {User} from "@/models/User";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";
import { Education } from "@/models/Education";
import { WorkExperience } from "@/models/WorkExperience";
import { Project } from "@/models/Project";

export async function savePageSettings(formData) {
  mongoose.connect(process.env.MONGO_URI);
  const session = await getServerSession(authOptions);
  if (!session) {
    return { success: false, message: 'Unauthorized' };
  }

  // ### FIX 1: Added try...catch and {success: ...} response ###
  try {
    const dataKeys = [
      'displayName','location',
      'bio', 'bgType', 'bgColor', 'bgImage',
    ];

    const dataToUpdate = {};
    for (const key of dataKeys) {
      if (formData.has(key)) {
        dataToUpdate[key] = formData.get(key);
      }
    }

    await Page.updateOne(
      {owner:session?.user?.email},
      dataToUpdate,
    );

    if (formData.has('avatar')) {
      const avatarLink = formData.get('avatar');
      await User.updateOne(
        {email: session.user?.email},
        {image: avatarLink},
      );
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving settings:', error);
    return { success: false, message: error.message };
  }
}

export async function savePageButtons(formData) {
  mongoose.connect(process.env.MONGO_URI);
  const session = await getServerSession(authOptions);
  if (!session) {
    return { success: false, message: 'Unauthorized' };
  }

  // ### FIX 1: Added try...catch and {success: ...} response ###
  try {
    const buttonsValues = {};
    formData.forEach((value, key) => {
      buttonsValues[key] = value;
    });
    const dataToUpdate = {buttons:buttonsValues};
    await Page.updateOne(
      {owner:session?.user?.email},
      dataToUpdate,
    );
    return { success: true };
  } catch (error) {
    console.error('Error saving buttons:', error);
    return { success: false, message: error.message };
  }
}

export async function savePageLinks(links) {
  mongoose.connect(process.env.MONGO_URI);
  const session = await getServerSession(authOptions);
  if (!session) {
    return { success: false, message: 'Unauthorized' };
  }
  
  try {
    const page = await Page.findOne({owner: session?.user?.email});
    const currentLinks = page.links || [];
    
    // Find deleted links
    const newLinkUrls = links.map(link => link.url);
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
    const restoredLinks = links.filter(link => !currentLinkUrls.includes(link.url));
    
    for (const restoredLink of restoredLinks) {
      await DeletedLink.deleteMany({
        url: restoredLink.url,
        pageUri: page.uri,
        owner: session.user.email
      });
    }
    
    // Update page with new links
    await Page.updateOne(
      {owner:session?.user?.email},
      {links},
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error saving links:', error);
    return { success: false, message: error.message };
  }
}

export async function savePageEducation(uri, educationData) {
  await mongoose.connect(process.env.MONGO_URI);
  
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  const userEmail = session.user.email;

  if (!uri || !Array.isArray(educationData)) {
    throw new Error('Invalid data provided.');
  }

  try {
    await Education.deleteMany({
      owner: userEmail,
      pageUri: uri,
    });

    // ### FIX 2: Be explicit about which fields to save ###
    // This prevents saving temporary client-side props like 'id'
    const educationDocsToInsert = educationData.map(eduItem => ({
      school: eduItem.school,
      degree: eduItem.degree,
      start: eduItem.start,
      end: eduItem.end,
      cgpa: eduItem.cgpa || '',
      description: eduItem.description,
      owner: userEmail,
      pageUri: uri,
    }));

    if (educationDocsToInsert.length > 0) {
      await Education.insertMany(educationDocsToInsert);
    }

    return { success: true };

  } catch (error) {
    console.error('Error saving education:', error);
    return { success: false, message: error.message };
  }
}

// Updated to support categorized skills with proficiency
export async function savePageSkills(uri, skillsData) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, message: 'Unauthorized. Please log in.' };
    }

    console.log("=== savePageSkills DEBUG ===");
    console.log("URI:", uri);
    console.log("Session email:", session.user.email);
    console.log("Skills data received:", JSON.stringify(skillsData, null, 2));

    // Support both old format (array of strings) and new format (categorized object)
    if (!uri) {
      return { success: false, message: 'URI is required.' };
    }

    // Validate the skills data structure
    if (skillsData === null || skillsData === undefined) {
      return { success: false, message: 'Invalid skills data format.' };
    }

    // Find and update the page by owner email (more reliable than uri match)
    const result = await Page.updateOne(
      { owner: session.user.email },
      { $set: { skills: skillsData } }
    );

    console.log("Update result:", JSON.stringify(result, null, 2));

    if (result.matchedCount === 0) {
      return { success: false, message: 'Page not found or permission denied.' };
    }

    // Verify the save
    const verifyPage = await Page.findOne({ owner: session.user.email });
    console.log("Verified skills in DB:", JSON.stringify(verifyPage?.skills, null, 2));

    return { success: true };

  } catch (error) {
    console.error('Error saving skills:', error);
    return { success: false, message: error.message };
  }
}

// This function is correct
export async function savePageWorkExperience(uri, workData) {
  await mongoose.connect(process.env.MONGO_URI);
  
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error('Unauthorized');
  }
  const userEmail = session.user.email;

  if (!uri || !Array.isArray(workData)) {
    throw new Error('Invalid data provided.');
  }

  try {
    await WorkExperience.deleteMany({
      owner: userEmail,
      pageUri: uri,
    });

    const workDocsToInsert = workData.map(item => ({
      company: item.company,
      role: item.role,
      start: item.start,
      end: item.end,
      bullets: item.bullets || [],
      owner: userEmail,
      pageUri: uri,
    }));

    if (workDocsToInsert.length > 0) {
      await WorkExperience.insertMany(workDocsToInsert);
    }

    return { success: true };

  } catch (error) {
    console.error('Error saving work experience:', error);
    return { success: false, message: error.message };
  }
}

// This function is correct
export async function savePageSummary(uri, summary) {
  await mongoose.connect(process.env.MONGO_URI);
  
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error('Unauthorized');
  }

  if (!uri || typeof summary !== 'string') {
    throw new Error('Invalid data');
  }

  try {
    const result = await Page.updateOne(
      { owner: session.user.email, uri: uri },
      { $set: { summary: summary } }
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
  await mongoose.connect(process.env.MONGO_URI);
  
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error('Unauthorized');
  }
  const userEmail = session.user.email;

  if (!uri || !Array.isArray(projectData)) {
    throw new Error('Invalid data provided.');
  }

  try {
    // 1. Delete all existing projects for this user and page
    await Project.deleteMany({
      owner: userEmail,
      pageUri: uri,
    });

    // 2. Prepare new entries
    const projectDocsToInsert = projectData.map(item => ({
      title: item.title,
      techStacks: item.techStacks,
      timeTaken: item.timeTaken,
      summary: item.summary,
      githubLink: item.githubLink, // <-- ADD THIS
      liveLink: item.liveLink,     // <-- ADD THIS
      owner: userEmail,
      pageUri: uri,
    }));

    // 3. Insert all new entries
    if (projectDocsToInsert.length > 0) {
      await Project.insertMany(projectDocsToInsert);
    }

    return { success: true };

  } catch (error) {
    console.error('Error saving projects:', error);
    return { success: false, message: error.message };
  }
}