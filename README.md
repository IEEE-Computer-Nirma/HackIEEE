<p align="center">
  <img src="public/HackIEEE-Typography.png" alt="HackIEEE Logo" width="120" />
</p>

<h1 align="center">HackIEEE</h1>

<p align="center">
  <strong>The Dune-themed hackathon by IEEE Computer Society, Nirma University</strong>
</p>

<p align="center">
  <a href="https://github.com/IEEE-Computer-Nirma/HackIEEE">
    <img src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs" alt="Next.js" />
  </a>
  <a href="https://github.com/IEEE-Computer-Nirma/HackIEEE">
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React" />
  </a>
  <a href="https://github.com/IEEE-Computer-Nirma/HackIEEE">
    <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss" alt="Tailwind CSS" />
  </a>
  <a href="https://github.com/IEEE-Computer-Nirma/HackIEEE">
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript" />
  </a>
</p>

---

## 🏜️ About

**HackIEEE** is the flagship hackathon jointly organised by three **IEEE Student Chapters at Nirma University**:

- **IEEE Computer Society (CS)**
- **IEEE Intelligent Transportation Systems Society (ITSS)**
- **IEEE Signal Processing Society (SPS)**

This repository contains the landing page — a fully immersive, Dune-inspired web experience built to capture the spirit of the event: innovation under pressure, collaboration across the sands, and the will to build something extraordinary.

The site features cinematic hero sections, a 3D title reveal, GSAP-powered animations, ambient soundscapes and light/dark Dune-themed palettes.

---

## ✨ Features

- 🎬 **Cinematic Hero** — Full-screen Dune-themed hero with particle effects and parallax
- 🎨 **Dual Theme** — Light (desert) and dark (night) Arrakis-inspired palettes
- 🔊 **Ambient Sound** — Toggle-able soundscapes using Howler.js
- ⏳ **Interactive Timeline** — GSAP-animated event timeline
- 📱 **Fully Responsive** — Mobile-first design with smooth page transitions
- 📊 **Analytics** — Vercel Analytics and Speed Insights baked in

---

## 🛠️ Tech Stack

