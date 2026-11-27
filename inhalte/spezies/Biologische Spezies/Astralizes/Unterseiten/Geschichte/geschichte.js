import { bewegungErlaubt } from "../../astralizes-basis.js";
const k = document.querySelector(".az-blink-knopf");
k?.addEventListener("click", () => { const an = k.getAttribute("aria-pressed") !== "true"; k.setAttribute("aria-pressed", String(an)); k.textContent = an ? "Blinkvergleich läuft" : "Blinkvergleich angehalten"; document.body.classList.toggle("az-blinken-aus", !an); });
if (!bewegungErlaubt) k?.click();
