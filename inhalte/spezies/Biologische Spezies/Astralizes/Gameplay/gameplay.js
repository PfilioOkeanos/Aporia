import { bewegungErlaubt } from "../astralizes-basis.js";
const kopf = document.querySelector(".az-hud-kopf"), svg = kopf?.querySelector(".az-peilung"), out = kopf?.querySelector(".az-koordinate");
const setze = (x, y) => { const r = kopf.getBoundingClientRect(); const a = svg.querySelector(".az-peil-a"), b = svg.querySelector(".az-peil-b"), z = svg.querySelector(".az-peil-ziel");
  a.setAttribute("x1", 0); a.setAttribute("y1", r.height); a.setAttribute("x2", x); a.setAttribute("y2", y);
  b.setAttribute("x1", r.width); b.setAttribute("y1", r.height); b.setAttribute("x2", x); b.setAttribute("y2", y);
  z.setAttribute("cx", x); z.setAttribute("cy", y);
  const wa = Math.atan2(r.height - y, x) * 180 / Math.PI, wb = Math.atan2(r.height - y, r.width - x) * 180 / Math.PI;
  out.textContent = `Peilung A ${wa.toFixed(1)}° · Peilung B ${wb.toFixed(1)}° · Position eingegrenzt`; };
if (kopf) { const r = kopf.getBoundingClientRect(); setze(r.width * .6, r.height * .4); kopf.addEventListener("pointermove", (e) => { const q = kopf.getBoundingClientRect(); setze(e.clientX - q.left, e.clientY - q.top); }); }
