/* ==========================================================================
   Vacatures — pas deze lijst aan om vacatures toe te voegen of te wijzigen.
   featured: true  → wordt getoond op de homepage (maximaal 3).
   sector: gebruik altijd een van deze drie (dan werken de filters en links):
     "Sales & Commercieel" · "Office & Digital" · "Techniek & Bouw" · "Horeca"
   ========================================================================== */

window.ZJW_JOBS = [
  {
    id: "accountmanager-b2b-groningen",
    title: "Accountmanager B2B",
    company: "Groothandel in installatietechniek",
    sector: "Sales & Commercieel",
    location: "Groningen",
    type: "Fulltime",
    hours: "40 uur",
    level: "Young professional",
    salary: "€3.000 – €3.800",
    period: "per maand + bonus",
    posted: 1,
    featured: true,
    summary: "Je bouwt langdurige relaties op met installateurs en aannemers in Groningen, Friesland en Drenthe, en breidt je eigen klantportefeuille stap voor stap uit.",
    tasks: [
      "Bezoeken en adviseren van bestaande zakelijke klanten",
      "Actief benaderen van nieuwe klanten in je regio",
      "Opstellen van offertes samen met de binnendienst",
      "Bijhouden van afspraken en kansen in het CRM"
    ],
    profile: [
      "Mbo-4- of hbo-denkniveau, bijvoorbeeld commerciële economie",
      "1 tot 3 jaar ervaring in sales of accountmanagement",
      "Je haalt energie uit klantcontact en het sluiten van deals",
      "Rijbewijs B"
    ],
    offer: [
      "Auto van de zaak, ook privé te gebruiken",
      "Bonusregeling op basis van omzet",
      "Salestraining en een ervaren collega als buddy",
      "Informele sfeer in een groeiend familiebedrijf"
    ]
  },
  {
    id: "marketing-medewerker-assen",
    title: "Allround Marketing Medewerker",
    company: "Groeiende webshop",
    sector: "Office & Digital",
    location: "Assen",
    type: "Fulltime",
    hours: "32–40 uur",
    level: "Starter",
    salary: "€2.700 – €3.200",
    period: "per maand",
    posted: 2,
    featured: true,
    summary: "Je maakt content voor de website, social media en nieuwsbrieven van een webshop die hard groeit in Nederland en België, en je ziet direct wat je werk oplevert.",
    tasks: [
      "Schrijven van productteksten, blogs en nieuwsbrieven",
      "Maken en inplannen van posts voor social media",
      "Beheren van de website in het CMS",
      "Bijhouden van bereik en verkoop per campagne"
    ],
    profile: [
      "Afgeronde mbo-4- of hbo-opleiding in marketing of communicatie",
      "Sterk in schrijven en visueel ingesteld",
      "Ervaring met Canva of vergelijkbare tools",
      "Je werkt graag zelfstandig en komt met eigen ideeën"
    ],
    offer: [
      "Veel ruimte voor eigen ideeën",
      "Budget voor cursussen in online marketing",
      "Personeelskorting op het assortiment",
      "Gratis parkeren en een verzorgde lunch"
    ]
  },
  {
    id: "werkvoorbereider-utiliteitsbouw-groningen",
    title: "Werkvoorbereider Utiliteitsbouw",
    company: "Bouwbedrijf in Noord-Nederland",
    sector: "Techniek & Bouw",
    location: "Groningen",
    type: "Fulltime",
    hours: "40 uur",
    level: "Ervaren",
    salary: "€3.600 – €4.600",
    period: "per maand",
    posted: 3,
    featured: true,
    summary: "Je vertaalt het ontwerp naar een uitvoerbaar plan voor scholen, kantoren en zorggebouwen, samen met de projectleider en de uitvoerder.",
    tasks: [
      "Opstellen van planningen en werktekeningen",
      "Aanvragen van offertes en inkopen van materialen",
      "Afstemmen met onderaannemers en leveranciers",
      "Bewaken van kwaliteit, veiligheid en budget"
    ],
    profile: [
      "Mbo-4- of hbo-opleiding bouwkunde of civiele techniek",
      "Minimaal 3 jaar ervaring als werkvoorbereider",
      "Georganiseerd, nauwkeurig en communicatief sterk",
      "Rijbewijs B"
    ],
    offer: [
      "Vast contract bij een stabiele werkgever",
      "Auto van de zaak of reiskostenvergoeding",
      "Opleidingsbudget en doorgroei naar projectleider",
      "Cao Bouw & Infra met goede secundaire voorwaarden"
    ]
  },
  {
    id: "medewerker-bediening-groningen",
    title: "Medewerker Bediening (parttime)",
    company: "Restaurant in de binnenstad",
    sector: "Horeca",
    location: "Groningen",
    type: "Parttime",
    hours: "12–24 uur",
    level: "Student",
    salary: "€14 – €16",
    period: "per uur + fooi",
    posted: 1,
    featured: true,
    summary: "Een bijbaan naast je studie in een druk restaurant in de Groningse binnenstad, in een jong team dat gastvrijheid hoog in het vaandel heeft.",
    tasks: [
      "Ontvangen van gasten en opnemen van bestellingen",
      "Serveren van gerechten en dranken",
      "Adviseren over de kaart en de wijnen",
      "Zorgen dat het restaurant er netjes en verzorgd uitziet"
    ],
    profile: [
      "Je bent gastvrij, vrolijk en houdt van aanpakken",
      "Ervaring in de bediening is mooi, maar niet nodig",
      "Beschikbaar op minimaal twee avonden en één weekenddag",
      "Goede beheersing van Nederlands of Engels"
    ],
    offer: [
      "Flexibel rooster rondom je studie",
      "Fooi wordt eerlijk verdeeld",
      "Gratis personeelsmaaltijd tijdens je dienst",
      "Doorgroeien naar shiftleider"
    ]
  },
  {
    id: "webdesigner-hamminga-digital",
    title: "Webdesigner",
    company: "Hamminga Digital",
    website: "https://hammingadigital.nl",
    sector: "Office & Digital",
    filled: true,                                  // vacature is vervuld
    featured: true,
    summary: "Hamminga Digital bouwt premium websites en webshops voor ondernemers die willen groeien, en zet AI-workflows en AI-agents in om processen te automatiseren. Voor dit bureau zochten we een webdesigner.",
    tasks: [
      "Ontwerpen en bouwen van websites en webshops in Framer of Webflow"
    ]
  },

  /* Voorbeeld van één vacature. Gebruiken? Verwijder deze regel en de regel met het sterretje en de schuine streep onderaan, en vul je eigen gegevens in.
  {
    id: "junior-accountmanager-groningen",        // uniek, kleine letters en streepjes
    title: "Junior Accountmanager",
    company: "Groothandel in installatietechniek", // mag ook anoniem omschreven
    sector: "Sales & Commercieel",
    location: "Groningen",
    type: "Fulltime",                              // Fulltime, Parttime, Stage of Traineeship
    hours: "40 uur",
    level: "Starter",                              // bijv. Student, Starter, Young professional, Ervaren
    salary: "€2.800 – €3.400",
    period: "per maand",
    posted: 1,                                     // aantal dagen geleden geplaatst
    featured: true,                                // true = ook op de homepage
    summary: "Korte omschrijving van de functie in één of twee zinnen.",
    tasks: ["Taak 1", "Taak 2", "Taak 3"],
    profile: ["Eis 1", "Eis 2", "Eis 3"],
    offer: ["Aanbod 1", "Aanbod 2", "Aanbod 3"]
  },
  */
];
