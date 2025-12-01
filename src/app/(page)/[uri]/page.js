import { Page } from "@/models/page";
import { User } from "@/models/User";
import { WorkExperience } from "@/models/WorkExperience";
import { Education } from "@/models/Education";
import { Project } from "@/models/Project";
import { Event } from "@/models/Event";
import mongoose from "mongoose";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiscord, faFacebook, faGithub, faInstagram, faTelegram,
  faTiktok, faWhatsapp, faYoutube, faLinkedin
} from "@fortawesome/free-brands-svg-icons";
import { 
  faEnvelope, faLink, faLocationDot, faMobile, faFileAlt, faCode, 
  faArrowUpRightFromSquare, faShareNodes, faDownload, faArrowDown,
  faHeart, faCopyright, faChevronUp
} from "@fortawesome/free-solid-svg-icons";
import { btoa } from "next/dist/compiled/@edge-runtime/primitives";
import SummarySection from "@/components/profile/SummarySection";
import SkillsSection from "@/components/profile/SkillsSection";
import WorkExperienceSection from "@/components/profile/WorkExperienceSection";
import EducationSection from "@/components/profile/EducationSection";
import ProjectSection from "@/components/profile/ProjectSection";

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

// Social button colors with solid backgrounds
const buttonStyles = {
  email: { bg: "bg-red-500", hover: "hover:bg-red-600" },
  mobile: { bg: "bg-green-500", hover: "hover:bg-green-600" },
  instagram: { bg: "bg-gradient-to-br from-purple-600 to-pink-500", hover: "hover:from-purple-700 hover:to-pink-600" },
  facebook: { bg: "bg-blue-600", hover: "hover:bg-blue-700" },
  linkedin: { bg: "bg-blue-700", hover: "hover:bg-blue-800" },
  youtube: { bg: "bg-red-600", hover: "hover:bg-red-700" },
  github: { bg: "bg-gray-800", hover: "hover:bg-gray-900" },
  geeksforgeeks: { bg: "bg-green-600", hover: "hover:bg-green-700" },
  resume: { bg: "bg-indigo-600", hover: "hover:bg-indigo-700" },
  discord: { bg: "bg-indigo-500", hover: "hover:bg-indigo-600" },
  tiktok: { bg: "bg-black", hover: "hover:bg-gray-900" },
  whatsapp: { bg: "bg-green-500", hover: "hover:bg-green-600" },
  telegram: { bg: "bg-sky-500", hover: "hover:bg-sky-600" },
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
    
    const pageData = await Page.findOne({ uri }).lean();

    if (!pageData) {
      return notFound();
    }

    const [userData, workExperience, education, projects] = await Promise.all([
      User.findOne({ email: pageData.owner }).lean(),
      WorkExperience.find({ owner: pageData.owner, pageUri: uri }).lean(),
      Education.find({ owner: pageData.owner, pageUri: uri }).lean(),
      Project.find({ owner: pageData.owner, pageUri: uri }).lean(),
    ]);

    // Serialize data to avoid Mongoose document issues
    const serializedEducation = JSON.parse(JSON.stringify(education));
    const serializedProjects = JSON.parse(JSON.stringify(projects));
    const serializedWorkExperience = JSON.parse(JSON.stringify(workExperience));
    
    // Track page view
    await Event.create({ uri: uri, page: uri, type: 'view' }).catch(console.error);
    
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

    // Get resume link if available (supports both URL and public folder path)
    const resumeLink = pageData.buttons?.resume || '/RESUME.pdf';
    const hasResume = pageData.buttons?.resume || false; // Only show if explicitly set

    return (
      <div className="bg-slate-950 text-white min-h-screen overflow-x-hidden">
        
        {/* === HERO SECTION - Split Layout === */}
        <section className="relative min-h-screen flex">
          
          {/* LEFT SIDE - Profile Image (Full Height) */}
          <div className="hidden lg:block lg:w-1/2 xl:w-2/5 relative overflow-hidden">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-slate-950 z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10"></div>
            
            {/* Profile Image - Full Cover */}
            <div className="absolute inset-0">
              <Image
                className="w-full h-full object-cover object-center"
                src={pageData.profileImage || '/profile.jpg'}
                alt={`${pageData.displayName}'s photo`}
                fill
                priority
                sizes="50vw"
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent z-10"></div>
            <div className="absolute top-10 left-10 w-20 h-20 border-l-2 border-t-2 border-blue-500/30 z-20"></div>
            <div className="absolute bottom-10 right-10 w-20 h-20 border-r-2 border-b-2 border-purple-500/30 z-20"></div>
          </div>

          {/* RIGHT SIDE - Content */}
          <div className="w-full lg:w-1/2 xl:w-3/5 relative flex items-center">
            {/* Animated Background for right side */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
              
              {/* Animated gradient orbs */}
              <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
              
              {/* Grid pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 px-8 md:px-12 lg:px-16 xl:px-20 py-20 w-full">
              
              {/* Mobile Profile Image */}
              <div className="lg:hidden mb-10 flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-spin-slow opacity-75 blur-sm"></div>
                  <div className="relative w-40 h-40 rounded-full border-4 border-slate-950 overflow-hidden">
                    <Image
                      className="w-full h-full object-cover"
                      src={pageData.profileImage || '/profile.jpg'}
                      alt={`${pageData.displayName}'s avatar`}
                      width={160}
                      height={160}
                      priority
                    />
                  </div>
                </div>
              </div>

              {/* Greeting */}
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Available for opportunities
                </span>
              </div>

              {/* Name */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
                <span className="text-slate-400 text-2xl md:text-3xl font-normal block mb-2">Hello, I&apos;m</span>
                <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                  {pageData.displayName}
                </span>
              </h1>

              {/* Bio/Title */}
              {pageData.bio && (
                <p className="text-lg md:text-xl lg:text-2xl text-slate-400 mb-8 leading-relaxed max-w-xl">
                  {pageData.bio}
                </p>
              )}

              {/* Location */}
              {pageData.location && (
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-slate-300 mb-10">
                  <FontAwesomeIcon icon={faLocationDot} className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium">{pageData.location}</span>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-12">
                {hasResume && (
                  <Link
                    href={resumeLink}
                    target="_blank"
                    download
                    className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
                  >
                    <FontAwesomeIcon icon={faDownload} className="w-5 h-5 group-hover:animate-bounce" />
                    Download Resume
                  </Link>
                )}
               
              </div>

              {/* Social Links */}
              {Object.keys(pageData.buttons || {}).length > 0 && (
                <div>
                  <p className="text-slate-500 text-sm uppercase tracking-wider mb-4 font-medium">Connect with me</p>
                  <div className="flex flex-wrap gap-3">
                    {Object.keys(pageData.buttons).map((buttonKey) => {
                      const url = buttonLink(buttonKey, pageData.buttons[buttonKey]);
                      const pingUrl = `${baseUrl}api/click?url=${btoa(url)}&page=${pageData.uri}&clickType=social`;
                      const style = buttonStyles[buttonKey] || { bg: "bg-blue-500", hover: "hover:bg-blue-600" };
                      
                      return (
                        <Link
                          key={buttonKey}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          ping={pingUrl}
                          className={`group relative w-12 h-12 rounded-xl ${style.bg} ${style.hover} text-white shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300`}
                          aria-label={buttonKey}
                        >
                          <FontAwesomeIcon
                            className="w-5 h-5"
                            icon={buttonsIcons[buttonKey]}
                          />
                          <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white text-slate-900 text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap capitalize shadow-lg">
                            {buttonKey}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-20">
            <Link href="#about" className="flex flex-col items-center gap-2 text-slate-500 hover:text-blue-400 transition-colors">
              <span className="text-xs uppercase tracking-widest">Scroll</span>
              <FontAwesomeIcon icon={faArrowDown} className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* === MAIN CONTENT === */}
        <main className="relative">
          
          {/* About Section */}
          <section id="about" className="py-24 bg-slate-900/50">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
              <SummarySection summary={pageData.summary} />
            </div>
          </section>

          {/* Skills Section */}
          <section id="skills" className="py-24 bg-slate-950">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
              <SkillsSection skills={pageData.skills} />
            </div>
          </section>

          {/* Projects Section */}
          <section id="projects" className="py-24 bg-slate-900/50">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
              <ProjectSection 
                projects={serializedProjects} 
                baseUrl={baseUrl} 
                pageUri={pageData.uri} 
              />
            </div>
          </section>

          {/* Experience Section */}
          <section id="experience" className="py-24 bg-slate-950">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
              <WorkExperienceSection workExperience={serializedWorkExperience} />
            </div>
          </section>

          {/* Education Section */}
          <section id="education" className="py-24 bg-slate-900/50">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
              <EducationSection education={serializedEducation} />
            </div>
          </section>

          {/* Links Section */}
          {(pageData.links || []).length > 0 && (
            <section id="links" className="py-24 bg-slate-950">
              <div className="max-w-4xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-4">
                    Featured Links
                  </h2>
                  <p className="text-slate-400">Check out my profiles and resources</p>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  {(pageData.links || []).map((link, index) => (
                    <Link
                      key={`${link.url}-${index}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      ping={`${baseUrl}api/click?url=${btoa(link.url)}&page=${pageData.uri}&clickType=link`}
                      className="group flex items-center gap-4 p-5 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl hover:bg-slate-800 hover:border-blue-500/50 transition-all duration-300"
                      href={link.url}
                    >
                      <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center overflow-hidden group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300">
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
                            className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-lg mb-1 truncate group-hover:text-blue-400 transition-colors duration-300">
                          {link.title}
                        </h3>
                        {link.subtitle && (
                          <p className="text-slate-500 text-sm truncate">
                            {link.subtitle}
                          </p>
                        )}
                      </div>
                      <FontAwesomeIcon 
                        icon={faArrowUpRightFromSquare} 
                        className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" 
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Contact Section */}
          <section id="contact" className="py-24 bg-gradient-to-b from-slate-900/50 to-slate-950">
            <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-6">
                Let&apos;s Work Together
              </h2>
              <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                Have a project in mind? I&apos;d love to hear about it. Send me a message and let&apos;s create something amazing together.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                {pageData.buttons?.email && (
                  <Link
                    href={`mailto:${pageData.buttons.email}`}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
                  >
                    <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5" />
                    Send Email
                  </Link>
                )}
                {pageData.buttons?.linkedin && (
                  <Link
                    href={pageData.buttons.linkedin}
                    target="_blank"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-blue-700 text-white rounded-full font-semibold text-lg hover:bg-blue-800 transition-all duration-300 shadow-lg hover:scale-105"
                  >
                    <FontAwesomeIcon icon={faLinkedin} className="w-5 h-5" />
                    LinkedIn
                  </Link>
                )}
                {pageData.buttons?.github && (
                  <Link
                    href={pageData.buttons.github}
                    target="_blank"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-slate-800 border border-slate-700 text-white rounded-full font-semibold text-lg hover:bg-slate-700 transition-all duration-300 hover:scale-105"
                  >
                    <FontAwesomeIcon icon={faGithub} className="w-5 h-5" />
                    GitHub
                  </Link>
                )}
              </div>
            </div>
          </section>
        </main>

        {/* === FOOTER === */}
        <footer className="py-12 bg-slate-950 border-t border-slate-800/50">
          <div className="max-w-6xl mx-auto flex justify-center">
            <div className="flex items-center gap-2 text-slate-500">
              <span>Made with</span>
              <FontAwesomeIcon icon={faHeart} className="w-4 h-4 text-red-500 animate-pulse" />
              <span>using</span>
              <Link href="/" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                LinkMate
              </Link>
            </div>
          </div>
        </footer>


        {/* Back to Top Button */}
        <Link
          href="#"
          className="fixed bottom-8 right-8 w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg shadow-blue-500/25 flex items-center justify-center transition-all duration-300 hover:scale-110 z-50"
          aria-label="Back to top"
        >
          <FontAwesomeIcon icon={faChevronUp} className="w-5 h-5" />
        </Link>
      </div>
    );
  } catch (error) {
    console.error("Error loading page:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center p-8 bg-slate-900 rounded-2xl shadow-xl max-w-md mx-4 border border-slate-800">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">😕</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Something went wrong</h1>
          <p className="text-slate-400 mb-8">We couldn&apos;t load this portfolio. Please try again later.</p>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }
}