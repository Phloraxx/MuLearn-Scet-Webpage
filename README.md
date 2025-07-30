# µLearn Sahrdaya Portfolio Website

A modern, responsive website for **µLearn Sahrdaya**, the education club of Sahrdaya College of Engineering & Technology. Built with React, Tailwind CSS, and Framer Motion to showcase the club's mission of peer learning and innovation.

## 🚀 Features

- **Modern Design**: Clean, professional design inspired by developer portfolios
- **Responsive Layout**: Fully responsive design that works on all devices
- **Smooth Animations**: Beautiful animations using Framer Motion
- **Interactive Elements**: Hover effects, smooth scrolling, and interactive components
- **Workshop Registration**: Google OAuth-based registration system with WooCommerce backend
- **Task Management System**: Personalized task dashboard for workshop participants
- **Gallery**: Dynamic image gallery with lightbox functionality
- **Contact Form**: Functional contact form with validation
- **Loading Screen**: Animated loading screen for better user experience
- **Custom Color Palette**: Integrated custom color scheme from brand guidelines

## 🎯 Workshop & Task Management

### Registration Flow
1. **Google Authentication**: Students login with their Sahrdaya Google account
2. **Registration Check**: Automatic verification if student is already registered
3. **Smart Redirect**: Already registered students are redirected to tasks page
4. **New Registration**: Complete registration flow for new students

### Task Dashboard Features
- **Three Learning Tasks**:
  1. **Intro to Command Line** (Easy) - https://learn.mulearn.org/challenge/intro-to-command-line
  2. **Intro to GitHub** (Medium) - https://learn.mulearn.org/challenge/intro-to-github  
  3. **GitHub Enablement Task** (INSANE HARD) - https://github.com/gtech-mulearn/Github-Enablment-Task

- **Progress Tracking**: Visual progress bar and completion status
- **GitHub Integration**: Students submit repository links for verification
- **WordPress Backend**: All submissions are stored in WooCommerce for tracking
- **Persistent Storage**: Task progress saved locally and synced with backend
- **Real-time Status Updates**: Tasks reflect admin feedback (approved/rejected/pending)
- **Resubmission System**: Students can resubmit rejected tasks with updated repositories

### User Experience
- **Automatic Redirects**: Seamless flow between registration and tasks
- **Session Persistence**: Login state maintained across browser sessions  
- **Real-time Validation**: GitHub URL validation and submission feedback
- **Mobile Optimized**: Full functionality on all devices

## 🔧 Admin Panel

### Admin Access
- **Secure Login**: Password-protected admin portal (`/admin`)
- **Admin Password**: `WASDQWE`
- **Task Review System**: Comprehensive dashboard for managing submissions

### Admin Features
- **Submission Overview**: View all student task submissions in a table format
- **Status Management**: Approve tasks or flag them for retry
- **Filtering & Search**: Filter by status (pending/approved/rejected) and search by student details
- **Real-time Stats**: Dashboard showing total submissions, pending reviews, approved, and rejected tasks
- **GitHub Integration**: Direct links to student repositories for quick review
- **WordPress Backend**: All status updates stored in WooCommerce for persistence

### Admin Workflow
1. Navigate to `/admin` and login with admin password
2. View dashboard with submission statistics
3. Review individual task submissions
4. Click "Approve" for correct submissions or "Flag" for retry
5. Use filters to focus on specific status types
6. Search functionality for finding specific students or tasks

### Task Status Workflow
1. **Student Submission**: Task submitted → Status: "Under Review 🔍"
2. **Admin Review**: Admin approves or flags for retry
3. **Approved**: Task marked as "Approved ✅" → Student sees completion
4. **Rejected**: Task marked as "Needs Resubmission ⚠️" → Student can resubmit
5. **Resubmission**: Student submits updated repository → Back to review

## 🛠️ Technologies Used

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Authentication**: Google OAuth
- **Backend**: WordPress/WooCommerce via Cloudflare Workers
- **Icons**: React Icons
- **UI Components**: Headless UI

## 📁 Project Structure

```
mulearn-portfolio/
├── public/
│   └── assets/           # Static assets (images, SVGs)
├── src/
│   ├── components/       # React components
│   │   ├── HeroSection.jsx
│   │   ├── AboutSection.jsx
│   │   ├── ProjectsSection.jsx
│   │   ├── GallerySection.jsx
│   │   ├── ContactSection.jsx
│   │   ├── Navigation.jsx
│   │   ├── Footer.jsx
│   │   ├── LoadingScreen.jsx
│   │   ├── ScrollToTop.jsx
│   │   ├── RegistrationPage.jsx  # Workshop registration
│   │   ├── TasksPage.jsx         # Task management dashboard
│   │   └── AdminPage.jsx         # Admin panel for task review
│   ├── utils/
│   │   └── woocommerceApi.js    # Backend API integration
│   ├── App.jsx           # Main application component
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles and Tailwind imports
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
└── package.json         # Project dependencies and scripts
```

## 🎨 Design System

### Color Palette
- **Dark Moss Green**: `#606c38` - Primary brand color
- **Pakistan Green**: `#283618` - Secondary brand color
- **Cornsilk**: `#fefae0` - Background and light accents
- **Earth Yellow**: `#dda15e` - Accent color
- **Tiger's Eye**: `#bc6c25` - Call-to-action and highlights

### Typography
- **Font Family**: Inter (Google Fonts)
- **Font Weights**: 300-900 range for various text styles

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mulearn-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 📝 Content Sections

### 1. Hero Section
- Club name and tagline
- Call-to-action buttons
- Background illustration
- Scroll indicator

### 2. About Section
- Club mission and philosophy
- Core values and principles
- Community statistics

### 3. Projects Section
- Workshop series
- Learning initiatives
- Community projects
- Interactive project cards

### 4. Gallery Section
- Event photos
- Workshop images
- Community moments
- Lightbox functionality

### 5. Contact Section
- Contact form
- Social media links
- Location information
- Quick action buttons

## 🎯 Key Features Implemented

- **Smooth Scrolling Navigation**: Seamless navigation between sections
- **Loading Animation**: Professional loading screen with progress bar
- **Responsive Design**: Mobile-first approach with responsive grid layouts
- **Image Optimization**: Lazy loading and optimized image assets
- **Interactive Animations**: Hover effects and scroll-triggered animations
- **Form Validation**: Client-side form validation for contact form
- **SEO Optimization**: Meta tags and semantic HTML structure

## 📱 Mobile Optimization

- Touch-friendly navigation
- Optimized image sizes
- Responsive typography
- Mobile-specific interactions
- Performance optimizations

## 🔧 Customization

### Updating Colors
Colors are defined in `src/index.css` using CSS custom properties. Update the `@theme` section to modify the color palette.

### Adding New Sections
1. Create a new component in `src/components/`
2. Import and add it to `App.jsx`
3. Update navigation if needed

### Modifying Content
- Update text content in respective component files
- Replace images in the `public/assets/` directory
- Modify social links and contact information in components

## 🌟 Performance Optimizations

- Lazy loading for images
- Code splitting with React lazy loading
- Optimized bundle size with Vite
- Efficient animation performance with Framer Motion
- Responsive image loading

## 📄 License

This project is created for µLearn Sahrdaya educational purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support or questions, please contact the µLearn Sahrdaya team through:
- Discord: [Join our server]
- Email: mulearn@sahrdaya.ac.in
- Campus: Sahrdaya College of Engineering & Technology

---

**Built with ❤️ by the µLearn Sahrdaya community**+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
