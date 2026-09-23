/**
 * ZoekJeWerk.nl — formulieren doorsturen naar e-mail
 *
 * Dit script draait in je eigen Google-account (script.google.com).
 * De website stuurt elk ingevuld formulier hierheen; het script mailt het
 * via Gmail door naar ONTVANGER, inclusief een eventueel geüpload cv.
 *
 * Installatie: zie apps-script/INSTALLATIE.md
 */

const ONTVANGER = "contact@zoekjewerk.nl";
const MAX_BESTAND_MB = 5;

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Spamfilter: dit verborgen veld vullen alleen bots in.
    if (data.website) return antwoord({ ok: true });

    const formulier = tekst(data.formulier || "Formulier");
    const velden = Array.isArray(data.velden) ? data.velden : [];
    const naam = waarde(velden, "naam");
    const email = waarde(velden, "email");

    const rijen = velden
      .filter((v) => v.waarde !== "")
      .map((v) =>
        '<tr><td style="padding:8px 16px 8px 0;color:#56617A;vertical-align:top;white-space:nowrap">' +
        escape(v.label) + '</td><td style="padding:8px 0;color:#0B1B36">' +
        escape(v.waarde).replace(/\n/g, "<br>") + "</td></tr>")
      .join("");

    const bijlagen = (Array.isArray(data.bestanden) ? data.bestanden : [])
      .filter((b) => b && b.data)
      .map((b) => Utilities.newBlob(Utilities.base64Decode(b.data), b.type || "application/octet-stream", tekst(b.naam || "bijlage")))
      .filter((blob) => blob.getBytes().length <= MAX_BESTAND_MB * 1024 * 1024);

    const html =
      '<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5">' +
      '<h2 style="margin:0 0 4px;color:#0B1B36">' + escape(formulier) + "</h2>" +
      '<p style="margin:0 0 20px;color:#56617A">Verstuurd via ' + escape(tekst(data.pagina || "zoekjewerk.nl")) + "</p>" +
      '<table style="border-collapse:collapse">' + rijen + "</table>" +
      (bijlagen.length ? '<p style="margin-top:20px;color:#56617A">Bijlage: ' + bijlagen.map((b) => escape(b.getName())).join(", ") + "</p>" : "") +
      "</div>";

    const bericht = {
      to: ONTVANGER,
      subject: formulier + (naam ? " — " + naam : ""),
      htmlBody: html,
      name: "ZoekJeWerk.nl website",
      attachments: bijlagen,
    };
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) bericht.replyTo = email;

    MailApp.sendEmail(bericht);
    return antwoord({ ok: true });
  } catch (err) {
    console.error(err);
    return antwoord({ ok: false, fout: String(err) });
  }
}

// Handig om te testen of de koppeling werkt: open de web-app-URL in je browser.
function doGet() {
  return antwoord({ ok: true, status: "ZoekJeWerk.nl formulieren actief" });
}

function waarde(velden, sleutel) {
  const v = velden.find((x) => x.naam === sleutel);
  return v ? tekst(v.waarde) : "";
}

function tekst(s) {
  return String(s).slice(0, 5000);
}

function escape(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function antwoord(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
