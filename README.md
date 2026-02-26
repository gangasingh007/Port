<div align="center">

# 🍎 macOS Desktop Portfolio

**A pixel-perfect macOS desktop experience built for the web.**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

<br />

> *Not just a portfolio — it's an entire operating system experience in your browser.*

<br />


---

</div>

<br />

## ✨ What Makes This Different

This isn't your typical portfolio website. It's a **fully interactive macOS desktop** that runs in the browser — complete with draggable windows, a dock with bounce animations, spotlight search, dynamic wallpapers, and a realistic boot sequence. Every detail, from the 0.5px borders to the traffic light buttons, is crafted to match the real macOS experience.

<br />

## 🎬 Experience

| Feature | Description |
|---------|-------------|
| 🖥️ **Boot Sequence** | Authentic Apple logo → progress bar → desktop fade-in |
| 🪟 **Window Management** | Drag, minimize, maximize, focus — just like real macOS |
| ⌨️ **Spotlight Search** | `⌘ Space` to search and launch apps instantly |
| 🎨 **Dynamic Wallpapers** | Auto-rotating wallpapers with crossfade transitions |
| 💤 **Sleep / Wake** | Breathing LED indicator, smooth screen transitions |
| 🕐 **Interactive Clock** | PressureText™ — font weight responds to cursor proximity |
| 📱 **Right-Click Menus** | Context-aware menus with keyboard shortcuts |

<br />

## 🗂️ Built-in Apps

<table>
<tr>
<td align="center" width="150">

**👤 About Me**
<br />
<sub>Personal summary with animated layout</sub>

</td>
<td align="center" width="150">

**📁 Projects**
<br />
<sub>Finder-style folder navigation with detail views</sub>

</td>
<td align="center" width="150">

**⚙️ Skills**
<br />
<sub>System Preferences-inspired skill browser</sub>

</td>
</tr>
<tr>
<td align="center" width="150">

**⬛ Terminal**
<br />
<sub>Interactive terminal with custom commands</sub>

</td>
<td align="center" width="150">

**🧭 Resume**
<br />
<sub>Safari-style PDF viewer with zoom & download</sub>

</td>
<td align="center" width="150">

**💬 Contact**
<br />
<sub>iMessage-style conversational contact form</sub>

</td>
</tr>
</table>

<br />

## 🛠️ Tech Stack

```
Frontend         React 18 · TypeScript · Vite 5
Styling          Tailwind CSS · tailwindcss-animate · CSS Variables
UI Primitives    shadcn/ui (Radix UI)
Routing          React Router v6
Testing          Vitest · React Testing Library
Code Quality     ESLint · Strict TypeScript
```

<br />

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9 (or pnpm / yarn)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/macos-portfolio.git
cd macos-portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — you'll see the boot screen, then the desktop.

### Production Build

```bash
# Build for production
npm run build

# Preview the build locally
npm run preview
```

<br />

## 📁 Project Structure

```
src/
├── main.tsx                    # App bootstrap (React + Router)
├── App.tsx                     # Top-level routing shell
│
├── pages/
│   ├── Index.tsx               # → Renders <Desktop />
│   └── NotFound.tsx            # 404 page
│
├── components/
│   ├── Desktop.tsx             # 🖥️  Main orchestrator
│   │                           #     Boot state, sleep/wake, wallpaper
│   │                           #     rotation, clock, window management
│   │
│   ├── BootScreen.tsx          # 🍎  Startup animation
│   ├── MenuBar.tsx             # 📋  Top bar + Apple menu + Control Center
│   ├── Dock.tsx                # 🚀  Bottom dock with bounce animations
│   ├── MacWindow.tsx           # 🪟  Draggable window container
│   ├── Spotlight.tsx           # 🔍  Search overlay (⌘ Space)
│   ├── ContextMenu.tsx         # 📎  Right-click menus
│   ├── Notification.tsx        # 🔔  Toast notifications
│   │
│   ├── apps/
│   │   ├── AboutMe.tsx         # 👤  Personal info
│   │   ├── Projects.tsx        # 📁  Finder-style project browser
│   │   ├── Skills.tsx          # ⚙️  Skill visualization
│   │   ├── Terminal.tsx        # ⬛  Interactive terminal
│   │   ├── Resume.tsx          # 🧭  PDF viewer (Safari-style)
│   │   └── Contact.tsx         # 💬  iMessage contact form
│   │
│   └── ui/                     # 🧩  shadcn/ui primitives
│
├── hooks/
│   └── useWindowManager.ts     # Window state management
│
├── assets/
│   ├── *.jpg / *.avif          # Wallpaper images
│   └── resume.pdf              # Resume document
│
├── index.css                   # Global styles + CSS variables
└── App.css                     # App-level styles
```

