/* =====================================================================
   CONFIGURATION DE L'ENQUÊTE « RÉCIFS CORALLIENS » — fichier unique à modifier
   ---------------------------------------------------------------------
   • META      : titre, textes d'accueil, contact, logos, photos, URL Apps Script
   • PHOTOS    : photos du bandeau, de l'accueil et des sections (avec crédits)
   • STEPS     : étapes du formulaire (sections A à L) et questions
   Les identifiants (id) deviennent les noms de colonnes dans Google
   Sheets et les noms de variables dans R : ne pas les modifier une fois
   la collecte lancée.

   Types : text, email, tel, textarea, number, year, radio, checkbox,
           scale (1–5), grid (plusieurs nombres), rank, file, datetime
   Options :
     other: true      → ajoute un champ texte quand « Autre » ou « (préciser) » est coché (id_autre)
     explain: '...'   → ajoute un champ « Pourquoi ? » (id_pourquoi)
     detail: {label, type} → champ complémentaire facultatif (id_detail)
     units: ['ha','km²'] → nombre + unité (id + id_unite)
     max: n           → nombre maximal de cases à cocher
     showIf           → { q:'q09', starts:'Oui' } | { q:'q83', eq:'Oui' } |
                        { q:'q50', any:[...] } | { q:'q35', notOnly:'Aucun suivi' } |
                        { q:'q14', ne:'Non' } | { q:'q19', in:[...] }
     Les options « Aucun… » et « Ne sait pas » d'un choix multiple sont exclusives.
   ===================================================================== */

