# Electric City Aquarium Wildlife Explorer

Electric City Aquarium is an interactive wildlife kiosk experience. Visitors can explore animal species on a world map, filter animals by taxonomic group, zoom and pan across geographic regions, and open a detailed animal profile.

The app is built for a large 16:9 kiosk display and includes responsive layouts for tablet and smaller screens.

## Features

- Interactive world map with geographic animal markers
- Zoom and pan controls with compact, readable markers
- Taxonomic filters with database-driven species counts
- Selected marker styling based on the Figma design
- Animal detail screens with habitat, conservation status, threats, fun facts, and quick statistics
- Responsive layouts for desktop, iPad, and mobile viewports
- Local image, icon, and font assets for reliable kiosk playback
- Static single-page app build served via Netlify

## Tech Stack

- React 19
- TypeScript
- React Router 8
- Vite
- Tailwind CSS 4 Vite integration
- Plain CSS for application styling
- Node.js 24 recommended

## Getting Started

### Prerequisites

- Node.js 24 or a recent Node.js release supported by React Router 8
- npm

### Installation

Clone the repository and install dependencies:

```bash
npm install
```

### Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The app is available at `http://localhost:5173` by default.

### Validation

Run the TypeScript and React Router checks:

```bash
npm run typecheck
```

Create a production build (static output in `build/client`):

```bash
npm run build
```

## Application Routes

| Path       | Description                                    |
| ---------- | ---------------------------------------------- |
| `/`        | Aquarium home screen with wildlife map preview |
| `/map`     | Interactive wildlife map and category filters  |
| `/map/:id` | Detail screen for one animal                   |

Animal markers link to their detail screen using the animal ID in `app/utils/animals.json`.

## Project Structure

```text
app/
	components/
		animal-data/       Animal detail screen and styles
		HomeHero/          Home screen hero section
		HomeMapPreview/    Home screen map preview
		InteractiveMap/    Map, filters, zoom, pan, and markers
		TaxonomicIcon/     Reusable taxonomy icon component
	routes/
		home.tsx           Home route
		animals.tsx        Interactive map route and loader
	utils/
		animals.json       Local animal dataset
		api.ts             Dataset access helpers
		types.ts           Animal and taxonomy types
public/
	images/              Local animal and taxonomy imagery
```

## Data

Animal records are stored in `app/utils/animals.json` and accessed through `app/utils/api.ts`. Each record includes an ID, common and scientific names, taxonomic group, native region, habitat information, conservation status, threats, and optional measurements or media.

To add an animal:

1. Add a complete record to `app/utils/animals.json`.
2. Add its image or icon to `public/` when needed.
3. Use the existing taxonomic group values: `fish`, `reptile`, `amphibian`, `mammal`, `bird`, or `invertebrate`.
4. Run `npm run typecheck` and verify the map position and detail screen.

## Design Notes

The interface uses local Baloo 2, Work Sans, and Inter font assets. The map and animal detail screens use a shared blue aquarium palette, high-contrast controls, and large touch targets for kiosk interaction.

When changing the responsive layouts, test at the target kiosk size of `1920x1080` as well as iPad portrait and landscape viewports.

## Repository

Project repository: <https://github.com/tripleten-externships/electriccity_team3>

## License

This project is released under the ISC license.
