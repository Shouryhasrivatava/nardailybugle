# THE DAILY BUGLE — Spider-Man Comic Blog / CMS Mini App
### Task 3 — Blog/Content Management System (Medium–Hard)

A full-stack, comic-inspired Content Management System (CMS) and Superhero News Chronicle built with a **React** front-end, a **Node.js/Express** REST API back-end, persistent **JSON file storage**, and interactive **Framer Motion** animations.

---

##  Task Objective & Requirements Met

| Requirement | Implementation Details |
| :--- | :--- |
| **1. React Front-End** | Built with Vite, React 18, Tailwind CSS, Framer Motion, and Web Audio API synthesizer. |
| **2. Node/Express Backend** | Modular REST API with structured MVC architecture (`controllers/`, `routes/`, `data/`). |
| **3. CRUD Operations** | Full support to **Create**, **Read**, **Update**, **Delete**, **Like (Clap)**, and **Comment** on posts. |
| **4. Persistent Storage** | Data persists in `server/data/posts.json` and `server/data/users.json` with safe read/write helpers. |
| **5. Form Validation** | Real-time and submission validation (title >= 3 chars, content >= 10 chars, author) with animated **Spider-Sense** electric warnings. |
| **6. List & Detail Views** | Toggleable **Comic Grid View** with 3D tilt cards & **Newspaper List View**, plus full **Markdown Reader Detail Modal**. |
| **7. Marvel/Spider-Man Aesthetic** | Authentic Daily Bugle vintage masthead, Ben-Day halftone dot matrix, speech bubble comments, action sound badges (*THWIP!*, *POW!*, *KRASH!*). |
| **8. Authentication & Role Gating** | 1-Click Marvel staff logins (Peter Parker, J. Jonah Jameson, Gwen Stacy, Miles Morales), custom Sign Up / Login, and **Anonymous Guest entry** with publishing restrictions. |
| **9. Image Upload & Preset Library** | 3-way cover selector: Upload local images from device (base64 persistence), 18+ Pinterest comic presets, or direct URLs. |

---

##  Architecture & Project Structure

```
dbugs/
├── client/                         # React Front-End (Vite)
│   ├── public/                     # Static assets
│   ├── src/
│   │   ├── components/             # Reusable Comic UI Components
│   │   │   ├── ActionBubble.jsx    # Comic action stickers & floating particles
│   │   │   ├── ComicFilterBar.jsx  # Category tabs & grid/list layout switcher
│   │   │   ├── DeleteModal.jsx     # Delete confirmation modal
│   │   │   ├── GuestRestrictedModal.jsx # Special guest access alert modal
│   │   │   ├── HeroBanner.jsx      # Top front-page featured scoop
│   │   │   ├── Navbar.jsx          # Vintage Daily Bugle masthead, ticker, search, auth
│   │   │   ├── PostCard.jsx        # Comic panel cards with tilt and sound effects
│   │   │   ├── PostDetailModal.jsx # Full comic article reader & speech bubble comments
│   │   │   ├── PostFormModal.jsx   # Article authoring/editing modal with image upload toggle
│   │   │   ├── PostList.jsx        # Responsive grid/list issue container
│   │   │   ├── SpiderSenseAlert.jsx# Electric vibration alert notifications
│   │   │   └── SpideyFourthWallModal.jsx # 4th-wall login & sign-up security gateway
│   │   ├── services/
│   │   │   └── api.js              # Centralized REST client for posts & auth
│   │   ├── utils/
│   │   │   └── audio.js            # Web Audio API sound synthesizer (THWIP, POW, FANFARE)
│   │   ├── App.jsx                 # Main application state & orchestration
│   │   ├── index.css               # Ben-Day halftone dot patterns & comic styling
│   │   └── main.jsx                # React entry point
│   ├── package.json
│   ├── tailwind.config.js          # Spidey color palette & comic fonts configuration
│   └── vite.config.js              # Vite server & API proxy
│
├── server/                         # Node.js / Express Backend
│   ├── controllers/
│   │   ├── authController.js       # Login, Sign Up, Guest session, and Presets controller
│   │   └── postController.js       # CRUD, like, comment, search, and reset controller
│   ├── data/
│   │   ├── posts.json              # Persistent JSON store for blog articles & comments
│   │   ├── seed.js                 # Default Marvel universe seed chronicles
│   │   └── users.json              # Registered user identities & credentials
│   ├── routes/
│   │   ├── auth.js                 # Authentication router (`/api/auth`)
│   │   └── posts.js                # Blog / CMS REST router (`/api/posts`)
│   ├── package.json
│   └── server.js                   # Express server entry point
│
├── package.json                    # Monorepo concurrency script
└── README.md                       # Comprehensive documentation
```

