import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, PlusCircle, RotateCcw, Search, Sparkles, User, LogIn, LogOut, Volume2, VolumeX } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const Navbar = ({
  postCount,
  searchQuery,
  onSearchChange,
  onOpenCreateModal,
  onResetData,
  isResetting,
  currentUser,
  onOpenLoginModal,
  onLogout
}) => {
  const [soundOn, setSoundOn] = useState(true);

  const toggleSfx = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    soundFx.toggleSound(nextState);
    if (nextState) {
      soundFx.playThwip();
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="sticky top-0 z-30 bg-spidey-paper border-b-4 border-spidey-black shadow-comic">
      {/* Top Vintage Newspaper Header Bar */}
      <div className="bg-spidey-black text-white px-4 py-1 flex flex-wrap items-center justify-between text-xs font-sans font-bold tracking-wider">
        <div className="flex items-center gap-3">
          <span className="bg-spidey-red text-white px-2 py-0.5 uppercase tracking-widest text-[11px] font-black animate-pulse">
            MORNING FINAL
          </span>
          <span className="hidden sm:inline text-gray-300">
            VOL. 61 • ISSUE #{postCount || 5} • {currentDate} • 50¢
          </span>
        </div>

        {/* Vintage Ticker from Reference Images */}
        <div className="hidden lg:flex items-center gap-4 text-spidey-yellow text-[11px] font-headline tracking-wide">
          <span>★ WHO IS SPIDER-MAN? (PAGE 2)</span>
          <span>•</span>
          <span>YANKEES WIN IN 14TH</span>
          <span>•</span>
          <span>BANK ROBBERIES ON THE RISE</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Integrated Sound Toggle in Header */}
          <button
            onClick={toggleSfx}
            className={`flex items-center gap-1 px-2 py-0.5 text-[11px] font-headline border border-black uppercase transition-colors ${
              soundOn ? 'bg-spidey-yellow text-spidey-black' : 'bg-gray-700 text-gray-300'
            }`}
            title="Toggle Sound Effects"
          >
            {soundOn ? <Volume2 className="w-3 h-3 text-spidey-red" /> : <VolumeX className="w-3 h-3 text-gray-400" />}
            <span>{soundOn ? 'SFX: ON' : 'SFX: OFF'}</span>
          </button>

          <button
            onClick={() => {
              soundFx.playPop();
              onResetData();
            }}
            disabled={isResetting}
            className="text-gray-300 hover:text-spidey-yellow flex items-center gap-1 text-[11px] uppercase transition-colors"
            title="Reset to default Marvel seed stories"
          >
            <RotateCcw className={`w-3 h-3 ${isResetting ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isResetting ? 'Resetting...' : 'Restore Seed Lore'}</span>
          </button>
        </div>
      </div>

      {/* Main Daily Bugle Masthead */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo and Vintage Tagline */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => soundFx.playThwip()}
        >
          <div className="w-12 h-12 bg-spidey-red border-3 border-spidey-black flex items-center justify-center shadow-comic-sm transform -rotate-3 hover:rotate-0 transition-transform">
            <span className="text-3xl">🕷️</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl text-spidey-black tracking-tight leading-none uppercase drop-shadow-[2px_2px_0px_#FFF]">
                THE DAILY <span className="text-spidey-red bg-spidey-yellow px-1 border-2 border-black">BUGLE</span>
              </h1>
            </div>
            <p className="font-marker text-xs text-spidey-blue tracking-wide -mt-0.5">
              "Spider-Man: Hero or Menace? New York's Favorite Newspaper Since 1932!"
            </p>
          </div>
        </div>

        {/* Action Controls, Search, & Identity Bar */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Quick Search */}
          <div className="relative flex-1 sm:w-56 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-spidey-black pointer-events-none" />
            <input
              type="text"
              placeholder="Search scoops & lore..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white font-comic text-sm border-3 border-spidey-black rounded-none shadow-comic-sm focus:outline-none focus:bg-yellow-50 placeholder:text-gray-500"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold bg-gray-200 px-1 py-0.5 border border-black hover:bg-spidey-red hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* User Auth Profile Badge or Login Button */}
          {currentUser ? (
            <div className="flex items-center gap-2 bg-white px-2.5 py-1 border-3 border-black shadow-comic-sm">
              <span className="text-xl">{currentUser.avatar || '🕷️'}</span>
              <div className="text-left leading-none">
                <p className="font-headline text-xs uppercase text-spidey-black truncate max-w-[110px]">
                  {currentUser.name}
                </p>
                <span className="text-[9px] font-sans font-black text-spidey-red">
                  {currentUser.badge || (currentUser.isGuest ? 'GUEST' : 'STAFF')}
                </span>
              </div>
              <button
                onClick={() => {
                  soundFx.playPop();
                  onLogout();
                }}
                className="p-1 hover:bg-red-100 text-gray-600 hover:text-spidey-red ml-1"
                title="Switch Hero Identity / Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                soundFx.playFreezeFrame();
                onOpenLoginModal();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-spidey-yellow hover:bg-spidey-darkYellow text-spidey-black font-headline text-sm border-3 border-black shadow-comic-sm comic-button select-none"
            >
              <LogIn className="w-4 h-4" />
              <span>LOGIN</span>
            </motion.button>
          )}

          {/* Write New Story Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              soundFx.playThwip();
              onOpenCreateModal();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-spidey-red hover:bg-spidey-darkRed text-white font-headline tracking-wider text-base md:text-lg border-3 border-spidey-black shadow-comic comic-button select-none"
          >
            <PlusCircle className="w-5 h-5 stroke-[2.5]" />
            <span>NEW STORY</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
};