const SURVEY = {
  META: {
  "version": "1.0",
  "title": "Enquête nationale sur le suivi écologique et la restauration des récifs coralliens à Madagascar",
  "subtitle": "Inventaire des méthodes, des moyens et des besoins des organisations, en vue d'un protocole national harmonisé",
  "organizer": "Fondation pour les Aires Protégées et la Biodiversité de Madagascar (FAPBM), en collaboration avec l’Institut Halieutique et des Sciences Marines (IH.SM) – Université de Toliara",
  "contactName": "José Randrianandrasana",
  "contactEmail": "jossarobidy@gmail.com",
  "deadline": "15 Novembre",
  "estimatedTime": "30 à 45 min",
  "appsScriptUrl": "https://script.google.com/macros/s/AKfycbxDKEPLKRuq5gGCRa-DEYExU09CilJHYr8TuKBAGoaGyQON2HI9WxCSxBmNiGmbf9cN/exec",
  "logos": [
    {
      "src": "assets/img/logos/ihsm.png",
      "alt": "IH.SM — Université de Toliara",
      "url": "https://ihsm.mg/"
    },
    {
      "src": "assets/img/logos/fapbm.png",
      "alt": "FAPBM",
      "url": "https://www.fapbm.org/en/home/"
    }
  ],
  "intro": [
    "Cette enquête vise à dresser un état des lieux des pratiques de suivi écologique et de restauration des récifs coralliens à Madagascar : méthodes et protocoles utilisés, moyens humains et financiers, contraintes rencontrées et besoins.",
    "Elle s'adresse aux gestionnaires d'AMP/LMMA, ONG, associations, institutions publiques, instituts de recherche et partenaires impliqués dans le suivi ou la restauration des récifs coralliens.",
    "Une seule réponse par organisation."
  ],
  "draftNote": "Vos réponses sont enregistrées automatiquement sur cet appareil : vous pouvez interrompre la saisie et la reprendre plus tard depuis le même navigateur.",
  "privacy": "Les informations recueillies servent uniquement à cette étude. Les résultats seront présentés de manière agrégée.",
  "consentLabel": "J'accepte que les informations fournies soient utilisées dans le cadre de cette étude, selon les conditions décrites ci-dessus.",
  "heroPhoto": "recif-empereurs",
  "introPhotos": [
    "recif-acropora",
    "recif-poissons-clowns",
    "recif-benitier"
  ],
  "thanksPhoto": "recif-perroquet",
  "photoCreditNote": "Photographies : Diego Delso (delso.photo), Wikimedia Commons, licence CC BY-SA 4.0 — récifs du nord-ouest de Madagascar, septembre 2025."
},

  PHOTOS: [
  {
    "key": "recif-acropora",
    "src": "assets/img/photos/recif-acropora.jpg",
    "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Coral_%28Acropora_clathrata%29%2C_Nosy_Iranja%2C_Madagascar%2C_2025-09-17%2C_DD_53.jpg/1280px-Coral_%28Acropora_clathrata%29%2C_Nosy_Iranja%2C_Madagascar%2C_2025-09-17%2C_DD_53.jpg",
    "caption": "",
    "credit": "Diego Delso",
    "license": "CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:Coral_%28Acropora_clathrata%29%2C_Nosy_Iranja%2C_Madagascar%2C_2025-09-17%2C_DD_53.jpg"
  },
  {
    "key": "recif-damoiselles",
    "src": "assets/img/photos/recif-damoiselles.jpg",
    "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Damisela_de_tres_bandas_%28Dascyllus_abudafur%29_en_un_coral_%28Acropora_hemprichii%29%2C_Nosy_Tanikely%2C_Madagascar%2C_2025-09-20%2C_DD_51.jpg/1280px-Damisela_de_tres_bandas_%28Dascyllus_abudafur%29_en_un_coral_%28Acropora_hemprichii%29%2C_Nosy_Tanikely%2C_Madagascar%2C_2025-09-20%2C_DD_51.jpg",
    "caption": "",
    "credit": "Diego Delso",
    "license": "CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:Damisela_de_tres_bandas_%28Dascyllus_abudafur%29_en_un_coral_%28Acropora_hemprichii%29%2C_Nosy_Tanikely%2C_Madagascar%2C_2025-09-20%2C_DD_51.jpg"
  },
  {
    "key": "recif-poissons-clowns",
    "src": "assets/img/photos/recif-poissons-clowns.jpg",
    "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Peces_payaso_de_Madagascar_%28Amphiprion_latifasciatus%29_en_una_an%C3%A9mona_perla_de_cristal_%28Heteractis_aurora%29%2C_Ambalihabe%2C_Madagascar%2C_2025-09-16%2C_DD_117.jpg/1280px-Peces_payaso_de_Madagascar_%28Amphiprion_latifasciatus%29_en_una_an%C3%A9mona_perla_de_cristal_%28Heteractis_aurora%29%2C_Ambalihabe%2C_Madagascar%2C_2025-09-16%2C_DD_117.jpg",
    "caption": "",
    "credit": "Diego Delso",
    "license": "CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:Peces_payaso_de_Madagascar_%28Amphiprion_latifasciatus%29_en_una_an%C3%A9mona_perla_de_cristal_%28Heteractis_aurora%29%2C_Ambalihabe%2C_Madagascar%2C_2025-09-16%2C_DD_117.jpg"
  },
  {
    "key": "recif-benitier",
    "src": "assets/img/photos/recif-benitier.jpg",
    "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Almeja_gigante_%28Tridacna_maxima%29%2C_Nosy_Antanimora%2C_Madagascar%2C_2025-09-15%2C_DD_144.jpg/1280px-Almeja_gigante_%28Tridacna_maxima%29%2C_Nosy_Antanimora%2C_Madagascar%2C_2025-09-15%2C_DD_144.jpg",
    "caption": "",
    "credit": "Diego Delso",
    "license": "CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:Almeja_gigante_%28Tridacna_maxima%29%2C_Nosy_Antanimora%2C_Madagascar%2C_2025-09-15%2C_DD_144.jpg"
  },
  {
    "key": "recif-fusiliers",
    "src": "assets/img/photos/recif-fusiliers.jpg",
    "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Fusilero_%28Caesio_varilineata%29%2C_Nosy_Antanimora%2C_Madagascar%2C_2025-09-15%2C_DD_150.jpg/1280px-Fusilero_%28Caesio_varilineata%29%2C_Nosy_Antanimora%2C_Madagascar%2C_2025-09-15%2C_DD_150.jpg",
    "caption": "",
    "credit": "Diego Delso",
    "license": "CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:Fusilero_%28Caesio_varilineata%29%2C_Nosy_Antanimora%2C_Madagascar%2C_2025-09-15%2C_DD_150.jpg"
  },
  {
    "key": "recif-acropora-2",
    "src": "assets/img/photos/recif-acropora-2.jpg",
    "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Coral_%28Acropora_gemmifera%29%2C_Nosy_Tanikely%2C_Madagascar%2C_2025-09-20%2C_DD_49.jpg/1280px-Coral_%28Acropora_gemmifera%29%2C_Nosy_Tanikely%2C_Madagascar%2C_2025-09-20%2C_DD_49.jpg",
    "caption": "",
    "credit": "Diego Delso",
    "license": "CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:Coral_%28Acropora_gemmifera%29%2C_Nosy_Tanikely%2C_Madagascar%2C_2025-09-20%2C_DD_49.jpg"
  },
  {
    "key": "recif-perroquet",
    "src": "assets/img/photos/recif-perroquet.jpg",
    "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Pez_loro_manchado_%28Cetoscarus_ocellatus%29%2C_Nosy_Antanimora%2C_Madagascar%2C_2025-09-15%2C_DD_105.jpg/1280px-Pez_loro_manchado_%28Cetoscarus_ocellatus%29%2C_Nosy_Antanimora%2C_Madagascar%2C_2025-09-15%2C_DD_105.jpg",
    "caption": "",
    "credit": "Diego Delso",
    "license": "CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:Pez_loro_manchado_%28Cetoscarus_ocellatus%29%2C_Nosy_Antanimora%2C_Madagascar%2C_2025-09-15%2C_DD_105.jpg"
  },
  {
    "key": "recif-empereurs",
    "src": "assets/img/photos/recif-empereurs.jpg",
    "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Grupo_de_peces_emperador_estriados_%28Gnathodentex_aureolineatus%29%2C_Nosy_Kalakajoro%2C_Madagascar%2C_2025-09-14%2C_DD_03.jpg/1280px-Grupo_de_peces_emperador_estriados_%28Gnathodentex_aureolineatus%29%2C_Nosy_Kalakajoro%2C_Madagascar%2C_2025-09-14%2C_DD_03.jpg",
    "caption": "",
    "credit": "Diego Delso",
    "license": "CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:Grupo_de_peces_emperador_estriados_%28Gnathodentex_aureolineatus%29%2C_Nosy_Kalakajoro%2C_Madagascar%2C_2025-09-14%2C_DD_03.jpg"
  },
  {
    "key": "recif-etoile",
    "src": "assets/img/photos/recif-etoile.jpg",
    "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Estrella_de_mar_azul_%28Linckia_laevigata%29%2C_Nosy_Iranja%2C_Madagascar%2C_2025-09-17%2C_DD_29.jpg/1280px-Estrella_de_mar_azul_%28Linckia_laevigata%29%2C_Nosy_Iranja%2C_Madagascar%2C_2025-09-17%2C_DD_29.jpg",
    "caption": "",
    "credit": "Diego Delso",
    "license": "CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:Estrella_de_mar_azul_%28Linckia_laevigata%29%2C_Nosy_Iranja%2C_Madagascar%2C_2025-09-17%2C_DD_29.jpg"
  }
],

  STEPS: [
  {
    "key": "A",
    "title": "Profil et caractéristiques de l'organisation et de leur suivi écologique",
    "short": "Profil de l'organisation",
    "questions": [
      {
        "id": "q001",
        "n": 1,
        "label": "Nom de l'organisation",
        "type": "text",
        "required": true
      },
      {
        "id": "q002",
        "n": 2,
        "label": "Type d’organisation",
        "type": "radio",
        "required": true,
        "options": [
          "AMP",
          "LMMA",
          "ONG",
          "OECM",
          "Association locale",
          "Institution publique",
          "Institut de recherche",
          "Université",
          "Secteur privé",
          "Partenaire technique/financier",
          "Autre"
        ],
        "other": true
      },
      {
        "id": "q003",
        "n": 3,
        "label": "Quelle catégorie UICN s'applique à votre AMP ?",
        "type": "radio",
        "required": true,
        "options": [
          "I-Réserves naturelles intégrales",
          "II-Parcs nationaux",
          "III-Monuments naturels",
          "IV-Réserves spéciales",
          "V-Paysages harmonieux protégés",
          "VI-Réserves de ressources naturelles",
          "Autre",
          "Non applicable (pas une AMP)"
        ],
        "other": true
      },
      {
        "id": "q004",
        "n": 4,
        "label": "Quelle est la superficie totale de l'AMP/LMMA dont votre organisation assure la gestion ou le contrôle ?",
        "type": "number",
        "required": true,
        "units": [
          "ha",
          "km²"
        ],
        "min": 0
      },
      {
        "id": "q005",
        "n": 5,
        "label": "Quels types de récifs coralliens votre organisation assure-t-elle de suivre ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Récif frangeant",
          "Récif barrière",
          "Îlot récifal",
          "Récif atoll",
          "Autre"
        ],
        "other": true
      },
      {
        "id": "q006",
        "n": 6,
        "label": "Quelle est la superficie récifale incluse dans cette AMP/LMMA ?",
        "type": "number",
        "required": true,
        "units": [
          "ha",
          "km²"
        ],
        "min": 0
      },
      {
        "id": "q007",
        "n": 7,
        "label": "Quelle est la superficie de récifs coralliens effectivement couverte par votre suivi écologique ?",
        "type": "number",
        "required": true,
        "units": [
          "ha",
          "km²"
        ],
        "min": 0
      },
      {
        "id": "q008",
        "n": 8,
        "label": "Sur quelle partie du récif le suivi écologique est-il réalisé ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Pente externe",
          "Platier",
          "Pente interne",
          "Autre"
        ],
        "other": true
      },
      {
        "id": "q009",
        "n": 9,
        "label": "Votre AMP/LMMA dispose-t-elle d'un zonage officiellement défini et documenté (plan de zonage) ?",
        "type": "radio",
        "required": true,
        "options": [
          "Oui, validé et cartographié",
          "Oui, mais non cartographié",
          "Non",
          "En cours d'élaboration",
          "Ne sait pas"
        ]
      },
      {
        "id": "q010",
        "n": 10,
        "label": "Si oui, quelles zones sont délimitées dans votre AMP/LMMA ? (plusieurs choix possibles)",
        "type": "checkbox",
        "required": true,
        "options": [
          "Noyau dur / Zone de non-prélèvement (no-take)",
          "Zone d'usage contrôlé (ZUC) / zone tampon",
          "Zone d'accès libre / zone d'usage multiple",
          "Zone de restauration corallienne",
          "Zone de pêche réglementée (ZPR)",
          "Autre"
        ],
        "other": true,
        "showIf": {
          "q": "q009",
          "starts": "Oui"
        }
      },
      {
        "id": "q011",
        "n": 11,
        "label": "Combien de stations de suivi écologique votre organisation utilise-t-elle au total (toutes zones confondues) ?",
        "type": "radio",
        "required": true,
        "options": [
          "1",
          "2–5",
          "6–10",
          "11–20",
          "21-30",
          "Plus de 30"
        ]
      },
      {
        "id": "q012",
        "n": 12,
        "label": "Comment ces stations sont-elles réparties selon le zonage ? (préciser le nombre par zone)",
        "type": "grid",
        "required": true,
        "rows": [
          {
            "key": "noyau",
            "label": "Noyau dur / no-take"
          },
          {
            "key": "zuc",
            "label": "ZUC / zone tampon"
          },
          {
            "key": "acces_libre",
            "label": "Zone d'accès libre"
          },
          {
            "key": "restauration",
            "label": "Zone de restauration"
          },
          {
            "key": "autre",
            "label": "Autre"
          }
        ],
        "unit": "stations",
        "help": "Noyau dur / no-take : ___ stations ; ZUC / zone tampon : ___ stations ; Zone d'accès libre : ___ stations ; Zone de restauration : ___ stations ; Autre : ___ stations",
        "showIf": {
          "q": "q009",
          "starts": "Oui"
        }
      },
      {
        "id": "q013",
        "n": 13,
        "label": "Réalisez-vous un suivi dans une ou plusieurs zones d'accès libre (hors AMP/LMMA) à des fins de comparaison ?",
        "type": "radio",
        "required": true,
        "options": [
          "Oui, systématiquement",
          "Oui, occasionnellement",
          "Non",
          "Ne sait pas"
        ]
      },
      {
        "id": "q014",
        "n": 14,
        "label": "Si oui, combien de stations de comparaison (accès libre) sont suivies ?",
        "type": "number",
        "required": false,
        "min": 0,
        "help": "Nombre de stations",
        "showIf": {
          "q": "q013",
          "starts": "Oui"
        }
      },
      {
        "id": "q015",
        "n": 15,
        "label": "Si la superficie est connue pour chaque site, quelle est la superficie de chaque site récifal suivi ?",
        "type": "textarea",
        "required": false,
        "help": "Préciser le nom du site et sa superficie en ha ou km2"
      },
      {
        "id": "q016",
        "n": 16,
        "label": "Combien de membres du personnel sont impliqués dans le suivi écologique ?",
        "type": "radio",
        "required": true,
        "options": [
          "0",
          "1–3",
          "4–10",
          "Plus de 10"
        ]
      },
      {
        "id": "q017",
        "n": 17,
        "label": "Quels partenaires techniques sont impliqués dans le suivi écologique ?",
        "type": "checkbox",
        "required": false,
        "options": [
          "IH.SM",
          "CNRO",
          "WWF",
          "WCS",
          "CI",
          "Blue Ventures",
          "MNP",
          "Ocean Farmers",
          "MIHARI",
          "Autre"
        ],
        "other": true
      },
      {
        "id": "q018",
        "n": 18,
        "label": "Quels partenaires financiers contribuent au suivi écologique ?",
        "type": "textarea",
        "required": false
      },
      {
        "id": "q019",
        "n": 19,
        "label": "Depuis combien d’années votre organisation réalise-t-elle un suivi écologique des récifs coralliens ?",
        "type": "radio",
        "required": true,
        "options": [
          "Moins d’un an",
          "1–3 ans",
          "4–5 ans",
          "6–10 ans",
          "Plus de 10 ans"
        ]
      },
      {
        "id": "q020",
        "n": 20,
        "label": "À quelle période votre organisation réalise-t-elle les campagnes de suivi écologique des récifs coralliens ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "À la même période chaque année",
          "À des dates variables selon les années",
          "De manière ponctuelle, selon les besoins ou les moyens disponibles",
          "Autre"
        ],
        "other": true
      },
      {
        "id": "q021",
        "n": 21,
        "label": "Combien de campagnes de suivi écologique votre organisation réalise-t-elle généralement par an ?",
        "type": "radio",
        "required": true,
        "options": [
          "Une",
          "Deux",
          "Trois",
          "Plus de trois",
          "Le nombre varie d’une année à l’autre"
        ],
        "detail": {
          "label": "Si plus de trois campagnes, préciser le nombre moyen",
          "type": "number"
        }
      },
      {
        "id": "q022",
        "n": 22,
        "label": "Quel est le coût total estimé d’une campagne de suivi écologique des récifs coralliens ?",
        "type": "radio",
        "required": false,
        "options": [
          "Moins de 5 millions d’Ariary",
          "De 5 à moins de 10 millions d’Ariary",
          "De 10 à moins de 15 millions d’Ariary",
          "De 15 à moins de 20 millions d’Ariary",
          "De 20 à moins de 30 millions d’Ariary",
          "30 millions d’Ariary ou plus",
          "Ne sait pas / coût non estimé",
          "Autre"
        ],
        "other": true
      }
    ]
  },
  {
    "key": "B",
    "title": "Objectifs du suivi écologique et intervenants sur le terrain",
    "short": "Objectifs et intervenants",
    "questions": [
      {
        "id": "q023",
        "n": 23,
        "label": "Quels sont les principaux objectifs de votre suivi écologique ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Évaluation de l’état de santé des récifs",
          "Suivi de la biodiversité",
          "Suivi des impacts des activités humaines",
          "Suivi de la pêche",
          "Suivi de la restauration corallienne",
          "Sensibilisation / éducation",
          "Recherche scientifique",
          "Obligation réglementaire",
          "Autre"
        ],
        "other": true
      },
      {
        "id": "q024",
        "n": 24,
        "label": "Qui réalise le suivi écologique ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Équipe interne",
          "Communautés locales",
          "Chercheurs externes",
          "Bénévoles",
          "Partenaires",
          "Équipe mixte"
        ]
      },
      {
        "id": "q025",
        "n": 25,
        "label": "Votre organisation implique-t-elle ou a-t-elle déjà impliqué les communautés locales dans les activités de suivi écologique des récifs coralliens ?",
        "type": "radio",
        "required": true,
        "options": [
          "Oui, régulièrement",
          "Oui, occasionnellement",
          "Oui, par le passé, mais plus actuellement",
          "Non, mais cela est envisagé",
          "Non"
        ]
      },
      {
        "id": "q026",
        "n": 26,
        "label": "Si non, pourquoi ?",
        "type": "textarea",
        "required": true,
        "showIf": {
          "q": "q025",
          "starts": "Non"
        }
      },
      {
        "id": "q027",
        "n": 27,
        "label": "Votre organisation assure-t-elle la formation des communautés locales au suivi écologique des récifs coralliens ?",
        "type": "radio",
        "required": true,
        "options": [
          "Oui, régulièrement",
          "Oui, occasionnellement",
          "Non, mais cela est prévu",
          "Non"
        ]
      },
      {
        "id": "q028",
        "n": 28,
        "label": "Si oui, quels types de formations sont dispensés aux communautés locales ?",
        "type": "checkbox",
        "required": false,
        "options": [
          "Identification des espèces marines",
          "Utilisation des méthodes et outils de suivi écologique",
          "Collecte et enregistrement des données",
          "Reconnaissance des changements de l’état de santé des récifs",
          "Autre"
        ],
        "other": true,
        "showIf": {
          "q": "q027",
          "starts": "Oui"
        }
      }
    ]
  },
  {
    "key": "C",
    "title": "Inventaire des méthodes et outils de suivi utilisés",
    "short": "Méthodes et outils",
    "questions": [
      {
        "id": "q029",
        "n": 29,
        "label": "Votre organisation dispose-t-elle d’un protocole écrit pour le suivi écologique ?",
        "type": "radio",
        "required": true,
        "options": [
          "Oui, standardisé",
          "Oui, informel",
          "Non",
          "En cours d’élaboration"
        ]
      },
      {
        "id": "q030",
        "n": 30,
        "label": "Quel protocole votre organisation utilise-t-elle pour la gestion et le suivi des récifs coralliens ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "GCRMN",
          "Reef Check",
          "AGRRA",
          "Manuel de suivi des récifs coralliens des îles du sud-ouest de l’océan Indien",
          "CoralWatch",
          "SocMon",
          "Autre"
        ],
        "other": true
      },
      {
        "id": "q031",
        "n": 31,
        "label": "Quelles méthodes de suivi des récifs coralliens votre organisation utilise-t-elle actuellement ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Transects linéaires (LIT)",
          "Transects en ceinture",
          "Quadrats",
          "Points intercepts (LIT / Point Intercept)",
          "Photo-quadrats",
          "Vidéo sous-marine",
          "Drone",
          "Télédétection",
          "Suivi visuel en apnée",
          "Suivi en plongée",
          "Méthodes participatives communautaires",
          "ADN environnemental (ADNe)",
          "Acoustique sous-marine et hydrophones",
          "Photogrammétrie 3D",
          "Autre"
        ],
        "other": true
      },
      {
        "id": "q032",
        "n": 32,
        "label": "Quels indicateurs écologiques suivez-vous ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Couverture corallienne (%)",
          "Diversité corallienne",
          "Recrutement corallien",
          "Mortalité corallienne",
          "Blanchissement",
          "Maladies coralliennes",
          "Abondance des poissons",
          "Biomasse des poissons",
          "Diversité des poissons",
          "Espèces clés (herbivores, prédateurs)",
          "Invertébrés (oursins, holothuries)",
          "Algues",
          "Paramètres physico-chimiques (température, salinité, turbidité)",
          "Autre"
        ],
        "other": true
      },
      {
        "id": "q033",
        "n": 33,
        "label": "Quels groupes de coraux sont suivis dans le cadre des indicateurs benthiques ?",
        "type": "radio",
        "required": true,
        "options": [
          "Coraux juvéniles (< 5 cm)",
          "Coraux adultes",
          "Les deux"
        ]
      },
      {
        "id": "q034",
        "n": 34,
        "label": "Quel niveau d’identification utilisez-vous pour les coraux ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Morphologique (tabulaire, digité, etc.)",
          "Famille",
          "Genre",
          "Espèce"
        ]
      },
      {
        "id": "q035",
        "n": 35,
        "label": "Quelle méthode utilisez-vous pour suivre les coraux juvéniles ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Quadrat",
          "Transect",
          "Autre",
          "Aucun suivi des juvéniles"
        ],
        "other": true,
        "detail": {
          "label": "Si aucune méthode n'est utilisée, préciser pourquoi. Pour une autre méthode, préciser ses dimensions",
          "type": "text"
        }
      },
      {
        "id": "q036",
        "n": 36,
        "label": "Quel indicateur utilisez-vous pour le suivi des coraux juvéniles ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Densité",
          "Taux de couverture",
          "Autre"
        ],
        "other": true,
        "showIf": {
          "q": "q035",
          "notOnly": "Aucun suivi des juvéniles"
        }
      },
      {
        "id": "q037",
        "n": 37,
        "label": "Combien de réplicats réalisez-vous pour le suivi des coraux juvéniles ?",
        "type": "radio",
        "required": true,
        "options": [
          "2",
          "3",
          "Plus de 3 (préciser)"
        ],
        "other": true,
        "showIf": {
          "q": "q035",
          "notOnly": "Aucun suivi des juvéniles"
        }
      },
      {
        "id": "q038",
        "n": 38,
        "label": "Quelle méthode utilisez-vous pour le suivi des coraux adultes ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Quadrat",
          "Transect",
          "Autre",
          "Aucun suivi"
        ],
        "other": true,
        "detail": {
          "label": "Pour une autre méthode, préciser ses dimensions",
          "type": "text"
        }
      },
      {
        "id": "q039",
        "n": 39,
        "label": "Quel indicateur utilisez-vous pour le suivi des coraux adultes ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Densité",
          "Taux de couverture",
          "Autre"
        ],
        "other": true,
        "showIf": {
          "q": "q038",
          "notOnly": "Aucun suivi"
        }
      },
      {
        "id": "q040",
        "n": 40,
        "label": "Combien de réplicats réalisez-vous pour le suivi des coraux adultes ?",
        "type": "radio",
        "required": true,
        "options": [
          "2",
          "3",
          "Plus de 3 (préciser)"
        ],
        "other": true,
        "showIf": {
          "q": "q038",
          "notOnly": "Aucun suivi"
        }
      },
      {
        "id": "q041",
        "n": 41,
        "label": "Quelle méthode utilisez-vous pour le suivi des poissons ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Transect couloir",
          "Transect de 50 m × 5 m",
          "Comptage circulaire",
          "Autre"
        ],
        "other": true,
        "detail": {
          "label": "Pour une autre méthode, préciser",
          "type": "text"
        }
      },
      {
        "id": "q042",
        "n": 42,
        "label": "Quel niveau d’identification utilisez-vous pour les poissons ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Nom vernaculaire",
          "Famille",
          "Genre",
          "Espèce"
        ]
      },
      {
        "id": "q043",
        "n": 43,
        "label": "Quels paramètres utilisez-vous pour caractériser les populations de poissons ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Abondance",
          "Richesse spécifique (nombre d’espèces)",
          "Classe de taille des individus",
          "Taille individuelle estimée ou mesurée",
          "Biomasse des poissons",
          "Composition spécifique",
          "Densité des poissons",
          "Groupes trophiques (herbivores, carnivores, prédateurs, etc.)",
          "Présence ou absence d’espèces indicatrices",
          "Stade de développement (juvéniles, adultes)",
          "Autre",
          "Aucun de ces paramètres"
        ],
        "other": true
      },
      {
        "id": "q044",
        "n": 44,
        "label": "Combien de réplicats réalisez-vous lors du suivi des poissons ?",
        "type": "radio",
        "required": true,
        "options": [
          "2",
          "3",
          "Plus de 3 (préciser)"
        ],
        "other": true
      },
      {
        "id": "q045",
        "n": 45,
        "label": "Utilisez-vous des espèces cibles pour le suivi des macro-invertébrés ? Si oui, lesquelles et pourquoi ce choix ?",
        "type": "textarea",
        "required": true,
        "help": "Préciser les espèces et la raison de ce choix"
      },
      {
        "id": "q046",
        "n": 46,
        "label": "Quel niveau d’identification utilisez-vous pour les macro-invertébrés ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Nom vernaculaire",
          "Genre",
          "Espèce",
          "Autre"
        ],
        "other": true
      },
      {
        "id": "q047",
        "n": 47,
        "label": "Quelle méthode utilisez-vous pour le suivi des macro-invertébrés ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Quadrat de 1 m²",
          "Quadrat circulaire",
          "Transect en ceinture",
          "Autre"
        ],
        "other": true,
        "detail": {
          "label": "Pour une autre méthode, préciser ses dimensions",
          "type": "text"
        }
      },
      {
        "id": "q048",
        "n": 48,
        "label": "Quel indicateur utilisez-vous pour le suivi des macro-invertébrés ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Densité",
          "Taux de couverture",
          "Autre"
        ],
        "other": true
      },
      {
        "id": "q049",
        "n": 49,
        "label": "Combien de réplicats réalisez-vous pour le suivi des macro-invertébrés ?",
        "type": "radio",
        "required": true,
        "options": [
          "2",
          "3",
          "Plus de 3 (préciser)"
        ],
        "other": true
      },
      {
        "id": "q050",
        "n": 50,
        "label": "Comment votre organisation réalise-t-elle les observations sous-marines lors du suivi écologique ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "En apnée (snorkeling)",
          "En plongée sous-marine (bouteille)",
          "Les deux à la fois, selon les stations",
          "Autre"
        ],
        "other": true
      },
      {
        "id": "q051",
        "n": 51,
        "label": "Si vous utilisez la plongée sous-marine, vos plongeurs sont-ils certifiés (PADI ou équivalent) ?",
        "type": "radio",
        "required": true,
        "options": [
          "Oui, tous certifiés",
          "Oui, partiellement",
          "Non",
          "Ne sait pas"
        ],
        "showIf": {
          "q": "q050",
          "any": [
            "En plongée sous-marine (bouteille)",
            "Les deux à la fois, selon les stations"
          ]
        }
      },
      {
        "id": "q052",
        "n": 52,
        "label": "Quels matériels utilisez-vous pour le suivi écologique ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Masque / tuba / palmes",
          "Bouteilles de plongée",
          "GPS",
          "Caméra photo",
          "Caméra vidéo",
          "Quadrat en PVC",
          "Transect ruban",
          "Tablette étanche",
          "Logiciel de saisie (ex. CoralNet, Reef Check)",
          "Autre"
        ],
        "other": true
      },
      {
        "id": "q053",
        "n": 53,
        "label": "Utilisez-vous un logiciel de traitement ou une application pour la collecte ou l’analyse des données ?",
        "type": "radio",
        "required": true,
        "options": [
          "Oui",
          "Non",
          "Ne sait pas"
        ],
        "detail": {
          "label": "Si oui, préciser le nom du logiciel ou de l'application",
          "type": "text"
        }
      },
      {
        "id": "q054",
        "n": 54,
        "label": "Vos données sont-elles stockées dans une base de données ?",
        "type": "radio",
        "required": true,
        "options": [
          "Oui, en local",
          "Oui, en ligne",
          "Oui, les deux",
          "Non",
          "Ne sait pas"
        ]
      },
      {
        "id": "q055",
        "n": 55,
        "label": "Partagez-vous vos données avec d’autres organisations ?",
        "type": "radio",
        "required": true,
        "options": [
          "Oui, régulièrement",
          "Oui, occasionnellement",
          "Non",
          "Ne sait pas"
        ]
      },
      {
        "id": "q056",
        "n": 56,
        "label": "Seriez-vous prêt à utiliser une base de données nationale commune ?",
        "type": "radio",
        "required": true,
        "options": [
          "Oui",
          "Non",
          "Peut-être",
          "Sous conditions (préciser)"
        ],
        "other": true
      }
    ]
  },
  {
    "key": "D",
    "title": "Suivi de l’état de blanchissement des coraux",
    "short": "Blanchissement",
    "questions": [
      {
        "id": "q057",
        "n": 57,
        "label": "Votre organisation réalise-t-elle un suivi du blanchissement des coraux ?",
        "type": "radio",
        "required": true,
        "options": [
          "Oui, régulièrement",
          "Oui, occasionnellement",
          "Non, mais cela est prévu",
          "Non"
        ]
      },
      {
        "id": "q058",
        "n": 58,
        "label": "Si oui, quelle méthode utilisez-vous pour évaluer le blanchissement ?",
        "type": "radio",
        "required": true,
        "options": [
          "Basique",
          "Intermédiaire",
          "Avancée"
        ],
        "showIf": {
          "q": "q057",
          "starts": "Oui"
        }
      },
      {
        "id": "q059",
        "n": 59,
        "label": "Si oui, depuis combien d’années ce suivi est-il réalisé ?",
        "type": "radio",
        "required": true,
        "options": [
          "Moins d’un an",
          "1–3 ans",
          "4–5 ans",
          "6–10 ans",
          "Plus de 10 ans"
        ],
        "showIf": {
          "q": "q057",
          "starts": "Oui"
        }
      },
      {
        "id": "q060",
        "n": 60,
        "label": "Si non, pourquoi ?",
        "type": "textarea",
        "required": true,
        "showIf": {
          "q": "q057",
          "starts": "Non"
        }
      },
      {
        "id": "q061",
        "n": 61,
        "label": "Quels paramètres sont relevés lors du suivi ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Présence ou absence de blanchissement",
          "Pourcentage de colonies coralliennes blanchies",
          "Espèces ou genres de coraux affectés",
          "Nombre de colonies coralliennes touchées",
          "Mortalité des coraux à la suite du blanchissement",
          "Température de l’eau",
          "Autres paramètres (préciser)",
          "Aucun paramètre standardisé",
          "Ne sait pas"
        ],
        "other": true,
        "showIf": {
          "q": "q057",
          "starts": "Oui"
        }
      },
      {
        "id": "q062",
        "n": 62,
        "label": "À quelle fréquence ce suivi est-il effectué ?",
        "type": "radio",
        "required": true,
        "options": [
          "1 fois par an",
          "Plusieurs fois par an, pendant les périodes à risque",
          "Avant et après un aléa naturel",
          "Après tout événement susceptible d’affecter les récifs coralliens",
          "À intervalles irréguliers, selon les moyens disponibles",
          "En continu, indépendamment des aléas naturels",
          "Autre"
        ],
        "other": true,
        "showIf": {
          "q": "q057",
          "starts": "Oui"
        }
      }
    ]
  },
  {
    "key": "E",
    "title": "Suivi du recrutement corallien",
    "short": "Recrutement corallien",
    "questions": [
      {
        "id": "q063",
        "n": 63,
        "label": "Votre organisation réalise-t-elle un suivi du recrutement corallien (jeunes coraux) ?",
        "type": "radio",
        "required": true,
        "options": [
          "Oui, régulièrement",
          "Oui, occasionnellement",
          "Non"
        ]
      },
      {
        "id": "q064",
        "n": 64,
        "label": "Si non, pour quelles raisons votre organisation ne réalise-t-elle pas de suivi du recrutement corallien ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Manque de financement",
          "Manque de personnel formé",
          "Manque de matériel adapté",
          "Absence de protocole ou de méthode appropriée",
          "Cette activité ne fait pas partie des objectifs de suivi",
          "Autre"
        ],
        "other": true,
        "showIf": {
          "q": "q063",
          "eq": "Non"
        }
      },
      {
        "id": "q065",
        "n": 65,
        "label": "Si oui, quelles méthodes utilisez-vous pour suivre le recrutement corallien ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Comptage des jeunes coraux sur des quadrats",
          "Suivi sur des substrats naturels",
          "Plaques de recrutement artificielles",
          "Photographie et analyse des surfaces échantillonnées",
          "Autre"
        ],
        "other": true,
        "showIf": {
          "q": "q063",
          "starts": "Oui"
        }
      },
      {
        "id": "q066",
        "n": 66,
        "label": "La restauration des récifs coralliens fait-elle partie intégrante du programme officiel de votre organisation ?",
        "type": "radio",
        "required": true,
        "options": [
          "Oui, c'est une composante structurante du programme",
          "Oui, mais de manière secondaire/ponctuelle",
          "Non, ce n'est pas dans le programme",
          "En cours de réflexion pour l'intégrer"
        ]
      }
    ]
  },
  {
    "key": "F",
    "title": "Activités de restauration corallienne",
    "short": "Restauration",
    "questions": [
      {
        "id": "q067",
        "n": 67,
        "label": "Votre organisation mène-t-elle actuellement des activités de restauration corallienne ?",
        "type": "radio",
        "required": true,
        "options": [
          "Oui, en cours",
          "Oui, mais en pause",
          "Non, arrêtées",
          "Non, jamais réalisées"
        ]
      },
      {
        "id": "q068",
        "n": 68,
        "label": "Si non, pour quelles raisons votre organisation ne mène-t-elle pas d’activités de restauration corallienne ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Manque de financement",
          "Manque de personnel formé",
          "Manque de matériel ou d’équipements adaptés",
          "Manque de connaissances techniques ou scientifiques",
          "Absence de sites appropriés",
          "La restauration ne fait pas partie des priorités de l’organisation",
          "Autre"
        ],
        "other": true,
        "showIf": {
          "q": "q067",
          "starts": "Non"
        }
      },
      {
        "id": "q069",
        "n": 69,
        "label": "Si oui, quelles techniques de restauration corallienne utilisez-vous ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Transplantation de fragments coralliens",
          "Bouturage corallien",
          "Élevage de coraux en pépinière suivi d’une transplantation",
          "Installation de substrats artificiels favorisant le recrutement corallien",
          "Structure métallique",
          "Autre"
        ],
        "other": true,
        "showIf": {
          "q": "q067",
          "starts": "Oui"
        }
      },
      {
        "id": "q070",
        "n": 70,
        "label": "Depuis quelle année votre organisation mène-t-elle des activités de restauration corallienne ?",
        "type": "year",
        "required": true,
        "showIf": {
          "q": "q067",
          "starts": "Oui"
        }
      },
      {
        "id": "q071",
        "n": 71,
        "label": "Quels genres ou groupes de coraux utilisez-vous dans vos activités de restauration ?",
        "type": "textarea",
        "required": true,
        "showIf": {
          "q": "q067",
          "starts": "Oui"
        }
      },
      {
        "id": "q072",
        "n": 72,
        "label": "Quelle est la superficie totale ciblée par vos activités de restauration corallienne ?",
        "type": "radio",
        "required": true,
        "options": [
          "Moins de 0,1 ha",
          "De 0,1 à moins de 1 ha",
          "De 1 à moins de 5 ha",
          "De 5 à moins de 10 ha",
          "10 ha ou plus",
          "Superficie non estimée"
        ],
        "detail": {
          "label": "Autre précision sur la superficie (ha)",
          "type": "text"
        },
        "showIf": {
          "q": "q067",
          "starts": "Oui"
        }
      },
      {
        "id": "q073",
        "n": 73,
        "label": "Quels types de récifs ou quelles zones sont ciblés par vos activités de restauration ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Récifs frangeants",
          "Récifs barrières",
          "Îlots récifaux",
          "Atolls",
          "Autre"
        ],
        "other": true,
        "detail": {
          "label": "Préciser la localisation du ou des sites",
          "type": "text"
        },
        "showIf": {
          "q": "q067",
          "starts": "Oui"
        }
      },
      {
        "id": "q074",
        "n": 74,
        "label": "Quel est le budget annuel approximatif consacré aux activités de restauration corallienne ?",
        "type": "radio",
        "required": true,
        "options": [
          "Moins de 5 millions d’Ariary",
          "De 5 à moins de 10 millions d’Ariary",
          "De 10 à moins de 15 millions d’Ariary",
          "De 15 à moins de 20 millions d’Ariary",
          "De 20 à moins de 30 millions d’Ariary",
          "30 millions d’Ariary ou plus",
          "Budget variable selon les projets",
          "Aucun budget spécifiquement alloué",
          "Ne sait pas / non communiqué"
        ],
        "showIf": {
          "q": "q067",
          "starts": "Oui"
        }
      },
      {
        "id": "q075",
        "n": 75,
        "label": "Quelles forces identifiez-vous dans votre programme de restauration corallienne ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Techniques maîtrisées",
          "Suivi dédié",
          "Participation communautaire",
          "Autre"
        ],
        "other": true,
        "showIf": {
          "q": "q066",
          "starts": "Oui"
        }
      },
      {
        "id": "q076",
        "n": 76,
        "label": "Quelles faiblesses identifiez-vous dans votre programme de restauration corallienne ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Manque de financement",
          "Manque de suivi",
          "Faible survie des coraux",
          "Autre"
        ],
        "other": true,
        "showIf": {
          "q": "q066",
          "starts": "Oui"
        }
      }
    ]
  },
  {
    "key": "G",
    "title": "Suivi des activités de restauration corallienne",
    "short": "Suivi de la restauration",
    "questions": [
      {
        "id": "q077",
        "n": 77,
        "label": "Votre organisation réalise-t-elle un suivi écologique des sites faisant l’objet d’activités de restauration corallienne ?",
        "type": "radio",
        "required": true,
        "options": [
          "Oui, systématiquement",
          "Oui, occasionnellement",
          "Non"
        ],
        "showIf": {
          "q": "q067",
          "starts": "Oui"
        }
      },
      {
        "id": "q078",
        "n": 78,
        "label": "Si oui, à quelle fréquence effectuez-vous ce suivi ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Avant la restauration uniquement",
          "Immédiatement après la restauration",
          "Mensuellement",
          "Trimestriellement",
          "Semestriellement",
          "Annuellement",
          "À une fréquence variable",
          "Autre"
        ],
        "other": true,
        "showIf": {
          "q": "q077",
          "starts": "Oui"
        }
      },
      {
        "id": "q079",
        "n": 79,
        "label": "Quelles méthodes utilisez-vous pour évaluer l’efficacité des activités de restauration corallienne ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Comptage et mesure de la survie des fragments transplantés",
          "Mesure de la croissance des coraux",
          "Suivi de la mortalité des colonies",
          "Suivi du recrutement corallien",
          "Estimation de l’évolution de la couverture corallienne",
          "Photographie ou photo-quadrats",
          "Comparaison entre les sites restaurés et les sites témoins",
          "Autre"
        ],
        "other": true,
        "showIf": {
          "q": "q077",
          "starts": "Oui"
        }
      },
      {
        "id": "q080",
        "n": 80,
        "label": "Quel budget annuel est consacré au suivi des activités de restauration corallienne ?",
        "type": "radio",
        "required": true,
        "options": [
          "Moins de 5 millions d’Ariary",
          "De 5 à moins de 10 millions d’Ariary",
          "De 10 à moins de 15 millions d’Ariary",
          "De 15 à moins de 20 millions d’Ariary",
          "20 millions d’Ariary ou plus",
          "Aucun budget spécifiquement alloué",
          "Budget inclus dans celui de la restauration",
          "Ne sait pas / non communiqué"
        ],
        "showIf": {
          "q": "q077",
          "starts": "Oui"
        }
      }
    ]
  },
  {
    "key": "H",
    "title": "Raisons du choix des méthodes",
    "short": "Choix des méthodes",
    "questions": [
      {
        "id": "q081",
        "n": 81,
        "label": "Pourquoi avez-vous choisi cette ou ces méthodes de suivi ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Facilité de mise en œuvre",
          "Coût faible",
          "Rapidité",
          "Précision scientifique",
          "Compatibilité avec d’autres programmes",
          "Formation disponible",
          "Recommandation d’un partenaire",
          "Contrainte logistique",
          "Autre"
        ],
        "other": true
      },
      {
        "id": "q082",
        "n": 82,
        "label": "Cette méthode répond-elle à vos objectifs de suivi ?",
        "type": "radio",
        "required": true,
        "options": [
          "Tout à fait",
          "Partiellement",
          "Pas du tout",
          "Ne sait pas"
        ]
      },
      {
        "id": "q083",
        "n": 83,
        "label": "Avez-vous déjà changé de méthode de suivi ?",
        "type": "radio",
        "required": true,
        "options": [
          "Oui",
          "Non"
        ]
      },
      {
        "id": "q084",
        "n": 84,
        "label": "Si oui, pour quelles raisons avez-vous changé de méthode ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Manque de moyens",
          "Manque de formation",
          "Résultats insuffisants",
          "Nouvelle recommandation",
          "Autre"
        ],
        "other": true,
        "showIf": {
          "q": "q083",
          "eq": "Oui"
        }
      }
    ]
  },
  {
    "key": "I",
    "title": "Contraintes, limites et besoins",
    "short": "Contraintes et besoins",
    "questions": [
      {
        "id": "q085",
        "n": 85,
        "label": "Quels sont les principaux avantages de votre méthode de suivi ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Rapide",
          "Peu coûteuse",
          "Fiable",
          "Reproductible",
          "Participative",
          "Autre"
        ],
        "other": true,
        "detail": {
          "label": "Précisions (facultatif)",
          "type": "text"
        }
      },
      {
        "id": "q086",
        "n": 86,
        "label": "Quels sont les principaux inconvénients de votre méthode de suivi ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Coûteuse",
          "Chronophage",
          "Difficile à standardiser",
          "Nécessite une formation",
          "Données incomplètes",
          "Autre"
        ],
        "other": true
      },
      {
        "id": "q087",
        "n": 87,
        "label": "Quels indicateurs sont difficiles à mesurer chez vous ? (3 maximum)",
        "type": "checkbox",
        "required": true,
        "options": [
          "Recrutement",
          "Maladies",
          "Biomasse poissons",
          "Macro-invertébrés",
          "Physico-chimie",
          "Autre"
        ],
        "other": true,
        "max": 3,
        "help": "3 réponses maximum.",
        "detail": {
          "label": "Précisions (facultatif)",
          "type": "text"
        }
      },
      {
        "id": "q088",
        "n": 88,
        "label": "Quelles sont les principales contraintes rencontrées lors du suivi écologique ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Manque de financement",
          "Manque de personnel formé",
          "Manque de matériel",
          "Conditions météorologiques",
          "Accès difficile aux sites",
          "Manque de coordination",
          "Absence de protocole standard",
          "Autre"
        ],
        "other": true
      },
      {
        "id": "q089",
        "n": 89,
        "label": "Votre organisation a-t-elle déjà interrompu un suivi écologique ?",
        "type": "radio",
        "required": true,
        "options": [
          "Oui",
          "Non"
        ]
      },
      {
        "id": "q090",
        "n": 90,
        "label": "Si oui, pour quelles raisons le suivi a-t-il été interrompu ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Manque de fonds",
          "Manque de personnel",
          "Catastrophe naturelle",
          "Autre"
        ],
        "other": true,
        "showIf": {
          "q": "q089",
          "eq": "Oui"
        }
      },
      {
        "id": "q091",
        "n": 91,
        "label": "Quels sont vos besoins prioritaires de formation ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Identification des espèces",
          "Méthodes d'échantillonnage",
          "Collecte de données",
          "Analyse statistique",
          "Gestion de base de données",
          "Restauration corallienne",
          "Autre"
        ],
        "other": true
      }
    ]
  },
  {
    "key": "J",
    "title": "Forces et faiblesses du modèle de financement",
    "short": "Financement",
    "questions": [
      {
        "id": "q092",
        "n": 92,
        "label": "Quelles sont les forces de votre modèle de financement ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Financement pluriannuel",
          "Diversification des sources",
          "Autofinancement",
          "Autre"
        ],
        "other": true
      },
      {
        "id": "q093",
        "n": 93,
        "label": "Quelles sont les faiblesses de votre modèle de financement ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Dépendance à un bailleur",
          "Financement ponctuel",
          "Pas de budget dédié",
          "Autre"
        ],
        "other": true
      }
    ]
  },
  {
    "key": "K",
    "title": "Perception et auto-évaluation (FFOM)",
    "short": "Auto-évaluation (FFOM)",
    "questions": [
      {
        "id": "q094",
        "n": 94,
        "label": "Votre organisation serait-elle prête à adopter un protocole national harmonisé ?",
        "type": "radio",
        "required": true,
        "options": [
          "Oui",
          "Non",
          "Peut-être",
          "Sous conditions (préciser)"
        ],
        "other": true
      },
      {
        "id": "q095",
        "n": 95,
        "label": "Selon vous, quelles sont les forces de votre système de suivi ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Bonne couverture",
          "Données fiables",
          "Participation communautaire",
          "Autre"
        ],
        "other": true
      },
      {
        "id": "q096",
        "n": 96,
        "label": "Quelles sont les faiblesses de votre système de suivi ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Manque de moyens",
          "Données incomplètes",
          "Manque de formation",
          "Autre"
        ],
        "other": true
      },
      {
        "id": "q097",
        "n": 97,
        "label": "Quelles sont les opportunités pour améliorer votre système de suivi ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Nouveaux partenariats",
          "Financements",
          "Technologies",
          "Autre"
        ],
        "other": true
      },
      {
        "id": "q098",
        "n": 98,
        "label": "Quelles sont les menaces pesant sur votre système de suivi ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Changement climatique",
          "Pêche illégale",
          "Pollution",
          "Manque de soutien politique",
          "Autre"
        ],
        "other": true
      },
      {
        "id": "q099",
        "n": 99,
        "label": "Sur une échelle de 1 à 5, comment évaluez-vous l’efficacité de votre suivi écologique ?",
        "type": "scale",
        "required": true,
        "options": [
          "Très faible",
          "Faible",
          "Moyenne",
          "Élevée",
          "Très élevée"
        ]
      }
    ]
  },
  {
    "key": "L",
    "title": "Harmonisation et recommandations",
    "short": "Harmonisation",
    "questions": [
      {
        "id": "q100",
        "n": 100,
        "label": "Pensez-vous qu’une harmonisation nationale des protocoles de suivi est nécessaire ?",
        "type": "radio",
        "required": true,
        "options": [
          "Oui",
          "Non",
          "Ne sait pas"
        ]
      },
      {
        "id": "q101",
        "n": 101,
        "label": "Quels critères sont importants pour un protocole national de suivi ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Simplicité",
          "Coût abordable",
          "Reproductibilité",
          "Adaptabilité locale",
          "Compatibilité internationale",
          "Autre"
        ],
        "other": true
      },
      {
        "id": "q102",
        "n": 102,
        "label": "Quelles conditions sont nécessaires pour réussir l'harmonisation ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Financement dédié",
          "Formation des équipes",
          "Outils communs",
          "Coordination nationale",
          "Validation par les gestionnaires",
          "Autre"
        ],
        "other": true
      },
      {
        "id": "q103",
        "n": 103,
        "label": "Quels critères sont prioritaires pour un protocole national ? (3 maximum)",
        "type": "checkbox",
        "required": true,
        "options": [
          "Simplicité",
          "Coût abordable",
          "Reproductibilité",
          "Adaptabilité locale",
          "Compatibilité internationale",
          "Facilité de formation",
          "Autre"
        ],
        "other": true,
        "max": 3,
        "help": "3 réponses maximum."
      },
      {
        "id": "q104",
        "n": 104,
        "label": "Quelles méthodes recommandez-vous pour un futur protocole national ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "LIT",
          "Quadrats",
          "Photo-quadrats",
          "Points intercepts",
          "Méthodes participatives",
          "Autre"
        ],
        "other": true
      },
      {
        "id": "q105",
        "n": 105,
        "label": "Souhaitez-vous participer à l’élaboration du protocole national ?",
        "type": "radio",
        "required": true,
        "options": [
          "Oui",
          "Non",
          "Peut-être"
        ]
      },
      {
        "id": "q106",
        "n": 106,
        "label": "Quelles sont vos recommandations générales concernant le suivi écologique des récifs coralliens ?",
        "type": "textarea",
        "required": true
      }
    ]
  }
]
};

if (typeof module !== "undefined") module.exports = SURVEY;
