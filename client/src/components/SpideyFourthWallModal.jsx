import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, User, Key, Sparkles, ArrowRight, UserPlus, LogIn, Eye, EyeOff, AlertCircle, X, Check, Briefcase, Smile } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { ActionWordBadge } from './ActionBubble';

const AVATAR_OPTIONS = ['🕷️', '🕸️', '⚡', '🥁', '📰', '🧪', '💥', '🛡️', '📸', '🥞', '🎭', '🕶️'];

const ROLE_OPTIONS = [
  'Daily Bugle Correspondent',
  'Staff Photographer',
  'Investigative Journalist',
  'Senior Editor',
  'Science Lab Specialist',
  'Street Vigilante',
  'Avenger Liaison'
];

export const SpideyFourthWallModal = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onSignupSuccess,
  onGuestLogin,
  presets = []
}) => {
  // Login State
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Sign Up State
  const [signupName, setSignupName] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState(ROLE_OPTIONS[0]);
  const [signupAvatar, setSignupAvatar] = useState(AVATAR_OPTIONS[0]);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const [activeTab, setActiveTab] = useState('quick'); // 'quick' | 'login' | 'signup'
  const [speechIndex, setSpeechIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const spideyQuips = [
    "Freeze frame! 🛑 Look at you trying to sneak into the Daily Bugle without a press badge!",
    "Jameson will fire me if unregistered vigilantes touch the printing press! Who's rolling today?",
    "Need a new press badge? Sign up in seconds, pick a Marvel hero, or just sneak in as a guest!",
    "Remember: Guests can read & comment, but only verified press staff can print front-page stories!"
  ];

  useEffect(() => {
    if (isOpen) {
      soundFx.playFreezeFrame();
      setErrorMsg('');
      setSpeechIndex(Math.floor(Math.random() * spideyQuips.length));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleQuickPick = (preset) => {
    soundFx.playThwip();
    setLoginUsername(preset.username);
    setLoginPassword(preset.password || (preset.username === 'peter' ? 'webhead' : preset.username === 'jameson' ? 'spiderman' : preset.username === 'gwen' ? 'ghostspider' : 'brooklyn'));
    setActiveTab('login');
  };

  const handleCustomLogin = async (e) => {
    e.preventDefault();
    if (!loginUsername.trim() || !loginPassword.trim()) {
      soundFx.playSpiderSense();
      setErrorMsg('Spider-Sense Warning: Both Login ID and Password are required!');
      return;
    }

    setIsSubmitting(true);
    soundFx.playThwip();
    try {
      await onLoginSuccess({ username: loginUsername.trim(), password: loginPassword.trim() });
      soundFx.playFanfare();
      onClose();
    } catch (err) {
      soundFx.playSpiderSense();
      setErrorMsg(err.message || 'Login failed! Check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!signupName.trim() || !signupUsername.trim() || !signupPassword.trim()) {
      soundFx.playSpiderSense();
      setErrorMsg('Spider-Sense Warning: Full Name, Login ID, and Passcode are required!');
      return;
    }

    setIsSubmitting(true);
    soundFx.playThwip();
    try {
      if (onSignupSuccess) {
        await onSignupSuccess({
          name: signupName.trim(),
          username: signupUsername.trim(),
          password: signupPassword.trim(),
          role: signupRole,
          avatar: signupAvatar
        });
      } else {
        await onLoginSuccess({
          name: signupName.trim(),
          username: signupUsername.trim(),
          password: signupPassword.trim()
        });
      }
      soundFx.playFanfare();
      onClose();
    } catch (err) {
      soundFx.playSpiderSense();
      setErrorMsg(err.message || 'Sign up failed! Please try another ID.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestEntry = async () => {
    soundFx.playThwip();
    setIsSubmitting(true);
    try {
      await onGuestLogin();
      soundFx.playFanfare();
      onClose();
    } catch (err) {
      soundFx.playSpiderSense();
      setErrorMsg('Could not initialize anonymous guest session.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
        {/* 4th-Wall VHS Freeze-Frame Scanlines & Halftone Grid */}
        <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none" />

        {/* Freeze Frame Banner at top-left */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-spidey-red text-white font-headline text-sm sm:text-base px-3 py-1 border-2 border-black shadow-comic transform -rotate-3 select-none">
          <span className="w-2.5 h-2.5 bg-spidey-yellow rounded-full animate-ping" />
          <span>PAUSE / 4TH WALL BREAK</span>
        </div>

        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 40 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          className="relative w-full max-w-2xl bg-spidey-paper border-5 border-spidey-black shadow-comic-xl overflow-hidden my-auto"
        >
          {/* Header Bar */}
          <div className="bg-spidey-black text-white px-5 py-3 flex items-center justify-between border-b-4 border-black">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🕸️</span>
              <h3 className="font-headline tracking-wider text-xl uppercase text-spidey-yellow">
                DAILY BUGLE PRESS ROOM ACCESS
              </h3>
            </div>

            <button
              onClick={() => {
                soundFx.playPop();
                onClose();
              }}
              className="p-1 text-white hover:bg-spidey-red transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6 stroke-[3]" />
            </button>
          </div>

          {/* Upside-Down Spidey 4th-Wall Animated Section */}
          <div className="relative bg-spidey-paperDark border-b-4 border-black p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 overflow-hidden">
            {/* Hanging Web & Upside-down Spidey Avatar */}
            <motion.div
              initial={{ y: -80, rotate: 180 }}
              animate={{ y: 0, rotate: 180 }}
              transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }}
              className="flex-shrink-0 relative cursor-pointer"
              onClick={() => {
                soundFx.playThwip();
                setSpeechIndex((prev) => (prev + 1) % spideyQuips.length);
              }}
              title="Click Spidey for more 4th-wall quips!"
            >
              {/* Web line from top */}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[3px] h-24 bg-white border border-black shadow-sm" />

              <div className="w-20 h-20 bg-spidey-red border-4 border-black rounded-full flex items-center justify-center shadow-comic-sm relative group">
                {/* Spidey eyes */}
                <div className="flex items-center gap-2">
                  <div className="w-5 h-7 bg-white border-2 border-black rounded-t-full transform rotate-12" />
                  <div className="w-5 h-7 bg-white border-2 border-black rounded-t-full transform -rotate-12" />
                </div>
                {/* Click me badge */}
                <span className="absolute -bottom-2 -right-2 bg-spidey-yellow text-spidey-black text-[9px] font-headline px-1.5 py-0.5 border border-black transform rotate-12">
                  CLICK ME!
                </span>
              </div>
            </motion.div>

            {/* Spidey Talking Speech Bubble */}
            <div className="flex-1">
              <div className="speech-bubble p-3.5 bg-white text-spidey-black">
                <p className="font-comic font-black text-sm sm:text-base leading-snug">
                  "{spideyQuips[speechIndex]}"
                </p>
              </div>
              <p className="mt-1 text-[11px] font-sans font-bold text-gray-700 pl-2">
                — Spider-Man (Earth-12041 / Ultimate Spidey)
              </p>
            </div>
          </div>

          {/* Tab Switcher: 1-Click Heroes vs Login vs Sign Up */}
          <div className="bg-spidey-yellow px-4 sm:px-5 py-2 flex flex-wrap items-center justify-between gap-2 border-b-3 border-black">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => {
                  soundFx.playPop();
                  setActiveTab('quick');
                }}
                className={`px-3 py-1 font-headline text-xs sm:text-sm border-2 border-black transition-all ${
                  activeTab === 'quick'
                    ? 'bg-spidey-red text-white shadow-comic-sm'
                    : 'bg-white text-black hover:bg-yellow-100'
                }`}
              >
                ★ 1-CLICK HEROES
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFx.playPop();
                  setActiveTab('login');
                }}
                className={`px-3 py-1 font-headline text-xs sm:text-sm border-2 border-black transition-all ${
                  activeTab === 'login'
                    ? 'bg-spidey-red text-white shadow-comic-sm'
                    : 'bg-white text-black hover:bg-yellow-100'
                }`}
              >
                🔐 LOGIN
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFx.playPop();
                  setActiveTab('signup');
                }}
                className={`px-3 py-1 font-headline text-xs sm:text-sm border-2 border-black transition-all ${
                  activeTab === 'signup'
                    ? 'bg-spidey-red text-white shadow-comic-sm'
                    : 'bg-white text-black hover:bg-yellow-100'
                }`}
              >
                📝 SIGN UP (NEW ID)
              </button>
            </div>

            <span className="font-headline text-xs text-spidey-black tracking-wide hidden sm:inline">
              SELECT ACCESS
            </span>
          </div>

          {/* Modal Body Content */}
          <div className="p-5 sm:p-6 space-y-4 max-h-[55vh] overflow-y-auto">
            {errorMsg && (
              <div className="p-3 bg-spidey-red text-white border-2 border-black font-comic text-xs sm:text-sm font-bold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* TAB 1: Quick Heroes */}
            {activeTab === 'quick' && (
              <div className="space-y-4">
                <p className="font-comic text-sm text-gray-800">
                  Select a verified Marvel press identity below to publish, edit, and comment with 1 click:
                </p>

                {/* Preset Identity Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      username: 'peter',
                      password: 'webhead',
                      name: 'Peter Parker',
                      role: 'Senior Photographer & Webhead',
                      avatar: '🕷️',
                      badge: 'STAFF PHOTOGRAPHER',
                      color: 'border-spidey-red hover:bg-red-50'
                    },
                    {
                      username: 'jameson',
                      password: 'spiderman',
                      name: 'J. Jonah Jameson',
                      role: 'Publisher & Editor-in-Chief',
                      avatar: '📰',
                      badge: 'EDITOR-IN-CHIEF',
                      color: 'border-spidey-yellow hover:bg-yellow-50'
                    },
                    {
                      username: 'gwen',
                      password: 'ghostspider',
                      name: 'Gwen Stacy',
                      role: 'Earth-65 Ghost-Spider & Drummer',
                      avatar: '🥁',
                      badge: 'MULTIVERSE HERO',
                      color: 'border-purple-500 hover:bg-purple-50'
                    },
                    {
                      username: 'miles',
                      password: 'brooklyn',
                      name: 'Miles Morales',
                      role: 'Brooklyn Spider-Man & Artist',
                      avatar: '⚡',
                      badge: 'AVENGER RECRUIT',
                      color: 'border-blue-500 hover:bg-blue-50'
                    }
                  ].map((preset) => (
                    <motion.button
                      key={preset.username}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleQuickPick(preset)}
                      className={`p-3 bg-white border-3 border-black shadow-comic-sm hover:shadow-comic text-left flex items-start gap-3 transition-all ${preset.color}`}
                    >
                      <span className="text-3xl p-1 bg-spidey-paper border-2 border-black">
                        {preset.avatar}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-headline text-base sm:text-lg text-spidey-black uppercase leading-tight truncate">
                            {preset.name}
                          </h4>
                        </div>
                        <p className="font-sans text-[11px] text-gray-600 font-bold truncate">
                          {preset.role}
                        </p>
                        <span className="inline-block mt-1 bg-spidey-black text-spidey-yellow font-headline text-[10px] px-1.5 py-0.2 uppercase border border-black">
                          ID: {preset.username} • PASS: {preset.password}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('signup')}
                    className="font-headline text-xs text-spidey-red hover:underline uppercase"
                  >
                    Want your own custom superhero identity? Click here to Sign Up →
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: Login Form */}
            {activeTab === 'login' && (
              <form onSubmit={handleCustomLogin} className="space-y-3 bg-white p-4 border-3 border-black shadow-comic-sm">
                <div>
                  <label className="block font-headline text-sm uppercase text-spidey-black mb-1">
                    Login ID / Superhero Alias <span className="text-spidey-red">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. peter, jameson, or your custom ID"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 font-comic text-sm border-2 border-black focus:outline-none focus:bg-yellow-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-headline text-sm uppercase text-spidey-black mb-1">
                    Security Passcode <span className="text-spidey-red">*</span>
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter passcode (e.g. webhead, spiderman)"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2 font-comic text-sm border-2 border-black focus:outline-none focus:bg-yellow-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-sans font-bold pt-1">
                  <span className="text-gray-600">Don't have a Daily Bugle ID?</span>
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playPop();
                      setActiveTab('signup');
                    }}
                    className="text-spidey-red hover:underline font-headline text-sm uppercase"
                  >
                    Create New Account (Sign Up) →
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-spidey-red hover:bg-spidey-darkRed text-white font-headline text-lg border-3 border-black shadow-comic comic-button flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  <LogIn className="w-5 h-5" />
                  <span>{isSubmitting ? 'AUTHENTICATING...' : 'LOG IN TO DAILY BUGLE'}</span>
                </button>
              </form>
            )}

            {/* TAB 3: Sign Up Form */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="space-y-3 bg-white p-4 border-3 border-black shadow-comic-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-headline text-sm uppercase text-spidey-black mb-1">
                      Full Name / Superhero Name <span className="text-spidey-red">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mary Jane Watson"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="w-full p-2 font-comic text-sm border-2 border-black focus:outline-none focus:bg-yellow-50"
                    />
                  </div>

                  <div>
                    <label className="block font-headline text-sm uppercase text-spidey-black mb-1">
                      Choose Login ID (Username) <span className="text-spidey-red">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. maryjane, spiderwoman"
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value)}
                      className="w-full p-2 font-comic text-sm border-2 border-black focus:outline-none focus:bg-yellow-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-headline text-sm uppercase text-spidey-black mb-1">
                      Create Passcode <span className="text-spidey-red">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showSignupPassword ? 'text' : 'password'}
                        required
                        placeholder="Min 3 characters"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="w-full p-2 pr-9 font-comic text-sm border-2 border-black focus:outline-none focus:bg-yellow-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
                      >
                        {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-headline text-sm uppercase text-spidey-black mb-1">
                      Press Room Role / Title
                    </label>
                    <select
                      value={signupRole}
                      onChange={(e) => setSignupRole(e.target.value)}
                      className="w-full p-2 font-headline text-sm uppercase border-2 border-black bg-white focus:outline-none cursor-pointer"
                    >
                      {ROLE_OPTIONS.map((r, i) => (
                        <option key={i} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Avatar Picker */}
                <div>
                  <label className="block font-headline text-sm uppercase text-spidey-black mb-1">
                    Select Your Superhero Badge / Avatar
                  </label>
                  <div className="flex flex-wrap gap-2 p-2 bg-spidey-paper border-2 border-black">
                    {AVATAR_OPTIONS.map((av, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          soundFx.playPop();
                          setSignupAvatar(av);
                        }}
                        className={`text-2xl p-1.5 border-2 transition-all ${
                          signupAvatar === av
                            ? 'bg-spidey-yellow border-black shadow-comic-sm scale-110'
                            : 'bg-white border-transparent hover:border-black'
                        }`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-sans font-bold pt-1">
                  <span className="text-gray-600">Already registered?</span>
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playPop();
                      setActiveTab('login');
                    }}
                    className="text-spidey-red hover:underline font-headline text-sm uppercase"
                  >
                    Switch to Log In →
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-spidey-red hover:bg-spidey-darkRed text-white font-headline text-lg border-3 border-black shadow-comic comic-button flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>{isSubmitting ? 'CREATING PRESS BADGE...' : 'ISSUE NEW PRESS BADGE (SIGN UP)'}</span>
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="relative flex items-center justify-center my-2">
              <div className="border-t-2 border-black w-full" />
              <span className="bg-spidey-paper px-3 font-headline text-xs text-gray-700 uppercase">
                OR
              </span>
              <div className="border-t-2 border-black w-full" />
            </div>

            {/* 1-Click Guest Option */}
            <div className="bg-spidey-yellow/40 p-3.5 border-2 border-black flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <p className="font-headline text-sm uppercase text-spidey-black leading-tight flex items-center gap-1.5">
                  <span>🕵️</span>
                  <span>ENTER AS ANONYMOUS GUEST (READ & COMMENT)</span>
                </p>
                <p className="font-comic text-xs text-gray-700 mt-0.5">
                  Browse, clap, and drop speech bubble comments. <em>(Note: Guests cannot publish new articles)</em>.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGuestEntry}
                disabled={isSubmitting}
                className="px-4 py-2 bg-spidey-blue hover:bg-spidey-darkBlue text-white font-headline text-sm border-2 border-black shadow-comic-sm comic-button whitespace-nowrap"
              >
                <span>CONTINUE AS GUEST</span>
                <ArrowRight className="w-4 h-4 inline-block ml-1" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
