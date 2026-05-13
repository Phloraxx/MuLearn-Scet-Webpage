# µLearn Sahrdaya
<img src="public/assets/Screenshot%202026-05-13%20153220.png" alt="µLearn learning illustration"  align="center">

The official campus website for **µLearn Sahrdaya**, the peer-learning community at Sahrdaya College of Engineering & Technology, Kodakara. A single-page application that serves as the club's digital presence — featuring event showcases, team profiles, Karma War registration, a task-based learning system with review workflow and public leaderboard.

Built with React 19, Vite 7, Tailwind CSS v4, and Framer Motion.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (Vite)                   │
│   React 19 · React Router · Tailwind · Framer Motion│
└──────────┬──────────┬──────────────┬────────────────┘
           │          │              │
    ┌──────┘    ┌─────┘      ┌──────┘
    ▼           ▼             ▼
┌──────────┐ ┌──────────┐ ┌──────────────────┐
│MuLearn   │ │Cloudflare│ │Google Apps Script│
│API       │ │Worker    │ │(Karma War form)  │
│(MuID     │ │(Tasks,   │ └────────┬─────────┘
│ lookup)  │ │ orders)  │          ▼
└──────────┘ └──────────┘    ┌──────────┐
                             │Google    │
                             │Sheets    │
                             └──────────┘

┌─────────────────────────────────────────────────────┐
│              Self-Hosted Backend Services            │
│                                                     │
│  Appwrite Function  ──►  MuLearn API Auth           │
│  (MuID validation,    (fetch student karma/rank)    │
│   token caching)                                     │
│                                                     │
│  Cloudflare Worker   ──►  Task/Order API            │
│  (task submissions,    (custom backend)             │
│   leaderboard)                                       │
│                                                     │
│  Google Apps Script  ──►  Google Sheets             │
│  (Karma War           (registration data)           │
│   registration)                                      │
└─────────────────────────────────────────────────────┘
```

### Backend Services

| Service | Purpose | Hosting |
|---|---|---|
| **Appwrite Function** | Authenticates to MuLearn API, caches tokens, fetches student data (karma, rank) by MuID | Self-hosted Appwrite |
| **Cloudflare Worker** | Task submission CRUD, leaderboard computation, admin review workflow | Cloudflare Workers |
| **Google Apps Script** | Karma War team registration — parses JSON payload, writes to Google Sheets | Google Workspace |

No external database credentials are exposed in the frontend. All API calls pass through serverless functions with CORS enforcement.

---

## Features

### Hero

<img src="public/assets/illustration.webp" alt="µLearn learning illustration" width="320" align="right" />

The landing section uses a full-viewport gradient background (`bg-gradient-to-br from-cornsilk via-cornsilk-600 to-earth-yellow-800`) with an animated SVG blob scene that fades in over 3 seconds. Two layers serve mobile (`blob-scene-haikei-mobile.svg`) and desktop (`blob-scene-haikei.svg`) via responsive breakpoints.

Content is layered on top with staggered Framer Motion entrances:
- **Logo + branding** — MuLearnLogo (scaled in) with "SahrdayaCET" subtitle (fade-in at 0.5s delay)
- **Tagline** — "Empowering Students Through Peer Learning & Innovation" (slide-up at 0.3s)
- **Subtext** — "Ready to start your learning journey?..." (slide-up at 0.6s)
- **CTAs** — Two buttons: "Register for Karma War" (Tiger's Eye bg, hover scales to 1.05) and "Learn More" (outline style, links to mulearn.org). Both appear at 0.9s delay.
- **Floating illustration** — `illustration.webp` sits at the bottom, gently bobbing in a 4-second infinite y-axis loop
- **Scroll indicator** — Pill-shaped widget at the bottom with a bouncing dot (2s loop), fades in at 1.5s

### About

Mission statement, phone mockup playing the orientation video (`/assets/fwdaiworkshop (2)/orientation.mp4`), floating icon badges (Rocket, Users, Lightbulb), and community stats. Ends with a "Get Started Today" CTA linking to app.mulearn.org.

### Projects

6 project cards (Art of Teaching, Web Development IG, Open Source, Permute, Cyber Security, Hacktoberfest) with gradient headers, tags, status badges, "Learn More" + "Join" action buttons. Desktop uses a responsive grid; mobile falls back to a carousel with arrow navigation and dot indicators.

### Gallery

8 workshop photos in a responsive grid. Hover reveals a dark overlay with "Click to expand". Click opens a full-screen lightbox modal with the image title. Animated counter section (50+ events, 1000+ students, 141814+ karma, 15+ experts) using `requestAnimationFrame` for smooth number transitions.

### Team

6-member carousel (Yadhu Krishna, Sandhwana Rose Shaju, Nandhana Biju, Sourav P Bijoy, Abel md, Niya rose Joseph). Left panel shows name, role, description, social links (Instagram). Right panel shows the member photo with a 3D card flip animation. Dot navigation, Previous/Next buttons, "Connect With Us" CTA linking to Discord.

### Footer

4-column layout: brand section with MuLearnLogo + social icons (Discord, GitHub, LinkedIn, Instagram), Quick Links, Community, Resources. Newsletter input (visual only) and copyright bar crediting the µLearn SCET Tech Team.

### Karma War Registration (`/karma-war`)

A 3-step team enrollment flow with real-time MuID validation:

```
Step 1: Squad Commander ──► Step 2: Operative Alpha ──► Step 3: Operative Bravo
   (Team Lead)                  (Member 2)                   (Member 3)
