import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PageButtonsForm from "@/components/forms/PageButtonsForm";
import PageWorkExperienceForm from "@/components/forms/PageWorkExperienceForm";
import PageLinksForm from "@/components/forms/PageLinksForm";
import PageSettingsForm from "@/components/forms/PageSettingsForm";
import { WorkExperience } from "@/models/WorkExperience";
import { Event } from "@/models/Event";
import { format } from "date-fns";
import { connectToDatabase } from "@/libs/mongoClient";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import PageSummaryForm from "@/components/forms/PageSummaryForm";
import PageSkillsForm from "@/components/forms/PageSkillsForm";
import PageEducationForm from "@/components/forms/PageEducationForm";
import { Education } from "@/models/Education";
import { Page } from "@/models/page";
import { Project } from "@/models/Project";
import PageProjectForm from "@/components/forms/PageProjectForm";
import AccountHeader from "@/components/layout/AccountHeader";

export default async function AccountPage({ searchParams }) {
  const session = await getServerSession(authOptions);
  let desiredUsername = searchParams?.desiredUsername ? String(searchParams.desiredUsername) : null;

  if (!session) {
    return redirect('/');
  }

  // Use optimized connection
  await connectToDatabase();

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
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      {/* Header Section with Page URL */}
      <AccountHeader uri={leanPage.uri} />

      <div className="space-y-6 w-full">
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
