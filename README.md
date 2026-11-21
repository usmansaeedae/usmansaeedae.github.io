# Portfolio: Dr Muhammad Usman Saeed Akhtar

A fully static personal website (HTML, CSS, JavaScript; no framework, no build step needed to host).

Last redesigned: 21 November 2026.

## Open the site on your computer

Double-click `index.html` in `D:\portfolio-website`. It opens in your web browser and everything works, including the videos, gallery and fonts.

If it opens in another program (such as VS Code or Notepad), right-click `index.html`, choose **Open with**, then pick Chrome or Edge. You can also drag `index.html` onto an open browser window, or paste this into the address bar:

```
file:///D:/portfolio-website/index.html
```

Optional, a local web server (closest to how the live site behaves). In Command Prompt:

```
cd /d D:\portfolio-website
python -m http.server 8000
```

Then open http://localhost:8000. The `/d` matters: without it, Command Prompt does not switch from C: to D:.

## What's new in this version

- **New look, "the hydrogen fingerprint":** deep marine navy with the four visible emission lines of hydrogen (410, 434, 486 and 656 nm) running through every dark band, placed at their true wavelength positions. One typeface, Archivo, used at different widths. Light and dark modes both work.
- **Cinematic homepage:** a 15-second muted video montage behind the name (graduation stage, ICES 2026 talk, Melbourne Skydeck, the Bosphorus and the 2022 cap toss), with a pause button. It respects "reduce motion" settings.
- **`durham.html`:** a page for the Durham postdoc: the D2862 engine digital models and Dual-Fuel Advisor app, SEASTARS, Karachi Port and HI-ACT, plus what is coming up.
- **`gallery.html`:** the graduation film, four short clips and 48 photos from the PhD graduation, ICMIAM 2025, ICES 2026 and ICMIAM 2026, with filters and a full-screen viewer (arrow keys and Escape work).
- **`conferences.html`:** rebuilt with photos for each recent conference.
- Durham work added to the homepage, About, Research, PhD project and Projects pages; ICMIAM 2026 changed from "accepted" to presented; PhD dates updated (awarded August 2026, graduation November 2026).
- Profile links (LinkedIn, Google Scholar, ResearchGate) are now real links on the contact page and in the footer.
- The contact form now opens the visitor's email app with the message filled in, so no Formspree account is needed.
- Fonts are self-hosted (`css/fonts.css`), so the site makes no requests to Google and keeps its typeface when opened straight from the folder.
- New social-share image (`assets/images/og-cover.jpg`).

## Folder layout

```
index.html, durham.html, gallery.html, about.html, research.html, phd-project.html,
projects.html, publications.html, conferences.html, teaching.html, expertise.html,
achievements.html, downloads.html, contact.html, 404.html
css/styles.css          design system (light and dark)
css/fonts.css           the Archivo font, embedded so it also works when opened from the folder
js/main.js              menus, theme, hero video, film player, lightbox, filters
assets/fonts/           Archivo variable font (SIL Open Font Licence)
assets/images/gallery/  web-sized photos (-lg 1600 px, -sm 720 px)
assets/video/           hero loop, graduation film and clips (H.264 MP4) with posters
assets/downloads/       CV and PDFs
_backup-2026-11-21/     the previous version of every page, CSS and JS
```

## Upload only the website files

The folders `Grad`, `ICMIAM 2025`, `ICMIAM 2026` and `Ices 2026` hold your original photos and videos (several GB, including one 1.7 GB clip). The site does not use them directly; it uses the compressed copies in `assets/`. **Do not upload those four folders, `certificates`, `Old CV.docx`, the `CV - Muhammad Usman Saeed Akhtar (November 2026)` files or `_backup-2026-11-21` to your web host.** The website files themselves come to about 45 MB.

## Still to do before going live

1. **Domain:** replace `https://your-domain.example` in every page, `sitemap.xml` and `robots.txt` with your real domain.
2. **CV:** `assets/downloads/Muhammad-Usman-Saeed-Akhtar-CV.pdf` was updated on 21 November 2026 with the Durham role. This public version leaves out your phone number and the Global Talent line; your full Word and PDF versions are in the folder root (`CV - Muhammad Usman Saeed Akhtar (November 2026)`). Do not upload those.
3. **Download centre:** three PDFs on `downloads.html` are still placeholders.
4. **DOIs:** publication cards still have "DOI to be added" buttons.
5. **Check the Durham page wording** with your line manager before publishing, especially what you say about SEASTARS and HI-ACT.

## Editing tips

- Colours, fonts and spacing are CSS variables at the top of `css/styles.css`.
- To add a photo to the gallery, resize it (about 1600 px and 720 px wide), save both into `assets/images/gallery/` and copy one of the `<figure class="shot">` blocks in `gallery.html`.
- Filtering works from `data-tags` on each item and `data-filter` on each chip; keep them in sync.
