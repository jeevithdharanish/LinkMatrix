import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PageButtonsForm from "@/components/forms/PageButtonsForm";
import PageWorkExperienceForm from "@/components/forms/PageWorkExperienceForm";
import PageLinksForm from "@/components/forms/PageLinksForm";
import PageSettingsForm from "@/components/forms/PageSettingsForm";
import { WorkExperience } from "@/models/WorkExperience";
import { Event } from "@/models/Event";
import { format } from "date-fns";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import PageSummaryForm from "@/components/forms/PageSummaryForm";
import PageSkillsForm from "@/components/forms/PageSkillsForm";
import PageEducationForm from "@/components/forms/PageEducationForm";
import { Education } from "@/models/Education";
import { Page } from "@/models/page";
import { Project } from "@/models/Project"; // 1. Import the new Project model
import PageProjectForm from "@/components/forms/PageProjectForm"; // 2. Import the new Form

export default async function AccountPage({ searchParams }) {
  const session = await getServerSession(authOptions);
  let desiredUsername = searchParams?.desiredUsername ? String(searchParams.desiredUsername) : null;

  if (!session) {
    return redirect('/');
  }

  // connect to DB (idempotent if you guard connection elsewhere)
  await mongoose.connect(process.env.MONGO_URI);

  const page = await Page.findOne({ owner: session?.user?.email });

  if (desiredUsername) {
    return redirect(`/claim-username?desiredUsername=${encodeURIComponent(desiredUsername)}`);
  }

  if (!page) {
    return redirect('/claim-username');
  }

  // Page -> plain object for passing to client components
  const leanPage = JSON.parse(JSON.stringify(page));

  // fetch related collections (use .lean() where possible)
  const [education, workExperience,projects, clicks, groupedViews] = await Promise.all([
    Education.find({
      owner: session?.user?.email,
      pageUri: leanPage.uri,
    }).lean(), // returns plain objects (but still stringify for safety)
    WorkExperience.find({
      owner: session?.user?.email,
      pageUri: leanPage.uri,
    }).lean(),
    Project.find({ // <-- ADD THIS QUERY
      owner: session?.user?.email,
      pageUri: leanPage.uri,
    }).lean(),
    Event.find({ page: leanPage.uri, type: 'click' }).lean(),
    Event.aggregate([
      {
        $match: {
          type: 'view',
          uri: leanPage.uri,
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

  // Convert to plain JSON-safe objects (this removes ObjectId buffers, Date objects, etc.)
  const educationPlain = JSON.parse(JSON.stringify(education || []));
  const workExperiencePlain = JSON.parse(JSON.stringify(workExperience || []));
  const clicksPlain = JSON.parse(JSON.stringify(clicks || []));
  const groupedViewsPlain = JSON.parse(JSON.stringify(groupedViews || []));
  const projectsPlain = JSON.parse(JSON.stringify(projects || []));

  // Analytics calculations (use the plain versions)
  const totalViews = groupedViewsPlain.reduce((acc, curr) => acc + (curr.count || 0), 0);
  const totalClicks = clicksPlain.length;
  // const clickRate = totalViews > 0 ? Number(((totalClicks / totalViews) * 100).toFixed(1)) : 0;
  const today = new Date();
  const todayString = format(today, 'yyyy-MM-dd');
  // const todayViews = groupedViewsPlain.find(v => v._id === todayString)?.count || 0;
  // // const todayClicks = clicksPlain.filter(c => {
  //   const clickDate = new Date(c.createdAt);
  //   return format(clickDate, 'yyyy-MM-dd') === todayString;
  // }).length;

  // If you need to use the analytics values in JSX, you can pass them as props or compute in client components.
  // For now we just compute them here to keep parity with your original code.

  return (
    <div className="space-y-8 w-full">
      {/* Header Section with Page URL */}
      <div
        className="md:sticky md:top-0 md:z-50 bg-gradient-to-r from-blue-500 to-purple-600 mt-2 rounded-xl p-4 text-white shadow-lg w-full">
        <h1 className="text-3xl font-bold mb-4">Your Link Page</h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <span className="text-blue-100 text-lg">Your page is live at:</span>
          <a
            href={`/${leanPage.uri}`}
            target="_blank"
            rel="noreferrer"
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
        <PageSummaryForm page={leanPage} user={session.user} />

        {/* These props are now plain objects, so the warning will disappear */}
        <PageWorkExperienceForm
          page={leanPage}
          user={session.user}
          initialWorkExperience={workExperiencePlain}
        />

        <PageProjectForm
          page={leanPage}
          initialProjects={projectsPlain}
        />

        <PageEducationForm page={leanPage} initialEducation={educationPlain} />

        <PageSkillsForm page={leanPage} initialSkills={leanPage.skills || []} />
      </div>
    </div>
  );
}
