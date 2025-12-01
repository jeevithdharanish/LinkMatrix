# LinkMatrix 🔗

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![NextAuth](https://img.shields.io/badge/NextAuth.js-black?style=for-the-badge&logo=next.js)

**A modern, professional portfolio builder that helps you showcase your skills, projects, and experience in one beautiful link.**

[Live Demo](https://linkmatrix.vercel.app) · [Report Bug](https://github.com/jdking123/linkmatrix/issues) · [Request Feature](https://github.com/jdking123/linkmatrix/issues)

</div>

---

## ✨ Features

### 🎯 Portfolio Builder
- **Professional Profile** - Display name, bio, location, and profile image
- **Social Links** - Connect all your social media profiles (LinkedIn, GitHub, Instagram, etc.)
- **Featured Links** - Add custom links with icons and descriptions

### 💼 Professional Sections
| Section | Features |
|---------|----------|
| **About Me** | Rich text summary with quote styling |
| **Skills** | Categorized skills with proficiency bars (Programming, Frontend, Backend, Tools, Coursework) |
| **Work Experience** | Timeline-based experience with bullet points |
| **Education** | Academic background with CGPA support |
| **Projects** | Showcase projects with tech stacks, GitHub & live demo links |

### 📊 Analytics Dashboard
- **View Tracking** - Monitor portfolio page views over time
- **Click Analytics** - Track link clicks, social clicks, and project clicks separately
- **Performance Metrics** - See top-performing links and daily statistics
- **Visual Charts** - Beautiful charts powered by Chart.js and Recharts
- **Historical Data** - Track engagement even for deleted links

### 🎨 Modern UI/UX
- **Dark Theme Portfolio** - Stunning dark-themed public portfolio page
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- **Smooth Animations** - Framer Motion powered animations
- **Glassmorphism Effects** - Modern frosted glass design elements
- **Timeline Layouts** - Beautiful timeline for experience and education

### 🔒 Security & Performance
- **Google OAuth** - Secure authentication with NextAuth.js
- **Input Sanitization** - XSS protection on all user inputs
- **Optimized Database** - MongoDB connection pooling and caching
- **Image Optimization** - Next.js Image with AVIF/WebP support
- **SEO Optimized** - Dynamic meta tags for social sharing

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 14 (App Router) |
| **Database** | MongoDB with Mongoose |
| **Authentication** | NextAuth.js (Google OAuth) |
| **Styling** | Tailwind CSS |
| **UI Components** | FontAwesome Icons, Framer Motion |
| **Charts** | Chart.js, Recharts |
| **File Storage** | AWS S3 |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- Google OAuth credentials ([Google Cloud Console](https://console.cloud.google.com/))
- AWS S3 bucket (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jdking123/linkmatrix.git
   cd linkmatrix
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # MongoDB
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/linkmatrix
   
   # NextAuth
   NEXTAUTH_SECRET=your-super-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # AWS S3 (for image uploads)
   S3_BUCKET_NAME=your-bucket-name
   S3_ACCESS_KEY=your-access-key
   S3_SECRET_KEY=your-secret-key
   S3_REGION=ap-south-1
   
   # App URL
   URL=http://localhost:3000/
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
linkmatrix/
├── public/
│   └── skills/              # Skill icons (SVG)
├── src/
│   ├── actions/             # Server actions
│   │   └── pageActions.js   # CRUD operations for portfolio
│   ├── app/
│   │   ├── (app)/           # Authenticated routes
│   │   │   ├── account/     # Portfolio editor dashboard
│   │   │   ├── analytics/   # Analytics dashboard
│   │   │   └── claim-username/
│   │   ├── (page)/          # Public portfolio routes
│   │   │   └── [uri]/       # Dynamic portfolio pages
│   │   ├── api/             # API routes
│   │   │   ├── auth/        # NextAuth handlers
│   │   │   ├── click/       # Click tracking API
│   │   │   └── upload/      # S3 file uploads
│   │   └── main/            # Landing & login pages
│   ├── components/
│   │   ├── buttons/         # SubmitButton, LoginWithGoogle
│   │   ├── forms/           # All form components
│   │   ├── layout/          # SectionBox, AppSideBar, AccountHeader
│   │   └── profile/         # Portfolio section components
│   ├── libs/
│   │   ├── mongoClient.js   # Database connection utility
│   │   └── upload.js        # S3 upload utility
│   └── models/              # MongoDB schemas
│       ├── page.js          # Main portfolio schema
│       ├── User.js
│       ├── Education.js
│       ├── Project.js
│       ├── WorkExperience.js
│       ├── Event.js         # Analytics events
│       └── DeletedLink.js   # Track deleted links
├── .env
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## 📸 Screenshots

<details>
<summary>Click to view screenshots</summary>

### 🌐 Public Portfolio
> Beautiful dark-themed portfolio with hero section, skills, projects, and more

### 📝 Dashboard Editor
> Manage all your portfolio sections from one place

### 📊 Analytics Dashboard
> Track views, clicks, and engagement metrics

</details>

---

## 🔧 Configuration

### Adding Skill Icons

Place SVG icons in the `public/skills/` directory. Naming convention:
```
python.svg     → Python
react.svg      → React
nextjs.svg     → Next.js
nodejs.svg     → Node.js
mongodb.svg    → MongoDB
```

### Skill Categories

Default categories in the Skills section:
- Programming Languages
- Frontend Development
- Backend Development
- Tools & Technologies
- Related Coursework
- Other Coursework

---

## 📝 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/[...nextauth]` | NextAuth authentication |
| `POST` | `/api/click` | Track link/social/project clicks |
| `POST` | `/api/upload` | Upload images to S3 |

### Click Tracking Parameters
```
POST /api/click?url={base64_url}&page={uri}&clickType={link|social|project}
```

---

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jdking123/linkmatrix)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the project
2. **Create** your feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

---

## 🔮 Roadmap

- [x] Portfolio builder with all sections
- [x] Analytics dashboard
- [x] Skills with proficiency levels
- [x] Project showcase
- [x] SEO optimization
- [ ] Testimonials/Recommendations
- [ ] Custom themes
- [ ] Resume PDF export
- [ ] QR code generator

---



## 👨‍💻 Author

**Jeevith Dharanish**

[![GitHub](https://img.shields.io/badge/GitHub-@jdking123-181717?style=flat&logo=github)](https://github.com/jdking123)
[![Portfolio](https://img.shields.io/badge/Portfolio-LinkMatrix-blue?style=flat)](https://linkmatrix.vercel.app/jeevi)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [MongoDB](https://www.mongodb.com/) - NoSQL Database
- [Vercel](https://vercel.com/) - Deployment Platform
- [FontAwesome](https://fontawesome.com/) - Icon Library

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

Made with ❤️ by [Jeevith Dharanish](https://github.com/jdking123)

</div>