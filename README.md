# 🚀 Kushagra Kanaujia - 3D Interactive Portfolio

A **next-generation FAANG-ready portfolio** featuring stunning 3D visualizations, interactive elements, and cutting-edge web technologies. Built to showcase world-class engineering skills.

## ✨ Key Features

### 🎯 3D Interactive Components
- **Neural Network Visualization** - Interactive 3D neural network with rotating nodes and data flow animations
- **Skills Galaxy** - 3D constellation of tech skills with connections and categories
- **3D iPhone Mockup** - Rotating iPhone model showcasing the Dawdle app
- **Particle Effects** - Custom particle system with cursor trails and ambient particles

### 💫 Enhanced UI/UX
- **Terminal Typing Animation** - Cycling terminal-style text in hero section
- **Smooth Scroll Animations** - Framer Motion animations triggered on scroll
- **Impact Dashboard** - Animated metrics counters with progress bars
- **Interactive Project Cards** - Expandable 3D demos for featured projects
- **Responsive Design** - Fully responsive across all device sizes
- **Dark Theme** - Professional dark mode with cyan/blue accents

## 🛠️ Tech Stack

### Core
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion

### 3D & Graphics
- **3D Engine**: Three.js
- **React Integration**: React Three Fiber (@react-three/fiber)
- **3D Helpers**: @react-three/drei
- **Post-Processing**: @react-three/postprocessing (optional)

### Additional
- **Icons**: Lucide React
- **Tweening**: GSAP
- **Dev Tools**: Leva (for 3D debugging)

## 🎨 Color Scheme

```css
--background: #0a0a0a      /* Deep black */
--foreground: #ffffff       /* Pure white */
--card: #1e1e1e            /* Dark gray */
--card-border: #2a2a2a     /* Lighter gray */
--accent: #00d9ff          /* Cyan (primary) */
--accent-blue: #0ea5e9     /* Sky blue (secondary) */
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

## 📁 Project Structure

```
/app
  ├── layout.tsx           # Root layout with SEO metadata
  ├── page.tsx            # Main page orchestrating all components
  └── globals.css         # Global styles, animations, utilities

/components
  # 3D Components
  ├── Hero3D.tsx                    # 3D neural network hero section
  ├── NeuralNetwork3D.tsx           # Interactive 3D neural network
  ├── SkillsGalaxy3D.tsx           # 3D skills constellation
  ├── iPhone3D.tsx                  # 3D iPhone model viewer
  ├── Projects3D.tsx                # Enhanced projects with 3D demos
  ├── TechArsenal3D.tsx            # Skills with 3D galaxy toggle
  ├── ParticleField.tsx             # Canvas-based particle system

  # Standard Components
  ├── Navbar.tsx                    # Sticky navigation
  ├── ImpactDashboard.tsx           # Animated metrics
  ├── Experience.tsx                # Timeline visualization
  ├── Contact.tsx                   # Contact information
  └── Footer.tsx                    # Footer section

/public
  └── fonts/                        # Custom fonts (optional)
```

## 🎬 Component Showcase

### Hero3D
- 3D neural network with input, hidden, and output layers
- Animated data particles flowing through connections
- Mouse-controlled rotation (OrbitControls)
- Terminal-style typing animation
- Tron-style grid background

### SkillsGalaxy3D
- Skills organized as 3D spheres in space
- Category-based coloring and connections
- Hover to see skill names
- Click category to highlight connections
- Zoom and rotate controls

### iPhone3D
- Realistic 3D iPhone 15 Pro model
- Auto-rotating app screenshots
- Interactive drag to rotate
- Glowing accents and reflections
- Slide indicators

### ParticleField
- Canvas-based particle system
- Mouse trail effects
- Ambient floating particles
- Blend modes for glow effects
- Performance-optimized (200 particle limit)

## ⚙️ Customization Guide

### Personal Information
1. **Hero Section**: Edit `components/Hero3D.tsx`
   - Update titles array
   - Change name and tagline
   - Modify current status

2. **Projects**: Edit `components/Projects3D.tsx`
   - Update project details
   - Add/remove project cards
   - Configure 3D demos

3. **Experience**: Edit `components/Experience.tsx`
   - Add work experience
   - Update education
   - Modify timeline items

4. **Contact**: Edit `components/Contact.tsx`
   - Update email and social links
   - Change availability status
   - Modify location

### 3D Scenes
- **Neural Network**: Modify node positions in `NeuralNetwork3D.tsx`
- **Skills Galaxy**: Update skills array in `SkillsGalaxy3D.tsx`
- **iPhone**: Customize slides in `iPhone3D.tsx`

### Styling
- **Colors**: Edit `tailwind.config.ts`
- **Fonts**: Update `app/globals.css`
- **Animations**: Modify Framer Motion props in components

## 🎯 Performance Optimization

- **Dynamic Imports**: 3D components loaded only when needed
- **Suspense Boundaries**: Graceful loading states
- **Particle Limiting**: Max 200 particles for smooth performance
- **LOD (Future)**: Can add Level of Detail for complex scenes
- **Code Splitting**: Automatic via Next.js

## 📱 Mobile Considerations

- Responsive breakpoints for all components
- Touch-friendly controls for 3D scenes
- Reduced particle count on mobile
- Simplified animations for performance
- Mobile-optimized text sizes

## 🔮 Future Enhancements

### Phase 2 (Optional)
- [ ] Post-processing effects (bloom, chromatic aberration)
- [ ] Custom GLSL shaders for advanced effects
- [ ] Physics simulations with Cannon.js
- [ ] GitHub contribution heatmap integration
- [ ] Blog section with MDX support

### Phase 3 (Advanced)
- [ ] WebGL custom shaders
- [ ] 3D project architecture visualizations
- [ ] Animated code editor with live output
- [ ] Easter eggs (Konami code, etc.)
- [ ] Analytics integration

## 🐛 Troubleshooting

### 3D Components Not Loading
- Check browser WebGL support: visit `webglreport.com`
- Clear Next.js cache: `rm -rf .next`
- Restart dev server

### Performance Issues
- Reduce particle count in `ParticleField.tsx`
- Disable 3D components on mobile
- Check GPU acceleration in browser settings

### Build Errors
- Ensure all dependencies installed: `npm install`
- Check TypeScript errors: `npm run lint`
- Verify Node version: `node --version` (v18+ recommended)

## 📄 License

© 2025 Kushagra Kanaujia. All rights reserved.

---

**Built with** ❤️ **using Next.js, Three.js, and modern web technologies**
