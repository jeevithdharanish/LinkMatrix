import { Page } from "@/models/page";
import { User } from "@/models/User";
import mongoose from "mongoose";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiscord,
  faFacebook,
  faGithub,
  faInstagram,
  faTelegram,
  faTiktok,
  faWhatsapp,
  faYoutube,
  faLinkedin
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faLink, faLocationDot, faMobile, faFileAlt, faCode } from "@fortawesome/free-solid-svg-icons";
import { btoa } from "next/dist/compiled/@edge-runtime/primitives";

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
    const pageDoc = await Page.findOne({ uri });

    if (!pageDoc) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
            <p className="text-gray-300">This link does not exist.</p>
          </div>
        </div>
      );
    }

    const userDoc = await User.findOne({ email: pageDoc.owner });

    // Convert to plain JSON-safe objects
    const pageData = JSON.parse(JSON.stringify(pageDoc));
    const userData = JSON.parse(JSON.stringify(userDoc));

    // Sort buttons to ensure consistent order between SSR & client
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
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white min-h-screen">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div
            className="h-64 bg-gray-400 bg-cover bg-center relative"
            style={backgroundStyle}
          >
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* Profile Image */}
          <div className="relative -mt-20 flex justify-center">
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
        </div>

        {/* Profile Info */}
        <div className="px-6 pt-6 pb-8 text-center">
          <h1 className="text-3xl font-bold mb-3 text-white">
            {pageData.displayName}
          </h1>

          {pageData.location && (
            <div className="flex items-center justify-center gap-2 text-white/80 mb-4">
              <FontAwesomeIcon icon={faLocationDot} className="w-4 h-4" />
              <span className="text-lg">{pageData.location}</span>
            </div>
          )}

          {pageData.bio && (
            <div className="max-w-md mx-auto mb-6">
              <p className="text-white/90 leading-relaxed">{pageData.bio}</p>
            </div>
          )}

          {/* Social Buttons */}
          {Object.keys(pageData.buttons || {}).length > 0 && (
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {Object.keys(pageData.buttons).map((buttonKey) => (
                <Link
                  key={buttonKey}
                  href={buttonLink(buttonKey, pageData.buttons[buttonKey])}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300 shadow-lg"
                  aria-label={buttonKey}
                >
                  <FontAwesomeIcon
                    className="w-5 h-5"
                    icon={buttonsIcons[buttonKey]}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Links Section */}
        <div className="px-6 pb-12">
          <div className="max-w-lg mx-auto space-y-4">
            {(pageData.links || []).map((link, index) => (
              <Link
                key={`${link.url}-${index}`}
                target="_blank"
                rel="noopener noreferrer"
                ping={`${baseUrl}api/click?url=${btoa(link.url)}&page=${pageData.uri}`}
                className="group block bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/20 hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
                href={link.url}
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center overflow-hidden">
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
                        className="w-6 h-6 text-white/80"
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-lg mb-1 truncate group-hover:text-white/90">
                      {link.title}
                    </h3>
                    {link.subtitle && (
                      <p className="text-white/70 text-sm truncate">
                        {link.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Arrow indicator */}
                  <div className="flex-shrink-0 text-white/60 group-hover:text-white/80 group-hover:translate-x-1 transition-all duration-300">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading page:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 to-red-800 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
          <p className="text-red-200">Please try again later.</p>
        </div>
      </div>
    );
  }
}
