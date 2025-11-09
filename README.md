LinkMatrix: Your Professional Analytics Hub

LinkMatrix is a full-stack, open-source portfolio platform that rivals paid services like Linktree Pro and bold.pro. It transforms a simple "link-in-bio" into a complete professional hub, complete with a built-in, advanced analytics dashboard to track user engagement.

✨ Core Features

This platform is more than just a list of links. It's a complete personal portfolio and analytics tool.

Full Professional Profile: A clean, two-column public layout to display your:

Professional Summary

Work Experience

Education

Key Skills (as tags)

Featured Links

Social Media Icons

Advanced Analytics Dashboard: We provide premium-level analytics for free.

Real-time Views: Track page views over time with a clean, interactive chart.

Click-Through Rate (CTR): Automatically calculates your page's engagement.

Separate Click Tracking: Uniquely tracks clicks on Links and Social Icons as separate categories.

Top-Performing Links: See which of your links are getting the most engagement.

Historical Data: Uniquely tracks and displays engagement data for links after they have been deleted.

Complete Admin Panel: A secure, session-based dashboard (/account) where you can manage every aspect of your public profile, including:

Page settings (display name, bio, location, background)

All links, socials, skills, summary, work, and education entries.

💻 Tech Stack

Framework: Next.js (App Router)

Authentication: NextAuth.js

Database: MongoDB (with Mongoose)

Styling: Tailwind CSS

Analytics: Recharts (for data visualization)

Deployment: Vercel

🚀 Getting Started

To run this project locally, follow these steps:

1. Clone the repository

git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name


2. Install dependencies

npm install


3. Set up Environment Variables

Create a file named .env.local in the root of your project and add the following variables.

# MongoDB
MONGO_URI=your_mongodb_connection_string

# NextAuth.js
# Get these from your Google Cloud Console
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# This is a random string you can generate
NEXTAUTH_SECRET=your_nextauth_secret

# The base URL of your app
NEXTAUTH_URL=http://localhost:3000


4. Run the development server

npm run dev


Open http://localhost:3000 in your browser to see the result.

🔮 Future Roadmap

This platform is built to be extensible. The next major feature planned is:

Managed Testimonials: A system to allow users to request testimonials via a unique link, with an admin dashboard to approve and display them on the public profile.