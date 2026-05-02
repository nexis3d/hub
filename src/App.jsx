import React, { useState, memo, useEffect, useRef, useMemo } from 'react';
import { 
  createUserWithEmailAndPassword, signInWithEmailAndPassword, 
  signOut, onAuthStateChanged, updateProfile, signInAnonymously, 
  signInWithCustomToken, sendPasswordResetEmail, sendEmailVerification
} from 'firebase/auth';
import { 
  doc, getDoc, setDoc, updateDoc, deleteDoc, 
  collection, onSnapshot 
} from 'firebase/firestore';
import { auth, db } from './firebase';

const APP_ID = 'nexis-games-production';

// --- SPONSOR BREAK COMPONENT ---
const SponsorBreak = memo(() => {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error("AdSense Error: ", e);
        }
    }, []);

    return (
        <div className="w-full max-w-4xl mx-auto my-8 text-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <p className="text-[10px] text-slate-500 mb-2 uppercase tracking-widest font-bold">Sponsor Break</p>
            <div className="min-h-[100px] flex items-center justify-center">
                <ins className="adsbygoogle"
                     style={{ display: 'block' }}
                     data-ad-client="ca-pub-9729951455444854"
                     data-ad-slot="1373555364"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
            </div>
        </div>
    );
});

// --- ICONS ---
const BlackjackIcon = memo(() => (
    <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none">
        <defs>
            <linearGradient id="bjGrad" x1="0" y1="0" x2="200" y2="200">
                <stop offset="0%" stopColor="#166534"/>
                <stop offset="100%" stopColor="#064e3b"/>
            </linearGradient>
            <filter id="bjDrop"><feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.5" /></filter>
        </defs>
        <rect width="200" height="200" rx="40" fill="url(#bjGrad)" />
        <g filter="url(#bjDrop)">
            <g transform="translate(60, 60) rotate(-15)">
                <rect width="60" height="90" rx="6" fill="#f8fafc" />
                <path d="M25 35 L30 45 L35 35 A 5 5 0 0 0 25 35" fill="#ef4444" />
                <text x="10" y="25" fill="#ef4444" fontSize="16" fontFamily="Arial" fontWeight="bold">A</text>
            </g>
            <g transform="translate(100, 70) rotate(10)">
                <rect width="60" height="90" rx="6" fill="#f8fafc" />
                <path d="M30 35 C 35 25, 45 45, 30 55 C 15 45, 25 25, 30 35" fill="#0f172a" />
                <text x="10" y="25" fill="#0f172a" fontSize="16" fontFamily="Arial" fontWeight="bold">J</text>
            </g>
        </g>
    </svg>
));

const CheeseIcon = memo(() => (
    <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none">
        <defs>
            <linearGradient id="cheeseGrad" x1="0" y1="0" x2="200" y2="200">
                <stop offset="0%" stopColor="#fef08a"/>
                <stop offset="100%" stopColor="#eab308"/>
            </linearGradient>
            <filter id="cheeseDrop"><feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" /></filter>
        </defs>
        <rect width="200" height="200" rx="40" fill="url(#cheeseGrad)" />
        <g filter="url(#cheeseDrop)" transform="translate(50, 60)">
            <path d="M0 0 L100 -20 L80 60 L-20 80 Z" fill="#fde047" stroke="#ca8a04" strokeWidth="6" strokeLinejoin="round" />
            <path d="M0 0 L-20 80 L-20 100 L0 20 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="6" strokeLinejoin="round" />
            <path d="M80 60 L-20 80 L-20 100 L80 80 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="6" strokeLinejoin="round" />
            <circle cx="30" cy="30" r="12" fill="#ca8a04" />
            <circle cx="65" cy="15" r="8" fill="#ca8a04" />
            <circle cx="10" cy="50" r="10" fill="#ca8a04" />
        </g>
    </svg>
));

