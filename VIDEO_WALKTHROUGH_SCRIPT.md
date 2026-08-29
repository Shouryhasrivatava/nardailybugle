# 🎬 2-Minute Video Walkthrough Script
## Task 3 — Blog / Content Management System (The Daily Bugle Comic CMS)

**Target Duration:** ~90–120 Seconds  
**Resolution:** 1080p Fullscreen Screen Recording with Clear Voiceover

---

### [0:00 - 0:15] 📰 Introduction & Architecture
- **Screen:** Open `http://localhost:5173` showcasing the vintage Daily Bugle masthead, halftone dot styling, and the morning edition ticker.
- **Voiceover:**
  > *"Hi everyone! This is my submission for Task 3: The Blog/Content Management System Mini App. I built 'The Daily Bugle' — a full-stack superhero news CMS with a React front-end, a Node.js/Express REST API backend, persistent JSON storage, and Marvel-inspired motion animations."*

---

### [0:15 - 0:35] 📑 Browsing, Filtering & Full Story Detail View
- **Screen:** Click category pills (`Scoop`, `Hero Log`, `Villain Alert`, `Tech & Gear`), search for "Doc Ock" in the search bar, toggle between **Comic Grid View** and **Newspaper List View**, then click on a card to open the Detail Reader.
- **Voiceover:**
  > *"Users can filter stories by category, search headlines and tags in real time, and switch between a 3D tilt comic grid and a classic newspaper list. Clicking any issue opens our full Markdown reader with tags, author bio, and interactive speech bubble comments."*

---

### [0:35 - 0:55] ✍️ Form Validation, Cover Picker & Publishing (CRUD)
- **Screen:** Click **"NEW STORY"**. Intentionally leave the title blank and click publish to show the animated **Spider-Sense alert**. Then fill in a headline, pick a category, choose an image using the **Image Upload Toggle** (Presets / File Upload / URL), and click **"PUBLISH TO PRESS!"** to see the confetti and sound fanfare.
- **Voiceover:**
  > *"For creating and editing stories, we have robust real-time validation with an animated Spider-Sense lightning warning if required fields are missing. Authors can choose from 18+ comic cover presets, paste a direct URL, or upload local image files directly from their device. Once published, the story appears on the feed with instant persistence on the Express backend."*

---

### [0:55 - 1:15] 🔐 Authentication, 4th-Wall Security Gateway & Role Gating
- **Screen:** Click **"LOGIN"** in the top masthead. Show the Ultimate Spider-Man 4th-wall break, 1-click Marvel presets (Peter Parker, J. Jonah Jameson, Gwen Stacy, Miles Morales), and the **Sign Up (New Press ID)** tab with avatar picker.
- **Voiceover:**
  > *"We built an authentic 4th-wall breaking login inspired by the Ultimate Spider-Man animated series. Users can choose 1-click verified Marvel identities, register a brand new press badge with custom superhero avatars, or enter as an Anonymous Guest."*

---

### [1:15 - 1:35] 🛡️ Guest Restrictions & Speech Bubble Comments
- **Screen:** Switch to **Anonymous Guest**. Show that guests can give hero claps and add speech bubble comments (with auto-assigned vigilante names). Then click **"NEW STORY"** as a guest to trigger the **Guest Restriction Modal**.
- **Voiceover:**
  > *"Role-based permissions protect the press room: Anonymous guests can read articles, give hero claps, and drop speech bubble comments. However, if a guest attempts to author an article, our security gateway blocks the action and prompts them to sign in with staff credentials."*

---

### [1:35 - 1:50] ⚡ Edit, Delete & Conclusion
- **Screen:** Log in as Peter Parker or Jameson. Click **Edit** on a post, make a quick change, and show the **Delete Modal** vaporizing a story with sound effects.
- **Voiceover:**
  > *"Staff members have full editing and deletion powers. The entire app is modular, fully validated, and backed by a clean REST API. Thank you, and Excelsior!"*
