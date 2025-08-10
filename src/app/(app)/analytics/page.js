import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Chart from "@/components/Chart";
import { Event } from "@/models/Event";
import { Page } from "@/models/page";
import { DeletedLink } from "@/models/DeletedLink";
import { faEye, faLink, faPercent, faCalendarDay, faArrowUp, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isToday, format, subDays, startOfDay, endOfDay } from "date-fns";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AnalyticsPage() {
  await mongoose.connect(process.env.MONGO_URI);
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return redirect('/');
  }

  const page = await Page.findOne({ owner: session.user.email });
  if (!page) {
    return redirect('/claim-username');
  }

  // Optimize queries with Promise.all for parallel execution
  const [clicks, deletedLinks, groupedViews] = await Promise.all([
    Event.find({ page: page.uri, type: 'click' }).lean(),
    DeletedLink.find({ pageUri: page.uri, owner: session.user.email }).lean(),
    Event.aggregate([
      {
        $match: {
          type: 'view',
          uri: page.uri,
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              date: "$createdAt",
              format: "%Y-%m-%d"
            },
          },
          count: { $sum: 1 }
        },
      },
      { $sort: { _id: 1 } }
    ])
  ]);

  // Calculate metrics
  const totalViews = groupedViews.reduce((acc, curr) => acc + curr.count, 0);
  const totalClicks = clicks.length;
  const clickRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : 0;
  
  // Today's metrics
  const today = new Date();
  const todayViews = groupedViews.find(v => v._id === format(today, 'yyyy-MM-dd'))?.count || 0;
  const todayClicks = clicks.filter(c => isToday(new Date(c.createdAt))).length;

  // Optimize link processing
  const linkClickMap = new Map();
  const todayClickMap = new Map();
  
  clicks.forEach(click => {
    const url = click.uri;
    linkClickMap.set(url, (linkClickMap.get(url) || 0) + 1);
    
    if (isToday(new Date(click.createdAt))) {
      todayClickMap.set(url, (todayClickMap.get(url) || 0) + 1);
    }
  });

  // Process active links
  const activeLinks = page.links.map(link => ({
    title: link.title || 'Untitled Link',
    url: link.url,
    totalClicks: linkClickMap.get(link.url) || 0,
    todayClicks: todayClickMap.get(link.url) || 0,
    isDeleted: false
  }));

  // Process deleted links
  const deletedLinksData = deletedLinks.map(link => ({
    title: link.title || 'Deleted Link',
    url: link.url,
    totalClicks: clicks.filter(c => 
      c.uri === link.url && new Date(c.createdAt) <= new Date(link.deletedAt)
    ).length,
    todayClicks: 0, // Deleted links don't get today's clicks
    isDeleted: true
  }));

  const allLinks = [...activeLinks, ...deletedLinksData];
  const topLinks = allLinks
    .sort((a, b) => b.totalClicks - a.totalClicks)
    .slice(0, 5);

  // Prepare chart data with better formatting
  const chartData = groupedViews.map(item => ({
    date: item._id,
    views: item.count,
    formattedDate: format(new Date(item._id), 'MMM dd')
  }));

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Track your page performance and link engagement</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clicks</p>
              <p className="text-2xl font-bold text-gray-900">{totalClicks.toLocaleString()}</p>
              <p className="text-xs text-blue-600 mt-1">
                <FontAwesomeIcon icon={faCalendarDay} className="mr-1" />
                {todayClicks} today
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FontAwesomeIcon icon={faLink} className="text-xl text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Click Rate</p>
              <p className="text-2xl font-bold text-gray-900">{clickRate}%</p>
              <p className="text-xs text-orange-600 mt-1">
                <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
                Engagement
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <FontAwesomeIcon icon={faPercent} className="text-xl text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Links</p>
              <p className="text-2xl font-bold text-gray-900">{page.links.length}</p>
              <p className="text-xs text-purple-600 mt-1">
                <FontAwesomeIcon icon={faLink} className="mr-1" />
                Live now
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FontAwesomeIcon icon={faExternalLinkAlt} className="text-xl text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Views Over Time</h2>
          <div className="text-sm text-gray-500">Last 30 days</div>
        </div>
        {chartData.length > 0 ? (
          <Chart data={chartData} />
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FontAwesomeIcon icon={faEye} className="text-4xl mb-4 text-gray-300" />
            <p>No view data available yet</p>
          </div>
        )}
      </div>

      {/* Top Performing Links */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Performing Links</h2>
        {topLinks.length > 0 ? (
          <div className="space-y-4">
            {topLinks.map((link, index) => {
              const progress = totalClicks > 0 ? (link.totalClicks / totalClicks) * 100 : 0;
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