```

**Per-step validation:**
- Fields: name, year of study (1st-4th), department (CSE/ASH), institutional email (`@sahrdaya.ac.in`), phone (auto-strips non-digits, handles +91 prefix), MuID
- On MuID blur → POST to `https://tests.mulearnscet.in` → Cloudflare Worker authenticates to MuLearn API → returns `{ valid, data: { karma, rank, level } }`
- Valid MuID shows green border + karma/rank display; invalid shows red border + error message
- Step 3 includes a "Rules of Engagement" checkbox + WhatsApp group link

**On final submit:**
1. All 3 MuIDs must be validated
2. Total karma computed server-side across all members
3. POSTs JSON payload to Google Apps Script (no-cors mode)
4. Apps Script writes to Google Sheets: timestamp + all 3 members' details
5. User sees success screen with WhatsApp group link + "top 20 teams by karma" warning

**UI theme:** Retro CRT TV with scanline overlay, glitch text effect, noise texture, Material Icons decorations, free-entry badge, monospace typography (Share Tech Mono, Orbitron).

### Task Management

A 3-task progressive learning system for workshop participants:

| # | Task | Difficulty | Points |
|---|---|---|---|
| 1 | [Intro to Command Line](https://learn.mulearn.org/challenge/intro-to-command-line) | Easy | 1 |
| 2 | [Intro to GitHub](https://learn.mulearn.org/challenge/intro-to-github) | Medium | 2 |
| 3 | [GitHub Enablement Task](https://github.com/gtech-mulearn/Github-Enablment-Task) | INSANE HARD | 5 |

**User flow:**
1. Login via Google OAuth → MuLearn registration check
2. Task dashboard shows 3 cards with GitHub URL inputs
3. Submit → creates order via Cloudflare Worker API → status: `pending`
4. Admin reviews via backend UI, approves or rejects
5. User sees real-time status: Pending (yellow) / Approved (green) / Rejected (red)
6. Rejected tasks show admin feedback + resubmission input field
7. Leaderboard ranks participants by total points

**Performance:** In-memory API cache (30s for user data, 5min for leaderboard). Single API call fetches all task statuses per user instead of N calls.

### Execom Recruitment (`/req`)

Embeds a Google Form iframe for executive committee applications. Role call: Web Development, Cybersecurity, Comic Creation.

---

## Routes

| Path | Component | Description |
|---|---|---|
| `/` | `HomePage` (inline) | Main landing: Nav + Hero + About + Projects + Gallery + Team + Footer |
| `/karma-war` | `KarmaWarPage` | 3-step team registration with MuID validation |
| `/req` | `ExecomCallPage` | Google Form iframe for execom applications |
| `/games` | Redirect | Immediately redirects to external Google Form |

---

## Project Structure

```
src/
├── main.jsx                          # ReactDOM entry, BrowserRouter
├── App.jsx                           # Route definitions, loading screen
├── index.css                         # Tailwind v4 + custom theme tokens
├── presentation.css                  # Snap-scroll CSS for slideshow
│
├── components/
│   ├── Navigation.jsx                # Sticky nav, scroll-aware, mobile drawer
│   ├── HeroSection.jsx               # Animated hero with blob BG, logo, CTAs
│   ├── AboutSection.jsx              # Mission + phone mockup video player
│   ├── ProjectsSection.jsx           # 6 project cards, desktop grid + mobile carousel
│   ├── GallerySection.jsx            # 8-image grid, lightbox modal, animated counters
│   ├── TeamSection.jsx               # 6-member carousel with image flip animation
│   ├── ContactSection.jsx            # Contact form + info cards + social links
│   ├── Footer.jsx                    # 4-column footer, newsletter, social icons
│   ├── MuLearnLogo.jsx               # Reusable SVG logo (small/default/large)
│   ├── ScrollToTop.jsx               # Floating back-to-top button
│   ├── LoadingScreen.jsx             # Animated splash with progress bar
│   ├── ExecomCallPage.jsx            # Google Form embed for execom recruitment
│   ├── TasksPage.jsx                 # Task dashboard with 3-task workflow
│   ├── LeaderboardPage.jsx           # Public leaderboard with points ranking
│   ├── PresentationPage.jsx          # 16-slide orientation slideshow
│   ├── TestTeamPage.jsx              # Team layout sandbox
│   └── KarmaWar/
│       ├── KarmaWarPage.jsx          # 3-step registration with MuID validation
│       └── KarmaWar.css              # Glitch/CRT scanline effects
│
├── utils/
│   ├── cloudflareApi.js              # Cloudflare Worker API client (tasks, orders, leaderboard)
│   └── userUtils.js                  # localStorage auth helpers
```

```
public/
└── assets/
    ├── favicon.png
    ├── illustration.webp
    ├── blob-scene-haikei.svg / blob-scene-haikei-mobile.svg
    ├── Scet.png
    ├── colors.css / svg.txt / texts.txt
    ├── team/                         # 7 team member headshots
    └── fwdaiworkshop (2)/            # 10 workshop photos + orientation.mp4
```

```
server/
├── cloudflare-worker.js              # MuID validation proxy (POST → MuLearn API)
├── google-apps-script.js             # Sheets-connected Karma War form handler
└── appwrite/functions/
    └── fetchMulearnData/
        └── src/index.js              # Appwrite function: MuID lookup with token caching
```

---

## Data Flow

### Karma War Registration

```
User fills step 1-3 form
        │
        ├── On MuID blur ──► Cloudflare Worker ──► MuLearn API ──► { valid, karma, rank }
        │
        └── On submit ──► Google Apps Script ──► Google Sheets
```

### Task Submission

```
User submits GitHub URL
        │
        ▼
Cloudflare Worker API ──► Custom backend (order created, status: pending)
        │
        ▼
Admin reviews via dashboard ──► Approve or Reject
        │
        ▼
Student sees updated status, can resubmit if rejected
```

### MuID Validation

```
KarmaWarPage ──► fetch("https://tests.mulearnscet.in", POST { muid })
        │
        ▼
Cloudflare Worker ──► login to app.mulearn.org ──► fetch user by MuID ──► return data
        │
        ▼
Appwrite Function (alternative) ──► cached token ──► fetch all students ──► find by muid
```

---

## Design System

### Colors

| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#606c38` | Dark moss green |
| `--color-secondary` | `#283618` | Pakistan green |
| `--color-light` | `#fefae0` | Cornsilk (backgrounds) |
| `--color-accent` | `#dda15e` | Earth yellow |
| `--color-cta` | `#bc6c25` | Tiger's eye (buttons) |

Karma War routes use an alternate purple palette (`#7C7CE0` primary).

### Typography

- **Inter** (body, 300-900 weight)
- **Anton**, **Bebas Neue** (display)
- **Orbitron** (tech/retro)
- **Share Tech Mono** (monospace)
- **Special Elite** (handwritten)

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR (proxies `/api` to Cloudflare Worker) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint across the project |

---

## License

Educational project for µLearn Sahrdaya, Sahrdaya College of Engineering & Technology.
