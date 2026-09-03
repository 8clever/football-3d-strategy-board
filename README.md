# 3D Football Tactical Board

Interactive 3D tactical board for football coaches, managers, and analysts. Drag-and-drop players and the ball on a realistic 3D pitch, switch formations, save unlimited strategies, and plan every phase of play.

## Features

- **3D Pitch** — full-size 105×68 m field rendered in Three.js with realistic grass and markings
- **Drag & Drop** — freely position players and the ball anywhere on the pitch
- **Context Menu** — right-click or click any player, ball, or empty space for tactical actions: pass, rotate, switch team, toggle goalkeeper, edit, delete, place cones
- **Formation Presets** — instant 11v11 setups for **4-3-3**, **4-4-2**, **3-5-2**, and **4-2-3-1** with custom team names and colours
- **Camera Presets** — Top-down 90°, Angled Center (broadcast), Angled Ball Focus, Goal A, Goal B
- **Overlay Toggles** — show/hide player names and passing lanes
- **Strategy Management** — create, rename, duplicate, delete, and switch between unlimited saved strategies
- **Coach's Notes** — collapsible side panel for per-strategy tactical notes
- **Tactical Markers** — place, drag, recolor, and delete cone markers on the pitch
- **Persistent Storage** — all strategies auto-save to localStorage

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| 3D Engine | Three.js |
| Styling | Tailwind CSS v4 |
| Build Tool | Vite 6 |
| Language | TypeScript 5.8 |
| Animations | Motion |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Bun](https://bun.sh/) (recommended) or npm

### Install

```bash
bun install
```

### Development

```bash
bun dev
```

Opens at [http://localhost:3000](http://localhost:3000).

### Build

```bash
bun run build
```

### Preview Production Build

```bash
bun run preview
```

### Type Check

```bash
bun run lint
```

### Clean

```bash
bun run clean
```

Removes `dist/` and `server.js`.

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | API key for Gemini AI calls | No (AI features) |
| `APP_URL` | URL where the app is hosted | No |

## Controls

| Action | Input |
|--------|-------|
| **Move player / ball** | Left-click + drag |
| **Orbit camera** | Left-click + drag on empty pitch |
| **Pan camera** | Right-click + drag (or Shift + drag) |
| **Zoom** | Mouse wheel / trackpad pinch |
| **Context menu** | Click on player, ball, or empty pitch |
| **Toggle names** | Camera toolbar button |
| **Toggle passing lanes** | Camera toolbar button |
| **Switch camera view** | Camera toolbar preset buttons |

### Context Menu Actions

**On a player:**
- Pass ball to this player
- Rotate (±45°)
- Face opponent goal
- Switch team
- Toggle goalkeeper
- Edit player details
- Delete player

**On the ball:**
- Move to center circle
- Pass to nearest player
- Shoot at left / right goal

**On empty pitch:**
- Add player (Team A / Team B)
- Place tactical cone marker

## Supported Formations

Both teams can independently use any of these formations:

- **4-3-3** — aggressive width with front three
- **4-4-2** — classic balanced setup
- **3-5-2** — wing-back overload with two strikers
- **4-2-3-1** — double pivot with attacking midfielder

## Project Structure

```
src/
├── App.tsx                  # Root component, state management
├── main.tsx                 # Entry point
├── types.ts                 # TypeScript interfaces
├── index.css                # Global styles
├── components/
│   ├── Pitch3D.tsx          # Three.js 3D pitch renderer
│   ├── HeaderBar.tsx        # Top navigation bar
│   ├── ContextMenu.tsx      # Right-click tactical menu
│   ├── CameraToolbar.tsx    # Camera presets & overlay toggles
│   ├── PlayerModal.tsx      # Edit player details
│   ├── StrategyModal.tsx    # Create / rename strategy
│   ├── DeleteConfirmModal.tsx
│   ├── HelpModal.tsx        # Help & controls reference
│   └── CoachNotes.tsx       # Collapsible notes panel
├── data/
│   └── defaultStrategies.ts # Initial formations & localStorage helpers
└── utils/
    └── threeTactics.ts      # Three.js scene utilities
```

## Author

**Ivan Vitiaev** — [vitiaev.com](https://vitiaev.com)
