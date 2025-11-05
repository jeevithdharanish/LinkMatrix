import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import PageButtonsForm from "@/components/forms/PageButtonsForm";
import PageWorkExperienceForm from "@/components/forms/PageWorkExperienceForm";
import PageLinksForm from "@/components/forms/PageLinksForm";
import PageSettingsForm from "@/components/forms/PageSettingsForm";
import {Page} from "@/models/page";
import { Event } from "@/models/Event";
import { faEye, faLink, faPercent, faCalendarDay, faArrowUp, faExternalLinkAlt, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";
import Link from "next/link";
import PageSummaryForm from "@/components/forms/PageSummaryForm";
import PageSkillsForm from "@/components/forms/PageSkillsForm";
import PageEducationForm from "@/components/forms/PageEducationForm";
import { Education } from "@/models/Education";

export default async function AccountPage({searchParams}) {
  const session = await getServerSession(authOptions);
  // Ensure desiredUsername is a plain string, not a complex object
  let desiredUsername = searchParams?.desiredUsername ? String(searchParams.desiredUsername) : null;

  if (!session) {
    return redirect('/');
  }

  mongoose.connect(process.env.MONGO_URI);
  const page = await Page.findOne({owner: session?.user?.email});

  

  // If user wants to claim a specific username, redirect to claim-username page
  if (desiredUsername) {
    return redirect(`/claim-username?desiredUsername=${encodeURIComponent(desiredUsername)}`);
  }

  // If user doesn't have a page yet, redirect to claim-username page
  if (!page) {
    return redirect('/claim-username');
  }

  if (page) {
    // Convert to plain object and serialize properly
    const leanPage = JSON.parse(JSON.stringify(page.toJSON()));
    const education = await Education.find({
    owner: session?.user?.email,
    pageUri: page.uri,
  });

  // Convert Mongoose docs to plain objects for the client component
  const serializedPage = JSON.parse(JSON.stringify(page));
  const serializedEducation = JSON.parse(JSON.stringify(education || []));
    
    // Fetch analytics data
    const [clicks, groupedViews] = await Promise.all([
      Event.find({ page: page.uri, type: 'click' }).lean(),
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
    const clickRate = totalViews > 0 ? Number(((totalClicks / totalViews) * 100).toFixed(1)) : 0;

    // Today's metrics - use server time consistently
    const today = new Date();
    const todayString = format(today, 'yyyy-MM-dd');
    const todayViews = groupedViews.find(v => v._id === todayString)?.count || 0;
    const todayClicks = clicks.filter(c => {
      const clickDate = new Date(c.createdAt);
      return format(clickDate, 'yyyy-MM-dd') === todayString;
    }).length;

    return (
      <div className="space-y-8 w-full">
        {/* Header Section with Page URL */}
        <div
    // THE CHANGE IS HERE: Sticky classes are now prefixed with 'md:'
    className="md:sticky md:top-0 md:z-50 bg-gradient-to-r from-blue-500 to-purple-600 mt-2 rounded-xl p-4 text-white shadow-lg w-full">
    <h1 className="text-3xl font-bold mb-4">Your Link Page</h1>
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <span className="text-blue-100 text-lg">Your page is live at:</span>
        <a
            href={`/${leanPage.uri}`}
            target="_blank"
            className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg text-white font-mono text-base hover:bg-white/30 transition-all duration-200 break-all"
        >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            linkto/{leanPage.uri}
        </a>
    </div>
</div>

        

        <div className="space-y-8 w-full">
          <PageSettingsForm page={leanPage} user={session.user} />
          <PageButtonsForm page={leanPage} user={session.user} />
          <PageLinksForm page={leanPage} user={session.user} />
          <PageSummaryForm page={leanPage} user={session.user}/>
          <PageWorkExperienceForm page={leanPage} user={session.user} />
          <PageSkillsForm page={leanPage} user={session.user} />
          <PageEducationForm 
    page={serializedPage} 
    initialEducation={serializedEducation} 
  />
        </div>
      </div>
    );
  }


}
