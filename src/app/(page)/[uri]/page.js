import { Page } from "@/models/page";
import { User } from "@/models/User";
import { WorkExperience } from "@/models/WorkExperience";
import { Education } from "@/models/Education";
import mongoose from "mongoose";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiscord, faFacebook, faGithub, faInstagram, faTelegram,
  faTiktok, faWhatsapp, faYoutube, faLinkedin
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faLink, faLocationDot, faMobile, faFileAlt, faCode } from "@fortawesome/free-solid-svg-icons";
import { btoa } from "next/dist/compiled/@edge-runtime/primitives";
import SummarySection from "@/components/profile/SummarySection";
import SkillsSection from "@/components/profile/SkillsSection";
import WorkExperienceSection from "@/components/profile/WorkExperienceSection";
import EducationSection from "@/components/profile/EducationSection";

export const buttonsIcons = {
  email: faEnvelope,
  mobile: faMobile,
  instagram: faInstagram,
  facebook: faFacebook,
  linkedin: faLinkedin,
  youtube: faYoutube,
  github: faGithub,
  geeksforgeeks: faCode,
  resume: faFileAlt,
  discord: faDiscord,
  tiktok: faTiktok,
  whatsapp: faWhatsapp,
  telegram: faTelegram,
};

function buttonLink(key, value) {
  if (key === 'mobile') return 'tel:' + value;
  if (key === 'email') return 'mailto:' + value;
  return value;
}

export default async function UserPage({ params }) {
  const uri = params.uri;
  const baseUrl = process.env.URL || "";

  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // 1. Fetch Page and User (using .lean() for plain objects)
    const pageData = await Page.findOne({ uri }).lean(); // Renamed to pageData

    if (!pageData) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
            <p className="text-gray-600">This link does not exist.</p>
          </div>
        </div>
      );
    }

    // 2. Fetch all other data in parallel
    const [userData, workExperience, education] = await Promise.all([
      User.findOne({ email: pageData.owner }).lean(), // Use pageData.owner
      WorkExperience.find({ owner: pageData.owner, pageUri: uri }).lean(),
      Education.find({ owner: pageData.owner, pageUri: uri }).lean(),
    ]);
    
    // --- This is where the bug was. No need to re-parse what is already lean ---
    // const pageData = JSON.parse(JSON.stringify(pageDoc)); // REMOVED
    // const userData = JSON.parse(JSON.stringify(userDoc)); // REMOVED

    // Sort buttons for consistency
    const sortedButtons = Object.keys(pageData.buttons || {})
      .sort()
      .reduce((obj, key) => {
        obj[key] = pageData.buttons[key];
        return obj;
      }, {});
    pageData.buttons = sortedButtons;

    const backgroundStyle =
      pageData.bgType === "color"
        ? { backgroundColor: pageData.bgColor }
        : { backgroundImage: `url(${pageData.bgImage})` };

    return (
      <div className="bg-gray-100 text-gray-900 min-h-screen">
        
        {/* === HERO SECTION === */}
        <div className="relative overflow-hidden mb-[-5rem] md:mb-[-6rem]">
          <div
            className="h-48 md:h-64 bg-gray-400 bg-cover bg-center relative"
            style={backgroundStyle}
          >
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
        </div>

        {/* === CONTENT WRAPPER === */}
        <div className="relative max-w-6xl mx-auto px-4 pb-8 lg:px-8">
            
            {/* === Profile Info Card === */}
            <div className="text-center bg-white rounded-xl shadow-lg p-6 pt-0 md:pt-6 -mt-20 md:-mt-24 mb-8">
              
              <div className="relative -mt-20 md:-mt-24 flex justify-center mb-4">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white">
                  <Image
                    className="w-full h-full object-cover"
                    src={userData.image}
                    alt={`${pageData.displayName}'s avatar`}
                    width={128}
                    height={128}
                    priority
                  />
                </div>
              </div>

              <h1 className="text-3xl font-bold mb-2 text-gray-900">
                {pageData.displayName}
              </h1>
              {pageData.location && (
                <div className="flex items-center justify-center gap-2 text-gray-600 mb-3">
                  <FontAwesomeIcon icon={faLocationDot} className="w-4 h-4" />
                  <span className="text-lg">{pageData.location}</span>
                </div>
              )}
              {pageData.bio && (
                <div className="max-w-xl mx-auto mb-6">
                  <p className="text-gray-700 leading-relaxed">{pageData.bio}</p>
                </div>
              )}

              {/* === SOCIAL BUTTONS (UPDATED) === */}
              {Object.keys(pageData.buttons || {}).length > 0 && (
                <div className="flex flex-wrap gap-3 justify-center mb-8">
                  {Object.keys(pageData.buttons).map((buttonKey) => {
                    const url = buttonLink(buttonKey, pageData.buttons[buttonKey]);
                    
                    // --- THIS IS THE CHANGE ---
                    const pingUrl = `${baseUrl}api/click?url=${btoa(url)}&page=${pageData.uri}&clickType=social`;
                    
                    return (
                      <Link
                        key={buttonKey}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        ping={pingUrl} // <-- Updated ping URL
                        className="w-12 h-12 rounded-full bg-white text-gray-700 shadow-md flex items-center justify-center hover:bg-gray-200 hover:scale-110 transition-all duration-300"
                        aria-label={buttonKey}
                      >
                        <FontAwesomeIcon
                          className="w-5 h-5"
                          icon={buttonsIcons[buttonKey]}
                        />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* === TWO-COLUMN LAYOUT WRAPPER === */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* === MAIN CONTENT (LEFT COLUMN) === */}
                <div className="md:col-span-2 space-y-8">
                    <SummarySection summary={pageData.summary} />
                    <WorkExperienceSection workExperience={workExperience} />
                    <EducationSection education={education} />
                </div>

                {/* === SIDEBAR (RIGHT COLUMN) === */}
                <div className="md:col-span-1 space-y-8">
                    {/* Links Section (UPDATED) */}
                    <div className="w-full">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Links</h2>
                        <div className="space-y-4">
                            {(pageData.links || []).map((link, index) => (
                            <Link
                                key={`${link.url}-${index}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                // --- THIS IS THE CHANGE ---
                                ping={`${baseUrl}api/click?url=${btoa(link.url)}&page=${pageData.uri}&clickType=link`}
                                className="group block bg-white rounded-2xl p-4 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                                href={link.url}
                            >
                              <div className="flex items-center gap-4">
                                <div className="flex-shrink-0 w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                                  {link.icon ? (
                                    <Image
                                      className="w-full h-full object-cover rounded-xl"
                                      src={link.icon}
                                      alt={`${link.title} icon`}
                                      width={56}
                                      height={56}
                                    />
                                  ) : (
                                    <FontAwesomeIcon
                                      icon={faLink}
                                      className="w-6 h-6 text-gray-500"
                                    />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-gray-800 text-lg mb-1 truncate">
                                    {link.title}
                                  </h3>
                                  {link.subtitle && (
                                    <p className="text-gray-500 text-sm truncate">
                                      {link.subtitle}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </Link>
                            ))}
                        </div>
                    </div>
                    
                    {/* Skills Section */}
                    <SkillsSection skills={pageData.skills} />
                </div>
                
            </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading page:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-800">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
          <p className="text-red-600">Please try again later.</p>
        </div>
      </div>
    );
  }
}