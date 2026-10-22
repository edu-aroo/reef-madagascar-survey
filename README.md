# Enquête nationale — suivi écologique et restauration des récifs coralliens à Madagascar

Online questionnaire (GitHub Pages) → Google Sheets → R project → HTML report.
Same structure and engine as the seagrass survey (`enquete-herbiers`), adapted to the reef questionnaire, with reef photos.

```
enquete-recifs/
├── index.html                  ← the questionnaire (GitHub Pages serves this)
├── assets/
│   ├── js/survey-config.js     ← THE file to edit: texts, logos, photos, questions, Apps Script URL
│   ├── js/app.js               ← form engine (no need to edit)
│   ├── css/style.css           ← colours / layout
│   └── img/
│       ├── logos/              ← put partner logos here (ihsm.png, fapbm.png)
│       └── photos/             ← local copies of the photos (optional, see Step 1)
├── apps-script/Code.gs         ← receives answers, writes them to Google Sheets
├── tools/
│   ├── make_codebook.js        ← regenerates analysis/codebook.csv after editing questions
│   └── download_photos.R       ← downloads the photos into assets/img/photos/
├── analysis/                   ← R project (open enquete-recifs.Rproj)
│   ├── R/00_packages.R  01_import.R  02_simulate.R  03_clean.R  functions.R  config.R
│   ├── report/rapport.Rmd
│   ├── codebook.csv            ← variable names, labels, options, display conditions
│   ├── run_all.R               ← import + render both reports
│   └── data/                   ← raw data (git-ignored, never published)
└── rapport/index.html          ← rendered public report (currently built from FAKE data)
```

---

## Step 1 — Customise the form (15 min)

Open `assets/js/survey-config.js` and fill the `META` block:

- `organizer`, `contactName`, `contactEmail`, `deadline`, `privacy` (all marked `[...]`).
- **Logos**: copy the official files into `assets/img/logos/` as `ihsm.png` and `fapbm.png` (PNG with transparent background, or SVG). Until they are there, the page shows the names as text. To add a partner, add a line to `logos`.
- Leave `appsScriptUrl` empty for now (Step 2).

**Photos.** The page uses 9 underwater photos taken in north-west Madagascar (Nosy Iranja, Nosy Tanikely, Nosy Antanimora, Ambalihabe…) by Diego Delso, published on Wikimedia Commons under **CC BY-SA 4.0**. This licence allows use on your site **provided the author, licence and a link are shown** — the page does this on each photo and in the footer; don't remove it.
- By default the photos load from Wikimedia. To host them with the site (faster, no external dependency), run once in R from the `enquete-recifs/` folder: `source("tools/download_photos.R")`, then commit the `assets/img/photos/*.jpg` files.
- To use your own field photos instead: put them in `assets/img/photos/` and edit the `PHOTOS` list (`src`, `caption`, `credit`, `license`, `page`). `META.heroPhoto`, `META.introPhotos` and `META.thanksPhoto` choose which photo goes where; the others rotate as section banners.

To preview locally: open a terminal in the folder and run `python -m http.server`, then go to <http://localhost:8000>. (Double-clicking `index.html` also works in most browsers.)

> ⚠️ Do not rename question `id`s once data collection starts: they are the column names in Google Sheets and the variable names in R.
> If you add/remove questions or options, run `node tools/make_codebook.js` to update `analysis/codebook.csv`.

## Step 2 — Connect the form to Google Sheets (10 min)

1. Create a new Google Sheet (e.g. *Enquête récifs — réponses*) with the Google account that will own the data.
2. In the Sheet: **Extensions → Apps Script**. Delete the default code and paste the content of `apps-script/Code.gs`. Save.
3. (Optional) Put your e-mail in `NOTIFY_EMAIL` to be notified of each response.
4. In the function menu select `autoriser` → **Run** → accept the permissions (Google will warn that the app is unverified: *Advanced → Go to project*). This is your own script.
5. **Deploy → New deployment → type: Web app**
   - *Execute as*: **Me**
   - *Who has access*: **Anyone**
   - Deploy, and copy the URL ending in `/exec`.
6. Paste that URL into `appsScriptUrl` in `survey-config.js`.
7. Test: open the `/exec` URL in a browser — you should see `{"ok":true,"message":"Service de collecte actif"}`. Then fill the form once and check that the `Reponses` tab appears in the Sheet.

Notes
- When you modify `Code.gs` later: **Deploy → Manage deployments → ✏️ Edit → Version: New version**. This keeps the same URL.
- Data structure: `Reponses` = one row per organisation. Multiple-choice answers are separated by ` | `; "Autre" / "(préciser)" details are in `qXXX_autre` columns; areas have a `qXXX_unite` column (ha or km²); the Q12 grid is split into `q012_noyau`, `q012_zuc`, etc.
- Cells are written as text so Sheets does not turn answers like "1–3" into dates.
- The `Journal` tab logs any server-side errors. Duplicate submissions are ignored using `response_id`.

## Step 3 — Publish on GitHub Pages (10 min)

1. Create a GitHub repository (e.g. `enquete-recifs`). Free GitHub Pages requires a **public** repository — fine, because no data is stored in it (`analysis/data/` is git-ignored).
2. Upload the whole folder (drag-and-drop in *Add file → Upload files*, or with Git):
   ```bash
   git init && git add . && git commit -m "Questionnaire récifs v1.0"
   git branch -M main
   git remote add origin https://github.com/<user>/enquete-recifs.git
   git push -u origin main
   ```
