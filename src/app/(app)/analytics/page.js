import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Chart from "@/components/Chart";
import SectionBox from "@/components/layout/SectionBox";
import { Event } from "@/models/Event";
import { Page } from "@/models/page";
import { faEye, faLink, faPercent } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isToday, isAfter, isBefore } from "date-fns";
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
    return <div>No data found.</div>;
  }

  const groupedViews = await Event.aggregate([
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
        count: {
          "$count": {},
        }
      },
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  const clicks = await Event.find({
    page: page.uri,
    type: 'click',
  });

  const totalViews = groupedViews.reduce((acc, curr) => acc + (curr.count || 0), 0);
  const totalClicks = clicks.length;

  // Calculate the click rate
  const clickRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : 0;

  const topLinks = page.links.map(link => ({
    title: link.title || 'No title',
    url: link.url,
    totalClicks: clicks.filter(c => c.uri === link.url).length,
    todayClicks: clicks.filter(c => c.uri === link.url && isToday(c.createdAt)).length,
  }))
  .sort((a, b) => b.totalClicks - a.totalClicks)
  .slice(0, 5);

  return (
    <div className="p-8 bg-gray-100">
      {/* Top Section: Summary */}
      <SectionBox className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl text-center font-semibold text-gray-800">Total Count:</h2>
          <div className="grid grid-cols-3 gap-4 text-center mt-5 mb-8">
            <div className="flex flex-col items-center bg-green-50 p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
              <FontAwesomeIcon icon={faEye} className="text-4xl text-green-600 mb-2" />
              <div className="text-2xl font-semibold text-gray-800">{totalViews || 0}</div>
              <div className="text-gray-600">Views</div>
            </div>
            <div className="flex flex-col items-center bg-blue-50 p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
              <FontAwesomeIcon icon={faLink} className="text-4xl text-blue-600 mb-2" />
              <div className="text-2xl font-semibold text-gray-800">{totalClicks || 0}</div>
              <div className="text-gray-600">Clicks</div>
            </div>
            <div className="flex flex-col items-center bg-orange-50 p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
              <FontAwesomeIcon icon={faPercent} className="text-4xl text-orange-600 mb-2" />
              <div className="text-2xl font-semibold text-gray-800">{clickRate || 0}%</div>
              <div className="text-gray-600">Click Rate</div>
            </div>
          </div>
       </SectionBox>


      {/* Middle Section: Chart for Views Over Time */}
      <SectionBox className="bg-white shadow rounded-lg p-6 mb-8">
        {/* Title and Description */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Views Over Time</h2>
          </div>
          <Chart data={groupedViews.map(o => ({
          'date': o._id,
          'views': o.count,
        }))} />
      </SectionBox>

      {/* Bottom Section: Top Performing Links */}
      <SectionBox className="bg-white shadow rounded-lg p-6 mb-8">
  <h2 className="text-xl mb-6 text-center font-semibold">Top Performing Links</h2>
  {topLinks.map(link => {
    const progress = totalClicks > 0 ? (link.totalClicks / totalClicks) * 100 : 0; // Calculate progress
    return (
      <div key={link.title} className="flex flex-col md:flex-row items-center border-b border-gray-200 py-4">
        {/* Link Info Section */}
        <div className="flex items-center w-full md:w-1/4 mb-2 md:mb-0">
          <FontAwesomeIcon icon={faLink} className="text-blue-500 mr-2 pl-0 md:pl-4" />
          <span className="font-semibold text-sm md:text-base">{link.title}</span>
        </div>
        
        {/* Progress Bar Section */}
        <div className="w-full md:w-3/4 flex items-center">
          <div className="relative bg-gray-200 rounded-md h-4 w-full mr-4">
            <div
              className="absolute top-0 left-0 h-4 bg-blue-500 rounded-md transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Percentage Value */}
          <span className="text-sm font-semibold text-gray-600">{Math.round(progress)}%</span>
        </div>
      </div>
    );
  })}
</SectionBox>



      {/* Bottom Section: Detailed Clicks per Link */}
<SectionBox className="bg-white shadow rounded-lg p-4 md:p-6 mb-6">
  <h2 className="text-xl mb-4 md:mb-6 text-center font-semibold">Clicks per Link</h2>
  {page.links
    .filter(link => {
      const now = new Date();
      const startDateValid = link.startDate ? isAfter(now, new Date(link.startDate)) : true;
      const endDateValid = link.endDate ? isBefore(now, new Date(link.endDate)) : true;
      return startDateValid && endDateValid;
    })
    .map(link => (
      <div key={link.title} className="flex flex-col md:flex-row gap-2 md:gap-4 items-center border-t border-gray-200 py-2 md:py-4">
        {/* Link Icon */}
        <div className="text-blue-500 md:pl-4">
          <FontAwesomeIcon icon={faLink} />
        </div>

        {/* Link Title and URL */}
        <div className="grow w-full md:w-auto text-center md:text-left">
          <h3 className="font-semibold text-sm md:text-base">{link.title || 'No title'}</h3>
          <a className="text-xs text-blue-400 break-all" href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
        </div>

        {/* Clicks Today */}
        <div className="w-full md:w-auto text-center mt-2 md:mt-0">
          <div className="border rounded-md p-2">
            <div className="text-2xl md:text-3xl">
              {clicks.filter(c => c.uri === link.url && isToday(c.createdAt)).length}
            </div>
            <div className="text-gray-400 text-xs uppercase font-bold">Clicks Today</div>
          </div>
        </div>

        {/* Total Clicks */}
        <div className="w-full md:w-auto text-center mt-2 md:mt-0">
          <div className="border rounded-md p-2">
            <div className="text-2xl md:text-3xl">
              {clicks.filter(c => c.uri === link.url).length}
            </div>
            <div className="text-gray-400 text-xs uppercase font-bold">Total Clicks</div>
          </div>
        </div>
      </div>
    ))}
</SectionBox>


    </div>
  );
}