| Layer         | Technology                                              |
| ------------- | ------------------------------------------------------- |
| Framework     | [Next.js 16](https://nextjs.org) (App Router, Turbopack)|
| Language      | TypeScript 5                                            |
| Styling       | Tailwind CSS 4                                          |
| Animations    | GSAP 3 + `@gsap/react`                                 |
| 3D / WebGL    | three.js                                                |
| Audio         | Howler.js                                               |
| Icons         | Lucide React                                            |
| Analytics     | Vercel Analytics · Vercel Speed Insights                |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm**, **yarn**, **pnpm**, or **bun**

### Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/IEEE-Computer-Nirma/HackIEEE.git
cd HackIEEE

# 2. Install dependencies
npm install

# 3. Create your local environment file
cp .env.local.example .env.local

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site locally.

---

## ⚙️ Environment Variables & Feature Flags

All configurable keys and flags are defined in `.env.local.example`. To customize behavior locally or in production, configure the following:

### 1. Core Services

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase Project URL for user authentication and team registration tables |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase Anonymous public API key |
| `RESEND_API_KEY` | Yes | Resend API key for automated registration confirmation emails |

### 2. Feature Flags

Feature flags control site functionality dynamically without requiring code changes. They can be set locally via `.env.local` or on Vercel via **Environment Variables** and **Vercel Flags Toolbar**.

| Flag / Environment Variable | Default | Description |
|---|---|---|
| `IS_REGISTRATION_ACTIVE` | `false` | Master toggle for HackIEEE registrations. See below for detailed states. |
| `SHOW_KIRO_COLLABORATION` | `false` | Toggles the Kiro collaboration badge in the Hero section. |

#### Registration Flag States (`IS_REGISTRATION_ACTIVE`)

- **`false` (Pre-launch / Closed)**:
  - **Navbar**: Displays the **Contact Us** button.
  - **Hero**: Shows the **Tracks & Challenges** and **Timeline** action buttons.
  - **Direct routes (`/register`, `/login`)**: Automatically redirect users back to the home page (`/`).
  - **Backend API (`POST /api/register`)**: Protects the database and returns `403 Forbidden`.
- **`true` (Live / Active)**:
  - **Navbar**: Displays **Register** and **Login** buttons.
  - **Hero**: Shows the **Register for HackIEEE** call-to-action button.
  - **Direct routes (`/register`, `/login`)**: Unlocked and accessible for multi-step registration and user login.
  - **Backend API (`POST /api/register`)**: Fully active, validating submissions and sending email confirmations.

---

## ☁️ Configuring Flags in Vercel

When deploying to Vercel, teammates can toggle the registration system in seconds without touching code:

### Method A: Environment Variables (Recommended)
1. Navigate to your project on the [Vercel Dashboard](https://vercel.com).
2. Go to **Settings** → **Environment Variables**.
3. Add or edit:
   - **Key**: `IS_REGISTRATION_ACTIVE`
   - **Value**: `true` (to launch registration) or `false` (to close registration)
   - **Target Environments**: Select **Production**, **Preview**, and **Development**.
4. Redeploy or promote your deployment to apply changes instantly.

### Method B: Vercel Flags Toolbar (Optional)
The project is integrated with `@flags-sdk/vercel` in `app/flags.ts`.
- Teammates with Vercel Toolbar access can explore, override, and test flags live on Preview deployments using the toolbar's flag toggle.
- Set `FLAGS_SECRET` in `.env.local` to securely enable flag exploration locally.


---

## 📁 Project Structure

```
hackieee/
├── app/
│   ├── components/      # All UI components (Hero, Navbar, Tracks, etc.)
│   ├── data/            # Static data and content
│   ├── fonts/           # Custom typefaces
│   ├── globals.css      # Design tokens and global styles
│   ├── layout.tsx       # Root layout with metadata and providers
│   └── page.tsx         # Home page composition
├── public/              # Static assets (images, audio, SVGs)
├── docs/                # Project documentation
└── next.config.ts       # Next.js configuration
```

---

## 📝 Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/). Every commit message should use this format:

```
<type>(optional scope): short description
```

| Type         | Purpose                        | Example                                      |
| ------------ | ------------------------------ | -------------------------------------------- |
| `feat:`      | New feature                    | `feat(hero): add spice-drift particle layer` |
| `fix:`       | Bug fix                        | `fix(navbar): close menu on route change`    |
| `docs:`      | Documentation                  | `docs(readme): add setup instructions`       |
| `style:`     | Code style / visual changes    | `style(tracks): swap palette to arrakis`     |
| `refactor:`  | Code restructuring             | `refactor(form): extract validation logic`   |
| `test:`      | Tests                          | `test(api): add sponsor endpoint tests`      |
| `chore:`     | Build, config, or dependency   | `chore(deps): bump next to 16.3.4`          |

> **Rules:** imperative mood · lowercase subject · no trailing period · keep it small and honest.

---

## 🤝 Contributing

We'd love your contributions! Please read our full **[CONTRIBUTING.md](CONTRIBUTING.md)** before getting started.

**The TL;DR:**

1. **Branch** off `main` — never commit directly to it.
2. **Name your branch** with a prefix: `feat/`, `fix/`, `style/`, `chore/`, `docs/`
3. **Commit** using the convention above.
4. **Push your branch** and open a **Pull Request**.
5. **Get a review** — at least one approval required.
6. **Squash and merge** — then delete the branch.

> ⚠️ **Force-pushing is banned.** No `--force`, no `-f`, no exceptions. Use `git revert` to undo mistakes.

---

## 🧑‍💻 Useful Commands

```bash
npm run dev       # Start dev server (Turbopack)
npm run build     # Production build
npm run start     # Serve production build
npm run lint      # Run ESLint
```

---

## 📄 License

This project is maintained by **IEEE CS**, **IEEE ITSS**, and **IEEE SPS** — student chapters at [Nirma University](https://github.com/IEEE-Computer-Nirma).

---

<p align="center">
  <em>"The mystery of life isn't a problem to solve, but a reality to experience."</em><br />
  — Frank Herbert, <strong>Dune</strong>
</p>
