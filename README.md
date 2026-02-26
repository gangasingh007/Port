Here’s a solid `README.md` you can paste into your project.

```markdown
## macOS‑style Portfolio Desktop

This is a personal portfolio built with **React + TypeScript + Vite + Tailwind CSS + shadcn/ui**, designed to look and feel like a modern macOS desktop. It features draggable app windows, a dock, a menu bar, spotlight search, notifications, and dynamic wallpapers.

---

### Features

- **Mac‑like desktop UI**
  - Top `MenuBar` with Apple menu actions (About, Sleep, Restart).
  - Bottom `Dock` with bouncing app icons.
  - `Spotlight` search (toggle with `Ctrl` + `Space` / `Cmd` + `Space`).
  - Custom `ContextMenu` on right‑click.

- **Windowed apps**
  - `AboutMe` – personal summary/about section.
  - `Projects` – showcase of selected projects.
  - `Skills` – tech stack and tools.
  - `Terminal` – fun, terminal‑style interface.
  - `Resume` – embedded resume (PDF/DOCX).
  - `Contact` – ways to reach out.

- **Desktop behavior**
  - `BootScreen` animation before the desktop loads.
  - Sleep / wake behavior with smooth transitions.
  - Large minimalist clock when no windows are open.
  - Rotating wallpaper slideshow using local images.

- **Modern tech stack**
  - **React 18 + TypeScript**
  - **Vite** for fast dev/build.
  - **Tailwind CSS** + `tailwindcss-animate`.
  - **shadcn/ui** (Radix UI primitives).
  - **React Router** (for `Index` / `NotFound` pages).
  - **Vitest** + Testing Library for unit tests.
  - Configured **ESLint** for linting.

---

### Getting Started

#### Prerequisites

- **Node.js** (recommended ≥ 18)
- **npm** (comes with Node)

#### Install dependencies

```bash
npm install
```

#### Run the dev server

```bash
npm run dev
```

Then open the printed local URL in your browser (usually `http://localhost:5173`).

#### Build for production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

### Project Structure (simplified)

- **`src/main.tsx`** – App bootstrap (React + Router + Providers).
- **`src/App.tsx`** – Top‑level app shell & routing.
- **`src/pages/Index.tsx`** – Renders the `Desktop` experience.
- **`src/pages/NotFound.tsx`** – 404 page.
- **`src/components/Desktop.tsx`**
  - Handles boot state, sleep/wake, wallpaper rotation, clock, and window manager integration.
- **`src/components/BootScreen.tsx`** – Startup animation before desktop appears.
- **`src/components/MenuBar.tsx`**, **`Dock.tsx`**, **`MacWindow.tsx`**, **`Spotlight.tsx`**, **`ContextMenu.tsx`**, **`Notification.tsx`**
  - Core macOS‑style UI components.
- **`src/components/apps/*`**
  - `AboutMe.tsx`, `Projects.tsx`, `Skills.tsx`, `Terminal.tsx`, `Resume.tsx`, `Contact.tsx`.
- **`src/hooks/useWindowManager.ts`**
  - Manages open windows, focus, positions, minimize/maximize, etc.
- **`src/assets/*`**
  - Wallpapers (`background.avif`, `bg*.jpg/avif`) and resume files.

---

### Scripts

From `package.json`:

- **`npm run dev`** – Start Vite dev server.
- **`npm run build`** – Build production bundle.
- **`npm run build:dev`** – Development‑mode build.
- **`npm run preview`** – Preview the production build locally.
- **`npm run lint`** – Run ESLint on the project.
- **`npm run test`** – Run Vitest tests once.
- **`npm run test:watch`** – Run Vitest in watch mode.

---

### Customization

- **Wallpapers**: Update images and imports in `src/components/Desktop.tsx` (`bg1`–`bg10`) and adjust the `imageWallpapers` list as needed.
- **Apps / Content**:
  - Edit or replace app components under `src/components/apps/`.
  - Update the `appContent` map in `Desktop.tsx` to add/remove apps.
- **Styling**:
  - Global styles: `src/index.css`, `src/App.css`.
  - Tailwind config: `tailwind.config.ts`.
  - UI primitives: `src/components/ui/*` (shadcn/ui components).

---

### Testing & Quality

- **Unit tests** with Vitest + Testing Library (`src/test`).
- **ESLint** configuration in `eslint.config.js`.
- Type‑safe codebase using **TypeScript** and strict configs in `tsconfig*.json`.

---

### License

This project is for personal portfolio use. Feel free to read the code and take inspiration; if you reuse significant parts, please give credit in your project’s README.
```