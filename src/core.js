/* ============================================================
   NEXIS GAMES — Application Source (Plaintext)
   --------------------------------------------------------
   This is the editable React/Babel application source.
   After making changes here, run:
       python3 build.py
   to regenerate the encrypted bundle /app/core.dat.
   --------------------------------------------------------
   Do NOT include this file in production deployments unless
   you want to expose the source. (It is git-ignored by default.)
   ============================================================ */

    import { initializeApp } from 'firebase/app';
    import { 
      getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
      signOut, onAuthStateChanged, updateProfile, signInAnonymously, 
      signInWithCustomToken, sendPasswordResetEmail, sendEmailVerification
    } from 'firebase/auth';
    import { 
      getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc, 
      collection, onSnapshot, enableIndexedDbPersistence, addDoc
    } from 'firebase/firestore';
    import { RegExpMatcher, TextCensor, englishDataset, englishRecommendedTransformers } from 'obscenity';

    const { useState, useEffect, useRef, memo, useMemo } = React;

    // --- UI ICONS ---
    const HomeIcon = ({ size = 24, className = "" }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="currentColor" fillOpacity="0.1"/><polyline points="9 22 9 12 15 12 15 22"/></svg>);
    const UserIcon = ({ size = 24, className = "" }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" fill="currentColor" fillOpacity="0.1"/><circle cx="12" cy="7" r="4" fill="currentColor" fillOpacity="0.1"/></svg>);
    const SettingsIcon = ({ size = 24, className = "" }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.1"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>);
    const TrophyIcon = ({ size = 24, className = "" }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" fill="currentColor" fillOpacity="0.1"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0z" fill="currentColor" fillOpacity="0.1"/></svg>);
    const SearchIcon = ({ size = 24, className = "" }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8" fill="currentColor" fillOpacity="0.1"/><path d="m21 21-4.3-4.3"/></svg>);
    const PlayIcon = ({ size = 24, className = "", fill = "none" }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="5 3 19 12 5 21 5 3"/></svg>);
    const Gamepad2Icon = ({ size = 24, className = "" }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="12" x="2" y="6" rx="2" fill="currentColor" fillOpacity="0.1"/><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/></svg>);
    const ChevronLeftIcon = ({ size = 24, className = "" }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6"/></svg>);
    const Maximize2Icon = ({ size = 24, className = "" }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/></svg>);
    const Minimize2Icon = ({ size = 24, className = "" }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" x2="21" y1="10" y2="3"/><line x1="3" x2="10" y1="21" y2="14"/></svg>);
    const XIcon = ({ size = 24, className = "" }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>);
    const MenuIcon = ({ size = 24, className = "" }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>);
    const HeartIcon = ({ size = 24, className = "", fill = "none" }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>);
    const SurpriseIcon = ({ size = 24, className = "" }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" fill="currentColor" fillOpacity="0.1"/><path d="M5 3v4M7 5H3"/><path d="M19 17v4M21 19h-4"/></svg>);
    const ShieldIcon = ({ size = 24, className = "" }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.1"/></svg>);
    const BanIcon = ({ size = 24, className = "" }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.1"/><path d="m4.9 4.9 14.2 14.2"/></svg>);
    const ClockIcon = ({ size = 24, className = "" }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.1"/><polyline points="12 6 12 12 16 14"/></svg>);
    const WifiOffIcon = ({ size = 24, className = "" }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="2" y1="2" x2="22" y2="22"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M2 8.82a15 15 0 0 1 4.17-2.65"/><path d="M10.66 5c4.01-.36 8.14.9 11.34 3.82"/></svg>);
    const CodeIcon = ({ size = 24, className = "" }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>);
    const MessageIcon = ({ size = 24, className = "" }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" fill="currentColor" fillOpacity="0.1"/></svg>);
    const StarIcon = ({ size = 24, className = "", filled = false }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
    const SendIcon = ({ size = 24, className = "" }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor" fillOpacity="0.1"/></svg>);
    const EyeIcon = ({ size = 24, className = "" }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" fill="currentColor" fillOpacity="0.1"/><circle cx="12" cy="12" r="3"/></svg>);
    const EyeOffIcon = ({ size = 24, className = "" }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" fill="currentColor" fillOpacity="0.1"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" fill="currentColor" fillOpacity="0.1"/><line x1="2" y1="2" x2="22" y2="22"/></svg>);
    const UsersIcon = ({ size = 24, className = "" }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>);
    const UploadIcon = ({ size = 24, className = "" }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" fill="currentColor" fillOpacity="0.1"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>);

    // --- GAME ICON RENDERER (Fast & Lightweight Image Loader) ---
    const GameIconRenderer = memo(({ title, isCommunity }) => (
      <div className="w-full h-full rounded-[20px] overflow-hidden bg-obsidian-950 p-0 box-border shadow-inner border border-white/5 relative group flex items-center justify-center">
        <img 
          src={isCommunity ? `assets/Community.png` : `assets/${title}.png`} 
          alt={title} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 z-10" 
          onError={e => {
            e.target.style.display = 'none'; 
            e.target.nextSibling.style.display = 'flex'; 
          }}
        />
        <div style={{display: 'none'}} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950 to-violet-950 z-0 text-center p-2">
            <span className="text-3xl font-black text-violet-400 opacity-50 mb-1">{title.charAt(0)}</span>
            <span className="text-[10px] font-bold text-violet-300 font-ui leading-tight">{title}</span>
        </div>
      </div>
    ));

    // --- ADSENSE WIDGET COMPONENT ---
    const AdSenseWidget = memo(() => {
      useEffect(() => {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          console.warn("AdSense push error:", e);
        }
      }, []);
      return (
        <div className="w-full flex justify-center mt-8 min-h-[100px] relative z-50 bg-obsidian-900/50 backdrop-blur-md rounded-2xl overflow-hidden border border-violet-500/10 shadow-inner">
          <ins className="adsbygoogle"
               style={{ display: 'block', width: '100%' }}
               data-ad-client="ca-pub-9729951455444854"
               data-ad-slot="1373555364"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>
      );
    });

    // --- FIREBASE CONFIG ---
    const firebaseConfig = { 
      apiKey: "AIzaSyBZsza33A9WhqSaywN3XJ4CsTa5lon8VPg", 
      authDomain: "nexis-games.firebaseapp.com", 
      projectId: "nexis-games", 
      storageBucket: "nexis-games.firebasestorage.app", 
      messagingSenderId: "291409336146", 
      appId: "1:291409336146:web:adf717a48f75469c44cc8b" 
    };

    let auth, db; 
    const APP_ID = 'nexis-games-production';
    try { 
      const app = initializeApp(firebaseConfig); 
      auth = getAuth(app); 
      db = getFirestore(app); 
      enableIndexedDbPersistence(db).catch(() => {}); 
    } catch (e) {}

    // --- SECURITY & PROFANITY UTILITIES ---
    const matcher = new RegExpMatcher({ ...englishDataset.build(), ...englishRecommendedTransformers });
    const censor = new TextCensor();

    const isProfane = (str) => {
        const reserved = ['admin', 'mofu', 'nexis'];
        if (reserved.some(w => str.toLowerCase().includes(w))) return true;
        return matcher.hasMatch(str);
    };

    const filterMessage = (text) => {
        const matches = matcher.getAllMatches(text);
        return censor.applyTo(text, matches);
    };

    const sanitizeUsername = (name) => {
        const regex = /^[a-zA-Z0-9_]{3,16}$/;
        return regex.test(name) && !isProfane(name);
    };

    // --- UTILS ---
    const getStreakDateString = (dateObj = new Date()) => { 
      const utc = dateObj.getTime() + (dateObj.getTimezoneOffset() * 60000); 
      const gmt7 = utc - (3600000 * 7); 
      const rolloverShift = new Date(gmt7 - (3600000 * 8)); 
      return rolloverShift.getFullYear() + '-' + String(rolloverShift.getMonth() + 1).padStart(2, '0') + '-' + String(rolloverShift.getDate()).padStart(2, '0'); 
    };

    const getDaysDifference = (d1, d2) => { 
      if (!d1 || !d2) return 999; 
      return Math.floor((new Date(d1 + 'T00:00:00Z') - new Date(d2 + 'T00:00:00Z')) / 86400000); 
    };

    const getEffectiveStreak = (p) => { 
      if (!p.lastPlayedDate || !p.currentStreak) return 0; 
      return getDaysDifference(getStreakDateString(), p.lastPlayedDate) <= 1 ? p.currentStreak : 0; 
    };

    // --- GAME DATA ---
    // Games registry loaded from /data/games.js at runtime
    const GAMES = (typeof window !== 'undefined' && window.__NEXIS_GAMES__) || [];

    const GAME_CATEGORIES = ['All', 'Favorites', '3D', 'Multiplayer', 'Action', 'Spooky', 'Adventure', 'Cooking', 'RPG', 'Arcade', 'Table', 'Strategy'];

    const THEMES = {
      violet: { name: 'Violet Void', primary: 'violet', gradient: 'from-violet-600 to-fuchsia-600', text: 'text-violet-400', border: 'border-violet-500/20', bg: 'bg-violet-500/10' },
      emerald: { name: 'Emerald Matrix', primary: 'emerald', gradient: 'from-emerald-500 to-teal-700', text: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10' },
      rose: { name: 'Crimson Core', primary: 'rose', gradient: 'from-rose-500 to-red-800', text: 'text-rose-400', border: 'border-rose-500/20', bg: 'bg-rose-500/10' },
      blue: { name: 'Cobalt Cyber', primary: 'blue', gradient: 'from-blue-500 to-cyan-700', text: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/10' },
      amber: { name: 'Solar Flare', primary: 'amber', gradient: 'from-amber-500 to-orange-700', text: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/10' }
    };

    const AVATAR_FRAMES = [
      { id: 'none', name: 'No Frame', style: 'border-white/10' },
      { id: 'neon', name: 'Neon Glow', style: 'border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.8)]' },
      { id: 'gold', name: 'Golden Champion', style: 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.8)]' },
      { id: 'fire', name: 'Inferno', style: 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.8)]' }
    ];

    // --- MAIN REACT COMPONENT ---
    function App() {
      
      // Basic States
      const [activeView, setActiveView] = useState(() => {
        const hash = window.location.hash.replace(/^#\/?/, '');
        return ['discover', 'leaderboard', 'profile', 'admin', 'reviews', 'settings'].includes(hash) ? hash : 'discover';
      }); 
      
      const [activeGame, setActiveGame] = useState(null); 
      const [searchQuery, setSearchQuery] = useState(''); 
      const [activeCategory, setActiveCategory] = useState('All'); 
      const [iframeLoading, setIframeLoading] = useState(false); 
      const [adCountdown, setAdCountdown] = useState(0); 
      const [isCssFullscreen, setIsCssFullscreen] = useState(false); 
      const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
      const [toast, setToast] = useState(null); 
      const [isOffline, setIsOffline] = useState(!navigator.onLine);
      const [pendingFullscreen, setPendingFullscreen] = useState(false);
      const [isBlocked, setIsBlocked] = useState(false);
      
      // Global Data
      const [announcements, setAnnouncements] = useState([]);
      const [globalChat, setGlobalChat] = useState([]);
      const [privateChatMessages, setPrivateChatMessages] = useState([]);
      const [activeChatTab, setActiveChatTab] = useState('global');
      const [showChatPanel, setShowChatPanel] = useState(false);
      const [chatMessage, setChatMessage] = useState('');
      const [playerSearchQuery, setPlayerSearchQuery] = useState('');
      const [gameReviews, setGameReviews] = useState([]);
      const [reviewText, setReviewText] = useState('');
      const [reviewStars, setReviewStars] = useState(5);
      const [communityGames, setCommunityGames] = useState([]);
      
      const [editingMessageId, setEditingMessageId] = useState(null);
      const [editMessageText, setEditMessageText] = useState('');
      
      // Social Data
      const [friendRequests, setFriendRequests] = useState([]);
      const [friendships, setFriendships] = useState([]);
      const [chatGroups, setChatGroups] = useState([]);
      const [showCreateGroup, setShowCreateGroup] = useState(false);
      const [newGroupName, setNewGroupName] = useState('');
      const [newGroupIcon, setNewGroupIcon] = useState('');
      
      // Auth & Profile States
      const [user, setUser] = useState(null); 
      const [currentUserTag, setCurrentUserTag] = useState(''); 
      const [currentUserPhoto, setCurrentUserPhoto] = useState(''); 
      const [currentUserBanner, setCurrentUserBanner] = useState(''); 
      const [currentUserBio, setCurrentUserBio] = useState(''); 
      const [userTheme, setUserTheme] = useState('violet');
      const [userFrame, setUserFrame] = useState('none');
      const [favorites, setFavorites] = useState([]); 
      const [recentlyPlayed, setRecentlyPlayed] = useState([]);
      const [todayPlays, setTodayPlays] = useState({});
      const [todayPlaysDate, setTodayPlaysDate] = useState(getStreakDateString());
      const [badges, setBadges] = useState([]);
      const [userStatus, setUserStatus] = useState('active'); 
      const [suspendedUntil, setSuspendedUntil] = useState(0);
      const [banReason, setBanReason] = useState('');
      const [currentXP, setCurrentXP] = useState(0);
      const [currentUserStreak, setCurrentUserStreak] = useState(0); 
      
      const [showAuthModal, setShowAuthModal] = useState(false); 
      const [authMode, setAuthMode] = useState('login'); 
      const [email, setEmail] = useState(''); 
      const [password, setPassword] = useState(''); 
      const [username, setUsername] = useState(''); 
      const [authError, setAuthError] = useState(''); 
      const [authLoading, setAuthLoading] = useState(false); 
      const [authCooldown, setAuthCooldown] = useState(false);
      const [showPassword, setShowPassword] = useState(false); 
      const [resetMessage, setResetMessage] = useState(''); 
      const [captchaBypass, setCaptchaBypass] = useState(false);
      const [botCheck, setBotCheck] = useState({ num1: 1, num2: 1, answer: '' });
      
      const [profileUsername, setProfileUsername] = useState(''); 
      const [profileUserTag, setProfileUserTag] = useState(''); 
      const [profilePhotoUrl, setProfilePhotoUrl] = useState(''); 
      const [profileBannerUrl, setProfileBannerUrl] = useState(''); 
      const [profileBio, setProfileBio] = useState(''); 
      const [isUpdatingProfile, setIsUpdatingProfile] = useState(false); 
      
      // Leaderboard States
      const [leaderboard, setLeaderboard] = useState([]); 
      const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(true); 
      const [leaderboardError, setLeaderboardError] = useState(''); 
      const [viewingPlayer, setViewingPlayer] = useState(null); 
      
      // Admin States
      const [allUsers, setAllUsers] = useState([]); 
      const [adminEditingUser, setAdminEditingUser] = useState(null); 
      const [adminEditUsername, setAdminEditUsername] = useState(''); 
      const [adminEditTag, setAdminEditTag] = useState(''); 
      const [adminEditPhoto, setAdminEditPhoto] = useState(''); 
      const [adminEditStreak, setAdminEditStreak] = useState(0); 
      const [adminEditLevel, setAdminEditLevel] = useState(1); 
      const [adminEditStatus, setAdminEditStatus] = useState('active'); 
      const [adminEditBanReason, setAdminEditBanReason] = useState('');
      const [adminEditSuspendHours, setAdminEditSuspendHours] = useState(24);
      const [adminEditBadges, setAdminEditBadges] = useState([]);
      const [newAdminBadgeCustom, setNewAdminBadgeCustom] = useState('');
      const [adminActionLoading, setAdminActionLoading] = useState(false); 

      // Audio & Loading States
      const [masterVolume, setMasterVolume] = useState(100); 
      const [musicVolume, setMusicVolume] = useState(2); 
      const [sfxVolume, setSfxVolume] = useState(100); 
      const [isSoundEnabled, setIsSoundEnabled] = useState(false);
      const [authResolved, setAuthResolved] = useState(false);
      
      const playerContainerRef = useRef(null); 
      const bgMusicRef = useRef(null);
      const chatEndRef = useRef(null);
      
      // 1. DERIVED STATE & MEMO
      const isRegistered = user && !user.isAnonymous; 
      const isDevUser = isRegistered && ['MOFU', 'DEV1', 'DEV2', 'DEV3', 'DEV4', 'DEV5'].includes(currentUserTag);
      const isAdmin = isRegistered && currentUserTag === "MOFU"; 
      const isModerator = isRegistered && (isAdmin || badges.includes('Admin'));
      const isVIP = isRegistered && (badges.includes('VIP') || isModerator);
      const canChat = isRegistered && (badges.includes('Verified') || isModerator);

      const allGames = useMemo(() => [...GAMES, ...communityGames], [communityGames]);

      const myFriendsList = useMemo(() => {
         if (!user) return [];
         return friendships.filter(f => f.u1 === user.uid || f.u2 === user.uid).map(f => f.u1 === user.uid ? f.u2 : f.u1);
      }, [friendships, user]);

      const filteredGames = useMemo(() => {
        if (activeView !== 'discover') return [];
        return allGames.filter(g => { 
          if (g.isBeta && !isDevUser) return false; 
          if (g.isMOFUOnly && currentUserTag !== 'MOFU') return false;
          const matchS = g.title.toLowerCase().includes(searchQuery.toLowerCase()) || g.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())); 
          const matchC = activeCategory === 'All' ? true : activeCategory === 'Favorites' ? favorites.includes(g.id) : g.tags.includes(activeCategory); 
          return matchS && matchC; 
        });
      }, [activeView, searchQuery, activeCategory, favorites, isDevUser, currentUserTag, allGames]);

      const gameAvgRatings = useMemo(() => {
         const ratings = {};
         allGames.forEach(g => {
            const revs = gameReviews.filter(r => r.gameId === g.id);
            ratings[g.id] = revs.length ? (revs.reduce((a,b) => a+b.stars, 0) / revs.length).toFixed(1) : null;
         });
         return ratings;
      }, [gameReviews, allGames]);

      const userLevel = Math.floor(Math.sqrt(currentXP / 100)) + 1;
      const currentLevelXP = currentXP - (Math.pow(userLevel - 1, 2) * 100);
      const nextLevelXP = (Math.pow(userLevel, 2) * 100) - (Math.pow(userLevel - 1, 2) * 100);
      const levelProgress = Math.min(100, Math.max(0, (currentLevelXP / nextLevelXP) * 100));

      const activeThemeColors = THEMES[userTheme] || THEMES.violet;
      const tColor = activeThemeColors.primary;

      const FeaturedGame = allGames[0]; 
      const FeaturedGridGames = allGames.slice(1, 3);
      const myIncomingRequests = friendRequests.filter(r => r.to === user?.uid);
      const myGroups = chatGroups.filter(g => g.members.includes(user?.uid));
      const activeGroupObj = activeChatTab.startsWith('group_') ? chatGroups.find(g => g.id === activeChatTab.replace('group_', '')) : null;

      // --- UTILITIES & NAVIGATION ---
      const navigateTo = (view) => {
        window.location.hash = view;
        setActiveView(view);
        setActiveGame(null);
        setIsSidebarOpen(false);
        if (bgMusicRef.current && isSoundEnabled) bgMusicRef.current.play().catch(e=>{});
      };

      const showToast = (message, type = 'success') => { 
        setToast({ message, type }); 
        setTimeout(() => setToast(null), 3500); 
      };

      const addXP = async (amount) => {
        if (!user || !isRegistered) return;
        const newXP = currentXP + amount;
        setCurrentXP(newXP);
        try { await updateDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'users', user.uid), { currentXP: newXP }); } catch(e) {}
      };

      // --- EFFECTS ---
      useEffect(() => {
        if (!user || user.isAnonymous) return;
        let inactivityTimer;
        const resetTimer = () => {
          clearTimeout(inactivityTimer);
          inactivityTimer = setTimeout(async () => {
            if (auth) { await signOut(auth); showToast("Logged out due to 10 minutes of inactivity.", "error"); }
          }, 10 * 60 * 1000);
        };
        const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];
        events.forEach(event => window.addEventListener(event, resetTimer));
        resetTimer();
        return () => { clearTimeout(inactivityTimer); events.forEach(event => window.removeEventListener(event, resetTimer)); };
      }, [user]);

      useEffect(() => {
        const handleHashChange = () => {
          const hash = window.location.hash.replace(/^#\/?/, '');
          if (['discover', 'leaderboard', 'profile', 'admin', 'reviews', 'settings'].includes(hash)) setActiveView(hash);
          else if (!hash) setActiveView('discover');
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
      }, []);

      useEffect(() => {
        const blockUntil = localStorage.getItem('nexis_block_until');
        if (blockUntil && parseInt(blockUntil) > Date.now()) setIsBlocked(true);
        else if (blockUntil) localStorage.removeItem('nexis_block_until');
      }, []);

      // TURNSTILE FIX - Ensures safe rendering in restricted iframes
      useEffect(() => {
        if (showAuthModal && (authMode === 'login' || authMode === 'signup')) {
            const attemptRender = () => {
                const el = document.getElementById('turnstile-container');
                if (window.turnstile && el) {
                    let isIframeRestricted = false;
                    try {
                        // Check if we are in a cross-origin iframe that blocks Turnstile
                        const testAccess = window.top.location.href;
                    } catch (e) {
                        isIframeRestricted = true;
                    }

                    if (isIframeRestricted) {
                        setCaptchaBypass(true);
                        if (el) el.innerHTML = '<div class="text-xs text-emerald-400 font-bold p-3 text-center bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-inner w-full">Security Auto-Bypassed<br/><span class="text-[10px] text-emerald-500/70 uppercase tracking-widest mt-1 block">Local Preview Mode</span></div>';
                        return;
                    }

                    try {
                        if (el.innerHTML === "") { 
                          window.turnstile.render('#turnstile-container', { 
                            sitekey: '0x4AAAAAADJvsIsXA6ZWtber', 
                            theme: 'dark' 
                          }); 
                        }
                        setCaptchaBypass(false);
                    } catch (e) {
                        setCaptchaBypass(true);
                        if (el) el.innerHTML = '<div class="text-xs text-emerald-400 font-bold p-3 text-center bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-inner w-full">Security Auto-Bypassed<br/><span class="text-[10px] text-emerald-500/70 uppercase tracking-widest mt-1 block">Local Preview Mode</span></div>';
                    }
                } else {
                    setTimeout(attemptRender, 100);
                }
            };
            attemptRender();
        } else {
            setCaptchaBypass(false);
        }
      }, [showAuthModal, authMode]);

      useEffect(() => {
        if (authMode === 'signup') {
          setBotCheck({ num1: Math.floor(Math.random() * 10) + 1, num2: Math.floor(Math.random() * 10) + 1, answer: '' });
        }
      }, [authMode]);

      useEffect(() => { 
        if (authResolved) {
           const loader = document.getElementById('nexis-global-loader');
           if (loader) { loader.style.opacity = '0'; setTimeout(() => { if (loader) loader.remove(); }, 400); }
        } 
      }, [authResolved]);

      useEffect(() => { const timeout = setTimeout(() => { setAuthResolved(true); }, 800); return () => clearTimeout(timeout); }, []);

      useEffect(() => {
        if (!bgMusicRef.current) { bgMusicRef.current = new Audio('assets/BG.mp3'); bgMusicRef.current.loop = true; bgMusicRef.current.volume = (musicVolume / 100) * (masterVolume / 100); }
      }, []);

      useEffect(() => { 
        if (bgMusicRef.current) { 
          if (activeGame || !isSoundEnabled) bgMusicRef.current.pause(); 
          else { bgMusicRef.current.volume = (musicVolume / 100) * (masterVolume / 100); bgMusicRef.current.play().catch(e => {}); } 
        } 
      }, [musicVolume, masterVolume, activeGame, isSoundEnabled]);

      useEffect(() => { 
        const handleOnline = () => setIsOffline(false); 
        const handleOffline = () => setIsOffline(true); 
        window.addEventListener('online', handleOnline); window.addEventListener('offline', handleOffline); 
        return () => { window.removeEventListener('online', handleOnline); window.removeEventListener('offline', handleOffline); }; 
      }, []);

      useEffect(() => {
        if (!auth) { setAuthResolved(true); return; }
        const initAuth = async () => { 
          try { 
            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) { try { await signInWithCustomToken(auth, __initial_auth_token); return; } catch(e) {} } 
            await signInAnonymously(auth); 
          } catch(e) {} 
        };
        initAuth(); 
        return onAuthStateChanged(auth, u => { setUser(u); setAuthResolved(true); if (u && !u.isAnonymous) setProfileUsername(u.displayName || ''); });
      }, []);

      useEffect(() => {
        if (!user || user.isAnonymous || !db) return;
        const userRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'users', user.uid);
        
        const initUser = async () => {
          try {
            const snap = await getDoc(userRef); 
            const today = getStreakDateString(); 
            let newStreak = 1; let cTag = user.uid.substring(0,4).toUpperCase(); let xp = 0; let cUser = user.displayName; 
            let cTodayPlays = {};
            
            if (snap.exists()) { 
              const d = snap.data(); cTag = d.userTag || cTag; xp = d.currentXP || 0; cUser = d.username || cUser; 
              if (d.todayPlaysDate === today) { cTodayPlays = d.todayPlays || {}; setTodayPlays(cTodayPlays); setTodayPlaysDate(d.todayPlaysDate); } 
              else { setTodayPlays({}); setTodayPlaysDate(today); }
              if (d.lastPlayedDate === today) newStreak = d.currentStreak || 1; 
              else { const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1); newStreak = d.lastPlayedDate === getStreakDateString(yesterday) ? (d.currentStreak || 0) + 1 : 0; } 
            }
            await setDoc(userRef, { 
              uid: user.uid, username: snap.exists() ? snap.data().username : (cUser || 'Gamer'), userTag: cTag, currentStreak: newStreak, 
              lastPlayedDate: today, currentXP: xp, status: snap.exists() && snap.data().status ? snap.data().status : 'active',
              badges: snap.exists() && snap.data().badges ? snap.data().badges : [], todayPlays: cTodayPlays, todayPlaysDate: today
            }, { merge: true });
            setCurrentUserStreak(newStreak);
          } catch(e) {}
        };
        initUser();
        
        return onSnapshot(userRef, s => { 
          if(s.exists()){ 
            const d = s.data(); 
            if(d.currentXP !== undefined) setCurrentXP(d.currentXP);
            if(d.currentStreak !== undefined) setCurrentUserStreak(d.currentStreak); 
            if(d.favorites) setFavorites(d.favorites); 
            if(d.recentlyPlayed) setRecentlyPlayed(d.recentlyPlayed);
            if(d.badges) setBadges(d.badges);
            if(d.status) setUserStatus(d.status); 
            if(d.suspendedUntil !== undefined) setSuspendedUntil(d.suspendedUntil);
            if(d.banReason) setBanReason(d.banReason);
            if(d.userTheme) setUserTheme(d.userTheme);
            if(d.userFrame) setUserFrame(d.userFrame);
            if(d.userTag) { setCurrentUserTag(d.userTag); setProfileUserTag(d.userTag); } 
            if(d.photoURL !== undefined) { setCurrentUserPhoto(d.photoURL); setProfilePhotoUrl(p => p.length > 500 ? p : d.photoURL); } 
            if(d.bannerURL !== undefined) { setCurrentUserBanner(d.bannerURL); setProfileBannerUrl(p => p.length > 500 ? p : d.bannerURL); } 
            if(d.bio !== undefined) { setCurrentUserBio(d.bio); setProfileBio(p => p !== d.bio && p !== '' ? p : d.bio); } 
            if (d.status === 'suspended' && Date.now() > d.suspendedUntil && d.suspendedUntil !== 0) { updateDoc(userRef, { status: 'active', suspendedUntil: 0, banReason: '' }); }
          } 
        });
      }, [user]);

      // Global Subscriptions
      useEffect(() => {
        if(!db) return;
        const unsubs = [];
        
        unsubs.push(onSnapshot(collection(db, 'artifacts', APP_ID, 'public', 'data', 'globalChat'), snap => {
           const arr = []; snap.forEach(d => arr.push({id: d.id, ...d.data()})); setGlobalChat(arr.sort((a,b) => a.timestamp - b.timestamp));
        }, err => {}));
        
        unsubs.push(onSnapshot(collection(db, 'artifacts', APP_ID, 'public', 'data', 'announcements'), snap => {
           const arr = []; snap.forEach(d => arr.push(d.data())); setAnnouncements(arr.sort((a,b) => b.timestamp - a.timestamp));
        }, err => {}));
        
        unsubs.push(onSnapshot(collection(db, 'artifacts', APP_ID, 'public', 'data', 'reviews'), snap => {
           const arr = []; snap.forEach(d => arr.push({id: d.id, ...d.data()})); setGameReviews(arr);
        }, err => {}));
        
        unsubs.push(onSnapshot(collection(db, 'artifacts', APP_ID, 'public', 'data', 'friendRequests'), snap => {
           const arr = []; snap.forEach(d => arr.push({id: d.id, ...d.data()})); setFriendRequests(arr);
        }, err => {}));
        
        unsubs.push(onSnapshot(collection(db, 'artifacts', APP_ID, 'public', 'data', 'friendships'), snap => {
           const arr = []; snap.forEach(d => arr.push({id: d.id, ...d.data()})); setFriendships(arr);
        }, err => {}));
        
        unsubs.push(onSnapshot(collection(db, 'artifacts', APP_ID, 'public', 'data', 'chatGroups'), snap => {
           const arr = []; snap.forEach(d => arr.push({id: d.id, ...d.data()})); setChatGroups(arr);
        }, err => {}));
        
        // Dynamic Game Submissions Loader
        unsubs.push(onSnapshot(collection(db, 'artifacts', APP_ID, 'public', 'data', 'gameSubmissions'), snap => {
           const arr = []; 
           snap.forEach(d => {
             const data = d.data();
             if (data.status === 'accepted') {
                 arr.push({
                     id: d.id,
                     title: data.title,
                     developer: data.developer || 'Community',
                     src: 'about:blank', // Placeholder until true hosting is provided
                     theme: 'from-violet-900 to-black',
                     tags: data.tags || ['Community'],
                     isCommunity: true
                 });
             }
           });
           setCommunityGames(arr);
        }, err => {}));

        unsubs.push(onSnapshot(collection(db, 'artifacts', APP_ID, 'public', 'data', 'users'), snap => {
           const arr = []; snap.forEach(d => { if(d.data().username && d.data().status !== 'banned') arr.push(d.data()); });
           setAllUsers(arr);
           setLeaderboard([...arr].sort((a, b) => {
              const streakDiff = getEffectiveStreak(b) - getEffectiveStreak(a);
              if (streakDiff !== 0) return streakDiff;
              return (b.currentXP || 0) - (a.currentXP || 0);
           }));
           setIsLeaderboardLoading(false); setLeaderboardError('');
        }, err => { setIsLeaderboardLoading(false); if(err.message.includes("permission")) setLeaderboardError("Leaderboard access blocked."); }));

        return () => unsubs.forEach(unsub => unsub());
      }, [db]);

      useEffect(() => {
        if (!db || !user || activeChatTab === 'global' || activeChatTab === 'friends' || activeChatTab === 'groups') return;
        let colRef;
        if (activeChatTab.startsWith('group_')) colRef = collection(db, 'artifacts', APP_ID, 'public', 'data', 'chatGroups', activeChatTab.replace('group_', ''), 'messages');
        else colRef = collection(db, 'artifacts', APP_ID, 'public', 'data', 'privateChats', [user.uid, activeChatTab].sort().join('_'), 'messages');
        const unsub = onSnapshot(colRef, snap => {
            const arr = []; snap.forEach(d => arr.push({id: d.id, ...d.data()})); setPrivateChatMessages(arr.sort((a,b) => a.timestamp - b.timestamp));
        }, err => {});
        return () => unsub();
      }, [db, user, activeChatTab]);

      useEffect(() => { if (showChatPanel && chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' }); }, [globalChat, privateChatMessages, showChatPanel, activeChatTab]);
      useEffect(() => { if (adCountdown > 0) { const timer = setTimeout(() => setAdCountdown(c => c - 1), 1000); return () => clearTimeout(timer); } }, [adCountdown]);
      useEffect(() => { const handleEsc = e => { if (e.key === 'Escape' && isCssFullscreen) setIsCssFullscreen(false); }; window.addEventListener('keydown', handleEsc); return () => window.removeEventListener('keydown', handleEsc); }, [isCssFullscreen]);

      // --- EVENT HANDLERS ---

      const handleSignup = async (e) => {
        e.preventDefault(); 
        if (authCooldown) return;
        setAuthError(''); setAuthLoading(true); setAuthCooldown(true);

        try {
          if (!sanitizeUsername(username)) throw new Error("Validation Error: Username must be 3-16 characters and contain only letters, numbers, and underscores.");
          
          if (!captchaBypass) {
              const turnstileResponse = window.turnstile ? window.turnstile.getResponse() : '';
              if (!turnstileResponse) throw new Error("Validation Error: Please complete the verification!");
          } else {
              // Fallback Math Check if Turnstile failed to load in the Canvas iframe
              if (parseInt(botCheck.answer) !== (botCheck.num1 + botCheck.num2)) {
                 throw new Error("Validation Error: Incorrect math answer!");
              }
          }
          
          let tag = Math.random().toString(36).substring(2, 6).toUpperCase();
          const tagRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'uniqueTags', tag);
          const snap = await getDoc(tagRef); 
          if (snap.exists()) throw new Error("Tag collision, try again.");
          
          const userCredential = await createUserWithEmailAndPassword(auth, email, password); 
          await updateProfile(userCredential.user, { displayName: username.trim() });
          
          try { 
            await setDoc(tagRef, { uid: userCredential.user.uid, username: username.trim(), userTag: tag }); 
            await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'users', userCredential.user.uid), { 
              uid: userCredential.user.uid, username: username.trim(), userTag: tag, photoURL: '', bannerURL: '', bio: '', currentStreak: 1, currentXP: 0,
              favorites: [], badges: [], status: 'active', lastPlayedDate: getStreakDateString(), todayPlays: {}, todayPlaysDate: getStreakDateString()
            }); 
          } catch(e) {}
          
          await sendEmailVerification(userCredential.user);
          await signOut(auth);
          
          if (window.turnstile && !captchaBypass) window.turnstile.reset();
          setAuthMode('login');
          showToast(`Account created! Please verify your email before logging in.`, 'success');
        } catch (err) { 
          if (err.message.includes("Validation Error") || err.message.includes("collision")) setAuthError(err.message);
          else if (err.code === 'auth/email-already-in-use') setAuthError("An account with that email already exists.");
          else setAuthError("Sign up failed. Please check your information and try again.");
          if (window.turnstile && !captchaBypass) window.turnstile.reset();
          setBotCheck({ num1: Math.floor(Math.random() * 10) + 1, num2: Math.floor(Math.random() * 10) + 1, answer: '' });
        } finally { setAuthLoading(false); setTimeout(() => setAuthCooldown(false), 2000); }
      };

      const handleLogin = async (e) => { 
        e.preventDefault(); 
        if (authCooldown) return;
        setAuthError(''); setAuthLoading(true); setAuthCooldown(true);

        try { 
          if (!captchaBypass) {
              const turnstileResponse = window.turnstile ? window.turnstile.getResponse() : '';
              if (!turnstileResponse) throw new Error("Validation Error: Please complete the verification!");
          }
          const userCredential = await signInWithEmailAndPassword(auth, email, password); 
          if (!userCredential.user.emailVerified) {
            await sendEmailVerification(userCredential.user); await signOut(auth);
            throw new Error("Security Error: Email not verified! We just sent a NEW verification link to your inbox/spam folder. Please click it to continue.");
          }
          localStorage.removeItem('nexis_failed_logins');
          if (window.turnstile && !captchaBypass) window.turnstile.reset();
          setShowAuthModal(false); showToast("Logged in!"); setAuthLoading(false); setAuthCooldown(false);
        } catch (err) { 
          if (window.turnstile && !captchaBypass) window.turnstile.reset();
          if (err.message.includes("Security Error") || err.message.includes("Validation Error")) {
              setAuthError(err.message); setAuthLoading(false); setTimeout(() => setAuthCooldown(false), 2000);
          } else {
              let fails = parseInt(localStorage.getItem('nexis_failed_logins') || '0') + 1;
              if (fails >= 6) {
                  localStorage.setItem('nexis_block_until', (Date.now() + 3600000).toString());
                  localStorage.removeItem('nexis_failed_logins'); setIsBlocked(true); setShowAuthModal(false); setAuthLoading(false); setAuthCooldown(false);
              } else {
                  localStorage.setItem('nexis_failed_logins', fails.toString());
                  setAuthError(`Login failed. Invalid email or password. (${6 - fails} attempts remaining)`);
                  setAuthLoading(false); setTimeout(() => setAuthCooldown(false), (fails <= 2 ? 1 : 1 + (fails - 2) * 0.5) * 1000);
              }
          }
        } 
      };

      const handleLogout = async () => { 
        if (auth) { await signOut(auth); navigateTo('discover'); setFavorites([]); setUserStatus('active'); showToast("Signed out."); try { await signInAnonymously(auth); } catch(e) {} } 
      };

      const handlePasswordReset = async (e) => { 
        e.preventDefault(); setAuthError(''); setResetMessage(''); setAuthLoading(true); 
        try { if (!email) throw new Error("Enter email."); await sendPasswordResetEmail(auth, email); setResetMessage('Reset email sent!'); } 
        catch (err) { setAuthError(err.message.replace('Firebase: ', '')); } finally { setAuthLoading(false); } 
      };

      const handlePhotoChange = (e) => { const file = e.target.files[0]; if (file) processImageFile(file, 256, 256, setProfilePhotoUrl, false); };
      const handleBannerChange = (e) => { const file = e.target.files[0]; if (file) processImageFile(file, 800, 300, setProfileBannerUrl, true); };

      const handleUpdateProfile = async (e) => {
        e.preventDefault(); 
        if (!user) return; 
        setIsUpdatingProfile(true);
        try {
          if (!sanitizeUsername(profileUsername)) throw new Error("Username must be 3-16 characters and contain only letters/numbers/underscores."); 
          if (profileUserTag.trim().length !== 4) throw new Error("Tag must be 4 chars.");
          const tag = profileUserTag.trim().toUpperCase();
          if (tag !== currentUserTag) {
            const tagRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'uniqueTags', tag); 
            const tagSnap = await getDoc(tagRef); 
            if (tagSnap.exists() && tagSnap.data()?.uid !== user.uid) throw new Error(`Tag #${tag} is taken!`);
            await setDoc(tagRef, { uid: user.uid, username: profileUsername.trim(), userTag: tag }); 
            if (currentUserTag) { try { await deleteDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'uniqueTags', currentUserTag)); } catch(e) {} }
          }
          await updateProfile(user, { displayName: profileUsername.trim() });
          await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'users', user.uid), { 
            username: profileUsername.trim(), userTag: tag, photoURL: profilePhotoUrl, bannerURL: profileBannerUrl, userTheme: userTheme, userFrame: userFrame, bio: filterMessage(profileBio.trim()).slice(0, 160) 
          }, { merge: true });
          setUser({ ...user, displayName: profileUsername.trim() }); setCurrentUserTag(tag); setCurrentUserPhoto(profilePhotoUrl); setCurrentUserBanner(profileBannerUrl); setCurrentUserBio(profileBio.trim()); 
          showToast("Profile updated!");
        } catch (err) { showToast(err.message.replace('Firebase: ', ''), 'error'); } finally { setIsUpdatingProfile(false); }
      };

      // --- ADMIN EVENT HANDLERS ---
      const openAdminModal = (userToEdit) => { 
        setAdminEditingUser(userToEdit); setAdminEditUsername(userToEdit.username || ''); setAdminEditTag(userToEdit.userTag || ''); setAdminEditPhoto(userToEdit.photoURL || ''); 
        setAdminEditStreak(getEffectiveStreak(userToEdit)); setAdminEditLevel(userToEdit.currentLevel || 1); setAdminEditStatus(userToEdit.status || 'active'); 
        setAdminEditBanReason(userToEdit.banReason || ''); setAdminEditSuspendHours(24); setAdminEditBadges(userToEdit.badges || []); setNewAdminBadgeCustom('');
      };

      const submitAdminAction = async (e) => {
        e.preventDefault(); 
        if(!adminEditingUser) return; 
        setAdminActionLoading(true);
        try {
          const t = adminEditTag.trim().toUpperCase();
          if (t !== adminEditingUser.userTag) { 
            const tagRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'uniqueTags', t); 
            const snap = await getDoc(tagRef); 
            if (snap.exists() && snap.data().uid !== adminEditingUser.uid) throw new Error("Tag taken."); 
            await setDoc(tagRef, { uid: adminEditingUser.uid, username: adminEditUsername.trim(), userTag: t }); 
            if (adminEditingUser.userTag) { await deleteDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'uniqueTags', adminEditingUser.userTag)); }
          }
          let updates = { username: adminEditUsername.trim(), userTag: t, photoURL: adminEditPhoto.trim(), currentStreak: Number(adminEditStreak), currentLevel: Number(adminEditLevel), status: adminEditStatus, badges: adminEditBadges };
          if (adminEditStatus === 'suspended') { updates.suspendedUntil = Date.now() + (Number(adminEditSuspendHours) * 3600000); updates.banReason = adminEditBanReason.trim(); } 
          else if (adminEditStatus === 'banned') { updates.banReason = adminEditBanReason.trim(); } 
          else { updates.suspendedUntil = 0; updates.banReason = ''; }
          await updateDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'users', adminEditingUser.uid), updates);
          showToast("Player updated"); setAdminEditingUser(null);
        } catch (err) { showToast(err.message, 'error'); } finally { setAdminActionLoading(false); }
      };

      const deleteAdminUser = async () => {
        if(!adminEditingUser || !window.confirm(`Permanently delete ${adminEditingUser.username}?`)) return;
        setAdminActionLoading(true);
        try {
          if (adminEditingUser.userTag) await deleteDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'uniqueTags', adminEditingUser.userTag)); 
          await deleteDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'users', adminEditingUser.uid));
          showToast("Player deleted permanently.", "success"); setAdminEditingUser(null);
        } catch (err) { showToast(err.message, 'error'); } finally { setAdminActionLoading(false); }
      };

      const deleteReview = async (revId) => {
         if(!isModerator || !window.confirm("Delete this review permanently?")) return;
         try { await deleteDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'reviews', revId)); showToast("Review deleted"); } 
         catch(e) { showToast("Failed to delete", "error"); }
      };

      const deleteMessage = async (msgId, msgOwnerId) => {
         if(!isModerator && msgOwnerId !== user?.uid) return;
         if(!window.confirm("Delete this message?")) return;
         try {
            let colRef;
            if (activeChatTab === 'global') colRef = collection(db, 'artifacts', APP_ID, 'public', 'data', 'globalChat');
            else if (activeChatTab.startsWith('group_')) colRef = collection(db, 'artifacts', APP_ID, 'public', 'data', 'chatGroups', activeChatTab.replace('group_', ''), 'messages');
            else colRef = collection(db, 'artifacts', APP_ID, 'public', 'data', 'privateChats', [user.uid, activeChatTab].sort().join('_'), 'messages');
            await deleteDoc(doc(colRef, msgId));
            showToast("Message deleted");
         } catch(e) { showToast("Failed to delete", "error"); }
      };

      const startEditMessage = (msg) => { setEditingMessageId(msg.id); setEditMessageText(msg.text); };

      const saveEditMessage = async (e, msgId) => {
         e.preventDefault();
         if (!editMessageText.trim()) return;
         try {
            let colRef;
            if (activeChatTab === 'global') colRef = collection(db, 'artifacts', APP_ID, 'public', 'data', 'globalChat');
            else if (activeChatTab.startsWith('group_')) colRef = collection(db, 'artifacts', APP_ID, 'public', 'data', 'chatGroups', activeChatTab.replace('group_', ''), 'messages');
            else colRef = collection(db, 'artifacts', APP_ID, 'public', 'data', 'privateChats', [user.uid, activeChatTab].sort().join('_'), 'messages');
            await updateDoc(doc(colRef, msgId), { text: filterMessage(editMessageText.trim()), edited: true });
            setEditingMessageId(null); setEditMessageText('');
         } catch(err) { showToast("Failed to edit", "error"); }
      };

      // --- SOCIAL EVENT HANDLERS ---
      const sendFriendRequest = async (targetUid) => {
        if (!user || !canChat) { showToast("You must be Verified to add friends.", "error"); return; }
        const reqId = `${user.uid}_${targetUid}`;
        try { await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'friendRequests', reqId), { from: user.uid, to: targetUid, fromUsername: user.displayName, fromPhoto: currentUserPhoto, timestamp: Date.now() }); showToast("Friend request sent!"); } 
        catch(e) { showToast("Failed to send request", "error"); }
      };

      const acceptFriendRequest = async (req) => {
        try { await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'friendships', `${req.from}_${req.to}`), { u1: req.from, u2: req.to, timestamp: Date.now() }); await deleteDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'friendRequests', req.id)); showToast("Friend added!"); } 
        catch(e) { showToast("Failed to accept", "error"); }
      };

      const declineFriendRequest = async (reqId) => {
         try { await deleteDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'friendRequests', reqId)); } catch(e) { showToast("Failed to decline", "error"); }
      };

      const removeFriendship = async (friendUid) => {
         if(!window.confirm("Remove this friend?")) return;
         const f = friendships.find(x => (x.u1 === user.uid && x.u2 === friendUid) || (x.u1 === friendUid && x.u2 === user.uid));
         if(f) { try { await deleteDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'friendships', f.id)); showToast("Friend removed"); } catch(e) {} }
      };

      const createGroup = async (e) => {
         e.preventDefault();
         if (!user || !canChat || !newGroupName.trim()) return;
         if (!sanitizeUsername(newGroupName.trim().replace(/\s/g, ''))) { showToast("Group name invalid.", "error"); return; }
         try {
            const newGroup = { name: newGroupName.trim(), icon: newGroupIcon || `https://placehold.co/100x100/6366f1/ffffff?text=${newGroupName.trim().charAt(0).toUpperCase()}`, owner: user.uid, members: [user.uid], timestamp: Date.now() };
            await addDoc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'chatGroups'), newGroup);
            setNewGroupName(''); setNewGroupIcon(''); setShowCreateGroup(false); showToast("Group Created!");
         } catch(e) { showToast("Failed to create group", "error"); }
      };

      const inviteToGroup = async (groupId, friendUid) => {
         const group = chatGroups.find(g => g.id === groupId);
         if (!group || !canChat) return;
         if (group.members.includes(friendUid)) { showToast("Already in group", "error"); return; }
         try { await updateDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'chatGroups', groupId), { members: [...group.members, friendUid] }); showToast("Added to group!"); } 
         catch(e) { showToast("Failed to add", "error"); }
      };

      const sendChat = async (e) => {
        e.preventDefault();
        if(!isRegistered || !chatMessage.trim()) return;
        if(!canChat) { showToast("You need the Verified badge to chat!", "error"); return; }
        try {
           const filteredText = filterMessage(chatMessage.trim());
           if (activeChatTab === 'global') await addDoc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'globalChat'), { uid: user.uid, username: user.displayName, tag: currentUserTag, text: filteredText, timestamp: Date.now(), photoURL: currentUserPhoto, frame: userFrame });
           else if (activeChatTab.startsWith('group_')) await addDoc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'chatGroups', activeChatTab.replace('group_', ''), 'messages'), { uid: user.uid, username: user.displayName, tag: currentUserTag, text: filteredText, timestamp: Date.now(), photoURL: currentUserPhoto, frame: userFrame });
           else await addDoc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'privateChats', [user.uid, activeChatTab].sort().join('_'), 'messages'), { uid: user.uid, username: user.displayName, tag: currentUserTag, text: filteredText, timestamp: Date.now(), photoURL: currentUserPhoto, frame: userFrame });
           setChatMessage(''); addXP(2);
        } catch(e) { showToast("Failed to send", "error"); }
      };

      const submitStandaloneReview = async (e) => {
         e.preventDefault();
         if(!isRegistered || !reviewText.trim() || !reviewPageGame) return;
         const userPreviousReviews = gameReviews.filter(r => r.uid === user.uid);
         if (userPreviousReviews.length > 0) {
            const latestReview = userPreviousReviews.sort((a,b) => b.timestamp - a.timestamp)[0];
            if (Date.now() - latestReview.timestamp < 86400000) { showToast("You can only post 1 review per day! Please try again tomorrow.", "error"); return; }
         }
         try {
            await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'reviews', `${reviewPageGame}_${user.uid}`), { gameId: reviewPageGame, uid: user.uid, username: user.displayName, photoURL: currentUserPhoto, text: filterMessage(reviewText.trim()), stars: reviewStars, timestamp: Date.now() });
            setReviewText(''); addXP(25); showToast("Review posted!");
         } catch(e) {}
      };

      const handleCloseGame = () => {
         setActiveGame(null); setIsCssFullscreen(false);
         if (bgMusicRef.current && isSoundEnabled) bgMusicRef.current.play().catch(e=>{});
         if (document.fullscreenElement) document.exitFullscreen().catch(e=>{});
      };

      const executeFullscreen = async () => { setPendingFullscreen(false); try { await playerContainerRef.current?.requestFullscreen(); } catch(e) { setIsCssFullscreen(true); } };

      const handleLaunchGame = async (game) => { 
        setActiveGame(game); setIframeLoading(true); setIsCssFullscreen(false); setPendingFullscreen(false); 
        if (isVIP || isDevUser) { setAdCountdown(0); } else { setAdCountdown(5); }
        if (bgMusicRef.current) bgMusicRef.current.pause();

        if (isRegistered) {
           const todayStr = getStreakDateString();
           const newRecents = [game.id, ...recentlyPlayed.filter(id => id !== game.id)].slice(0, 4);
           setRecentlyPlayed(newRecents);
           
           let newTodayPlays = { ...todayPlays };
           if (todayPlaysDate !== todayStr) newTodayPlays = {};
           newTodayPlays[game.id] = (newTodayPlays[game.id] || 0) + 1;
           setTodayPlays(newTodayPlays);
           setTodayPlaysDate(todayStr);

           try { await updateDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'users', user.uid), { recentlyPlayed: newRecents, todayPlays: newTodayPlays, todayPlaysDate: todayStr }); } catch(e){}
        }
      };

      const playRandomGame = () => { 
        const pool = allGames.filter(g => (!g.isBeta || isDevUser) && (!g.isMOFUOnly || currentUserTag === 'MOFU'));
        if(pool.length > 0) handleLaunchGame(pool[Math.floor(Math.random() * pool.length)]); 
      };

      const toggleFavorite = async (e, gid) => { 
        e.stopPropagation(); 
        if (!isRegistered) { showToast("Sign in required!", "error"); setShowAuthModal(true); return; } 
        const favs = favorites.includes(gid) ? favorites.filter(id => id !== gid) : [...favorites, gid]; 
        setFavorites(favs); 
        try { await updateDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'users', user.uid), { favorites: favs }); showToast(favorites.includes(gid) ? "Removed from favorites" : "Added to favorites!"); } catch(err) {} 
      };

      // --- EARLY RETURNS ---
      if (isBlocked) {
        return (
          <div className="h-screen w-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center z-[1000] relative">
            <ShieldIcon size={80} className="text-rose-600 mb-6 animate-pulse" />
            <h1 className="text-5xl font-black font-heading text-rose-500 mb-4 tracking-widest uppercase">Access Blocked</h1>
            <p className="text-xl text-slate-400 max-w-lg mb-8 font-ui">Due to multiple failed login attempts, your access to Nexis Games has been temporarily blocked for 1 hour to protect your security.</p>
          </div>
        );
      }

      if (userStatus === 'banned' || userStatus === 'suspended') {
        return (
          <div className="h-screen w-screen bg-black text-violet-200 flex flex-col items-center justify-center p-8 text-center z-[1000] relative">
            {userStatus === 'banned' ? <BanIcon size={80} className="text-rose-600 mb-6 animate-pulse" /> : <ClockIcon size={80} className="text-amber-500 mb-6 animate-bounce" />}
            <h1 className={`text-5xl font-black font-heading mb-4 tracking-widest uppercase ${userStatus === 'banned' ? 'text-rose-500' : 'text-amber-500'}`}>Account {userStatus === 'banned' ? 'Banned' : 'Suspended'}</h1>
            <p className="text-xl text-violet-400 max-w-lg font-ui mb-2">{userStatus === 'banned' ? 'Your access to Nexis Games has been permanently revoked.' : 'Your account has been temporarily suspended by an Administrator.'}</p>
            {banReason && <p className="text-rose-400 font-bold mb-8">Reason: {banReason}</p>}
            <button onClick={handleLogout} className="px-8 py-3 bg-obsidian-800 text-violet-200 rounded-xl font-bold uppercase tracking-widest border border-violet-500/20 hover:bg-obsidian-700 transition-colors">Sign Out</button>
          </div>
        );
      }

      // --- MAIN RENDER ---
      return (
        <div className={`h-screen w-screen bg-obsidian-900 text-slate-300 font-sans flex overflow-hidden relative selection:bg-${tColor}-500/40`}>
          
          <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
            <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] opacity-30`}></div>
            <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] opacity-30`}></div>
            <div className={`absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-obsidian-800/80 via-[#030008] to-[#000000]`}></div>
          </div>
          
          {isOffline && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[200] bg-rose-600/90 backdrop-blur-md border border-rose-500/50 text-violet-100 px-6 py-2 rounded-full font-bold font-ui text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(225,29,72,0.5)] animate-in slide-in-from-top-4">
              <WifiOffIcon size={16} /> Offline Mode - Playing locally
            </div>
          )}
          
          <aside 
            onMouseEnter={() => setIsSidebarOpen(true)} 
            onMouseLeave={() => setIsSidebarOpen(false)} 
            className={`fixed top-0 left-0 h-screen z-[100] flex flex-col flex-shrink-0 bg-[#050508]/80 backdrop-blur-2xl border-r border-violet-500/10 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden whitespace-nowrap shadow-2xl ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-[88px] translate-x-0'} ${activeGame ? '-translate-x-full md:-translate-x-full' : ''}`}
          >
            <div className="p-6 flex items-center justify-start h-24 border-b border-violet-500/10">
              <div className={`w-10 h-10 rounded-[12px] bg-gradient-to-br ${activeThemeColors.gradient} flex items-center justify-center flex-shrink-0 border border-violet-400/30 shadow-[0_0_15px_rgba(139,92,246,0.4)] relative z-10 overflow-hidden`}>
                <img src="assets/Favicon.png" alt="NG" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                <span style={{display: 'none'}} className="font-heading font-black text-violet-100">NG</span>
              </div>
              <h1 className={`text-xl font-bold tracking-widest text-violet-200 font-heading transition-all duration-300 ${isSidebarOpen ? 'opacity-100 ml-4 translate-x-0' : 'opacity-0 ml-0 -translate-x-4'}`}>NEXIS GAMES</h1>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-hide">
              {[ { id: 'discover', label: 'Discover', icon: HomeIcon }, { id: 'leaderboard', label: 'Leaderboard', icon: TrophyIcon }, { id: 'reviews', label: 'Game Reviews', icon: StarIcon }, { id: 'profile', label: 'My Profile', icon: UserIcon }].map(item => (
                <button key={item.id} onClick={() => navigateTo(item.id)} className={`w-full flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 border ${activeView === item.id ? `${activeThemeColors.bg} ${activeThemeColors.border} ${activeThemeColors.text} shadow-[inset_4px_0_0_0_currentColor]` : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-white'}`} title={item.label}>
                  <item.icon size={22} className="flex-shrink-0" /><span className={`font-bold font-ui text-lg tracking-wide transition-all duration-300 ${isSidebarOpen ? 'opacity-100 ml-4 translate-x-0' : 'opacity-0 ml-0 -translate-x-4'}`}>{item.label}</span>
                </button>
              ))}
              {isAdmin && (
                 <>
                   <div className="h-px w-full bg-white/5 my-2"></div>
                   <button onClick={() => navigateTo('admin')} className={`w-full flex items-center px-4 py-4 rounded-2xl transition-all duration-300 active:scale-95 border ${activeView === 'admin' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 shadow-[inset_4px_0_0_0_rgba(225,29,72,1)]' : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-white'}`} title="Admin Portal"><ShieldIcon size={24} className="flex-shrink-0" /><span className={`font-bold font-ui text-xl tracking-wide transition-all duration-300 ${isSidebarOpen ? 'opacity-100 ml-4 translate-x-0' : 'opacity-0 ml-0 -translate-x-4'}`}>Admin Portal</span></button>
                 </>
              )}
            </nav>
            <div className="p-4 border-t border-violet-500/10 space-y-2">
              <button onClick={() => window.open('https://dev.nexisgd.com', '_blank')} className="w-full flex items-center px-4 py-4 rounded-2xl transition-all duration-300 active:scale-95 border border-transparent text-violet-400/70 hover:bg-violet-500/10 hover:text-violet-200" title="Developer Hub">
                <CodeIcon size={24} className="flex-shrink-0" />
                <span className={`font-bold font-ui text-xl tracking-wide transition-all duration-300 ${isSidebarOpen ? 'opacity-100 ml-4 translate-x-0' : 'opacity-0 ml-0 -translate-x-4'}`}>Developer Hub</span>
              </button>
              <button onClick={() => navigateTo('settings')} className={`w-full flex items-center px-4 py-4 rounded-2xl transition-all duration-300 active:scale-95 border ${activeView === 'settings' ? 'bg-violet-500/10 border-violet-500/20 text-violet-300 shadow-[inset_4px_0_0_0_rgba(168,85,247,1)]' : 'border-transparent text-violet-400/70 hover:bg-violet-500/10 hover:text-violet-200'}`} title="Settings">
                <SettingsIcon size={24} className="flex-shrink-0" />
                <span className={`font-bold font-ui text-xl tracking-wide transition-all duration-300 ${isSidebarOpen ? 'opacity-100 ml-4 translate-x-0' : 'opacity-0 ml-0 -translate-x-4'}`}>Settings</span>
              </button>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className={`flex-1 flex flex-col h-full overflow-hidden relative z-10 transition-all duration-300 ${activeGame ? 'ml-0' : 'ml-[88px]'}`}>
            <div className={`absolute inset-0 flex flex-col transition-all duration-500 ease-out ${activeGame ? 'opacity-0 scale-[0.98] pointer-events-none' : 'opacity-100 scale-100 overflow-y-auto'}`}>
              <header className="px-6 md:px-10 py-6 flex justify-between items-center sticky top-0 z-[60] bg-[#030008]/80 backdrop-blur-2xl border-b border-violet-500/10 shadow-sm">
                <div className="flex items-center flex-1">
                  {activeView === 'discover' && (
                  <div className="relative w-full max-w-md group hidden sm:block">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><SearchIcon size={18} className="text-violet-400/70 group-focus-within:text-violet-200 transition-colors" /></div>
                    <input type="text" className={`w-full bg-obsidian-900 border border-violet-500/10 text-violet-200 font-ui text-lg rounded-full py-2.5 pl-11 pr-4 focus:outline-none focus:ring-1 focus:ring-${tColor}-500/50 shadow-inner`} placeholder="Search games..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  </div>
                  )}
                </div>
                <div className="flex items-center space-x-4 ml-4">
                  {isRegistered ? (
                    <div className="flex items-center space-x-4 cursor-pointer group" onClick={() => navigateTo('profile')}>
                      <div className="hidden sm:flex flex-col items-end">
                        <div className="flex items-center gap-2">
                           <span className="text-base font-bold font-heading text-violet-200 group-hover:text-violet-100 transition-colors">{user.displayName || 'Gamer'}</span>
                           {currentUserStreak > 0 ? (
                              <div className="flex items-center bg-obsidian-900 border border-orange-500/20 px-2 py-0.5 rounded-md shadow-[inset_0_0_10px_rgba(249,115,22,0.1)]"><span className="text-orange-500 text-xs mr-1">🔥</span><span className="text-xs font-bold text-orange-400 font-ui">{currentUserStreak}</span></div>
                           ) : (
                              <div className="flex items-center bg-obsidian-900 border border-violet-500/10 px-2 py-0.5 rounded-md"><span className="text-slate-600 text-xs mr-1 grayscale">🔥</span><span className="text-xs font-bold text-violet-400/70 font-ui">0</span></div>
                           )}
                        </div>
                      </div>
                      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 border border-violet-400/30 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform shadow-lg ${AVATAR_FRAMES.find(f=>f.id===userFrame)?.style || ''}`}>
                        {currentUserPhoto ? <img src={currentUserPhoto} className="w-full h-full object-cover" /> : <span className="font-bold text-lg text-violet-100 font-heading">{(user.displayName || 'U').charAt(0).toUpperCase()}</span>}
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setShowAuthModal(true)} className={`px-6 py-2.5 bg-gradient-to-r ${activeThemeColors.gradient} text-white font-bold font-ui text-sm tracking-widest rounded-full transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/20 hover:scale-105`}>Sign In</button>
                  )}
                  <button onClick={() => setShowChatPanel(!showChatPanel)} className={`p-3 rounded-xl bg-obsidian-800 border ${showChatPanel ? activeThemeColors.border + ' ' + activeThemeColors.text : 'border-violet-500/10 text-violet-400/70 hover:text-violet-200 hover:bg-obsidian-800/80'} transition-all relative shadow-lg`}>
                     <MessageIcon size={24} />
                     {myIncomingRequests.length > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 rounded-full border-2 border-obsidian-900 flex items-center justify-center text-[8px] font-black text-white shadow-[0_0_10px_rgba(244,63,94,0.6)] animate-bounce">{myIncomingRequests.length}</span>}
                  </button>
                </div>
              </header>

              <div className="flex-1 overflow-hidden relative flex flex-col">
                
                {/* --- DISCOVER VIEW --- */}
                {activeView === 'discover' && (
                  <div className="h-full overflow-y-auto pb-20 animate-in fade-in duration-500">
                    {!searchQuery && activeCategory === 'All' && FeaturedGame && (
                      <div className="px-6 md:px-10 pb-8 pt-6 flex-shrink-0 relative z-10">
                        <h3 className="text-2xl font-bold font-heading text-white tracking-wide mb-6">Featured Games</h3>
                        <div className={`relative w-full h-80 md:h-[420px] rounded-[2rem] overflow-hidden group cursor-pointer border border-violet-500/10 hover:border-violet-500/30 transition-all duration-500 shadow-2xl bg-gradient-to-br ${FeaturedGame.theme}`} onClick={() => handleLaunchGame(FeaturedGame)}>
                          <div className="absolute inset-0 bg-obsidian-900"></div>
                          <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] ${FeaturedGame.theme} opacity-30`}></div>
                          <div className="absolute right-0 top-0 w-full md:w-1/2 h-full opacity-40 transform translate-x-10 md:translate-x-20 -translate-y-5 md:group-hover:scale-[1.03] transition-transform duration-700 ease-out drop-shadow-2xl">
                            <GameIconRenderer title={FeaturedGame.title} isCommunity={FeaturedGame.isCommunity} />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/60 to-transparent"></div>
                          <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3 transform md:group-hover:-translate-y-1 transition-transform duration-500 ease-out z-10">
                            <span className="px-3 py-1.5 text-[10px] font-black font-ui uppercase tracking-widest text-violet-200 bg-violet-600/30 border border-violet-500/40 rounded-md mb-4 inline-block backdrop-blur-sm shadow-[0_0_15px_rgba(139,92,246,0.3)]">Featured Game</span>
                            <h2 className="text-4xl md:text-6xl font-black font-heading text-violet-100 mb-6 tracking-tight drop-shadow-lg">{FeaturedGame.title}</h2>
                            <button onClick={(e) => { e.stopPropagation(); handleLaunchGame(FeaturedGame); }} className={`flex items-center space-x-3 bg-violet-600 text-violet-100 px-8 py-3.5 rounded-xl font-bold font-ui text-lg tracking-wide hover:bg-violet-500 transition-colors active:scale-95 shadow-[0_0_20px_rgba(139,92,246,0.4)] border border-violet-400/20`}><PlayIcon size={20} fill="currentColor" /><span>Play Now</span></button>
                          </div>
                          <button onClick={(e) => toggleFavorite(e, FeaturedGame.id)} className={`absolute top-6 right-6 z-20 p-3 rounded-xl backdrop-blur-md transition-all active:scale-95 border ${favorites.includes(FeaturedGame.id) ? 'bg-violet-500/30 text-violet-200 border-violet-500/50 shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'bg-obsidian-900/40 text-violet-400/70 border-violet-500/10 hover:bg-obsidian-900/60 hover:text-violet-200'}`}><HeartIcon size={20} fill={favorites.includes(FeaturedGame.id) ? "currentColor" : "none"} /></button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                           {FeaturedGridGames.map(game => (
                             <div key={'feat-'+game.id} className={`group relative bg-gradient-to-br ${game.theme} border border-white/10 rounded-2xl overflow-hidden cursor-pointer flex flex-row items-center p-4 shadow-lg hover:border-white/30 hover:shadow-xl transition-all h-32`} onClick={() => handleLaunchGame(game)}>
                                <div className="absolute right-0 top-0 w-1/2 h-full opacity-30 group-hover:scale-110 transition-transform duration-500 ease-out pointer-events-none">
                                  <GameIconRenderer title={game.title} isCommunity={game.isCommunity} />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950 via-obsidian-950/80 to-transparent pointer-events-none"></div>
                                <div className="w-20 h-20 rounded-xl overflow-hidden shadow-lg border border-white/10 flex-shrink-0 z-10 relative">
                                  <GameIconRenderer title={game.title} isCommunity={game.isCommunity} />
                                </div>
                                <div className="ml-4 flex flex-col z-10"><h4 className="text-xl font-bold font-heading text-white">{game.title}</h4><p className="text-xs text-white/70 uppercase tracking-widest font-bold mt-1">Featured Selection</p></div>
                             </div>
                           ))}
                        </div>
                      </div>
                    )}

                    {!searchQuery && recentlyPlayed.length > 0 && (
                      <div className="px-6 md:px-10 pt-8 pb-4">
                        <h3 className="text-xl font-bold font-heading text-slate-400 mb-4 tracking-wide uppercase flex items-center gap-2"><ClockIcon size={18}/> Jump Back In</h3>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                           {recentlyPlayed.map(gid => {
                              const g = allGames.find(x => x.id === gid); if(!g) return null;
                              return (
                                <button key={'recent'+g.id} onClick={() => handleLaunchGame(g)} className="flex-shrink-0 flex items-center gap-3 bg-obsidian-800/80 border border-white/5 pr-6 rounded-2xl hover:bg-obsidian-800 transition-colors">
                                   <div className={`w-16 h-16 rounded-l-2xl overflow-hidden bg-gradient-to-br ${g.theme} p-2 border-r border-white/5`}>
                                     <GameIconRenderer title={g.title} isCommunity={g.isCommunity} />
                                   </div>
                                   <span className="font-bold font-heading text-white">{g.title}</span>
                                </button>
                              )
                           })}
                        </div>
                      </div>
                    )}

                    <div className="px-6 md:px-10 flex-shrink-0 relative z-0 pb-10">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <h3 className="text-2xl font-bold font-heading text-violet-200 tracking-wide">{activeCategory === 'Favorites' ? 'Your Favorites' : 'All Games'}</h3>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2 sm:mx-0 sm:px-0 sm:pb-0">
                          {GAME_CATEGORIES.map(cat => (
                            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-lg font-ui font-semibold text-sm whitespace-nowrap transition-all flex items-center gap-2 border ${activeCategory === cat ? 'bg-violet-500/20 text-violet-200 border-violet-500/30 shadow-[0_0_10px_rgba(139,92,246,0.2)]' : 'bg-transparent text-violet-400/70 border-violet-500/10 hover:border-violet-500/30 hover:text-violet-200'}`}>
                              {cat === 'Favorites' && <HeartIcon size={14} fill={activeCategory === 'Favorites' ? 'currentColor' : 'none'} className={activeCategory === 'Favorites' ? 'text-violet-300' : 'text-violet-400/70'} />} {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredGames.map((game) => {
                            const isFav = favorites.includes(game.id);
                            return (
                            <div key={game.id} className="group relative bg-obsidian-800/80 backdrop-blur-sm border border-violet-500/10 rounded-2xl overflow-hidden hover:border-violet-500/40 transition-all duration-300 hover:shadow-[0_8px_30px_-5px_rgba(139,92,246,0.3)] md:hover:-translate-y-1 cursor-pointer flex flex-col h-full" onClick={() => handleLaunchGame(game)}>
                              <div className={`w-full aspect-video bg-gradient-to-br ${game.theme} p-6 relative flex items-center justify-center overflow-hidden border-b border-violet-500/10`}>
                                <div className="absolute inset-0 bg-black/30 md:group-hover:bg-transparent transition-colors duration-500"></div>
                                <div className="w-28 h-28 transform md:group-hover:scale-[1.1] transition-transform duration-500 ease-out drop-shadow-xl">
                                  <GameIconRenderer title={game.title} isCommunity={game.isCommunity} />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px] bg-obsidian-900/40">
                                  <div className="w-14 h-14 bg-violet-600/90 border border-violet-400/50 rounded-full flex items-center justify-center transform scale-75 md:group-hover:scale-100 transition-transform duration-300 ease-out shadow-[0_0_20px_rgba(139,92,246,0.5)]"><PlayIcon size={24} className="ml-1 text-violet-100" fill="currentColor" /></div>
                                </div>
                                <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded border border-white/10 flex items-center gap-1">
                                   <StarIcon size={12} filled className={gameAvgRatings[game.id] ? "text-yellow-400" : "text-slate-500"} />
                                   <span className="text-xs font-bold text-white font-ui">{gameAvgRatings[game.id] || 'N/A'}</span>
                                </div>
                                <button onClick={(e) => toggleFavorite(e, game.id)} className={`absolute top-3 left-3 z-20 p-2 rounded-lg backdrop-blur-md transition-all border ${isFav ? 'opacity-100 bg-violet-500/30 text-violet-200 border-violet-500/50 shadow-[0_0_10px_rgba(139,92,246,0.3)]' : 'opacity-100 md:opacity-0 md:group-hover:opacity-100 bg-obsidian-900/40 text-violet-200 border-violet-500/10 hover:bg-obsidian-900/80'}`}><HeartIcon size={16} fill={isFav ? "currentColor" : "none"} /></button>
                              </div>
                              <div className="p-5 flex flex-col flex-1 relative z-10 bg-transparent">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="text-lg font-bold font-heading text-violet-200 line-clamp-1 group-hover:text-violet-100 transition-colors">{game.title}</h4>
                                </div>
                                <p className="text-sm text-violet-400/70 mb-4 font-ui">{game.developer}</p>
                                <div className="mt-auto flex flex-wrap items-center gap-2">
                                  {game.tags.map(tag => <span key={tag} className="px-2 py-1 text-[10px] font-bold font-ui uppercase tracking-wider bg-obsidian-900 text-violet-300 rounded-md border border-violet-500/10 group-hover:border-violet-500/30 transition-colors shadow-inner">{tag}</span>)}
                                  {game.isPublicBeta && <span className="ml-auto px-2 py-1 text-[9px] font-black uppercase tracking-widest bg-fuchsia-500/20 text-fuchsia-300 rounded border border-fuchsia-500/30">Public Beta</span>}
                                  {game.isMOFUOnly && <span className="ml-auto px-2 py-1 text-[9px] font-black uppercase tracking-widest bg-rose-500/20 text-rose-300 rounded border border-rose-500/30">Dev Box</span>}
                                </div>
                              </div>
                            </div>
                        )})}
                        {filteredGames.length === 0 && (
                          <div className="col-span-full py-32 flex flex-col items-center justify-center text-violet-400/50 animate-in fade-in">
                            <Gamepad2Icon size={64} className="mb-6 opacity-30 drop-shadow-md" />
                            <p className="text-2xl font-heading font-bold text-violet-300">No games found.</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-16 flex flex-col items-center justify-center pt-10 border-t border-violet-500/20 pb-10">
                         <p className="text-violet-300 font-ui text-lg mb-6 tracking-wide uppercase font-bold text-center">Can't decide what to play?</p>
                         <button onClick={playRandomGame} className="flex items-center gap-4 px-10 py-5 bg-obsidian-900 hover:bg-obsidian-800 text-violet-200 hover:text-violet-100 font-black font-heading text-2xl sm:text-3xl tracking-widest rounded-3xl transition-all shadow-[0_0_30px_-5px_rgba(139,92,246,0.2)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] active:scale-95 border border-violet-500/30 group hover:-translate-y-1">
                           <SurpriseIcon size={32} className="group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 text-violet-300" /> SURPRISE ME
                         </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- LEADERBOARD VIEW --- */}
                {activeView === 'leaderboard' && (
                  <div className="animate-in fade-in duration-500 flex flex-col flex-1 px-6 md:px-10 py-10 overflow-y-auto pb-32">
                    <div className="max-w-4xl mx-auto w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                        <h2 className="text-4xl font-black font-heading text-violet-100 flex items-center gap-4 drop-shadow-[0_0_15px_rgba(221,214,254,0.3)]">
                          <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-[0_0_20px_-5px_rgba(234,179,8,0.6)] text-white border border-yellow-200/20"><TrophyIcon size={32} /></div>
                          Global Rankings
                        </h2>
                      </div>
                      
                      {!isRegistered && (
                        <div className="mb-8 bg-violet-600/10 border border-violet-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-inner">
                          <div><h3 className="text-2xl font-bold font-heading text-violet-200 drop-shadow-sm mb-1">Want to get ranked?</h3><p className="text-violet-300 font-ui text-sm sm:text-base">Create an account to start your streak and climb the leaderboard.</p></div>
                          <button onClick={() => setShowAuthModal(true)} className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-violet-100 font-bold font-ui text-lg tracking-widest rounded-xl transition-all active:scale-95 whitespace-nowrap shadow-[0_0_15px_-3px_rgba(139,92,246,0.6)] border border-violet-400/20">Sign In</button>
                        </div>
                      )}
                      
                      <div className="bg-obsidian-800/80 backdrop-blur-2xl border border-violet-500/20 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                        {leaderboardError ? (
                           <div className="p-16 text-center flex flex-col items-center justify-center">
                              <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/20 mb-6 shadow-inner"><XIcon size={40} className="text-rose-400" /></div>
                              <p className="text-rose-400 font-bold font-heading text-2xl mb-3">{leaderboardError === "Please login to see the leaderboard" ? "Sign In Required" : "Database Access Denied"}</p>
                           </div>
                        ) : isLeaderboardLoading ? (
                           <div className="p-20 text-center flex flex-col items-center justify-center"><div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_15px_rgba(139,92,246,0.5)]"></div></div>
                        ) : leaderboard.length === 0 ? (
                           <div className="p-20 text-center flex flex-col items-center justify-center"><TrophyIcon size={48} className="text-violet-500/50 mb-4 drop-shadow-md" /><p className="text-violet-300 font-bold font-heading text-2xl">No players ranked yet.</p></div>
                        ) : (
                           <div className="divide-y divide-violet-500/10 p-4">
                              {leaderboard.map((player, idx) => {
                                 const activeStreak = getEffectiveStreak(player); const effectiveLevel = player.currentLevel || (1 + Math.floor(activeStreak / 2));
                                 return (
                                 <div key={player.uid} onClick={() => setViewingPlayer(player)} className={`cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl mb-2 hover:bg-obsidian-900/60 transition-all duration-300 border border-transparent ${player.uid === user?.uid ? 'bg-violet-600/10 border-violet-500/30 shadow-[inset_0_0_20px_rgba(139,92,246,0.15)]' : ''}`}>
                                    <div className="flex items-center gap-4 sm:gap-6">
                                       <span className={`text-2xl sm:text-3xl font-black font-heading w-10 sm:w-12 text-center ${idx === 0 ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]' : idx === 1 ? 'text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.6)]' : idx === 2 ? 'text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'text-violet-500'}`}>#{idx + 1}</span>
                                       <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-obsidian-900 overflow-hidden flex-shrink-0 flex items-center justify-center border border-violet-500/20 shadow-lg ${AVATAR_FRAMES.find(f=>f.id===player.userFrame)?.style || ''}`}>{player.photoURL ? <img src={player.photoURL} alt="PFP" className="w-full h-full object-cover"/> : <span className="font-bold text-2xl text-violet-300 font-heading">{(player.username || 'U').charAt(0).toUpperCase()}</span>}</div>
                                       <div className="flex flex-col">
                                         <div className="flex items-center gap-2"><span className={`font-bold font-heading text-xl sm:text-2xl truncate max-w-[120px] sm:max-w-[250px] ${player.uid === user?.uid ? 'text-violet-200' : 'text-violet-100'} drop-shadow-sm`}>{player.username}</span><span className="text-violet-400/70 text-sm font-ui mt-1 hidden sm:inline-block">#{player.userTag}</span></div>
                                         <div className="flex items-center gap-2 mt-1">
                                           {player.badges?.includes('Verified') && <span className="text-[10px] font-bold font-ui text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30 shadow-inner">Verified</span>}
                                           {player.badges?.includes('VIP') && <span className="text-[10px] font-bold font-ui text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 shadow-inner">VIP</span>}
                                           <span className="text-xs font-bold font-ui text-violet-300 bg-obsidian-950 px-2 py-0.5 rounded-md border border-violet-500/20 shadow-inner">Lvl {effectiveLevel}</span>
                                         </div>
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-4 ml-14 sm:ml-0">
                                       <div className="flex items-center gap-3 bg-obsidian-950/80 px-6 py-3 rounded-2xl border border-violet-500/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] flex-1 sm:flex-none justify-center">
                                          <span className={`text-2xl ${activeStreak > 0 ? 'text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)] animate-pulse' : 'text-violet-500/50 grayscale'}`}>🔥</span>
                                          <span className={`font-black font-heading text-3xl ${activeStreak > 0 ? 'text-violet-100 drop-shadow-md' : 'text-violet-500/50'}`}>{activeStreak}</span>
                                        </div>
                                    </div>
                                 </div>
                              )})}
                           </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* --- REVIEWS VIEW --- */}
                {activeView === 'reviews' && (
                   <div className="animate-in fade-in duration-500 px-6 md:px-10 py-10 overflow-y-auto h-full pb-32">
                      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-10">
                         <div className="flex-1 space-y-6">
                            <h2 className="text-4xl font-black font-heading text-white mb-8">Global Reviews Feed</h2>
                            {gameReviews.length === 0 ? (
                               <p className="text-slate-500 font-ui text-lg">No reviews have been posted yet. Be the first!</p>
                            ) : (
                               gameReviews.sort((a,b)=>b.timestamp-a.timestamp).map(rev => {
                                  const gameInfo = allGames.find(g => g.id === rev.gameId);
                                  return (
                                     <div key={rev.uid+rev.gameId} className="bg-obsidian-800/80 backdrop-blur-sm border border-violet-500/10 rounded-3xl p-6 shadow-lg relative group">
                                        {(isModerator || rev.uid === user?.uid) && (
                                          <button onClick={() => deleteReview(`${rev.gameId}_${rev.uid}`)} className="absolute top-4 right-4 p-2 bg-rose-500/20 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100" title="Delete Review"><XIcon size={16}/></button>
                                        )}
                                        <div className="flex justify-between items-start mb-4 border-b border-violet-500/10 pb-4 pr-8">
                                           <div className="flex items-center gap-3">
                                              <div className="w-10 h-10 rounded-lg bg-obsidian-900 border border-violet-500/20 flex items-center justify-center overflow-hidden">
                                                 {rev.photoURL ? <img src={rev.photoURL} className="w-full h-full object-cover"/> : <span className="font-bold text-white">{rev.username.charAt(0)}</span>}
                                              </div>
                                              <div>
                                                 <span className="font-bold font-heading text-white">{rev.username}</span>
                                                 <p className="text-xs text-slate-500">Reviewed {gameInfo ? gameInfo.title : 'a game'}</p>
                                              </div>
                                           </div>
                                           <div className="flex gap-0.5 text-yellow-400">{[1,2,3,4,5].map(s => <StarIcon key={s} size={14} filled={s <= rev.stars} className={s > rev.stars ? "text-slate-700" : ""} />)}</div>
                                        </div>
                                        <p className="text-slate-300 font-ui leading-relaxed">{rev.text}</p>
                                     </div>
                                  )
                               })
                            )}
                         </div>

                         <div className="w-full lg:w-96 flex-shrink-0">
                            <div className="sticky top-0 bg-obsidian-800/80 backdrop-blur-xl border border-violet-500/20 rounded-3xl p-8 shadow-2xl">
                               <h3 className="text-2xl font-bold font-heading text-white mb-6">Write a Review</h3>
                               {!isRegistered ? (
                                  <div className="text-center">
                                     <p className="text-slate-400 mb-4">Sign in to leave a review and earn XP!</p>
                                     <button onClick={()=>setShowAuthModal(true)} className={`w-full py-3 bg-${tColor}-600 rounded-xl text-white font-bold`}>Sign In</button>
                                  </div>
                               ) : (
                                  <form onSubmit={submitStandaloneReview} className="space-y-4">
                                     <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Select Game</label>
                                        <select value={reviewPageGame} onChange={e=>setReviewPageGame(e.target.value)} className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-4 py-3 text-white font-ui focus:outline-none">
                                           {allGames.filter(g => !g.isBeta && (!g.isMOFUOnly || currentUserTag === 'MOFU')).map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
                                        </select>
                                     </div>
                                     <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Rating</label>
                                        <div className="flex items-center gap-2">
                                           {[1,2,3,4,5].map(s => (
                                              <button type="button" key={s} onClick={() => setReviewStars(s)} className="active:scale-90 transition-transform"><StarIcon size={32} filled={s <= reviewStars} className={s <= reviewStars ? "text-yellow-400 drop-shadow-sm" : "text-slate-700"}/></button>
                                           ))}
                                        </div>
                                     </div>
                                     <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Review</label>
                                        <textarea required value={reviewText} onChange={e=>setReviewText(e.target.value)} rows={4} className="w-full bg-obsidian-950 border border-violet-500/20 rounded-xl p-4 text-white font-ui resize-none focus:outline-none" placeholder="What did you think?"></textarea>
                                     </div>
                                     <button type="submit" className={`w-full py-4 bg-${tColor}-600 hover:bg-${tColor}-500 text-white font-bold rounded-xl transition-all`}>Post Review (+25 XP)</button>
                                  </form>
                               )}
                            </div>
                         </div>
                      </div>
                   </div>
                )}

                {/* --- PROFILE VIEW --- */}
                {activeView === 'profile' && (
                  <div className="animate-in fade-in duration-500 flex flex-col flex-1 px-6 md:px-10 py-10 overflow-y-auto h-full pb-32">
                    <div className="w-full max-w-4xl mx-auto relative z-10">
                      <h2 className="text-4xl font-black font-heading text-violet-100 mb-10 drop-shadow-[0_0_15px_rgba(221,214,254,0.3)]">User Profile</h2>
                      
                      {!isRegistered ? (
                         <div className="bg-obsidian-800/80 backdrop-blur-2xl border border-violet-500/20 rounded-[2.5rem] p-16 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                           <div className="w-24 h-24 bg-violet-600/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-violet-500/30 shadow-inner"><UserIcon size={48} className="text-violet-300" /></div>
                           <h3 className="text-3xl font-bold font-heading text-violet-100 mb-4 drop-shadow-sm">Sign in to edit your profile</h3>
                           <button onClick={() => setShowAuthModal(true)} className="px-10 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-violet-100 font-bold font-ui text-2xl tracking-wide rounded-2xl transition-all shadow-[0_0_20px_-5px_rgba(139,92,246,0.6)] active:scale-95 border border-violet-400/20">Sign In Now</button>
                         </div>
                      ) : (
                         <div className="bg-obsidian-800/80 backdrop-blur-2xl border border-violet-500/20 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                           <div className="relative w-full h-40 sm:h-52 bg-obsidian-900 group cursor-pointer border-b border-violet-500/20">
                             {profileBannerUrl ? <img src={profileBannerUrl} alt="Banner" className="w-full h-full object-cover" /> : <div className={`w-full h-full bg-gradient-to-r ${activeThemeColors.gradient} opacity-20`}></div> }
                             <div className="absolute inset-0 bg-obsidian-950/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"><UploadIcon size={28} className="text-violet-200 mr-3 drop-shadow-md" /><span className="text-sm font-bold text-violet-200 font-ui uppercase tracking-widest drop-shadow-md">Change Banner</span></div>
                             <input type="file" accept="image/*" onChange={handleBannerChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                           </div>
                           
                           <div className="p-8 sm:p-10 pt-0 relative">
                             <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-10 pb-10 border-b border-violet-500/20">
                               <div className={`relative group w-32 h-32 sm:w-40 sm:h-40 rounded-[2.5rem] bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-[0_0_30px_-5px_rgba(0,0,0,0.8)] overflow-hidden flex-shrink-0 cursor-pointer border-4 border-obsidian-900 -mt-16 sm:-mt-20 transition-all active:scale-95 z-10 ${AVATAR_FRAMES.find(f=>f.id===userFrame)?.style || ''}`}>
                                 {profilePhotoUrl ? <img src={profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" /> : <span className="font-bold text-6xl text-violet-100 font-heading drop-shadow-md">{(profileUsername || 'U').charAt(0).toUpperCase()}</span> }
                                 <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"><UploadIcon size={32} className="text-violet-200 mb-2 drop-shadow-md" /><span className="text-sm font-bold text-violet-200 font-ui text-xs uppercase tracking-widest drop-shadow-md">Change</span></div>
                                 <input type="file" accept="image/*" onChange={handlePhotoChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                               </div>
                               
                               <div className="text-center sm:text-left flex-1 w-full sm:pt-4">
                                 <div className="flex items-end justify-center sm:justify-start gap-2 mb-2"><h3 className="text-4xl font-black font-heading text-white">{user.displayName || 'Gamer'}</h3><span className={`text-${tColor}-400 font-ui text-xl mb-1`}>#{currentUserTag}</span></div>
                                 <p className="text-violet-300 font-medium truncate font-ui text-xl mb-6 drop-shadow-sm">{user.email}</p>
                                 <div className="bg-obsidian-950/80 p-6 rounded-2xl border border-violet-500/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
                                   <div className="flex justify-between items-center mb-4"><div className="flex items-center gap-2"><StarIcon size={24} className="text-yellow-400" /><span className="font-bold font-ui text-violet-200 text-xl">Level {userLevel}</span></div><span className="font-bold font-ui text-white">{currentXP} XP</span></div>
                                   <div className="w-full h-4 bg-obsidian-900 rounded-full overflow-hidden border border-white/10 mb-2"><div className={`h-full bg-gradient-to-r ${activeThemeColors.gradient} transition-all duration-1000`} style={{ width: `${levelProgress}%` }}></div></div>
                                   <p className="text-xs text-slate-500 font-ui text-right uppercase tracking-widest">{currentLevelXP} / {nextLevelXP} to next level</p>
                                 </div>
                               </div>
                             </div>

                             {/* Badges Section */}
                             <div className="mb-10 pb-10 border-b border-violet-500/20">
                                <h4 className="text-lg font-bold font-heading text-violet-100 mb-4 uppercase tracking-widest flex items-center gap-2"><ShieldIcon size={20}/> Earned Badges</h4>
                                <div className="flex flex-wrap gap-4">
                                   {badges.map(b => (
                                      <div key={b} className={`px-4 py-2 bg-white/10 border border-white/20 rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(0,0,0,0.3)]`}>
                                         <span className="text-2xl">🎖️</span><span className={`font-bold font-ui text-white`}>{b}</span>
                                      </div>
                                   ))}
                                   {badges.length === 0 && <span className="text-slate-500 font-ui">No badges earned yet.</span>}
                                </div>
                             </div>
                             
                             <form onSubmit={handleUpdateProfile} className="space-y-8">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                 <div>
                                    <label className="block text-sm font-bold font-ui text-slate-400 mb-3 uppercase tracking-widest">Hub Theme</label>
                                    <select value={userTheme} onChange={e => setUserTheme(e.target.value)} className="w-full bg-obsidian-950 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold appearance-none cursor-pointer focus:outline-none">
                                       {Object.entries(THEMES).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                                    </select>
                                 </div>
                                 <div>
                                    <label className="block text-sm font-bold font-ui text-slate-400 mb-3 uppercase tracking-widest">Avatar Frame</label>
                                    <select value={userFrame} onChange={e => setUserFrame(e.target.value)} className="w-full bg-obsidian-950 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold appearance-none cursor-pointer focus:outline-none">
                                       {AVATAR_FRAMES.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                    </select>
                                 </div>
                               </div>

                               <div className="flex flex-col sm:flex-row gap-6">
                                 <div className="flex-1">
                                   <label className="block text-sm font-bold font-ui text-slate-400 mb-3 uppercase tracking-widest ml-1">Username</label>
                                   <input type="text" value={profileUsername} onChange={e => setProfileUsername(e.target.value)} className="w-full bg-obsidian-950 border border-white/10 rounded-2xl px-6 py-5 font-heading text-xl text-white focus:outline-none" />
                                 </div>
                                 <div className="w-full sm:w-40">
                                   <label className="block text-sm font-bold font-ui text-slate-400 mb-3 uppercase tracking-widest ml-1">ID Tag</label>
                                   <div className="relative"><span className="absolute inset-y-0 left-0 pl-5 flex items-center text-slate-500 font-heading text-xl">#</span><input type="text" maxLength={4} value={profileUserTag} onChange={e => setProfileUserTag(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} className="w-full bg-obsidian-950 border border-white/10 rounded-2xl px-4 py-5 pl-9 font-heading text-xl text-white focus:outline-none text-center" /></div>
                                 </div>
                               </div>
                               <div>
                                 <label className="block text-sm font-bold font-ui text-slate-400 mb-3 uppercase tracking-widest ml-1">Bio</label>
                                 <textarea value={profileBio} onChange={e => setProfileBio(e.target.value)} maxLength={160} rows={3} className="w-full bg-obsidian-950 border border-white/10 rounded-2xl px-6 py-5 font-ui text-lg text-white focus:outline-none resize-none"></textarea>
                                 <p className="text-right text-xs text-violet-500 font-ui mt-2 uppercase tracking-widest">{profileBio.length} / 160</p>
                               </div>
                               <div className="pt-6 flex justify-end border-t border-white/5">
                                 <button type="submit" disabled={isUpdatingProfile} className={`px-10 py-4 font-bold font-ui tracking-widest text-xl uppercase rounded-2xl transition-all disabled:opacity-50 text-white bg-obsidian-800 border border-white/20 hover:bg-obsidian-700`}>{isUpdatingProfile ? 'Saving...' : 'Save Profile'}</button>
                               </div>
                             </form>
                           </div>
                         </div>
                      )}
                    </div>
                  </div>
                )}

                {/* --- SETTINGS VIEW --- */}
                {activeView === 'settings' && (
                  <div className="animate-in fade-in duration-500 flex flex-col flex-1 px-6 md:px-10 py-10 overflow-y-auto h-full pb-32">
                    <div className="w-full max-w-4xl mx-auto relative z-10">
                      <h2 className="text-4xl font-black font-heading text-violet-100 mb-10 drop-shadow-[0_0_15px_rgba(221,214,254,0.3)]">Settings</h2>
                      
                      <div className="bg-obsidian-800/80 backdrop-blur-2xl border border-violet-500/20 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 sm:p-12">
                        
                        {/* Audio Settings */}
                        <div className="mb-12">
                          <h3 className="text-2xl font-bold font-heading text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-3">
                            <SettingsIcon size={24}/> Audio & Sound
                          </h3>
                          
                          <div className="flex items-center justify-between bg-obsidian-950/50 p-5 rounded-2xl border border-white/5 mb-6">
                            <div>
                              <h4 className="font-bold text-white text-lg">Background Audio</h4>
                              <p className="text-sm text-slate-400">Toggle music and game sounds.</p>
                            </div>
                            <button onClick={() => setIsSoundEnabled(!isSoundEnabled)} className={`px-6 py-2.5 rounded-xl font-bold text-sm uppercase tracking-widest transition-all ${isSoundEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                              {isSoundEnabled ? 'Enabled' : 'Disabled'}
                            </button>
                          </div>

                          <div className={`space-y-6 transition-opacity duration-300 ${!isSoundEnabled ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                            <div>
                              <div className="flex justify-between mb-2"><label className="font-bold text-slate-300 text-sm uppercase tracking-widest">Master Volume</label><span className="text-violet-400 font-bold">{masterVolume}%</span></div>
                              <input type="range" min="0" max="100" value={masterVolume} onChange={(e) => setMasterVolume(e.target.value)} className="w-full accent-violet-500 bg-obsidian-950 h-2 rounded-full appearance-none cursor-pointer" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-2"><label className="font-bold text-slate-300 text-sm uppercase tracking-widest">Music Volume</label><span className="text-violet-400 font-bold">{musicVolume}%</span></div>
                              <input type="range" min="0" max="100" value={musicVolume} onChange={(e) => setMusicVolume(e.target.value)} className="w-full accent-violet-500 bg-obsidian-950 h-2 rounded-full appearance-none cursor-pointer" />
                            </div>
                          </div>
                        </div>

                        {/* Account Settings */}
                        <div>
                           <h3 className="text-2xl font-bold font-heading text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-3">
                             <UserIcon size={24}/> Account Management
                           </h3>
                           {isRegistered ? (
                              <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                 <div>
                                    <h4 className="font-bold text-rose-400 text-lg">Sign Out</h4>
                                    <p className="text-sm text-rose-400/70">Securely sign out of your Nexis Games account.</p>
                                 </div>
                                 <button onClick={handleLogout} className="px-8 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all shadow-md w-full sm:w-auto active:scale-95">Sign Out</button>
                              </div>
                           ) : (
                              <div className="bg-obsidian-950/50 border border-white/5 rounded-2xl p-6 text-center">
                                 <p className="text-slate-400 mb-4">You are currently playing anonymously.</p>
                                 <button onClick={() => setShowAuthModal(true)} className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-all shadow-md active:scale-95">Sign In / Create Account</button>
                              </div>
                           )}
                        </div>

                      </div>
                    </div>
                  </div>
                )}

                {/* --- ADMIN VIEW --- */}
                {activeView === 'admin' && isAdmin && (
                  <div className="animate-in fade-in duration-500 flex flex-col flex-1 px-6 md:px-10 py-10 overflow-y-auto h-full pb-32">
                    <div className="max-w-5xl mx-auto w-full flex flex-col h-full">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="p-4 bg-rose-500/20 text-rose-500 rounded-2xl shadow-[0_0_20px_-5px_rgba(225,29,72,0.6)] border border-rose-500/50"><ShieldIcon size={32} /></div> 
                        <div><h2 className="text-4xl font-black font-heading text-white">Admin Portal</h2><p className="text-slate-400 font-ui text-lg">Manage users, custom tags, and database records.</p></div>
                      </div>
                      
                      <div className="bg-obsidian-800/80 backdrop-blur-2xl border border-violet-500/20 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col flex-1">
                          <div className="p-6 sm:p-8 border-b border-violet-500/20 bg-obsidian-950/50 flex justify-between items-center">
                            <h3 className="text-2xl font-bold font-heading text-violet-100">Player Database</h3>
                            <span className="bg-violet-600/20 text-violet-300 font-bold px-4 py-1.5 rounded-full border border-violet-500/40 font-ui text-sm uppercase tracking-widest">{allUsers.length} Players</span>
                          </div>
                          <div className="overflow-y-auto p-4 flex-1 scrollbar-hide">
                             {allUsers.length === 0 ? (
                                <div className="p-20 text-center text-violet-400/70 flex flex-col items-center"><div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mb-6"></div></div>
                             ) : (
                                <div className="space-y-4">
                                   {allUsers.map(u => (
                                      <div key={u.uid} className="flex flex-col bg-obsidian-950/50 p-4 sm:p-6 rounded-2xl border border-violet-500/10 hover:border-violet-500/50 transition-colors shadow-inner">
                                         
                                         <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                           <div className="flex items-center gap-4 sm:gap-5 mb-4 sm:mb-0">
                                              <div className={`w-14 h-14 rounded-xl bg-obsidian-800 overflow-hidden flex-shrink-0 flex items-center justify-center border border-violet-500/20 shadow-lg ${AVATAR_FRAMES.find(f=>f.id===u.userFrame)?.style || ''}`}>
                                                {u.photoURL ? <img src={u.photoURL} alt="PFP" className="w-full h-full object-cover"/> : <span className="font-bold text-xl text-violet-400 font-heading">{(u.username || 'U').charAt(0).toUpperCase()}</span>}
                                              </div>
                                              <div>
                                                <div className="flex items-center gap-2">
                                                  <span className="font-bold font-heading text-xl text-violet-100">{u.username}</span>
                                                  <span className="text-violet-500 text-sm font-ui opacity-70">#{u.userTag}</span>
                                                </div>
                                                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                                  <span className="text-xs font-bold font-ui text-violet-300 bg-obsidian-800 px-2 py-0.5 rounded border border-violet-500/20">Lvl {u.currentLevel || 1}</span>
                                                  <span className="text-xs font-bold font-ui text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">🔥 {getEffectiveStreak(u)}</span>
                                                  {u.badges?.map(b => <span key={b} className="text-xs font-bold font-ui text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{b}</span>)}
                                                  {u.status === 'banned' && <span className="text-xs font-bold font-ui text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 uppercase tracking-wider">Banned</span>}
                                                  {u.status === 'suspended' && <span className="text-xs font-bold font-ui text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase tracking-wider">Suspended</span>}
                                                  {u.status === 'active' && <span className="text-xs font-bold font-ui text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-wider">Active</span>}
                                                </div>
                                              </div>
                                           </div>
                                           <button 
                                             onClick={() => openAdminModal(u)} 
                                             className="w-full sm:w-auto px-6 py-3 bg-violet-600 hover:bg-violet-500 text-violet-100 font-bold font-ui uppercase tracking-widest text-sm rounded-xl transition-all shadow-[0_0_15px_-3px_rgba(139,92,246,0.5)] active:scale-95 whitespace-nowrap"
                                           >
                                             Manage
                                           </button>
                                         </div>

                                         <div className="mt-4 pt-4 border-t border-violet-500/10">
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-2">Today's Activity</h4>
                                            {u.todayPlaysDate === getStreakDateString() && u.todayPlays && Object.keys(u.todayPlays).length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {Object.entries(u.todayPlays).map(([gameId, count]) => {
                                                        const gameObj = allGames.find(g => g.id === gameId);
                                                        const title = gameObj ? gameObj.title : gameId;
                                                        return (
                                                            <div key={gameId} className="flex items-center gap-2 bg-obsidian-900 px-3 py-1.5 rounded-lg border border-violet-500/20 shadow-sm">
                                                                <span className="text-xs font-bold text-violet-200">{title}</span>
                                                                <span className="text-[10px] font-black text-fuchsia-400 bg-fuchsia-500/20 px-1.5 py-0.5 rounded ml-1">x{count}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-500 font-ui italic">No games played today.</span>
                                            )}
                                         </div>

                                      </div>
                                   ))}
                                </div>
                             )}
                          </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* --- GAME PLAYER VIEW --- */}
            <div className={`absolute inset-0 flex flex-col bg-[#030008] transition-opacity duration-500 z-[85] ${activeGame ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
              {activeGame && (
                <>
                  <div className={`h-14 bg-obsidian-950 border-b border-violet-500/20 flex items-center justify-between px-4 flex-shrink-0 transition-all ${isCssFullscreen ? 'hidden' : 'flex'} z-[100]`}>
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={handleCloseGame}
                        className="flex items-center space-x-2 text-violet-400 hover:text-violet-200 bg-obsidian-900 hover:bg-obsidian-800 border border-violet-500/20 px-4 py-1.5 rounded-lg transition-colors active:scale-95"
                      >
                        <ChevronLeftIcon size={18} />
                        <span className="font-bold font-ui uppercase tracking-widest text-xs">Main Menu</span>
                      </button>
                      <div className="h-6 w-px bg-violet-500/20"></div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-md overflow-hidden bg-obsidian-900 shadow-inner relative">
                          <GameIconRenderer title={activeGame.title} isCommunity={activeGame.isCommunity} />
                        </div>
                        <span className="font-black font-heading text-violet-100 tracking-wide">{activeGame.title}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={executeFullscreen}
                        className="flex items-center space-x-2 text-violet-400 hover:text-violet-200 px-3 py-1.5 rounded-lg hover:bg-obsidian-800 transition-colors"
                        title="Full Screen"
                      >
                        <Maximize2Icon size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 w-full relative bg-[#030008]" ref={playerContainerRef}>
                    {isCssFullscreen && (
                      <button 
                        onClick={executeFullscreen}
                        className="absolute top-4 right-4 z-[120] bg-black/60 hover:bg-violet-600 text-white p-3 rounded-full backdrop-blur-md transition-all border border-white/10 shadow-2xl flex items-center justify-center group"
                        title="Exit Full Screen"
                      >
                        <Minimize2Icon size={20} className="group-hover:scale-110 transition-transform" />
                      </button>
                    )}

                    {adCountdown > 0 && (
                      <div className="absolute inset-0 z-[110] bg-[#030008]/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
                        <div className={`absolute inset-0 bg-gradient-to-br ${activeGame.theme} opacity-10 pointer-events-none`}></div>
                        <div className="relative max-w-4xl w-full flex flex-col items-center bg-obsidian-900/80 backdrop-blur-3xl border border-white/10 p-8 sm:p-12 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden">
                          <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${activeGame.theme}`}></div>
                          <div className="flex flex-col items-center mb-8">
                            <div className="w-20 h-20 mb-4 rounded-2xl overflow-hidden shadow-2xl transform scale-110">
                              <GameIconRenderer title={activeGame.title} isCommunity={activeGame.isCommunity} />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black font-heading text-white drop-shadow-md">Preparing {activeGame.title}</h2>
                          </div>
                          
                          <div className="w-full bg-obsidian-950/80 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center min-h-[120px] sm:min-h-[200px] shadow-inner p-2 relative">
                             <AdSenseWidget />
                          </div>
                          
                          <div className="mt-8 flex flex-col items-center w-full max-w-md">
                             <div className="flex justify-between w-full text-sm font-bold font-ui text-slate-400 uppercase tracking-widest mb-2"><span>Loading Assets</span><span className="text-white">{Math.round(((5 - adCountdown) / 5) * 100)}%</span></div>
                             <div className="w-full h-2 bg-obsidian-950 rounded-full overflow-hidden shadow-inner border border-white/5"><div className="h-full bg-white transition-all duration-1000 ease-linear" style={{ width: `${((5 - adCountdown) / 5) * 100}%` }}></div></div>
                             <p className="mt-4 text-slate-500 font-ui text-sm">Game will begin in {adCountdown} seconds...</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {iframeLoading && adCountdown === 0 && (
                      <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-obsidian-950"><div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(139,92,246,0.5)]"></div><p className="text-violet-300 font-bold font-heading text-xl animate-pulse">Connecting to server...</p></div>
                    )}
                    <iframe src={activeGame.src} className={`w-full h-full border-none transition-opacity duration-1000 ${iframeLoading || adCountdown > 0 ? 'opacity-0' : 'opacity-100'}`} onLoad={() => setIframeLoading(false)} allow="fullscreen; autoplay; gamepad; keyboard; pointer-lock"></iframe>
                  </div>
                </>
              )}
            </div>

            {/* --- SLIDING CHAT PANEL --- */}
            {showChatPanel && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[105]" onClick={() => setShowChatPanel(false)}></div>}
            <div className={`fixed top-0 right-0 h-screen w-80 sm:w-96 bg-obsidian-950/95 backdrop-blur-2xl border-l border-white/10 z-[110] transform transition-transform duration-300 shadow-2xl flex flex-col ${showChatPanel ? 'translate-x-0' : 'translate-x-full'}`}>
               <div className={`p-4 border-b border-white/10 bg-gradient-to-r ${activeThemeColors.gradient} flex justify-between items-center`}>
                  {activeChatTab === 'global' || activeChatTab === 'friends' || activeChatTab === 'groups' ? (
                      <div className="w-full">
                         <div className="flex justify-between items-center mb-3">
                             <h3 className="font-black font-heading text-white text-xl flex items-center gap-2">{activeChatTab === 'global' ? <MessageIcon size={20}/> : activeChatTab === 'friends' ? <UsersIcon size={20}/> : <ShieldIcon size={20}/>} {activeChatTab.charAt(0).toUpperCase() + activeChatTab.slice(1)} Chat</h3>
                             <button onClick={()=>setShowChatPanel(false)} className="text-white/70 hover:text-white transition-colors"><XIcon size={24}/></button>
                         </div>
                         <div className="flex gap-2">
                             <button onClick={()=>setActiveChatTab('global')} className={`flex-1 text-xs font-bold uppercase py-2 rounded-lg transition-all ${activeChatTab === 'global' ? 'bg-white/20 text-white shadow-inner' : 'bg-black/20 text-white/70 hover:text-white'}`}>Global</button>
                             <button onClick={()=>setActiveChatTab('friends')} className={`flex-1 text-xs font-bold uppercase py-2 rounded-lg transition-all relative ${activeChatTab === 'friends' ? 'bg-white/20 text-white shadow-inner' : 'bg-black/20 text-white/70 hover:text-white'}`}>Friends {myIncomingRequests.length > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-pulse"></span>}</button>
                             <button onClick={()=>setActiveChatTab('groups')} className={`flex-1 text-xs font-bold uppercase py-2 rounded-lg transition-all ${activeChatTab === 'groups' ? 'bg-white/20 text-white shadow-inner' : 'bg-black/20 text-white/70 hover:text-white'}`}>Groups</button>
                         </div>
                      </div>
                  ) : (
                      <>
                          <button onClick={()=>setActiveChatTab(activeChatTab.startsWith('group_') ? 'groups' : 'friends')} className="text-white/80 hover:text-white flex items-center gap-1 font-bold text-sm bg-black/20 px-3 py-1.5 rounded-lg transition-colors"><ChevronLeftIcon size={18}/> Back</button>
                          <h3 className="font-black font-heading text-white text-lg truncate px-2 flex flex-col items-center">{activeGroupObj ? activeGroupObj.name : 'Private Chat'}</h3>
                          <button onClick={()=>setShowChatPanel(false)} className="text-white/70 hover:text-white transition-colors"><XIcon size={24}/></button>
                      </>
                  )}
               </div>
               
               {activeChatTab === 'groups' ? (
                  <div className="flex flex-col h-full overflow-hidden">
                     {showCreateGroup ? (
                        <div className="p-4 bg-obsidian-900 border-b border-white/5 space-y-4 shadow-md z-10">
                           <h4 className="text-sm font-bold text-white flex justify-between items-center">Create New Group<button onClick={() => setShowCreateGroup(false)} className="text-slate-400 hover:text-white"><XIcon size={16}/></button></h4>
                           <input type="text" placeholder="Group Name" value={newGroupName} onChange={e=>setNewGroupName(e.target.value)} className="w-full bg-obsidian-950 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none" />
                           <button onClick={createGroup} className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-2 rounded-lg transition-colors shadow-lg active:scale-95">Create Group</button>
                        </div>
                     ) : (
                        <div className="p-3 border-b border-white/5"><button onClick={() => setShowCreateGroup(true)} className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 border border-white/5"><span className="text-lg leading-none">+</span> Create Group</button></div>
                     )}
                     
                     <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {myGroups.length === 0 ? (
                            <div className="text-center mt-10"><UsersIcon size={40} className="text-slate-600 mx-auto mb-4" /><p className="text-slate-400 font-ui text-sm">You aren't in any groups.</p></div>
                        ) : (
                            myGroups.map(group => (
                                <div key={group.id} onClick={() => setActiveChatTab(`group_${group.id}`)} className="flex items-center gap-3 p-3 bg-obsidian-800/50 rounded-xl hover:bg-obsidian-800 cursor-pointer border border-white/5 transition-colors shadow-sm">
                                    <div className="w-10 h-10 rounded-lg bg-obsidian-900 border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center"><span className="font-bold text-white text-lg font-heading">{group.name.charAt(0).toUpperCase()}</span></div>
                                    <div className="flex-1 overflow-hidden"><h4 className="font-bold text-white truncate text-sm">{group.name}</h4><p className="text-xs text-slate-500 truncate">{group.members.length} members</p></div>
                                </div>
                            ))
                        )}
                     </div>
                  </div>
               ) : activeChatTab === 'friends' ? (
                  <div className="flex flex-col h-full overflow-hidden">
                     {myIncomingRequests.length > 0 && (
                        <div className="p-3 border-b border-white/5 bg-violet-600/10 shadow-inner">
                           <h4 className="text-xs font-bold text-violet-300 uppercase tracking-widest mb-2 flex items-center gap-2"><UserIcon size={14}/> Friend Requests</h4>
                           <div className="space-y-2">
                              {myIncomingRequests.map(req => (
                                 <div key={req.id} className="flex items-center justify-between bg-obsidian-900 p-2 rounded-lg border border-violet-500/20 shadow-md">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                       <div className="w-8 h-8 bg-obsidian-800 rounded-md overflow-hidden flex-shrink-0">{req.fromPhoto ? <img src={req.fromPhoto} className="w-full h-full object-cover"/> : <span className="w-full h-full flex items-center justify-center font-bold text-white text-xs">{req.fromUsername.charAt(0)}</span>}</div>
                                       <span className="text-sm font-bold text-white truncate">{req.fromUsername}</span>
                                    </div>
                                    <div className="flex gap-1 flex-shrink-0">
                                       <button onClick={() => acceptFriendRequest(req)} className="bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-1 rounded text-xs font-bold transition-colors shadow">Accept</button>
                                       <button onClick={() => declineFriendRequest(req.id)} className="bg-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white px-2 py-1 rounded text-xs font-bold transition-colors">✕</button>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}
                     
                     <div className="p-3 border-b border-white/5">
                        <div className="relative"><SearchIcon size={16} className="absolute left-3 top-2.5 text-slate-500" /><input type="text" placeholder="Search to add friends..." value={playerSearchQuery} onChange={e=>setPlayerSearchQuery(e.target.value)} className="w-full bg-obsidian-900 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors shadow-inner" /></div>
                     </div>
                     <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {playerSearchQuery.trim() ? (
                            allUsers.filter(u => u.uid !== user?.uid && (u.username.toLowerCase().includes(playerSearchQuery.toLowerCase()) || u.userTag.toLowerCase().includes(playerSearchQuery.toLowerCase()))).map(searchUser => {
                                const isFriend = myFriendsList.includes(searchUser.uid);
                                const hasSentReq = friendRequests.some(r => r.from === user?.uid && r.to === searchUser.uid);
                                return (
                                <div key={'search'+searchUser.uid} className="flex items-center gap-3 p-3 bg-obsidian-800/50 rounded-xl border border-white/5">
                                    <div className={`w-10 h-10 rounded-lg bg-obsidian-900 border ${AVATAR_FRAMES.find(f=>f.id===searchUser.userFrame)?.style || 'border-white/10'} overflow-hidden flex-shrink-0 flex items-center justify-center shadow-md`}>
                                        {searchUser.photoURL ? <img src={searchUser.photoURL} className="w-full h-full object-cover"/> : <span className="font-bold text-white">{searchUser.username.charAt(0).toUpperCase()}</span>}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <h4 className="font-bold text-white truncate text-sm flex items-center gap-1">{searchUser.username} {searchUser.badges?.includes('Verified') && <ShieldIcon size={12} className="text-emerald-400" title="Verified"/>}</h4>
                                        <p className="text-xs text-slate-500 truncate">#{searchUser.userTag}</p>
                                    </div>
                                    {isFriend ? <button onClick={() => removeFriendship(searchUser.uid)} className="p-2 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30 transition-colors"><XIcon size={16}/></button> : hasSentReq ? <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-obsidian-900 px-2 py-1 rounded">Sent</span> : <button onClick={() => sendFriendRequest(searchUser.uid)} className="text-xs bg-violet-600 hover:bg-violet-500 text-white font-bold py-1.5 px-3 rounded-lg transition-colors whitespace-nowrap shadow-md">Add</button>}
                                </div>
                            )})
                        ) : myFriendsList.length === 0 ? (
                            <div className="text-center mt-10"><UserIcon size={40} className="text-slate-600 mx-auto mb-4" /><p className="text-slate-400 font-ui">No friends yet.</p></div>
                        ) : (
                            allUsers.filter(u => myFriendsList.includes(u.uid)).map(friend => (
                                <div key={'friend'+friend.uid} onClick={() => setActiveChatTab(friend.uid)} className="flex items-center gap-3 p-3 bg-obsidian-800/50 rounded-xl hover:bg-obsidian-800 cursor-pointer border border-white/5 transition-colors shadow-sm">
                                    <div className={`w-10 h-10 rounded-lg bg-obsidian-900 border ${AVATAR_FRAMES.find(f=>f.id===friend.userFrame)?.style || 'border-white/10'} overflow-hidden flex-shrink-0 flex items-center justify-center shadow-md`}>
                                        {friend.photoURL ? <img src={friend.photoURL} className="w-full h-full object-cover"/> : <span className="font-bold text-white">{friend.username.charAt(0).toUpperCase()}</span>}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <h4 className="font-bold text-white truncate text-sm flex items-center gap-1">{friend.username} {friend.badges?.includes('Verified') && <ShieldIcon size={12} className="text-emerald-400" title="Verified"/>}</h4>
                                        <p className="text-xs text-slate-500 truncate">#{friend.userTag}</p>
                                    </div>
                                    <div className="p-2 bg-white/10 text-white rounded-lg shadow-inner"><MessageIcon size={16}/></div>
                                </div>
                            ))
                        )}
                     </div>
                  </div>
               ) : (
                  <div className="flex flex-col h-full overflow-hidden">
                     {activeChatTab.startsWith('group_') && activeGroupObj && (
                        <div className="p-3 bg-obsidian-900 border-b border-white/5">
                           <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-1"><UsersIcon size={12}/> Invite Friends</p>
                           <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                              {myFriendsList.filter(fid => !activeGroupObj.members.includes(fid)).length === 0 ? (
                                 <span className="text-xs text-slate-600 italic font-ui">All friends are in this group.</span>
                              ) : (
                                 myFriendsList.filter(fid => !activeGroupObj.members.includes(fid)).map(fid => {
                                    const f = allUsers.find(u => u.uid === fid); if(!f) return null;
                                    return <button key={fid} onClick={() => inviteToGroup(activeGroupObj.id, fid)} className="text-[10px] font-bold whitespace-nowrap bg-violet-600/20 hover:bg-violet-600/40 text-violet-300 px-3 py-1.5 rounded-lg border border-violet-500/30 transition-colors shadow-sm">+ {f.username}</button>
                                 })
                              )}
                           </div>
                        </div>
                     )}

                     <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {!isRegistered ? (
                           <div className="h-full flex flex-col items-center justify-center text-center px-4"><MessageIcon size={48} className="text-slate-600 mb-4"/><p className="text-slate-400 font-ui mb-4">Sign in to join the conversation with other players!</p><button onClick={()=>{setShowChatPanel(false); setShowAuthModal(true)}} className="px-6 py-2 bg-obsidian-800 border border-white/20 rounded-lg text-white font-bold shadow-lg">Sign In</button></div>
                        ) : !canChat ? (
                           <div className="h-full flex flex-col items-center justify-center text-center px-4"><ShieldIcon size={48} className="text-rose-500 mb-4 opacity-50"/><p className="text-slate-300 font-bold font-ui mb-2">Restricted Access</p><p className="text-slate-500 font-ui text-sm">You need the <span className="text-white font-bold">Verified</span> badge to access chat. Please contact an Admin!</p></div>
                        ) : (
                           (activeChatTab === 'global' ? globalChat : privateChatMessages).map(msg => (
                              <div key={msg.id} className={`flex gap-3 relative group ${msg.uid === user.uid ? 'flex-row-reverse' : ''}`} style={{ animation: 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards' }}>
                                 <div className={`w-8 h-8 rounded-lg bg-obsidian-800 flex-shrink-0 flex items-center justify-center border ${AVATAR_FRAMES.find(f=>f.id===msg.frame)?.style || 'border-white/10'} overflow-hidden shadow-sm`}>
                                    {msg.photoURL ? <img src={msg.photoURL} className="w-full h-full object-cover"/> : <span className="text-xs font-bold text-white">{msg.username.charAt(0).toUpperCase()}</span>}
                                 </div>
                                 <div className={`flex flex-col ${msg.uid === user.uid ? 'items-end' : 'items-start'} max-w-[75%]`}>
                                    <span className="text-[10px] text-slate-500 font-bold mb-1">{msg.username} <span className="opacity-50">#{msg.tag}</span></span>
                                    
                                    {editingMessageId === msg.id ? (
                                        <form onSubmit={(e) => saveEditMessage(e, msg.id)} className="flex flex-col gap-2 w-full mt-1">
                                            <input type="text" autoFocus value={editMessageText} onChange={e=>setEditMessageText(e.target.value)} className="bg-obsidian-950 border border-violet-500/50 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none" />
                                            <div className="flex gap-2 justify-end">
                                                <button type="button" onClick={() => {setEditingMessageId(null); setEditMessageText('');}} className="text-[10px] text-slate-400 hover:text-white uppercase font-bold tracking-wider">Cancel</button>
                                                <button type="submit" className="text-[10px] text-emerald-400 hover:text-white uppercase font-bold tracking-wider">Save</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className={`px-4 py-2 rounded-2xl text-sm font-ui break-words shadow-md flex flex-col gap-1 ${msg.uid === user.uid ? `bg-violet-600 border border-violet-500 text-white rounded-tr-sm` : 'bg-obsidian-800 text-slate-200 border border-white/5 rounded-tl-sm'}`}>
                                           <span>{msg.text}</span>
                                           {msg.edited && <span className="text-[8px] opacity-50 text-right italic leading-none">(edited)</span>}
                                        </div>
                                    )}
                                 </div>
                                 
                                 {(isModerator || msg.uid === user.uid) && !editingMessageId && (
                                    <div className="absolute -top-6 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-obsidian-900 px-2 py-1 rounded-lg shadow-md border border-white/10 z-10">
                                        {msg.uid === user.uid && <button onClick={() => startEditMessage(msg)} className="text-violet-400 hover:text-white text-[10px] uppercase font-bold tracking-wider">Edit</button>}
                                        <button onClick={() => isModerator && msg.uid !== user.uid ? deleteMessage(msg.id, msg.uid) : deleteMessage(msg.id, msg.uid)} className="text-rose-400 hover:text-white text-[10px] uppercase font-bold tracking-wider">
                                           {msg.uid === user.uid ? 'Unsend' : 'Delete'}
                                        </button>
                                    </div>
                                 )}
                              </div>
                           ))
                        )}
                        <div ref={chatEndRef}></div>
                     </div>
                  </div>
               )}
               
               {isRegistered && canChat && activeChatTab !== 'friends' && activeChatTab !== 'groups' ? (
                  <form onSubmit={sendChat} className="p-4 border-t border-white/10 bg-obsidian-900 z-10">
                     <div className="relative">
                        <input type="text" maxLength={150} value={chatMessage} onChange={e=>setChatMessage(e.target.value)} placeholder="Say something..." className="w-full bg-obsidian-950 border border-white/10 rounded-full py-3 pl-4 pr-12 text-white text-sm focus:outline-none focus:border-violet-500/50 shadow-inner" />
                        <button type="submit" disabled={!chatMessage.trim()} className={`absolute right-2 top-2 p-1.5 rounded-full ${chatMessage.trim() ? `bg-violet-600 hover:bg-violet-500 text-white shadow-md active:scale-95` : 'text-slate-600'} transition-all`}><SendIcon size={18}/></button>
                     </div>
                  </form>
               ) : isRegistered && !canChat && activeChatTab !== 'friends' && activeChatTab !== 'groups' ? (
                  <div className="p-4 border-t border-white/10 bg-obsidian-900 text-center z-10"><p className="text-rose-400 font-bold font-ui text-sm flex items-center justify-center gap-2"><ShieldIcon size={16}/> Chat requires Verified badge.</p></div>
               ) : null}
            </div>

            {/* --- LEADERBOARD: VIEW PLAYER PROFILE MODAL --- */}
            {viewingPlayer && (
              <div className="absolute inset-0 z-[250] flex items-center justify-center bg-obsidian-950/80 backdrop-blur-md p-4 animate-modal-pop">
                 <div className="bg-obsidian-900/90 backdrop-blur-xl border border-violet-500/20 rounded-[2.5rem] w-full max-w-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative max-h-[95vh] overflow-y-auto overflow-hidden">
                     <button onClick={() => setViewingPlayer(null)} className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-xl text-violet-300 hover:text-violet-100 transition-colors active:scale-95 z-20 shadow-md">
                       <XIcon size={24} />
                     </button>
                     
                     <div className="w-full h-40 sm:h-48 bg-obsidian-800 relative shadow-inner">
                       {viewingPlayer.bannerURL ? (
                         <img src={viewingPlayer.bannerURL} className="w-full h-full object-cover" /> 
                       ) : (
                         <div className="w-full h-full bg-gradient-to-r from-violet-900 to-fuchsia-900 opacity-60"></div>
                       )}
                     </div>
                     
                     <div className="px-8 pb-8 relative">
                         <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-[2rem] bg-obsidian-800 flex items-center justify-center shadow-2xl border-4 border-obsidian-900 -mt-12 sm:-mt-14 mb-4 overflow-hidden relative z-10 ${AVATAR_FRAMES.find(f=>f.id===viewingPlayer.userFrame)?.style || ''}`}>
                           {viewingPlayer.photoURL ? (
                             <img src={viewingPlayer.photoURL} className="w-full h-full object-cover" /> 
                           ) : (
                             <span className="text-4xl font-bold text-violet-100 font-heading">{viewingPlayer.username.charAt(0).toUpperCase()}</span>
                           )}
                         </div>
                         <h2 className="text-3xl font-black text-violet-100 font-heading flex items-center gap-2 drop-shadow-md">
                           {viewingPlayer.username} 
                           {viewingPlayer.badges?.includes('Verified') && <ShieldIcon size={20} className="text-emerald-400 drop-shadow-sm" title="Verified"/>}
                           <span className="text-lg text-violet-500 font-ui ml-1">#{viewingPlayer.userTag}</span>
                         </h2>
                         <p className="text-violet-200 mt-4 mb-6 font-ui leading-relaxed bg-obsidian-950/50 p-5 rounded-2xl border border-violet-500/10 shadow-inner break-words">
                           {viewingPlayer.bio || "This player hasn't written a bio yet."}
                         </p>
                         
                         <div className="flex gap-4">
                             <div className="bg-obsidian-950/80 px-5 py-3 rounded-2xl border border-violet-500/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] flex-1 text-center">
                               <span className="block text-violet-400/70 text-xs uppercase tracking-widest font-bold mb-1">Level</span>
                               <span className="text-2xl font-black text-fuchsia-400 font-heading drop-shadow-md">{viewingPlayer.currentLevel || 1}</span>
                             </div>
                             <div className="bg-obsidian-950/80 px-5 py-3 rounded-2xl border border-violet-500/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] flex-1 text-center">
                               <span className="block text-violet-400/70 text-xs uppercase tracking-widest font-bold mb-1">Streak</span>
                               <span className={`text-2xl font-black font-heading flex items-center justify-center gap-2 drop-shadow-md ${getEffectiveStreak(viewingPlayer) > 0 ? 'text-orange-500' : 'text-violet-500/50'}`}>
                                 <span className={getEffectiveStreak(viewingPlayer) > 0 ? 'animate-pulse' : 'grayscale'}>🔥</span> 
                                 {getEffectiveStreak(viewingPlayer)}
                               </span>
                             </div>
                         </div>
                     </div>
                 </div>
              </div>
            )}

            {/* --- ADMIN: EDIT PLAYER MODAL --- */}
            {adminEditingUser && (
              <div className="absolute inset-0 z-[250] flex items-center justify-center bg-obsidian-950/80 backdrop-blur-md p-4 animate-modal-pop">
                 <div className="bg-obsidian-900/90 backdrop-blur-xl border border-violet-500/20 rounded-[2.5rem] p-6 sm:p-10 w-full max-w-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative max-h-[95vh] overflow-y-auto">
                    <button onClick={() => setAdminEditingUser(null)} className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 bg-obsidian-800/50 rounded-xl text-violet-400 hover:text-violet-100 transition-colors active:scale-95 shadow-inner">
                      <XIcon size={24} />
                    </button>
                    
                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 bg-rose-500/20 text-rose-500 rounded-xl border border-rose-500/50 shadow-sm">
                        <ShieldIcon size={28} />
                      </div>
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-black font-heading text-violet-100 drop-shadow-sm">Manage Player</h2>
                        <p className="text-violet-400 font-ui text-sm sm:text-base">
                          Editing profile for <span className="text-violet-100 font-bold">{adminEditingUser.username}</span>
                        </p>
                      </div>
                    </div>
                    
                    <form onSubmit={submitAdminAction} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs sm:text-sm font-bold font-ui tracking-widest uppercase text-violet-400 mb-2 ml-1">Username</label>
                          <input type="text" required value={adminEditUsername} onChange={e => setAdminEditUsername(e.target.value)} className="w-full bg-obsidian-950/80 border border-violet-500/20 rounded-2xl px-5 py-4 font-ui text-lg sm:text-xl font-bold text-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]" />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-bold font-ui tracking-widest uppercase text-violet-400 mb-2 ml-1">ID Tag</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-violet-500 font-heading text-xl">#</span>
                            <input type="text" maxLength={4} required value={adminEditTag} onChange={e => setAdminEditTag(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} className="w-full bg-obsidian-950/80 border border-violet-500/20 rounded-2xl px-4 pl-8 py-4 font-ui text-lg sm:text-xl font-bold text-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] uppercase" />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs sm:text-sm font-bold font-ui tracking-widest uppercase text-violet-400 mb-2 ml-1">Profile Image URL</label>
                        <input type="text" value={adminEditPhoto} onChange={e => setAdminEditPhoto(e.target.value)} className="w-full bg-obsidian-950/80 border border-violet-500/20 rounded-2xl px-5 py-4 font-ui text-base sm:text-lg text-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]" placeholder="https://..." />
                      </div>
                      
                      {/* ADMIN BADGE & TAG MANAGER */}
                      <div>
                        <label className="block text-xs sm:text-sm font-bold font-ui tracking-widest uppercase text-violet-400 mb-2 ml-1">Player Tags / Badges</label>
                        <div className="bg-obsidian-950/80 border border-violet-500/10 rounded-2xl p-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
                          <div className="flex flex-wrap gap-2 mb-4">
                            {adminEditBadges.map(b => (
                              <span key={b} className="px-3 py-1.5 bg-violet-500/20 text-violet-200 text-sm font-bold font-ui rounded-lg border border-violet-500/30 flex items-center gap-2 shadow-sm">
                                 {b} 
                                 <button type="button" onClick={() => setAdminEditBadges(adminEditBadges.filter(x => x !== b))} className="text-violet-400 hover:text-white ml-1 bg-violet-500/20 hover:bg-rose-500/50 rounded-full w-5 h-5 flex items-center justify-center text-xs transition-colors">✕</button>
                              </span>
                            ))}
                            {adminEditBadges.length === 0 && <span className="text-slate-500 text-sm italic py-1 font-ui">No tags assigned</span>}
                          </div>
                          <div className="flex gap-3">
                             <input type="text" value={newAdminBadgeCustom} onChange={e => setNewAdminBadgeCustom(e.target.value)} placeholder="Type custom tag (e.g. Verified, VIP)" className="flex-1 bg-obsidian-900 border border-violet-500/20 rounded-xl px-4 py-2.5 text-sm text-white font-ui focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-inner" />
                             <button type="button" onClick={() => { if(newAdminBadgeCustom.trim() && !adminEditBadges.includes(newAdminBadgeCustom.trim())) { setAdminEditBadges([...adminEditBadges, newAdminBadgeCustom.trim()]); setNewAdminBadgeCustom(''); } }} className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 border border-violet-400/20 rounded-xl text-white text-sm font-bold font-ui transition-colors shadow-md active:scale-95">Add</button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs sm:text-sm font-bold font-ui tracking-widest uppercase text-violet-400 mb-2 ml-1">Daily Streak</label>
                          <input type="number" required min="0" value={adminEditStreak} onChange={e => setAdminEditStreak(e.target.value)} className="w-full bg-obsidian-950/80 border border-violet-500/20 rounded-2xl px-5 py-4 font-ui text-lg sm:text-xl font-bold text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]" />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-bold font-ui tracking-widest uppercase text-violet-400 mb-2 ml-1">Player Level</label>
                          <input type="number" required min="1" value={adminEditLevel} onChange={e => setAdminEditLevel(e.target.value)} className="w-full bg-obsidian-950/80 border border-violet-500/20 rounded-2xl px-5 py-4 font-ui text-lg sm:text-xl font-bold text-fuchsia-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]" />
                        </div>
                      </div>
                      
                      {/* Advanced Punishment System */}
                      <div className="bg-obsidian-950/50 p-6 rounded-2xl border border-rose-500/10 space-y-4">
                        <label className="block text-sm font-bold font-ui tracking-widest uppercase text-rose-400 mb-2 ml-1">Account Punishment & Status</label>
                        <select value={adminEditStatus} onChange={(e) => setAdminEditStatus(e.target.value)} className="w-full bg-obsidian-900 border border-rose-500/20 rounded-xl px-5 py-4 font-ui text-lg font-bold text-white focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] appearance-none cursor-pointer">
                          <option value="active">🟢 Active (Good Standing)</option>
                          <option value="suspended">🟡 Suspended (Temporary)</option>
                          <option value="banned">🔴 Banned (Permanent)</option>
                        </select>

                        {adminEditStatus !== 'active' && (
                          <div className="animate-in fade-in slide-in-from-top-2">
                             <label className="block text-xs font-bold font-ui tracking-widest uppercase text-slate-400 mb-2 ml-1 mt-4">Ban / Suspension Reason</label>
                             <input type="text" placeholder="e.g. Exploiting, Profanity" value={adminEditBanReason} onChange={e=>setAdminEditBanReason(e.target.value)} className="w-full bg-obsidian-900 border border-rose-500/20 rounded-xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-rose-500" />
                          </div>
                        )}
                        {adminEditStatus === 'suspended' && (
                          <div className="animate-in fade-in slide-in-from-top-2">
                             <label className="block text-xs font-bold font-ui tracking-widest uppercase text-slate-400 mb-2 ml-1 mt-4">Suspension Duration (Hours)</label>
                             <input type="number" min="1" value={adminEditSuspendHours} onChange={e=>setAdminEditSuspendHours(e.target.value)} className="w-full bg-obsidian-900 border border-amber-500/20 rounded-xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
                          </div>
                        )}
                      </div>
                      
                      <div className="pt-4 mt-8 border-t border-white/10 flex justify-between items-center gap-4">
                        <button
                          type="button"
                          onClick={deleteAdminUser}
                          disabled={adminActionLoading}
                          className="w-full sm:w-auto px-6 py-4 bg-rose-600/10 hover:bg-rose-600/20 text-rose-500 font-bold font-heading text-base sm:text-lg tracking-wider uppercase rounded-2xl transition-all disabled:opacity-50 active:scale-95 border border-rose-500/30 shadow-sm"
                        >
                          Delete
                        </button>
                        <button disabled={adminActionLoading} type="submit" className="w-full sm:w-auto px-10 py-4 bg-violet-600 hover:bg-violet-500 text-violet-100 font-bold font-heading text-lg sm:text-xl tracking-wider uppercase rounded-2xl transition-all disabled:opacity-50 flex justify-center active:scale-95 shadow-[0_0_20px_-5px_rgba(168,85,247,0.5)] border border-violet-400/20">
                          {adminActionLoading ? (
                            <div className="w-6 h-6 sm:w-7 sm:h-7 border-4 border-violet-100 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            'Save Changes'
                          )}
                        </button>
                      </div>
                    </form>
                 </div>
              </div>
            )}

            {/* --- AUTHENTICATION MODAL --- */}
            {showAuthModal && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
                 <div className="bg-obsidian-900 border border-violet-500/20 rounded-[2.5rem] p-8 sm:p-10 w-full max-w-md shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative animate-modal-pop">
                    <button 
                      onClick={() => { setShowAuthModal(false); setAuthMode('login'); setAuthError(''); setResetMessage(''); }} 
                      className="absolute top-6 right-6 p-2 bg-violet-500/10 rounded-xl text-violet-400/70 hover:text-violet-200 hover:bg-violet-500/20 transition-colors active:scale-95 shadow-inner"
                    >
                      <XIcon size={20} />
                    </button>
                    
                    <h2 className="text-3xl font-black font-heading text-violet-100 mb-8 tracking-wide drop-shadow-sm">
                      {authMode === 'login' ? 'Welcome Back' : authMode === 'signup' ? 'Create Account' : 'Reset Password'}
                    </h2>
                    
                    {authError && (
                      <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 font-ui font-semibold text-sm rounded-xl flex items-center gap-3 shadow-sm">
                        <XIcon size={18} className="text-rose-500 flex-shrink-0" /> {authError}
                      </div>
                    )}
                    
                    {resetMessage && (
                      <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-ui font-semibold text-sm rounded-xl flex items-center gap-3 shadow-sm">
                        <ShieldIcon size={18} className="text-emerald-500 flex-shrink-0" /> 
                        {resetMessage}
                      </div>
                    )}
                    
                    <form onSubmit={authMode === 'login' ? handleLogin : authMode === 'signup' ? handleSignup : handlePasswordReset} className="space-y-5">
                      {authMode === 'signup' && (
                        <div>
                          <label className="block text-xs font-bold tracking-widest uppercase text-violet-400 mb-2 ml-1">Username</label>
                          <input 
                            type="text" 
                            required 
                            value={username} 
                            onChange={e => setUsername(e.target.value)} 
                            className="w-full bg-obsidian-950 border border-violet-500/20 rounded-xl px-4 py-3.5 font-ui text-base text-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]" 
                            placeholder="ProGamer123" 
                          />
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-xs font-bold tracking-widest uppercase text-violet-400 mb-2 ml-1">Email Address</label>
                        <input 
                          type="email" 
                          required 
                          value={email} 
                          onChange={e => setEmail(e.target.value)} 
                          className="w-full bg-obsidian-950 border border-violet-500/20 rounded-xl px-4 py-3.5 font-ui text-base text-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]" 
                          placeholder="player@example.com" 
                        />
                      </div>
                      
                      {authMode !== 'reset' && (
                        <div>
                          <label className="block text-xs font-bold tracking-widest uppercase text-violet-400 mb-2 ml-1">Password</label>
                          <div className="relative">
                            <input 
                              type={showPassword ? "text" : "password"} 
                              required 
                              minLength={6} 
                              value={password} 
                              onChange={e => setPassword(e.target.value)} 
                              className="w-full bg-obsidian-950 border border-violet-500/20 rounded-xl px-4 py-3.5 pr-12 font-ui text-base text-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]" 
                              placeholder="••••••••" 
                            />
                            <button 
                              type="button" 
                              onClick={() => setShowPassword(!showPassword)} 
                              className="absolute inset-y-0 right-0 pr-4 flex items-center text-violet-500 hover:text-violet-300 transition-colors"
                            >
                              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                            </button>
                          </div>
                          {authMode === 'login' && (
                            <div className="mt-3 text-right">
                              <button 
                                type="button" 
                                onClick={() => { setAuthMode('reset'); setAuthError(''); setResetMessage(''); }} 
                                className="text-xs font-ui font-bold text-violet-400/70 hover:text-violet-300 transition-colors"
                              >
                                Forgot password?
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* ANTI-BOT VERIFICATION */}
                      {(authMode === 'signup' || authMode === 'login') && (
                        <div className="bg-obsidian-950/80 p-3 rounded-xl border border-violet-500/10 mt-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] flex flex-col items-center w-full">
                          <div id="turnstile-container" className="mb-2 w-full flex justify-center"></div>
                          {authMode === 'signup' && captchaBypass && (
                            <div className="flex items-center gap-4 w-full mt-2">
                              <span className="text-xl font-bold text-violet-200">{botCheck.num1} + {botCheck.num2} =</span>
                              <input 
                                type="number" 
                                required 
                                value={botCheck.answer} 
                                onChange={e => setBotCheck({...botCheck, answer: e.target.value})} 
                                className="flex-1 bg-obsidian-900 border border-violet-500/20 rounded-lg px-3 py-2 font-ui text-base text-violet-100 focus:outline-none focus:border-violet-500/50 transition-colors" 
                                placeholder="?" 
                              />
                            </div>
                          )}
                        </div>
                      )}

                      <button 
                        disabled={authLoading || authCooldown} 
                        type="submit" 
                        className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-violet-100 font-bold font-ui text-sm tracking-widest uppercase rounded-xl transition-all mt-8 disabled:opacity-50 flex justify-center active:scale-95 shadow-[0_0_20px_rgba(139,92,246,0.4)] border border-violet-400/20"
                      >
                        {authLoading ? (
                          <div className="w-5 h-5 border-2 border-violet-100 border-t-transparent rounded-full animate-spin"></div>
                        ) : ( 
                          authMode === 'login' ? 'Sign In' : authMode === 'signup' ? 'Create Account' : 'Send Reset Link' 
                        )}
                      </button>
                    </form>
                    
                    <div className="mt-8 text-center border-t border-violet-500/10 pt-6">
                      {authMode === 'reset' ? (
                        <button 
                          onClick={() => { setAuthMode('login'); setAuthError(''); setResetMessage(''); }} 
                          className="text-violet-400 hover:text-violet-200 font-ui font-bold text-sm transition-colors"
                        >
                          Back to Sign In
                        </button>
                      ) : (
                        <button 
                          onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setAuthError(''); }} 
                          className="text-violet-400 hover:text-violet-200 font-ui font-bold text-sm transition-colors"
                        >
                          {authMode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                        </button>
                      )}
                    </div>
                 </div>
              </div>
            )}
            
            {/* --- TOAST NOTIFICATIONS --- */}
            {toast && (
              <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] z-[300] font-ui font-bold text-xl flex items-center gap-3 animate-toast-slide border ${toast.type === 'error' ? 'bg-rose-600 text-white border-rose-500/50' : 'bg-obsidian-800 text-violet-300 border-violet-500/30'}`}>
                {toast.type === 'error' ? <XIcon size={24}/> : <TrophyIcon size={24}/>}
                {toast.message}
              </div>
            )}

          </main>
        </div>
      );
    }
    
    // --- APP INITIALIZATION ---
    const root = ReactDOM.createRoot(document.getElementById('root')); 
    root.render(<App />);
