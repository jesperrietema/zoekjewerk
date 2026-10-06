/* ==========================================================================
   Vacatures — pas deze lijst aan om vacatures toe te voegen of te wijzigen.
   featured: true  → wordt getoond op de homepage (maximaal 3).
   sector: gebruik altijd een van deze drie (dan werken de filters en links):
     "Sales & Commercieel" · "Office & Digital" · "Techniek & Bouw"
   ========================================================================== */

window.ZJW_JOBS = [
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
