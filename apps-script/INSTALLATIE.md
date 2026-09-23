# Formulieren doorsturen naar contact@zoekjewerk.nl

Alle formulieren op de website (contact, open sollicitatie, talentaanvraag en
solliciteren op een vacature) worden via een klein script in je eigen
Google-account als e-mail doorgestuurd naar **contact@zoekjewerk.nl**,
inclusief het geüploade cv als bijlage. Dit hoef je maar één keer in te stellen.

## Stap 1 — Script aanmaken

1. Ga naar <https://script.google.com> en log in met het Google-account waarmee
   je de mails wilt laten versturen (je Gmail).
2. Klik op **Nieuw project**. Geef het linksboven de naam `ZoekJeWerk formulieren`.
3. Verwijder alles wat in `Code.gs` staat en plak de volledige inhoud van
   [`Code.gs`](Code.gs) uit deze map erin.
4. Klik op het diskette-icoon (**Opslaan**).

## Stap 2 — Publiceren als web-app

1. Klik rechtsboven op **Implementeren → Nieuwe implementatie**.
2. Klik op het tandwiel naast "Type selecteren" en kies **Web-app**.
3. Vul in:
   - **Uitvoeren als:** Ik
   - **Wie heeft toegang:** Iedereen
4. Klik op **Implementeren** en daarna op **Toegang autoriseren**.
5. Kies je Google-account. Google toont de melding *"Google heeft deze app niet
   geverifieerd"*. Dat is normaal voor een eigen script: klik op **Geavanceerd →
   Ga naar ZoekJeWerk formulieren (onveilig)** en daarna op **Toestaan**.
6. Kopieer de **URL van de web-app**. Die ziet eruit als
   `https://script.google.com/macros/s/AKfy.../exec`.

Controle: open die URL in je browser. Je ziet dan
`{"ok":true,"status":"ZoekJeWerk.nl formulieren actief"}`.

## Stap 3 — Koppelen aan de website

Zet de URL in [`assets/js/main.js`](../assets/js/main.js), bovenaan:

```js
const FORM_ENDPOINT = "https://script.google.com/macros/s/AKfy.../exec";
```

(of stuur de URL naar Claude, dan wordt dit voor je gedaan). Push daarna naar
GitHub en verstuur een testformulier. Kijk bij de eerste test ook even in je
spammap.

## Goed om te weten

- **Limiet:** met een gratis Gmail-account kan het script 100 e-mails per dag
  versturen. Met Google Workspace is dat 1.500.
- **Antwoorden:** in de mail staat het e-mailadres van de invuller als
  antwoordadres. Klik gewoon op *Beantwoorden*.
- **Script aangepast?** Na een wijziging in `Code.gs` moet je via
  **Implementeren → Implementaties beheren → potlood → Versie: Nieuwe versie**
  opnieuw implementeren. De URL blijft dan hetzelfde.
- **Spam:** elk formulier heeft een onzichtbaar veld dat alleen bots invullen.
  Die inzendingen worden genegeerd.
- **Cv's:** maximaal 5 MB per bestand (pdf of Word).
