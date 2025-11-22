import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Chart from "@/components/Chart";
import { Event } from "@/models/Event";
import { Page } from "@/models/page";
import { DeletedLink } from "@/models/DeletedLink";
import { Project } from "@/models/Project";
import { 
  faEye, faLink, faPercent, faCalendarDay, faArrowUp, faExternalLinkAlt,
  faEnvelope, faMobile, faFileAlt, faCode, faProjectDiagram 
} from "@fortawesome/free-solid-svg-icons";
import {
  faDiscord, faFacebook, faGithub, faInstagram, faTelegram,
  faTiktok, faWhatsapp, faYoutube, faLinkedin
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isToday, format } from "date-fns";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

// Helper map & function
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

export default async function AnalyticsPage() {
  await mongoose.connect(process.env.MONGO_URI);
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return redirect('/');
  }

  const page = await Page.findOne({ owner: session.user.email }).lean(); 
  if (!page) {
    return redirect('/claim-username');
  }

  // 1. Fetch all data
  const [allClicks, deletedLinks, groupedViews, projects] = await Promise.all([
    Event.find({ page: page.uri, type: 'click' }).lean(),
    DeletedLink.find({ pageUri: page.uri, owner: session.user.email }).lean(),
    Event.aggregate([
      { $match: { type: 'view', uri: page.uri } },
      { $group: { _id: { $dateToString: { date: "$createdAt", format: "%Y-%m-%d" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]),
    Project.find({ owner: session.user.email, pageUri: page.uri }).lean(),
  ]);

  // 2. Filter clicks into THREE separate groups
  const linkClicks = allClicks.filter(c => c.clickType === 'link' || !c.clickType);
  const socialClicks = allClicks.filter(c => c.clickType === 'social');
  const projectClicks = allClicks.filter(c => c.clickType === 'project');

  // 3. Calculate Totals
  const totalViews = groupedViews.reduce((acc, curr) => acc + curr.count, 0);
  const totalLinkClicks = linkClicks.length;
  const totalSocialClicks = socialClicks.length;
  const totalProjectClicks = projectClicks.length;
  const clickRate = totalViews > 0 ? ((totalLinkClicks / totalViews) * 100).toFixed(1) : 0;
  
  // 4. Calculate Today's Stats
  const today = new Date();
  const todayViews = groupedViews.find(v => v._id === format(today, 'yyyy-MM-dd'))?.count || 0;
  const todayLinkClicks = linkClicks.filter(c => isToday(new Date(c.createdAt))).length;
  const todaySocialClicks = socialClicks.filter(c => isToday(new Date(c.createdAt))).length;
  const todayProjectClicks = projectClicks.filter(c => isToday(new Date(c.createdAt))).length;

  // 5. Process LINK Clicks (Map for quick lookup)
  const linkClickMap = new Map();
  const todayClickMap = new Map();
  linkClicks.forEach(click => {
    const url = click.uri;
    linkClickMap.set(url, (linkClickMap.get(url) || 0) + 1);
    if (isToday(new Date(click.createdAt))) {
      todayClickMap.set(url, (todayClickMap.get(url) || 0) + 1);
    }
  });

  // 6. Process SOCIAL Clicks
  const socialClickMap = new Map();
  const todaySocialClickMap = new Map();
  socialClicks.forEach(click => {
    const url = click.uri;
    socialClickMap.set(url, (socialClickMap.get(url) || 0) + 1);
    if (isToday(new Date(click.createdAt))) {
      todaySocialClickMap.set(url, (todaySocialClickMap.get(url) || 0) + 1);
    }
  });

  // 7. Process PROJECT Clicks
  const projectClickMap = new Map();
  const todayProjectClickMap = new Map();
  projectClicks.forEach(click => {
    const url = click.uri;
    projectClickMap.set(url, (projectClickMap.get(url) || 0) + 1);
    if (isToday(new Date(click.createdAt))) {
      todayProjectClickMap.set(url, (todayProjectClickMap.get(url) || 0) + 1);
    }
  });

  // Prepare Lists for Display
  const activeLinks = page.links.map(link => ({
    title: link.title || 'Untitled Link',
    url: link.url,
    totalClicks: linkClickMap.get(link.url) || 0,
    todayClicks: todayClickMap.get(link.url) || 0,
    isDeleted: false
  }));

  const deletedLinksData = deletedLinks.map(link => ({
    title: link.title || 'Deleted Link',
    url: link.url,
    totalClicks: linkClicks.filter(c =>
      c.uri === link.url && new Date(c.createdAt) <= new Date(link.deletedAt)
    ).length,
    todayClicks: 0,
    isDeleted: true
  }));

  const allLinks = [...activeLinks, ...deletedLinksData];
  const topLinks = allLinks.sort((a, b) => b.totalClicks - a.totalClicks).slice(0, 5);

  const chartData = groupedViews.map(item => ({
    date: item._id,
    views: item.count,
  }));

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Track your page performance and link engagement</p>
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Total Views */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">
                <FontAwesomeIcon icon={faCalendarDay} className="mr-1" />
                {todayViews} today
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FontAwesomeIcon icon={faEye} className="text-xl text-green-600" />
            </div>
          </div>
        </div>

        {/* Link Clicks */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Link Clicks</p>
              <p className="text-2xl font-bold text-gray-900">{totalLinkClicks.toLocaleString()}</p>
              <p className="text-xs text-blue-600 mt-1">
                <FontAwesomeIcon icon={faCalendarDay} className="mr-1" />
                {todayLinkClicks} today
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FontAwesomeIcon icon={faLink} className="text-xl text-blue-600" />
            </div>
          </div>
        </div>

        {/* Social Clicks */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Social Clicks</p>
              <p className="text-2xl font-bold text-gray-900">{totalSocialClicks.toLocaleString()}</p>
              <p className="text-xs text-purple-600 mt-1">
                <FontAwesomeIcon icon={faCalendarDay} className="mr-1" />
                {todaySocialClicks} today
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FontAwesomeIcon icon={faExternalLinkAlt} className="text-xl text-purple-600" />
            </div>
          </div>
        </div>

        {/* Project Clicks (NEW CARD) */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Project Clicks</p>
              <p className="text-2xl font-bold text-gray-900">{totalProjectClicks.toLocaleString()}</p>
              <p className="text-xs text-red-600 mt-1">
                <FontAwesomeIcon icon={faCalendarDay} className="mr-1" />
                {todayProjectClicks} today
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <FontAwesomeIcon icon={faProjectDiagram} className="text-xl text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Views Over Time</h2>
        <Chart data={chartData} />
      </div>

      {/* Top Performing Links (Shows only main links) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Performing Links</h2>
        {topLinks.length > 0 ? (
          <div className="space-y-4">
            {topLinks.map((link, index) => {
              const progress = totalLinkClicks > 0 ? (link.totalClicks / totalLinkClicks) * 100 : 0;
              return (
                <div key={`${link.url}-${index}`} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-sm font-semibold text-blue-600">#{index + 1}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`font-medium truncate ${link.isDeleted ? 'text-red-600' : 'text-gray-900'}`}>
                        {link.title}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{link.url}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 ml-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{link.totalClicks}</p>
                      <p className="text-xs text-gray-500">clicks</p>
                    </div>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${link.isDeleted ? 'bg-red-400' : 'bg-blue-500'}`}
                        style={{ width: `${Math.max(progress, 2)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FontAwesomeIcon icon={faLink} className="text-4xl mb-4 text-gray-300" />
            <p>No link clicks yet</p>
          </div>
        )}
      </div>

      {/* Socials Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Socials Performance</h2>
        {Object.keys(page.buttons || {}).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(page.buttons).map(([key, value]) => {
              if (!value) return null;
              const realUrl = buttonLink(key, value);
              const totalClicks = socialClickMap.get(realUrl) || 0;
              const todayClicks = todaySocialClickMap.get(realUrl) || 0;
              const Icon = buttonsIcons[key];

              return (
                <div key={key} className="border border-gray-200 rounded-lg p-4">
                   <div className="flex flex-col md:flex-row md:items-center gap-4">
                     <div className="flex-1 min-w-0 flex items-center gap-3">
                       {Icon && <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"><FontAwesomeIcon icon={Icon} className="w-5 h-5 text-gray-600" /></div>}
                       <div>
                         <h3 className="font-medium text-gray-900 capitalize">{key}</h3>
                         <p className="text-sm text-blue-500 truncate">{value}</p>
                       </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg min-w-[80px]">
                          <div className="text-xl font-bold text-blue-600">{todayClicks}</div>
                          <div className="text-xs text-blue-600 font-medium">Today</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg min-w-[80px]">
                          <div className="text-xl font-bold text-gray-900">{totalClicks}</div>
                          <div className="text-xs text-gray-600 font-medium">Total</div>
                        </div>
                     </div>
                   </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FontAwesomeIcon icon={faExternalLinkAlt} className="text-4xl mb-4 text-gray-300" />
            <p>No social buttons added yet</p>
          </div>
        )}
      </div>

      {/* Projects Performance (NEW SECTION) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Projects Performance</h2>
        {projects.length > 0 ? (
          <div className="space-y-4">
            {projects.map((project) => {
              const githubClicks = projectClickMap.get(project.githubLink) || 0;
              const liveClicks = projectClickMap.get(project.liveLink) || 0;
              const todayGithub = todayProjectClickMap.get(project.githubLink) || 0;
              const todayLive = todayProjectClickMap.get(project.liveLink) || 0;

              return (
                <div key={project._id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 truncate mb-3">
                    {project.title || 'Untitled Project'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* GitHub Link Stats */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-gray-700 mb-2">
                        <FontAwesomeIcon icon={faGithub} className="w-4 h-4" />
                        <span className="text-sm font-medium">GitHub</span>
                      </div>
                      <div className="flex items-baseline gap-4">
                        <span className="text-2xl font-bold text-gray-900">{githubClicks}</span>
                        <span className="text-sm text-gray-600">clicks</span>
                      </div>
                      <span className="text-xs text-blue-600 font-medium">{todayGithub} today</span>
                    </div>
                    {/* Live Demo Link Stats */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-gray-700 mb-2">
                        <FontAwesomeIcon icon={faExternalLinkAlt} className="w-4 h-4" />
                        <span className="text-sm font-medium">Live Demo</span>
                      </div>
                      <div className="flex items-baseline gap-4">
                        <span className="text-2xl font-bold text-gray-900">{liveClicks}</span>
                        <span className="text-sm text-gray-600">clicks</span>
                      </div>
                      <span className="text-xs text-blue-600 font-medium">{todayLive} today</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FontAwesomeIcon icon={faProjectDiagram} className="text-4xl mb-4 text-gray-300" />
            <p>No projects added yet</p>
          </div>
        )}
      </div>

      {/* Detailed Link Analytics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">All Links Performance</h2>
        {page.links.length > 0 ? (
          <div className="space-y-4">
            {page.links.map((link, index) => {
              const totalClicks = linkClickMap.get(link.url) || 0;
              const todayClicks = todayClickMap.get(link.url) || 0;

              return (
                <div key={`${link.url}-${index}`} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {link.title || 'Untitled Link'}
                      </h3>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:text-blue-700 truncate block"
                      >
                        {link.url}
                        <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-1 text-xs" />
                      </a>
                    </div>

                    <div className="flex gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg min-w-[80px]">
                        <div className="text-xl font-bold text-blue-600">{todayClicks}</div>
                        <div className="text-xs text-blue-600 font-medium">Today</div>
                      </div>

                      <div className="text-center p-3 bg-gray-50 rounded-lg min-w-[80px]">
                        <div className="text-xl font-bold text-gray-900">{totalClicks}</div>
                        <div className="text-xs text-gray-600 font-medium">Total</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FontAwesomeIcon icon={faLink} className="text-4xl mb-4 text-gray-300" />
            <p>No links added yet</p>
            <p className="text-sm mt-2">Add some links to see their performance</p>
          </div>
        )}
      </div>
    </div>
  );
}