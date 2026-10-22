# Coral reef monitoring survey — step-by-step guide

```
 Respondent ──► Web form (GitHub/GitLab Pages) ──POST──► Google Apps Script ──► Google Sheet
                                                                                    │
                       HTML report (docs/index.html) ◄── report.Rmd ◄── R (googlesheets4)
```

Folder contents

| Folder | What it is |
|---|---|
| `web/` | The survey page (`index.html`) + `logos/` + `.gitlab-ci.yml` (only for GitLab) |
| `apps-script/Code.gs` | Script that receives answers and writes them into the Google Sheet |
| `r-analysis/` | RStudio project: import, cleaning, Rmd report, simulated test data, codebook |

---

## Step 1 — Personalise the form (10 min)

1. Put the logos in `web/logos/` named `ihsm.png` and `fapbm.png` (PNG, transparent background). Until they are present, a text placeholder is shown.
2. Open `web/index.html` in a text editor (VS Code, RStudio, Notepad++). At the top of the `<script>` block, edit `CONFIG`:
   - `CONTACT_EMAIL` — shown in the footer and in the error message.
   - `INTRO`, `PRIVACY`, `THANKS`, `DURATION` — I wrote neutral placeholder texts; please check them, especially the confidentiality statement, which must match what you actually commit to.
   - `SCRIPT_URL` — filled in at Step 2.
3. Open `index.html` in your browser (double-click) to check how it looks.

The questions themselves are embedded in the page (generated from your Excel). If you change the questionnaire later, send me the updated Excel and I'll regenerate the page and the codebook together so the form and R analysis stay in sync.

## Step 2 — Google Sheet + Apps Script (10 min)

