"""Build questions.json (single source of truth for web form + R codebook)
from the Excel questionnaire, applying the agreed corrections."""
import json, re, sys, csv
import openpyxl

src, out_json, out_csv = sys.argv[1], sys.argv[2], sys.argv[3]
ws = openpyxl.load_workbook(src)["Questionnaire"]

TYPE_MAP = {
    "réponse courte": "text", "choix unique": "single", "choix multiple": "multi",
    "chhoix multiple": "multi", "réponse numérique": "area", "réponse longue": "textarea",
    "réponse longue (ou grille)": "grid", "réponse numérique / année": "year",
    "échelle de 1 à 5": "scale",
}

def split_opts(s):
    if not s:
        return []
    return [re.sub(r"\s+", " ", o).strip(" :") for o in s.split(";") if o.strip()]

qs, section = [], None
for row in ws.iter_rows(min_row=2, values_only=True):
    sec, n, text, typ, opts, req, _rem = row
    if n is None:
        continue
    if sec:
        section = sec.strip()
    t = TYPE_MAP[typ.strip().lower()]
    q = {"id": f"q{int(n):03d}", "n": int(n), "section": section,
         "text": re.sub(r"\s+", " ", text).strip(), "type": t,
         "required": req.strip() == "Oui", "options": [], "hint": "", "show_if": None}
    if t in ("single", "multi", "scale"):
        q["options"] = split_opts(opts)
    elif opts:
        q["hint"] = re.sub(r"\s+", " ", opts).strip()
    qs.append(q)

Q = {q["n"]: q for q in qs}

# ---------- Corrections (documented in GUIDE.md) ----------
Q[3]["options"] = [o.replace("hamonieux", "harmonieux") for o in Q[3]["options"]]
Q[3]["options"][-1] = "Autre (préciser)"
Q[3]["options"].append("Non applicable (pas une AMP)")
Q[3]["type"] = "single"
Q[10]["type"] = "multi"
Q[10]["text"] = "Si oui, quelles zones sont délimitées dans votre AMP/LMMA ? (plusieurs choix possibles)"
Q[11]["options"][-1] = "Plus de 30"
Q[12]["grid"] = [["noyau", "Noyau dur / no-take"], ["zuc", "ZUC / zone tampon"],
                 ["acces_libre", "Zone d'accès libre"], ["restauration", "Zone de restauration"],
                 ["autre", "Autre"]]
Q[14]["type"] = "number"; Q[14]["hint"] = "Nombre de stations"
Q[45]["text"] = "Utilisez-vous des espèces cibles pour le suivi des macro-invertébrés ? Si oui, lesquelles et pourquoi ce choix ?"
Q[45]["hint"] = "Préciser les espèces et la raison de ce choix"
Q[51]["type"] = "single"
Q[75]["text"] = "Quelles forces identifiez-vous dans votre programme de restauration corallienne ?"
Q[75]["options"] = ["Techniques maîtrisées", "Suivi dédié", "Participation communautaire", "Autre (préciser)"]
Q[75]["type"] = "multi"
Q[76]["text"] = "Quelles faiblesses identifiez-vous dans votre programme de restauration corallienne ?"
Q[76]["options"] = ["Manque de financement", "Manque de suivi", "Faible survie des coraux", "Autre (préciser)"]
Q[76]["type"] = "multi"
Q[87]["max"] = 3
Q[92]["text"] = "Quelles sont les forces de votre modèle de financement ?"
Q[93]["text"] = "Quelles sont les faiblesses de votre modèle de financement ?"
Q[94]["options"][-1] = "Sous conditions (préciser)"
Q[103]["max"] = 3
Q[103]["text"] = "Quels critères sont prioritaires pour un protocole national ? (3 maximum)"
for n in (4, 6, 7):
    Q[n]["hint"] = "Indiquer la valeur et l'unité"