const BurgerIcon = memo(() => (<svg width="100%" height="100%" viewBox="0 0 200 200"><rect width="200" height="200" rx="40" fill="#d97706"/><circle cx="100" cy="100" r="40" fill="#fef3c7"/></svg>));
const GSwitchIcon = memo(() => (<svg width="100%" height="100%" viewBox="0 0 200 200"><rect width="200" height="200" rx="40" fill="#2563eb"/><path d="M50 100 L150 100" stroke="white" strokeWidth="10"/></svg>));
const ArchitectIcon = memo(() => (<svg width="100%" height="100%" viewBox="0 0 200 200"><rect width="200" height="200" rx="40" fill="#115e59"/><polygon points="100,40 40,120 160,120" fill="#ccfbf1"/></svg>));

const ShieldIcon = ({ size = 24 }) => (
  <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);

// --- GAME DATA ---
const GAMES = [
    { id: 'burger-chef', title: 'Burger Chef', developer: 'Mofawo', src: '/games/Burger.html', icon: BurgerIcon, theme: 'from-amber-500 to-orange-700', tags: ['Cooking', 'Action'] },
    { id: 'beauty-and-the-cheese', title: 'Beauty and the Cheese', developer: 'Jam', src: '/games/Che.html', icon: CheeseIcon, theme: 'from-yellow-400 to-amber-600', tags: ['Adventure', 'Arcade'] },
    { id: 'g-switch-3', title: 'G-Switch 3', developer: 'Serius Games', src: '[https://gswitch.io/g-switch-3.embed](https://gswitch.io/g-switch-3.embed)', icon: GSwitchIcon, theme: 'from-blue-600 to-indigo-800', tags: ['Action', 'Arcade'] },
    { id: 'architects-curse', title: "THE ARCHITECT'S CURSE", developer: 'CoolDude_10', src: '/games/Arch.html', icon: ArchitectIcon, theme: 'from-teal-800 to-slate-900', tags: ['Spooky', 'Adventure'], isPublicBeta: true },
    { id: 'casual-blackjack', title: 'Casual Blackjack', developer: 'DUMBGUY0.π', src: '/games/Black.html', icon: BlackjackIcon, theme: 'from-green-700 to-emerald-950', tags: ['Arcade', 'Table'] }
];

