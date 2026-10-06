# Day Planner

A small, monochrome day planner with a personal notebook feel. Plan the day in focused blocks, combine blocks for longer tasks, and download a one-page A4 checklist.

## Features

- 16 hourly blocks from 6:00 AM to 10:00 PM: 50 minutes of focus, then a 10-minute break.
- Editable task descriptions and a planning date.
- Merge adjacent blocks; split them back into individual blocks. Hourly breaks remain within merged tasks.
- A4 PDF with the date, task table, empty check and notes cells, and a daily notes box.
- Print preview, progress indicator, and a confirmed **Clear day** action.
- Installable PWA with a home-screen icon and offline support after a successful first online load.
- Device-local saving: plans survive refreshes without a database or account.
- Mobile layout on both phones and desktop screens.

## Technology

React, TypeScript, Vite, and Tailwind CSS. The only application runtime packages are React and React DOM. PDF generation uses browser canvas and a small PDF writer; there is no PDF library, backend, or database.

This standalone export preserves the latest planner UI and features and replaces the original hosting starter with a conventional Vite project. It can be deployed independently of ChatGPT Sites.

## Run locally

Install **Node.js 22.13 or newer** and npm (included with Node.js).

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

```sh
npm run build
npm run preview
```

The build command checks TypeScript and creates the production site in `dist/`. The preview command serves that build locally, normally at `http://localhost:4173`.

No environment variables, API keys, or database setup are needed. The service worker is registered only in production builds so it does not interfere with development.

## Push to your GitHub account

Create an empty repository named `day-planner` on GitHub. Do not initialize that repository with a README, license, or `.gitignore`, because the project already supplies its own files. Choose public or private according to your preference.

From the extracted project folder, run:

```sh
git init
git add .
git commit -m "Add Day Planner PWA"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/day-planner.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username. Use your normal GitHub authentication or GitHub Desktop. Do not paste access tokens into source files.

For later changes:

```sh
git add .
git commit -m "Update planner"
git push
```

## Deploy to your own Vercel account

1. Sign into Vercel with your account and select **Add New → Project**.
2. Import your `day-planner` GitHub repository.
3. Select **Vite** as the framework preset if it is not detected.
4. Use these settings:

| Setting | Value |
| --- | --- |
| Root directory | Repository root |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment variables | None |

5. Deploy. Vercel provides an HTTPS URL that you can share.
6. Future pushes to the production branch trigger new deployments. You can add your own domain in the project settings.

`vercel.json` supplies the build settings and prevents long-lived caching of the service worker. Deploy at the root of a domain or subdomain. Paths in the manifest and service worker currently assume `/`; GitHub Pages repository subpaths require extra configuration.

You can also deploy the `dist/` folder to another static host that supports HTTPS.

## Install and offline use

Visit the deployed site online and allow its resources to finish loading. Use **Install day planner**, the browser's installation option, or Safari's **Share → Add to Home Screen** on iPhone.

Installation availability depends on browser and operating system. Offline use requires the initial resource caching to succeed. PDF generation runs on the device and can work offline once the app is cached.

## Data and privacy

The current plan is stored in this browser's `localStorage` under `day-planner`. Plans are not uploaded or shared with other users. There is no cross-device sync or date-indexed plan history: changing the date changes the date of the current plan.

Clearing browser data removes the saved plan. If storage is unavailable, the app displays a message asking you to download your plan before leaving. **Clear day** resets task content and merged blocks while keeping the selected date.

## Project structure

```text
src/
  App.tsx             Planner controls, schedule, preview, local saving
  main.tsx            React entry point
  styles.css          Tailwind and notebook styling
components/
  pwa.tsx             Service worker registration and installation UI
lib/
  planner-pdf.ts      Canvas rendering and A4 PDF download
public/
  manifest.webmanifest
  sw.js               Offline caching
  icons/              PWA and Apple touch icons
index.html            Metadata and app entry
vercel.json           Deployment settings
```

## Customization and updates

- Change hours and slot counts in `src/App.tsx`; update corresponding labels and PDF timing logic in `lib/planner-pdf.ts` too.
- Change visual styling in `src/styles.css`.
- Update the name, description, and icons in `index.html` and `public/manifest.webmanifest`.
- Increment the `CACHE` value in `public/sw.js` when releasing changes to the offline app. Open or reload the app online to receive updates.
- Task entry is limited to 180 characters. Merging joins task descriptions and currently truncates the combined description to that limit. Splitting keeps the description in the first block.
- PDFs are rasterized for reliable rendering; text is not selectable. Very long descriptions use smaller text to fit the page.

## Troubleshooting

**Old version appears:** Open the site online and reload it. If necessary, clear that site's service-worker/cache data in browser developer tools. Clearing all site data also removes your saved plan.

**Install option is missing:** Check HTTPS, browser installation support, and the manifest. The development server does not register a service worker; use a production build to test offline support.

**PDF download behaves differently on mobile:** Look in the browser's downloads or file-sharing interface. PDF handling depends on the device and browser.

**Build fails:** Check your Node.js version, run `npm ci`, and review the TypeScript/build output.

## Reference documentation

- [Vite deployment guide](https://vite.dev/guide/static-deploy.html)
- [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite)
- [PWA installation guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)
