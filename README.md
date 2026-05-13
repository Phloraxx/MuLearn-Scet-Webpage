# µLearn Sahrdaya Portfolio

A modern, responsive portfolio website for **µLearn Sahrdaya**, the IEEE-backed peer-learning community at Sahrdaya College of Engineering & Technology, Kodakara. The platform showcases the club's activities, manages workshop registrations (Karma War), provides a task-based learning system with admin review, and includes full-screen orientation presentations for fresher events.

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 |
| **Build Tool** | Vite 7 |
| **Styling** | Tailwind CSS v4 |
| **Animation** | Framer Motion |
| **Routing** | React Router v7 |
| **Icons** | react-icons, lucide-react |
| **HTTP** | Axios |
| **UI Library** | Headless UI |
| **Linting** | ESLint 9 |

## Features

### Portfolio Site
- Hero section with club branding and call-to-action
- About section with mission, values, and community stats
- Projects section displaying workshop series and initiatives
- Gallery with lightbox modal and animated statistics counters
- Team member carousel with social links
- Contact section with form and social links
- Multi-column footer with newsletter signup

### Karma War Registration (`/karma-war`)
- 3-step team registration form (Squad Commander + 2 Operatives)
- Real-time MuID validation against µLearn API via Cloudflare Worker
- Fetches karma points and rank for each MuID
- Submits registration data to Google Sheets via Apps Script
- Retro CRT TV and glitch-text UI theme

### Admin Panel (`/admin`)
- Password-protected dashboard (default: `WASDQWE`)
- View all task submissions with status indicators
- Approve or reject submissions
- Filter by status and search by student details
- Real-time submission statistics

### Task Management
- 3 progressive tasks: Command Line (1pt), GitHub (2pts), Enablement (5pts)
- Student submits GitHub repository URLs for review
- Status tracking: Pending &rarr; Approved or Rejected
- Resubmission support for rejected tasks
- Leaderboard ranking participants by accumulated points

### Presentation Mode (`/present`)
- 16-slide full-screen orientation slideshow
- Snap scrolling, keyboard navigation, animated transitions
- Suitable for projector-based fresher presentations

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/mulearn-sahrdaya/mulearn-portfolio.git
cd mulearn-portfolio
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173`. The dev server proxies `/api/*` requests to the Cloudflare Worker backend.

### Production Build

```bash
npm run build
npm run preview
```

Output goes to `dist/`.

## Project Structure

```
src/
├── main.jsx                  # Entry point with BrowserRouter
├── App.jsx                   # Root component and route definitions
├── index.css                 # Tailwind imports + custom theme
├── components/
│   ├── Navigation.jsx        # Sticky navbar with section links
│   ├── HeroSection.jsx       # Landing hero
│   ├── AboutSection.jsx      # Mission and stats
│   ├── ProjectsSection.jsx   # Project cards
│   ├── GallerySection.jsx    # Image gallery + lightbox
│   ├── TeamSection.jsx       # Team carousel
│   ├── ContactSection.jsx    # Contact form + social links
│   ├── Footer.jsx            # Site footer
│   ├── MuLearnLogo.jsx       # Reusable SVG logo
│   ├── ScrollToTop.jsx       # Back-to-top button
│   ├── LoadingScreen.jsx     # Animated loading overlay
│   ├── ExecomCallPage.jsx    # Execom recruitment (Google Form)
│   ├── KarmaWar/
│   │   ├── KarmaWarPage.jsx  # 3-step registration form
│   │   └── KarmaWar.css      # Glitch/CRT effects
│   ├── TasksPage.jsx         # Task dashboard for participants
│   ├── LeaderboardPage.jsx   # Public leaderboard
│   ├── PresentationPage.jsx  # Orientation slideshow
│   └── TestTeamPage.jsx      # Team layout test
├── utils/
│   ├── woocommerceApi.js     # WooCommerce/Cloudflare Worker client
│   └── userUtils.js          # Auth helpers (localStorage)
```

```
public/assets/
├── team/                     # Team member photos
├── fwdaiworkshop (2)/        # Workshop event photos + orientation.mp4
├── favicon.png
├── illustration.webp
├── blob-scene-haikei.svg
├── Scet.png
└── colors.css / svg.txt / texts.txt
```

```
server/
├── cloudflare-worker.js      # MuID validation proxy worker
├── google-apps-script.js     # Sheets-connected form handler
└── appwrite/functions/       # Appwrite serverless function (MuID lookup)
```

## Design System

### Colors

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#606c38` | Dark moss green, brand primary |
| `--color-secondary` | `#283618` | Pakistan green |
| `--color-light` | `#fefae0` | Cornsilk, backgrounds |
| `--color-accent` | `#dda15e` | Earth yellow |
| `--color-cta` | `#bc6c25` | Tiger's eye, CTAs |

Karma War pages use an alternate purple-based palette (`#7C7CE0` primary).

### Typography

- **Inter** (body, 300-900 weight range via Google Fonts)
- **Anton**, **Bebas Neue** (display/headings)
- **Orbitron** (tech/retro elements)
- **Share Tech Mono** (monospace)
- **Special Elite** (handwritten accent)

## Routes

| Path | Component | Description |
|---|---|---|
| `/` | HomePage (inline) | Main portfolio landing page |
| `/karma-war` | KarmaWarPage | Team registration for Karma War |
| `/req` | ExecomCallPage | Execom application (Google Form embed) |
| `/games` | ExternalGamesRedirect | Redirects to external Google Form |
| `/admin` | (separate branch) | Admin dashboard for task review |

## API Architecture

```
Frontend (Vite dev server)
  │
  ├── /api/* ──proxy──> Cloudflare Worker ──> MuLearn API (MuID validation)
  │
  ├── WooCommerce API ──via──> Cloudflare Worker ──> WordPress/WooCommerce (tasks/orders)
  │
  └── Karma War form ──POST──> Google Apps Script ──> Google Sheets (registrations)
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint across the project |

## License

Educational project for µLearn Sahrdaya, Sahrdaya College of Engineering & Technology.