# Remarks column was shifted one row down in the Excel: attach to the right question
extra = {
    21: ("number", "Si plus de trois campagnes, préciser le nombre moyen", False),
    35: ("text", "Si aucune méthode n'est utilisée, préciser pourquoi. Pour une autre méthode, préciser ses dimensions", False),
    38: ("text", "Pour une autre méthode, préciser ses dimensions", False),
    41: ("text", "Pour une autre méthode, préciser", False),
    47: ("text", "Pour une autre méthode, préciser ses dimensions", False),
    53: ("text", "Si oui, préciser le nom du logiciel ou de l'application", False),
    72: ("text", "Autre précision sur la superficie (ha)", False),
    73: ("text", "Préciser la localisation du ou des sites", False),
    85: ("text", "Précisions (facultatif)", False),
    87: ("text", "Précisions (facultatif)", False),
}
for n, (t, label, req) in extra.items():
    Q[n]["detail"] = {"type": t, "label": label}
# "Plus de 3" replicates -> ask for the number
for n in (37, 40, 44, 49):
    Q[n]["options"] = ["2", "3", "Plus de 3 (préciser)"]

# Normalise "Autre" options so they trigger a free-text field
for q in qs:
    q["options"] = [re.sub(r"Autre\s*\(?\s*préciser\s*\)?\s*:?", "Autre (préciser)", o) for o in q["options"]]
    q["options"] = [re.sub(r"Autres paramètres \(préciser\)", "Autres paramètres (préciser)", o) for o in q["options"]]

# ---------- Conditional display ----------
def cond(n, op, *vals):
    return {"q": f"q{n:03d}", "op": op, "values": list(vals)}

starts_oui = lambda n: cond(n, "startswith", "Oui")
starts_non = lambda n: cond(n, "startswith", "Non")
for n in (10, 12): Q[n]["show_if"] = starts_oui(9)
Q[14]["show_if"] = starts_oui(13)
Q[26]["show_if"] = starts_non(25)
Q[26]["text"] = "Si non, pourquoi ?"
Q[28]["show_if"] = starts_oui(27)
for n in (36, 37): Q[n]["show_if"] = cond(35, "not_only", "Aucun suivi des juvéniles")
for n in (39, 40): Q[n]["show_if"] = cond(38, "not_only", "Aucun suivi")
Q[51]["show_if"] = cond(50, "any", "En apnée (snorkeling) ; En plongée sous-marine (bouteille)".split(" ; ")[1], "Les deux à la fois, selon les stations")
for n in (58, 59, 61, 62): Q[n]["show_if"] = starts_oui(57)
Q[60]["show_if"] = starts_non(57)
Q[60]["text"] = "Si non, pourquoi ?"
Q[64]["show_if"] = cond(63, "equals", "Non")
Q[65]["show_if"] = starts_oui(63)
Q[68]["show_if"] = starts_non(67)
for n in range(69, 75): Q[n]["show_if"] = starts_oui(67)
for n in (75, 76): Q[n]["show_if"] = starts_oui(66)
Q[77]["show_if"] = starts_oui(67)
for n in (78, 79, 80): Q[n]["show_if"] = starts_oui(77)
Q[84]["show_if"] = cond(83, "equals", "Oui")
Q[90]["show_if"] = cond(89, "equals", "Oui")

# Section short titles for the stepper
for q in qs:
    letter, title = q["section"].split(".", 1)
    q["section_code"] = letter.strip()
    q["section_title"] = title.strip()

json.dump(qs, open(out_json, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

# ---------- Codebook for R: one row per sheet column ----------
rows = []
for q in qs:
    base = dict(question_n=q["n"], section=q["section"], question=q["text"],
                type=q["type"], options=" | ".join(q["options"]))
    if q["type"] == "area":
        rows += [dict(base, column=f"{q['id']}_valeur", role="value"),
                 dict(base, column=f"{q['id']}_unite", role="unit")]
    elif q["type"] == "grid":
        rows += [dict(base, column=f"{q['id']}_{k}", role=f"grid:{lab}") for k, lab in q["grid"]]
    else:
        rows.append(dict(base, column=q["id"], role="answer"))
    if any("préciser" in o.lower() for o in q["options"]):
        rows.append(dict(base, column=f"{q['id']}_preciser", role="specify"))
    if q.get("detail"):
        rows.append(dict(base, column=f"{q['id']}_detail", role="detail"))
with open(out_csv, "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=["column", "question_n", "section", "question", "type", "role", "options"])
    w.writeheader(); w.writerows(rows)
print(len(qs), "questions,", len(rows), "columns")