3. **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`** → Save.
4. After ~1 min the form is online at `https://<user>.github.io/enquete-recifs/` and the report at `https://<user>.github.io/enquete-recifs/rapport/`.
5. Before sending the link: fill it once yourself on a phone and on a computer, then delete your test rows in the Sheet.

## Step 4 — Analyse in R

1. Open `analysis/enquete-recifs.Rproj` in RStudio. `R/00_packages.R` installs what is missing.
2. **Test now with fake data**: `DATA_SOURCE <- "simulated"` (default in `R/config.R`), then `source("run_all.R")`. This builds `rapport/index.html` (public) and `data/rapport_interne.html` (internal, with organisation names and open answers). The fake data follow the form's display conditions (hidden questions stay empty).
3. **Real data**: in `R/config.R` set `SHEET_URL` and `DATA_SOURCE <- "sheet"`, then `source("run_all.R")`. The first time, a browser window asks you to authorise *Tidyverse API Packages* to read your Sheets; the token is cached in `analysis/.secrets/` (git-ignored).
   - Each import saves a timestamped copy in `data/raw/` (`.rds` + `.csv`). Use `DATA_SOURCE <- "cache"` to work offline on the last copy.
4. Work interactively:
   ```r
   source("R/01_import.R"); source("R/03_clean.R"); source("R/functions.R")
   CB  <- read_codebook()
   dat <- clean_data(load_raw("cache"), CB)
   plot_choice(dat$reponses, "q031")                  # methods used
   heat_by(dat$reponses, "q032", group = "q002")       # indicators by organisation type
   ```
   Areas (Q4, Q6, Q7) are converted to hectares in `q004_ha`, `q006_ha`, `q007_ha`.

## Step 5 — Publish the report

After `run_all.R`, commit and push `rapport/index.html`:
```bash
git add rapport/index.html && git commit -m "Rapport mis à jour" && git push
```
The **public** version contains only aggregated results (no organisation names or free-text answers). Keep `data/rapport_interne.html` for yourself and your supervisors — never commit it.

> With few respondents, some categories (e.g. a single organisation of one type) can still be identifying. Check the public report before pushing.

---

## Changes made to the questionnaire — please check

The online version follows the spreadsheet; these adjustments were needed to make it work as a form. Revert any you disagree with in `survey-config.js` (then run `node tools/make_codebook.js`).

| Q | Change | Why |
|---|---|---|
| 3 | Single choice + option "Non applicable (pas une AMP)"; typo "hamonieux" fixed | Required for everyone, but only AMPs have an IUCN category |
| 4, 6, 7 | Number + unit (ha / km²); converted to ha in R | The sheet allowed both units |
| 10 | Multiple choice (was single); shown if Q9 = "Oui…" | Text says "plusieurs choix possibles" |
| 11 | "Plus de 31" → "Plus de 30" | 31 was missing |
| 12 | One number per zone; shown if Q9 = "Oui…" | Grid question |
| 14 | Number; shown if Q13 = "Oui…" | Asks for a count |
| 26, 60 | Shown (and required) only if Q25 / Q57 = "Non…" | "Si non, pourquoi ?" was required for everyone |
| 28, 51, 58–59, 61–62, 64–65, 68–80, 84, 90 | Conditional | "Si oui / si non" questions. Q69–74 and Q77 if restoration is ongoing (Q67); Q75–76 if restoration is in the programme (Q66); Q78–80 if restoration sites are monitored (Q77) |
| 36–37, 39–40 | Hidden when "Aucun suivi" is the only answer to Q35 / Q38 | |
| 37, 40, 44, 49 | "Plus de 3 (préciser)" opens a field | Number was not collected |
| Remarks column | The Excel remarks are **shifted one row down** (e.g. "Si oui, préciser le nom du logiciel" sits on Q54 but refers to Q53) | Attached to the question they refer to, as optional fields: Q21, 35, 38, 41, 47, 53, 72, 73, 85, 87 |
| 45 | Reworded ("Préciser le et dites…") | Grammar |
| 51 | Single choice | Answers are exclusive |
| 75–76 | Two clear questions (forces / faiblesses), multiple choice | Same text twice, labels inside the options |
| 87, 103 | Max 3 selections enforced | "3 maximum" |
| 92–93 | "forces…" / "faiblesses…" | Same text twice |
| 99 | Scale labelled 1 = très faible … 5 = très élevée | Labels added for the end points |
| All | "Autre" / "(préciser)" opens a required text field; "Aucun…" / "Ne sait pas" un-tick the other options | |

**Points I did not change — worth deciding before launch:**
- **Q101 and Q103 overlap** (same criteria; Q103 adds "Facilité de formation" and "3 maximum"). Consider keeping only Q103.
- **Q58** "Basique / Intermédiaire / Avancée" will be read differently by different respondents — add a definition or list actual methods.
- **Q2 vs Q3/Q4/Q6**: several questions assume the respondent manages an AMP/LMMA; NGOs, universities or funders may not. I can show Q3–Q4 only to AMP/LMMA/OECM managers if you want.
- **Q22** includes "Autre (préciser)" among cost ranges — unusual for a numeric range.
- **No respondent identification.** Unlike the seagrass survey (name, role, e-mail, phone), this questionnaire only asks for the organisation name, so you cannot contact a respondent to clarify an answer. I did not add these fields since they are not in your sheet; I can add them as an optional first step.

## Limits to be aware of

- **Answers are saved on the respondent's device** (browser storage) while filling — not across devices.
- The form is in French only.
- The `/exec` URL is public: anyone with it could submit. A hidden anti-bot field is included; duplicates are filtered by `response_id`. Check the data for test/spam rows before analysis.
- Photos load from Wikimedia Commons unless you run `tools/download_photos.R`.