export default function App() {
    const [selectedGame, setSelectedGame] = useState(null);
    
    // Auth State
    const [user, setUser] = useState(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [authError, setAuthError] = useState('');
    const [authLoading, setAuthLoading] = useState(false);
    
    // Anti-Bot Math Check
    const [botCheck, setBotCheck] = useState({ num1: 1, num2: 1, answer: '' });

    useEffect(() => {
        if (!auth) return;
        const unsubscribe = onAuthStateChanged(auth, u => {
            setUser(u);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (authMode === 'signup') {
            setBotCheck({
                num1: Math.floor(Math.random() * 10) + 1,
                num2: Math.floor(Math.random() * 10) + 1,
                answer: ''
            });
        }
    }, [authMode]);

    const handleSignup = async (e) => {
        e.preventDefault();
        setAuthError('');
        setAuthLoading(true);

        try {
            if (!username || username.trim().length < 3) throw new Error("Username must be at least 3 characters.");
            if (parseInt(botCheck.answer) !== (botCheck.num1 + botCheck.num2)) {
                throw new Error("Anti-Bot Check Failed: Incorrect math answer!");
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: username.trim() });
            await sendEmailVerification(userCredential.user);
            await signOut(auth);
            
            setAuthMode('login');
            alert("Account created! Please check your email inbox (or spam) to verify your account before logging in.");
        } catch (err) {
            setAuthError(err.message.replace('Firebase: ', ''));
            setBotCheck({ num1: Math.floor(Math.random() * 10) + 1, num2: Math.floor(Math.random() * 10) + 1, answer: '' });
        } finally {
            setAuthLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setAuthError('');
        setAuthLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            if (!userCredential.user.emailVerified) {
                await signOut(auth);
                throw new Error("Please verify your email address first! Check your inbox or spam folder.");
            }
            setShowAuthModal(false);
        } catch (err) {
            setAuthError(err.message.replace('Firebase: ', ''));
        } finally {
            setAuthLoading(false);
        }
    };

    const handleLogout = async () => {
        if (auth) await signOut(auth);
    };

    if (selectedGame) {
        return (
            <div className="h-screen w-full bg-black flex flex-col">
                <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center shadow-lg z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10"><selectedGame.icon /></div>
                        <h1 className="text-xl font-bold text-white">{selectedGame.title}</h1>
                    </div>
                    <button 
                        onClick={() => setSelectedGame(null)} 
                        className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors font-semibold border border-slate-700"
                    >
                        ← Back to Hub
                    </button>
                </div>
                <div className="flex-1 w-full bg-black relative">
                    <iframe 
                        src={selectedGame.src} 
                        className="w-full h-full border-none pointer-events-auto" 
                        title={selectedGame.title}
                        allow="fullscreen"
                    ></iframe>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8 relative">
            <div className="absolute top-6 right-8">
                {user && user.emailVerified ? (
                    <div className="flex items-center gap-4">
                        <span className="text-slate-300 font-bold">{user.displayName}</span>
                        <button onClick={handleLogout} className="px-4 py-2 bg-rose-600/20 text-rose-500 rounded-lg border border-rose-500/50 hover:bg-rose-600 hover:text-white transition-colors">Sign Out</button>
                    </div>
                ) : (
                    <button onClick={() => setShowAuthModal(true)} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-all shadow-lg">Sign In</button>
                )}
            </div>

            <header className="max-w-6xl mx-auto mb-8 text-center pt-8">
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-4 tracking-tight">
                    Nexis Games Hub
                </h1>
                <p className="text-slate-400 text-lg">Your ultimate browser gaming destination.</p>
            </header>

            <SponsorBreak />

            <main className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {GAMES.map(game => {
                        const Icon = game.icon;
                        return (
                            <div 
                                key={game.id} 
                                onClick={() => setSelectedGame(game)} 
                                className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.3)] border border-white/10 bg-gradient-to-br ${game.theme}`}
                            >
                                <div className="p-8 flex flex-col items-center text-center h-full">
                                    <div className="w-32 h-32 mb-6 drop-shadow-2xl transition-transform duration-300 hover:scale-110">
                                        <Icon />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-md">{game.title}</h2>
                                    <p className="text-white/80 text-sm font-medium mb-4">by {game.developer}</p>
                                    
                                    <div className="flex flex-wrap justify-center gap-2 mt-auto">
                                        {game.tags.map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-black/40 rounded-full text-xs font-semibold text-white/90 backdrop-blur-md shadow-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </main>

            {/* Auth Modal UI */}
            {showAuthModal && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-full max-w-md relative shadow-2xl">
                        <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">✕</button>
                        <h2 className="text-3xl font-bold text-white mb-6">
                            {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        
                        {authError && <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-lg text-sm">{authError}</div>}

                        <form onSubmit={authMode === 'login' ? handleLogin : handleSignup} className="space-y-4">
                            {authMode === 'signup' && (
                                <div>
                                    <label className="block text-slate-400 text-sm font-bold mb-2">Username</label>
                                    <input type="text" required value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="ProGamer123" />
                                </div>
                            )}
                            
                            <div>
                                <label className="block text-slate-400 text-sm font-bold mb-2">Email</label>
                                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="player@example.com" />
                            </div>
                            
                            <div>
                                <label className="block text-slate-400 text-sm font-bold mb-2">Password</label>
                                <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="••••••••" />
                            </div>

                            {authMode === 'signup' && (
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 mt-4">
                                    <label className="block text-slate-400 text-sm font-bold mb-2 flex items-center gap-2">
                                        <ShieldIcon size={16} /> Anti-Bot Verification
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xl font-bold text-white">{botCheck.num1} + {botCheck.num2} =</span>
                                        <input type="number" required value={botCheck.answer} onChange={e => setBotCheck({...botCheck, answer: e.target.value})} className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="?" />
                                    </div>
                                </div>
                            )}

                            <button disabled={authLoading} type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl mt-6 transition-colors">
                                {authLoading ? 'Processing...' : authMode === 'login' ? 'Sign In' : 'Sign Up & Verify'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="text-slate-400 hover:text-white text-sm transition-colors font-medium">
                                {authMode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Log in"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