<br />

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘ Space` | Toggle Spotlight search |
| `⌘ →` / `⌘ ←` | Next / Previous wallpaper |
| `⌘ +` / `⌘ -` | Zoom in / out (Resume viewer) |
| `⌘ 0` | Reset zoom |
| `⌘ S` | Download resume |
| `⌘ P` | Print resume |
| `Escape` | Close Spotlight / Context menu |
| `Arrow Keys` | Navigate folder grid (Projects) |
| `Enter` | Open selected folder |
| `Backspace` | Go back (Projects detail view) |

<br />

## 🎨 Customization Guide

### Wallpapers

Edit `Desktop.tsx` — update the `imageWallpapers` array:

```tsx
const imageWallpapers = [
  { id: 'wall-1', label: 'Mountain', src: '/your-wallpaper.jpg' },
  { id: 'wall-2', label: 'Ocean',    src: '/another-wallpaper.avif' },
  // Add as many as you'd like
];
```

> 💡 Recommended: Use `.avif` or `.webp` for faster load times. Ideal resolution: 2560×1600 or higher.

### Apps

Add a new app in 3 steps:

**1. Create the component:**

```tsx
// src/components/apps/MyApp.tsx
const MyApp = () => (
  <div className="p-6">
    <h1>My Custom App</h1>
  </div>
);
export default MyApp;
```

**2. Register it in Desktop.tsx:**

```tsx
import MyApp from '@/components/apps/MyApp';

const appContent: Record<string, () => JSX.Element> = {
  // ... existing apps
  myapp: () => <MyApp />,
};
```

**3. Add it to the Dock** — update your `Dock.tsx` app list.

### Theming

- **Global CSS variables** → `src/index.css`
- **Tailwind configuration** → `tailwind.config.ts`
- **Window styling** → `MacWindow.tsx` (glass material, shadows, borders)
- **Menu bar vibrancy** → `MenuBar.tsx` (backdrop-filter, gradients)

<br />

## 🧪 Testing & Quality

```bash
# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Lint the codebase
npm run lint
```

| Tool | Purpose |
|------|---------|
| **Vitest** | Unit testing framework |
| **React Testing Library** | Component testing |
| **ESLint** | Code linting & best practices |
| **TypeScript (strict)** | Type safety across the codebase |

<br />

## 📜 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Dev** | `npm run dev` | Start Vite dev server with HMR |
| **Build** | `npm run build` | Production build (TypeScript + Vite) |
| **Build (dev)** | `npm run build:dev` | Development-mode build |
| **Preview** | `npm run preview` | Serve production build locally |
| **Lint** | `npm run lint` | Run ESLint |
| **Test** | `npm run test` | Run Vitest once |
| **Test (watch)** | `npm run test:watch` | Vitest in watch mode |

<br />

## 🎯 Design Principles

| Principle | Implementation |
|-----------|---------------|
| **Pixel Perfection** | 0.5px borders, 26px menu bar, 12px traffic lights — matching real macOS |
| **Material Realism** | `backdrop-filter: blur(80px) saturate(180%)` for vibrancy glass effects |
| **Motion Design** | Spring curves (`cubic-bezier(0.2, 0.9, 0.3, 1)`), staggered animations |
| **Performance** | `requestAnimationFrame` throttling, `will-change` hints, lazy rendering |
| **Accessibility** | `aria-label` on all buttons, keyboard navigation, focus management |
| **Responsiveness** | `min()` units, viewport-relative sizing, flexible layouts |

<br />

## 📐 Browser Support

| Browser | Support |
|---------|---------|
| Chrome / Edge | ✅ Full support |
| Firefox | ✅ Full support |
| Safari | ✅ Full support (best experience) |
| Mobile browsers | ⚠️ Desktop-optimized (functional on tablets) |

<br />

## 🤝 Contributing

Contributions are welcome! If you'd like to improve something:

1. **Fork** the repository
2. Create a **feature branch** (`git checkout -b feature/amazing-thing`)
3. **Commit** your changes (`git commit -m 'Add amazing thing'`)
4. **Push** to the branch (`git push origin feature/amazing-thing`)
5. Open a **Pull Request**

<br />

## 📄 License

This project is open-source under the [MIT License](LICENSE).

Built with ❤️ and an obsessive attention to detail.

<br />

---

<div align="center">

**If you found this project interesting, consider giving it a ⭐**

<br />

[**Live Demo**](https://your-portfolio-url.com) · [**Report Issue**](https://github.com/your-username/repo/issues) · [**Request Feature**](https://github.com/your-username/repo/issues)

</div>