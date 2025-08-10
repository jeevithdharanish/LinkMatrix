'use server';
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {Page} from "@/models/page";
import {DeletedLink} from "@/models/DeletedLink";
import {Event} from "@/models/Event";
import {User} from "@/models/User";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";

export async function savePageSettings(formData) {
  mongoose.connect(process.env.MONGO_URI);
  const session = await getServerSession(authOptions);
  if (session) {
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

    return true;
  }

  return false;
}

export async function savePageButtons(formData) {
  mongoose.connect(process.env.MONGO_URI);
  const session = await getServerSession(authOptions);
  if (session) {
    const buttonsValues = {};
    formData.forEach((value, key) => {
      buttonsValues[key] = value;
    });
    const dataToUpdate = {buttons:buttonsValues};
    await Page.updateOne(
      {owner:session?.user?.email},
      dataToUpdate,
    );
    return true;
  }
  return false;
}

export async function savePageLinks(links) {
  mongoose.connect(process.env.MONGO_URI);
  const session = await getServerSession(authOptions);
  if (session) {
    const page = await Page.findOne({owner: session?.user?.email});
    const currentLinks = page.links || [];
    
    // Find deleted links (links that were in currentLinks but not in new links)
    const newLinkUrls = links.map(link => link.url);
    const deletedLinks = currentLinks.filter(link => !newLinkUrls.includes(link.url));
    
    // Store deleted links in DeletedLink collection
    for (const deletedLink of deletedLinks) {
      // Count total clicks for this link up to now
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
    
    // Check if any new links were previously deleted and remove them from DeletedLink collection
    const currentLinkUrls = currentLinks.map(link => link.url);
    const restoredLinks = links.filter(link => !currentLinkUrls.includes(link.url));
    
    for (const restoredLink of restoredLinks) {
      // Remove from DeletedLink collection if it was previously deleted
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
    
    return true;
  } else {
    return false;
  }
}
