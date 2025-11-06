# Portfolio Website - Kushagra Kanaujia

A modern, feature-rich portfolio website built with Next.js 16, React Three Fiber, and Framer Motion. This portfolio showcases projects, skills, and experience with stunning 3D visualizations and smooth animations.

## 🚀 Features

### Core Sections
- **Hero Section** - Terminal-style typing animation with dynamic text rotation
- **About Section** - Professional bio with stats and highlights (placeholder headshot included)
- **Experience Section** - Timeline view of work experience and education
- **Skills Section** - Interactive 3D galaxy visualization with 17+ technologies
- **Projects Section** - Visual project cards with images and metrics
- **Contact Section** - Multiple contact methods with availability status

### Interactive Elements
- 3D Visualizations with React Three Fiber
- Smooth scrolling navigation
- Scroll-triggered animations
- Back to top button
- Responsive navbar with active section highlighting
- Custom themed scrollbar

## 🛠️ Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

Open [http://localhost:3000](http://localhost:3000) to view your portfolio.

## 🎨 Customization Guide

### Replace Placeholder Images

1. **Profile Image**: Replace placeholder in `/components/About.tsx`
   - Add your headshot to `/public/headshot.jpg`
   - Currently shows a placeholder icon - update with real image

2. **Project Images**: Already configured with placeholder images
   - `/public/dawdle.jpg`
   - `/public/nsight.jpg`
   - `/public/visual-layer.jpg`
   - Replace these with your actual project screenshots

### Update Personal Information

1. **Hero Section** (`/components/Hero.tsx`):
   - Update name and titles
   - Modify tagline and description

2. **About Section** (`/components/About.tsx`):
   - Update bio text
   - Modify stats (uptime, requests, projects, etc.)
   - Update highlights with your expertise

3. **Projects** (`/components/Projects.tsx`):
   - Update project titles, descriptions, and tech stacks
   - Replace "#" with actual GitHub/live links
   - Update metrics to reflect your actual stats

4. **Experience** (`/components/Experience.tsx`):
   - Update work experience entries
   - Modify education details

5. **Contact** (`/components/Contact.tsx`):
   - Update email, LinkedIn, GitHub, Twitter URLs
   - Modify location and timezone

### Customize Colors

Edit `/tailwind.config.ts`:
```ts
colors: {
  accent: "#00d9ff",        // Primary cyan accent
  "accent-blue": "#0ea5e9", // Secondary blue
  background: "#0a0a0a",    // Dark background
}
```

### SEO & Metadata

Edit `/app/layout.tsx` to update title, description, and keywords.

## 📁 Project Structure

```
portfolio/
├── app/
│   ├── components/Navbar.tsx    # Navigation
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Main page
│   └── globals.css              # Global styles
├── components/                   # Reusable components
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Experience.tsx
│   ├── Projects.tsx
│   ├── TechArsenal3D.tsx
│   ├── Contact.tsx
│   ├── Footer.tsx
│   └── BackToTop.tsx
└── public/                      # Static assets
```

## 🎯 Key Features

- Next.js 16 with React 19
- TypeScript for type safety
- Tailwind CSS for styling
- Framer Motion for animations
- React Three Fiber for 3D graphics
- Fully responsive design
- SEO optimized

## 🚀 Deployment

Deploy to Vercel:
```bash
vercel
```

Or push to GitHub and connect to Vercel for automatic deployments.

## 📝 TODO: Personalization Checklist

- [ ] Replace placeholder headshot in About section
- [ ] Update project images if needed
- [ ] Add your GitHub username and links
- [ ] Update LinkedIn, Twitter, email in Contact
- [ ] Modify project descriptions and metrics
- [ ] Update work experience and education
- [ ] Add real project links (replace "#")
- [ ] Customize meta tags for SEO
- [ ] Add custom domain

## Notes

- Do not commit env files. Configure keys in .env.local if needed.
- Uses React Three Fiber + Tailwind + Framer Motion
- Optimized for Vercel deployment

---

Made with 💙 by Kushagra Kanaujia