1. Create a new Google Sheet, e.g. *Enquête récifs – réponses*.
2. **Extensions → Apps Script**. Delete the default code, paste the content of `apps-script/Code.gs`, save.
3. In the function menu select `setup` → **Run**. Authorise access (Google warns "unverified app": *Advanced → Go to project* — it is your own script). A tab `Reponses` is created.
4. **Deploy → New deployment** → type *Web app*:
   - Execute as: **Me**
   - Who has access: **Anyone** (respondents don't need a Google account)
5. Copy the **Web app URL** (ends in `/exec`) and paste it into `CONFIG.SCRIPT_URL` in `index.html`.
6. Optional: put your e-mail in `NOTIFY_EMAIL` in the script to get an e-mail for each response.

> If you edit the script later: **Deploy → Manage deployments → ✏️ → Version: New version**. This keeps the same URL. "New deployment" would create a new URL.

## Step 3 — Test (5 min)

1. Open `index.html` locally, fill it quickly, submit.
2. Check that a row appears in the `Reponses` tab within a few seconds. Columns are created automatically (`q001`, `q002`, …, `q004_valeur`, `q004_unite`, `q003_preciser`, …). The meaning of each column is in `r-analysis/data/codebook.csv`.
3. **Delete the test rows** (keep row 1, the header) before sending the link.

## Step 4 — Publish the form

**GitHub Pages**

1. Create a repository (e.g. `enquete-recifs`) — it must be public on a free account. Only the form goes there; the answers stay in your Google Sheet.
2. Upload the *contents* of `web/` (`index.html` and the `logos` folder) to the root of the repository (*Add file → Upload files*).
3. *Settings → Pages → Source: Deploy from a branch → `main` / `(root)` → Save*.
4. After ~1 min the form is online at `https://<your-username>.github.io/enquete-recifs/`.

**GitLab Pages (alternative)**

Push the contents of `web/` including `.gitlab-ci.yml`. The pipeline publishes it at `https://<username>.gitlab.io/<project>/` (see *Deploy → Pages* in the project).

## Step 5 — Send the link

Practical tips for respondents (worth including in your e-mail):
- Answers are saved automatically in their browser: they can stop and resume later **on the same computer and browser**.
- One response per organisation.
- At the end they get a reference number and can download a copy of their answers.

## Step 6 — R analysis

1. Open `r-analysis/enquete-recifs-analyse.Rproj` in RStudio.
2. **Test first with simulated data**: in `render.R`, set `USE_SIMULATED <- TRUE`, then `source("render.R")`. This installs missing packages and produces `docs/index.html` (marked as simulated data).
3. With real data: paste your Sheet URL in `R/01_import.R` (`SHEET_URL`), set `USE_SIMULATED <- FALSE`, run `source("render.R")`. The first time, a browser window asks you to authorise `googlesheets4` with your Google account.
4. Each run saves a dated copy of the raw data in `data/raw/` (never edited by the code).

What the report contains: an overview (number of responses, reception timeline, areas converted to ha, share of reef area covered by monitoring), then one section per questionnaire section with a bar chart per closed question (n and %, all options shown for single-choice questions, sorted by frequency for multiple-choice ones), the "Autre (préciser)" texts in collapsible tables, and open answers in searchable tables.

## Step 7 — Publish the report

The report contains organisation names (Q1 and free-text answers). Decide who should see it before choosing:

- **Share privately**: send `docs/index.html` (a single self-contained file) by e-mail or Drive.
- **GitLab Pages, private project**: GitLab can restrict Pages to project members (*Settings → General → Visibility → Pages*). Commit the `r-analysis` folder (raw data is excluded by `.gitignore`) and publish the `docs/` folder.
- **GitHub Pages (public)**: *Settings → Pages → Branch `main` / `/docs`*. Anyone with the link can read it — only for an anonymised version.

---

## Corrections applied to the questionnaire (please carry them over to the Excel)

| Q | Issue in the Excel | What the form does |
|---|---|---|
| 3 | Not applicable to non-AMP organisations, but required; typo "hamonieux"; typed "multiple" although an AMP has one IUCN category | Single choice + option "Non applicable (pas une AMP)"; typo fixed |
| 10 | Text says "plusieurs choix possibles", type was "Choix unique" | Multiple choice; shown only if Q9 = Oui… |
| 11 | "21–30" then "Plus de 31" (31 missing) | "Plus de 30" |
| 12 | Grid | One numeric field per zone; shown only if Q9 = Oui… |
| 14 | Long text for a count | Numeric; shown only if Q13 = Oui… |
| 26, 60 | "Si non, pourquoi ?" marked required for everyone | Shown (and required) only if Q25 / Q57 = Non… |
| 28, 51, 58–59, 61–62, 64–65, 68–80, 84, 90 | Conditional questions marked required for everyone | Shown only when relevant (Q51 if diving; Q69–74 and Q77 if restoration is ongoing; Q75–76 if restoration is in the programme (Q66); Q78–80 if restoration sites are monitored) |
| 36–37, 39–40 | Juvenile/adult indicators asked even if "Aucun suivi" | Hidden when "Aucun suivi" is the only answer |
| 37, 40, 44, 49 | "Plus de 3" without the number | "Plus de 3 (préciser)" opens a field |
| Remarks column | Remarks appear **shifted one row down** (e.g. "Si plus de trois campagnes" is on Q22 but refers to Q21; "Si oui, préciser le nom du logiciel" is on Q54 but refers to Q53) | Attached to the question they refer to: Q21, 35, 38, 41, 47, 53, 72, 73, 85, 87 |
| 45 | Wording ("Préciser le et dites…") | Reworded |
| 51 | Typed multiple, answers are exclusive | Single choice |
| 75–76 | Same question twice, "Forces : …" / "Faiblesses : …" inside options, single choice | Two clear questions (forces / faiblesses), multiple choice |
| 87, 103 | "3 maximum" | Max 3 selections enforced |
| 92–93 | Same text twice | "forces…" / "faiblesses…" |
| All "Autre (préciser)" / "Sous conditions" | — | Opens a text field, required if ticked |
| "Aucun…" / "Ne sait pas" in multiple choice | — | Exclusive: un-ticks the other options |

**Points to check — I did not change these:**

- **Q101 and Q103 overlap** (same criteria list; Q103 just adds "Facilité de formation" and "3 maximum"). Consider keeping only Q103.
- **Q58** — "Basique / Intermédiaire / Avancée" is not self-explanatory; respondents will interpret it differently. Add a short definition of each level or list the actual methods.
- **Q2 vs Q3/Q4/Q6** — several questions assume the respondent manages an AMP/LMMA. NGOs, universities or funders may not. You may want to show Q3–Q4 only for AMP/LMMA/OECM managers (I can add this).
- **Q22, Q74, Q80** — cost bins in Ariary; Q22 includes "Autre (préciser)", which is odd for a numeric range.
- **Q17** lists partner organisations; check the list is complete (e.g. IH.SM is both partner and survey organiser — possible response bias worth mentioning in the methods).
- Nothing identifies the **respondent** (name, role, e-mail). If you may need to contact them to clarify answers, add an optional contact field.

## Known limitations

- Google Apps Script does not return a readable confirmation to a page hosted elsewhere, so the "thank you" page appears once the request has been sent, not once it is confirmed in the Sheet. In practice this is reliable; the notification e-mail and the respondent's downloadable copy are the safety net.
- The draft is saved in the respondent's browser only (not across devices).
- The form does not prevent the same organisation from answering twice; the R import removes exact duplicates of `submission_id` only — check Q1 for duplicates manually.
