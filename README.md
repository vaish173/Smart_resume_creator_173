# VTU Web Technology Lab Assignment-1

Project: Multi-page personal website (Resume & Bio-data) for Vaishnavi V

Objective: Create a responsive multi-page site that collects user details via a form, stores them in browser localStorage, generates a styled resume and bio-data, and provides Download as PDF (print fallback).

Files included:
- `index.html` — Landing page with quick actions.
- `form.html` — Form to enter personal, education, skills, projects, and certificate links.
- `resume.html` — Auto-loads data from localStorage and renders a professional resume. Supports PDF export (uses html2pdf if available; otherwise uses print-to-PDF fallback).
- `biodata.html` — Auto-loads key personal fields and supports PDF export.
- `style.css` — Green-themed styling and responsive layout.
- `script.js` — JavaScript logic for saving/loading, multi-step form, theme toggle, and export (PDF/print).

How to run locally
1. Open the project folder in VS Code or a file explorer.
2. Open `index.html` in your browser (double-click or right-click -> Open with).
3. Click "Create Resume" to fill the form, save, and preview.

Notes on features
- Works offline (data is stored in `localStorage`).
- PDF export prefers `html2pdf.js` if added locally; otherwise the page will open the print dialog (use "Save as PDF").
- DOCX export was removed to keep the project CDN-free and lightweight. If you need DOCX export, include a local docx/FileSaver build and restore the functions in `script.js`.

Hosting on GitHub Pages
1. Create a GitHub repository and push this project (all files at the repository root).
2. In GitHub repo -> Settings -> Pages, choose branch `main` (or `master`) and folder `/ (root)` and click Save.
3. After a minute the site will be available under `https://<your-username>.github.io/<repo-name>/`.

Validation & Testing
- Tested to be responsive; try on mobile and desktop browsers.
- If DOCX export fails in some browsers, check console for errors; ensure the docx UMD script is accessible.

License
This project is created as an assignment sample and is free to use and modify.