---

##  REST API Documentation

### Blog Posts (`/api/posts`)

| Method | Endpoint | Description | Request Body / Query Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/posts` | List posts with search, filter, and sort | `?q=query&category=Scoop&sort=latest` |
| `GET` | `/api/posts/:id` | Fetch single article with comments | `id` in URL parameter |
| `POST` | `/api/posts` | Create a new blog story | `{ title, content, excerpt, author, authorRole, category, tags, coverImage, soundEffect }` |
| `PUT` | `/api/posts/:id` | Update an existing story | `{ title, content, excerpt, category, tags, coverImage, soundEffect }` |
| `DELETE` | `/api/posts/:id` | Delete a story | `id` in URL parameter |
| `POST` | `/api/posts/:id/like` | Give hero clap / upvote | Increments like count |
| `POST` | `/api/posts/:id/comments` | Add speech bubble reaction | `{ author, avatar, text }` |
| `POST` | `/api/posts/admin/reset` | Restore default Marvel lore | Restores initial seed articles |

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Log in with username and password | `{ username, password }` |
| `POST` | `/api/auth/signup` | Register new staff credentials | `{ name, username, password, role, avatar }` |
| `POST` | `/api/auth/guest` | Instant anonymous guest pass | None |
| `GET` | `/api/auth/presets` | Get Marvel staff preset profiles | None |

---

##  Role-Based Access Control (RBAC)

1. **Unauthenticated Users**:
   - Can browse articles, read full stories, and search.
   - Clicking "NEW STORY" or attempting to comment triggers the **Login Gateway**.
2. **Anonymous Guests (`isGuest: true`)**:
   - Can browse, read, give hero claps, and drop speech bubble comments (with their assigned guest identity `Anonymous Vigilante #...`).
   - Attempting to author a story displays the **Guest Restriction Modal**, prompting the user to sign in with staff credentials.
3. **Verified Staff / Registered Heroes**:
   - Full permissions to **Create**, **Edit**, **Delete**, **Clap**, and **Comment** with their verified alias and custom badge.

---

##  Getting Started Locally

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/Shouryhasrivatava/nardailybugle.git
cd nardailybugle

# Install root, client, and server dependencies
npm run install:all
```

### 2. Running in Development Mode
Start both the Express backend API and the Vite frontend with one command:
```bash
npm run dev
```

- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api/posts](http://localhost:5000/api/posts)
- **API Health**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 3. Production Build
```bash
npm run build
```

---

##  Marvel Universe Pre-Seeded Identities

| Name | Role | Username | Password | Avatar |
| :--- | :--- | :--- | :--- | :---: |
| **Peter Parker** | Senior Photographer & Webhead | `peter` | `webhead` | 🕷️ |
| **J. Jonah Jameson** | Publisher & Editor-in-Chief | `jameson` | `spiderman` | 📰 |
| **Gwen Stacy** | Earth-65 Ghost-Spider & Drummer | `gwen` | `ghostspider` | 🥁 |
| **Miles Morales** | Brooklyn Spider-Man & Artist | `miles` | `brooklyn` | ⚡ |

*(Users can also create their own custom credentials via the **Sign Up** tab with custom superhero avatars!)*

---

## 📜 License
Developed for **DBUG LABS Technical Recruitments 2026** under the **MIT License**.
*Spider-Man and related characters are trademarks of Marvel Entertainment, LLC.*
