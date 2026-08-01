import { Link } from 'react-router';
import { FaTrophy } from 'react-icons/fa6';
import InstagramPreviewCard from '../InstagramPreviewCard';
import './KarmaWar.css';

// --- Components ---

const TvSet = () => {
  return (
    <div className="relative w-full max-w-lg aspect-[4/3] bg-gray-800 rounded-3xl p-4 shadow-tv border-4 border-gray-600 mx-auto transform hover:scale-[1.02] transition-transform duration-500 group">
      {/* Power LED */}
      <div className="absolute top-2 right-8 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>

      {/* Inner Bezel */}
      <div className="w-full h-full bg-black rounded-2xl p-4 border-b-2 border-gray-700 relative overflow-hidden">

        {/* Screen Container */}
        <div className="w-[85%] h-full bg-screen-blue relative overflow-hidden rounded-xl flex flex-col items-center justify-center shadow-inner group-hover:brightness-110 transition-all">

          {/* Effects */}
          <div className="absolute inset-0 tv-scanline z-20 opacity-30"></div>
          <div className="absolute inset-0 crt-overlay z-20"></div>
          <div className="absolute inset-0 opacity-20 bg-noise animate-pulse z-0"></div>

          {/* Screen Content */}
          <div className="relative z-10 text-center transform -rotate-2">
            <p className="text-white/80 font-mono text-xs mb-2 tracking-[0.2em] uppercase">Event Completed</p>
            <h2 className="text-5xl lg:text-6xl font-display italic text-white leading-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
              THANK<br />YOU
            </h2>
          </div>
        </div>

        {/* Side Controls Panel */}
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gray-900 border-l border-gray-700 flex flex-col items-center py-6 gap-4 z-30 rounded-r-xl">
          {/* Dials */}
          <div className="w-10 h-10 rounded-full border-4 border-gray-700 bg-gray-800 shadow-inner relative transform rotate-45">
            <div className="absolute w-1 h-4 bg-gray-600 top-1 left-1/2 -translate-x-1/2"></div>
          </div>
          <div className="w-10 h-10 rounded-full border-4 border-gray-700 bg-gray-800 shadow-inner relative transform -rotate-12">
            <div className="absolute w-1 h-4 bg-gray-600 top-1 left-1/2 -translate-x-1/2"></div>
          </div>

          {/* Speaker Grill */}
          <div className="mt-auto grid grid-cols-2 gap-1 px-2">
            <div className="w-full h-1 bg-gray-700"></div> <div className="w-full h-1 bg-gray-700"></div>
            <div className="w-full h-1 bg-gray-700"></div> <div className="w-full h-1 bg-gray-700"></div>
            <div className="w-full h-1 bg-gray-700"></div> <div className="w-full h-1 bg-gray-700"></div>
            <div className="w-full h-1 bg-gray-700"></div> <div className="w-full h-1 bg-gray-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BackgroundDecorations = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30" aria-hidden="true">
      <div className="absolute top-20 left-10 h-56 w-56 -rotate-12 rounded-full border-[28px] border-gray-500/60 border-r-transparent"></div>
      <div className="absolute bottom-24 right-16 h-40 w-40 rotate-45 border-[24px] border-gray-500/50"></div>
      <div className="absolute top-1/3 right-24 h-28 w-28 rotate-12 rounded-full bg-gray-700/30"></div>
      <div className="absolute top-10 left-1/3 -rotate-6 w-28 h-14 border-8 border-black rounded-full"></div>
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] border-l-4 border-b-4 border-gray-400 opacity-20 rotate-3"></div>
      <div className="absolute bottom-0 left-0 w-[50rem] h-[50rem] border-r-4 border-t-4 border-gray-400 opacity-20 -rotate-2"></div>
    </div>
  );
};
const Navbar = () => {
  return (
    <nav className="absolute top-0 w-full z-50 p-6 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-primary font-display text-2xl tracking-tighter lowercase">µLearn</span>
        <span className="text-xs font-mono text-gray-500 border-l border-gray-400 pl-2">Sahrdaya</span>
      </Link>
      <div className="flex gap-4">
        {/* Login button removed as registration is on the page */}
      </div>
    </nav>
  );
};

const HeroSection = () => {
  return (
    <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative">
      <div className="text-center mb-8 relative">
        <div className="absolute top-0 right-0 w-[105%] h-full bg-primary/30 -z-10 transform translate-x-4 -translate-y-2"></div>
        <h1
          className="text-7xl lg:text-9xl font-display font-black tracking-tighter leading-none text-secondary glitch-text"
          data-text="KARMA WAR"
        >
          KARMA WAR
        </h1>
        <div className="flex items-center justify-center gap-4 mt-2">
          <div className="h-1 bg-black w-12"></div>
          <p className="text-xl lg:text-2xl font-retro tracking-widest uppercase">Completed</p>
          <div className="h-1 bg-black w-12"></div>
        </div>
        <div className="mt-2">
          <p className="text-5xl lg:text-6xl font-handwritten font-bold text-black drop-shadow-lg">2026</p>
        </div>
      </div>

      <TvSet />

      <div className="mt-8 flex items-center gap-3 opacity-50" aria-hidden="true">
        <span className="h-px w-20 bg-gray-500" /><span className="font-mono text-[0.6rem] tracking-[0.35em] text-gray-500">END OF TRANSMISSION</span><span className="h-px w-20 bg-gray-500" />
      </div>
    </div>
  );
};

const CompletedBanner = () => {
  return (
    <div className="w-full lg:w-1/3 relative z-20 lg:scale-90">
      <div className="bg-white/80 backdrop-blur-sm border border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-lg text-center">
        <FaTrophy className="mx-auto mb-4 text-6xl text-primary" aria-hidden="true" />
        <h3 className="text-3xl font-tech font-bold uppercase text-secondary mb-2">Karma War Has Ended</h3>
        <p className="text-sm font-mono text-gray-500 mb-6">
          Thank you to all squads who enlisted and fought. The battle is over.
        </p>

        <div className="mb-6">
          <p className="text-primary font-bold text-lg mb-3">Winners</p>
          <InstagramPreviewCard
            href="https://www.instagram.com/p/DUV0UKEkso6/"
            image="/assets/karmawar/previews/karma-winners-v2.webp"
            title="Karma War winners"
            className="aspect-[4/5] border-gray-300"
          />
        </div>

        <div className="space-y-3">
          <a
            href="https://chat.whatsapp.com/IxnzOfJo4Kt3Zzg8ZBZdCl"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-[#5555b8] text-white font-tech font-bold py-3 uppercase tracking-widest hover:bg-[#48489f] transition-all"
          >
            Join Community
          </a>
          <Link
            to="/"
            className="block w-full border-2 border-gray-400 text-gray-600 font-tech font-bold py-3 uppercase tracking-widest hover:bg-gray-100 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

const KarmaWarPage = () => {
  return (
    <div className="bg-background-light min-h-screen font-karma-sans text-secondary bg-grunge-pattern relative overflow-x-hidden selection:bg-primary selection:text-white">
      <Navbar />

      <BackgroundDecorations />

      <main className="relative z-10 flex flex-col lg:flex-row min-h-screen items-center justify-center p-6 gap-12 lg:gap-20 pt-24 lg:p-0">
        <HeroSection />
        <CompletedBanner />
      </main>

      <div className="fixed bottom-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-purple-500 to-blue-500 opacity-50 pointer-events-none z-50"></div>
    </div>
  );
};

export default KarmaWarPage;
