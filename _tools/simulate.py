"""Simulated responses (for testing the R pipeline only — NOT real data)."""
import json, random, csv, sys, datetime
random.seed(42)
qs = json.load(open(sys.argv[1])); Q = {q["id"]: q for q in qs}
orgs = ["Org. %s" % c for c in "ABCDEFGHIJKLMNOPQRSTUVWXY"]
rows = []
def visible(q, ans):
    c = q["show_if"]
    if not c: return True
    if not visible(Q[c["q"]], ans): return False
    v = ans.get(c["q"]); arr = v if isinstance(v, list) else ([v] if v else [])
    if c["op"] == "startswith": return any(x.startswith(p) for x in arr for p in c["values"])
    if c["op"] in ("equals", "any"): return any(x in c["values"] for x in arr)
    if c["op"] == "not_only": return not (len(arr) == 1 and arr[0] in c["values"])
for i, org in enumerate(orgs):
    ans, row = {}, {}
    d = datetime.datetime(2026, 11, 3) + datetime.timedelta(days=random.randint(0, 40), hours=random.randint(0, 23))
    row.update(received_at=d.isoformat(sep=" "), submission_id=f"SIM-{i+1:03d}", submitted_at_client=d.isoformat(), survey_version="recifs-v1")
    for q in qs:
        vis = visible(q, ans); id_ = q["id"]; t = q["type"]
        opts = q["options"]
        if t in ("single", "scale"):
            w = [len(opts) - k for k in range(len(opts))]
            v = random.choices(opts, weights=w)[0] if vis else ""
            ans[id_] = v; row[id_] = v
        elif t == "multi":
            v = []
            if vis:
                pool = [o for o in opts if not o.startswith(("Aucun", "Ne sait"))] or opts
                k = min(q.get("max", 99), random.randint(1, min(4, len(pool))))
                v = random.sample(pool, k)
            ans[id_] = v; row[id_] = "; ".join(v)
        elif t == "area":
            u = random.choice(["ha", "ha", "km2"])
            val = round(random.lognormvariate(5, 1.2) / (100 if u == "km2" else 1), 2)
            row[id_ + "_valeur"] = val if vis else ""; row[id_ + "_unite"] = u if vis else ""
        elif t == "grid":
            for k, _ in q["grid"]: row[f"{id_}_{k}"] = random.choice(["", 0, 1, 2, 3, 5]) if vis else ""
        elif t == "number": row[id_] = random.randint(1, 8) if vis else ""
        elif t == "year": row[id_] = random.randint(2008, 2025) if vis else ""
        elif t == "text": row[id_] = org if id_ == "q001" else ("Texte simulé" if vis else "")
        else: row[id_] = "Réponse libre simulée." if vis and random.random() < .8 else ""
        if any("préciser" in o.lower() for o in opts):
            sel = ans.get(id_); sel = sel if isinstance(sel, list) else [sel]
            row[id_ + "_preciser"] = "Précision simulée" if any(s and "préciser" in s.lower() for s in sel) else ""
        if q.get("detail"): row[id_ + "_detail"] = ""
    rows.append(row)
cols = list(rows[0].keys())
with open(sys.argv[2], "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=cols); w.writeheader(); w.writerows(rows)
print(len(rows), "rows", len(cols), "cols")
