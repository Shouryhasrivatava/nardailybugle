import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { api } from './services/api';
import { soundFx } from './utils/audio';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ComicFilterBar } from './components/ComicFilterBar';
import { PostList } from './components/PostList';
import { PostDetailModal } from './components/PostDetailModal';
import { PostFormModal } from './components/PostFormModal';
import { DeleteModal } from './components/DeleteModal';
import { SpiderSenseAlert } from './components/SpiderSenseAlert';
import { FloatingActionParticle } from './components/ActionBubble';
import { SpideyFourthWallModal } from './components/SpideyFourthWallModal';
import { GuestRestrictedModal } from './components/GuestRestrictedModal';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSort, setActiveSort] = useState('latest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // User Auth & Identity State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('spidey_cms_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isGuestRestrictedOpen, setIsGuestRestrictedOpen] = useState(false);
  const [presets, setPresets] = useState([]);

  // Modals state
  const [selectedPost, setSelectedPost] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingPost, setDeletingPost] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Alerts & Particles
  const [alert, setAlert] = useState(null);
  const [particles, setParticles] = useState([]);

  // Fetch posts from backend REST API
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getPosts({
        q: searchQuery,
        category: activeCategory,
        sort: activeSort
      });
      setPosts(data || []);
    } catch (err) {
      console.error('Failed to load posts:', err);
      showAlert('error', 'CONNECTION FAILED', 'Could not reach the Daily Bugle backend server.', [err.message]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, activeCategory, activeSort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPosts();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchPosts]);

  // Load presets on mount
  useEffect(() => {
    api.getPresets().then(setPresets).catch(() => {});
  }, []);

  // Show Spider-Sense Alert Toast
  const showAlert = (type, title, message, errors = []) => {
    setAlert({ type, title, message, errors });
    if (type === 'error') {
      soundFx.playSpiderSense();
    }
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };

  // Spawn floating action particle
  const spawnParticle = (x, y, text = 'THWIP!') => {
    const newParticle = {
      id: `${Date.now()}-${Math.random()}`,
      x,
      y,
      text
    };
    setParticles((prev) => [...prev, newParticle]);
  };

  const removeParticle = (id) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  };

  // Trigger Comic Confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E23636', '#FDB813', '#0B4F6C', '#111111', '#FFFFFF']
    });
  };

  // Auth: Handle Login
  const handleLogin = async (credentials) => {
    const res = await api.login(credentials);
    setCurrentUser(res.user);
    localStorage.setItem('spidey_cms_user', JSON.stringify(res.user));
    showAlert('success', 'IDENTITY VERIFIED!', `Welcome to the press room, ${res.user.name}!`);
  };

  // Auth: Handle Sign Up
  const handleSignup = async (userData) => {
    const res = await api.signup(userData);
    setCurrentUser(res.user);
    localStorage.setItem('spidey_cms_user', JSON.stringify(res.user));
    triggerConfetti();
    showAlert('success', 'PRESS BADGE ISSUED!', `Welcome to the Daily Bugle, ${res.user.name}!`);
  };

  // Auth: Handle Guest Login
  const handleGuestLogin = async () => {
    const res = await api.guestLogin();
    setCurrentUser(res.user);
    localStorage.setItem('spidey_cms_user', JSON.stringify(res.user));
    showAlert('success', 'GUEST PASS ISSUED!', `Browsing the Daily Bugle as ${res.user.name}!`);
  };

  // Auth: Logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('spidey_cms_user');
    showAlert('info', 'SIGNED OUT', 'You have exited your Daily Bugle session.');
  };

  // Check Permissions before opening Create Post Modal
  const handleOpenCreateModal = () => {
    if (!currentUser) {
      soundFx.playFreezeFrame();
      showAlert('error', 'LOGIN REQUIRED!', 'You must log in with your Daily Bugle credentials before you can post an article.');
      setIsLoginModalOpen(true);
      return;
    }

    if (currentUser.isGuest) {
      soundFx.playSpiderSense();
      setIsGuestRestrictedOpen(true);
      return;
    }

    soundFx.playThwip();
    setEditingPost(null);
    setIsFormOpen(true);
  };

  // Create or Update Post
  const handleSavePost = async (postData) => {
    try {
      if (editingPost) {
        // PUT update
        const updated = await api.updatePost(editingPost.id, postData);
        setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        if (selectedPost && selectedPost.id === updated.id) {
          setSelectedPost(updated);
        }
        showAlert('success', 'ISSUE UPDATED!', `"${updated.title}" successfully updated on the wire.`);
      } else {
        // POST create
        const created = await api.createPost(postData);
        setPosts((prev) => [created, ...prev]);
        triggerConfetti();
        soundFx.playFanfare();
        showAlert('success', 'EXCELSIOR! NEW ISSUE PUBLISHED!', `"${created.title}" is now on newsstands everywhere!`);
      }
      setIsFormOpen(false);
      setEditingPost(null);
    } catch (err) {
      console.error('Error saving post:', err);
      showAlert('error', 'PRINTING ERROR!', err.message, err.errors);
      throw err;
    }
  };

  // Delete Post
  const handleDeletePostClick = (post) => {
    if (!currentUser || currentUser.isGuest) {
      soundFx.playSpiderSense();
      showAlert('error', 'PERMISSION DENIED', 'Only authorized staff can delete articles.');
      setIsLoginModalOpen(true);
      return;
    }
    setDeletingPost(post);
    setIsDeleteOpen(true);
  };

  // Confirm Delete Post
  const handleConfirmDelete = async (id) => {
    try {
      setIsDeleting(true);
      await api.deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      if (selectedPost && selectedPost.id === id) {
        setSelectedPost(null);
      }
      setIsDeleteOpen(false);
      setDeletingPost(null);
      showAlert('success', 'ISSUE VAPORIZED!', 'The comic story was removed from circulation.');
    } catch (err) {
      console.error('Error deleting post:', err);
      showAlert('error', 'DELETE ERROR', err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Like Post (Hero Clap)
  const handleLikePost = async (id) => {
    // Optimistic UI update
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: (p.likes || 0) + 1 } : p))
    );
    if (selectedPost && selectedPost.id === id) {
      setSelectedPost((prev) => ({ ...prev, likes: (prev.likes || 0) + 1 }));
    }

    try {
      await api.likePost(id);
    } catch (err) {
      console.error('Error recording clap:', err);
    }
  };

  // Add Comment (Speech Bubble)
  const handleAddComment = async (postId, commentData) => {
    if (!currentUser) {
      soundFx.playFreezeFrame();
      showAlert('error', 'LOGIN REQUIRED!', 'Please log in or enter as guest to post comments.');
      setIsLoginModalOpen(true);
      return;
    }

    try {
      const payload = {
        ...commentData,
        author: currentUser.name,
        avatar: currentUser.avatar || (currentUser.isGuest ? '🕵️' : '🕸️')
      };
      const newComment = await api.addComment(postId, payload);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, comments: [...(p.comments || []), newComment] }
            : p
        )
      );
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost((prev) => ({
          ...prev,
          comments: [...(prev.comments || []), newComment]
        }));
      }
      showAlert('success', 'SPEECH BUBBLE SHOUTED!', 'Your reaction bubble has been added to the comic strip.');
    } catch (err) {
      console.error('Error adding comment:', err);
      showAlert('error', 'SPEECH ERROR', err.message);
      throw err;
    }
  };

  // Reset to default seed lore
  const handleResetData = async () => {
    try {
      setIsResetting(true);
      const restoredData = await api.resetSeedData();
      setPosts(restoredData || []);
      showAlert('success', 'MULTIVERSE RESTORED!', 'Default Spider-Man & Marvel lore chronicles restored.');
    } catch (err) {
      console.error('Error resetting lore:', err);
      showAlert('error', 'RESET ERROR', err.message);
    } finally {
      setIsResetting(false);
    }
  };

  // Featured Post for Hero Banner
  const featuredPost = posts.length > 0 ? posts[0] : null;

  return (
    <div className="min-h-screen bg-halftone flex flex-col justify-between selection:bg-spidey-yellow selection:text-spidey-black">
      {/* Spider-Sense Visual Notification Banner */}
      <SpiderSenseAlert alert={alert} onClose={() => setAlert(null)} />

      {/* Floating Action Particles */}
      {particles.map((p) => (
        <FloatingActionParticle
          key={p.id}
          x={p.x}
          y={p.y}
          text={p.text}
          onComplete={() => removeParticle(p.id)}
        />
      ))}

      {/* Daily Bugle Masthead Navbar */}
      <Navbar
        postCount={posts.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCreateModal={handleOpenCreateModal}
        onResetData={handleResetData}
        isResetting={isResetting}
        currentUser={currentUser}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Newspaper Feed Container */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full">
        {/* Featured Hot Scoop Banner (only on 'All' category and without active search) */}
        {activeCategory === 'All' && !searchQuery && featuredPost && (
          <HeroBanner
            featuredPost={featuredPost}
            onSelectPost={(post) => setSelectedPost(post)}
          />
        )}

        {/* Comic Category Tabs & View Switcher */}
        <ComicFilterBar
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          activeSort={activeSort}
          onSelectSort={setActiveSort}
          viewMode={viewMode}
          onToggleViewMode={setViewMode}
          totalPosts={posts.length}
        />

        {/* Comic Issue Feed Grid / List */}
        <PostList
          posts={posts}
          loading={loading}
          viewMode={viewMode}
          currentUser={currentUser}
          onSelectPost={(post) => setSelectedPost(post)}
          onEditPost={(post) => {
            if (!currentUser || currentUser.isGuest) {
              soundFx.playSpiderSense();
              showAlert('error', 'STAFF ONLY', 'Only registered staff can edit articles.');
              setIsLoginModalOpen(true);
              return;
            }
            setEditingPost(post);
            setIsFormOpen(true);
          }}
          onDeletePost={handleDeletePostClick}
          onLikePost={handleLikePost}
          onSpawnParticle={spawnParticle}
          onOpenCreateModal={handleOpenCreateModal}
        />
      </main>

      {/* Modals */}
      {/* 1. Full Comic Reader Detail Modal */}
      <PostDetailModal
        post={selectedPost}
        isOpen={!!selectedPost}
        currentUser={currentUser}
        onClose={() => setSelectedPost(null)}
        onEdit={(post) => {
          if (!currentUser || currentUser.isGuest) {
            soundFx.playSpiderSense();
            showAlert('error', 'STAFF ONLY', 'Only registered staff can edit articles.');
            setIsLoginModalOpen(true);
            return;
          }
          setEditingPost(post);
          setIsFormOpen(true);
        }}
        onDelete={handleDeletePostClick}
        onLike={handleLikePost}
        onAddComment={handleAddComment}
        onSpawnParticle={spawnParticle}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* 2. Create / Edit Story Modal */}
      <PostFormModal
        isOpen={isFormOpen}
        initialData={editingPost}
        currentUser={currentUser}
        onClose={() => {
          setIsFormOpen(false);
          setEditingPost(null);
        }}
        onSubmit={handleSavePost}
        onTriggerSpiderSense={(alertData) =>
          showAlert(alertData.type, alertData.title, alertData.message, alertData.errors)
        }
      />

      {/* 3. Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteOpen}
        post={deletingPost}
        isDeleting={isDeleting}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingPost(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* 4. Login Gateway Modal with Sign Up */}
      <SpideyFourthWallModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLogin}
        onSignupSuccess={handleSignup}
        onGuestLogin={handleGuestLogin}
        presets={presets}
      />

      {/* 5. Special Guest Restricted Modal */}
      <GuestRestrictedModal
        isOpen={isGuestRestrictedOpen}
        onClose={() => setIsGuestRestrictedOpen(false)}
        onSwitchToLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Comic Footer */}
      <footer className="mt-16 bg-spidey-black text-white border-t-5 border-spidey-black">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <span className="text-2xl">🕸️</span>
              <span className="font-headline text-2xl text-spidey-yellow tracking-wider uppercase">
                THE DAILY BUGLE • SPIDER-MAN CMS
              </span>
            </div>
            <p className="font-comic text-xs text-gray-400 max-w-md">
              A full-stack Blog & Content Management System built with React, Node/Express, and Motion. Styled with vintage Ben-Day halftone dots and Marvel Spider-Man aesthetic.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="bg-spidey-red px-3 py-1 font-headline text-sm border-2 border-white shadow-comic-sm">
              EXCELSIOR! ★ STAN LEE TRIBUTE
            </div>
            <p className="font-sans text-xs text-gray-500 font-bold">
              DBUG LABS RECRUITMENTS 2026 • TASK 3
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
