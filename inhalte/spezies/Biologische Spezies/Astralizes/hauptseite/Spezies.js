import { bewegungErlaubt } from "../astralizes-basis.js";
const linse = document.querySelector(".az-linse"), foyer = document.querySelector(".az-foyer");
if (bewegungErlaubt && linse) foyer.addEventListener("pointermove", (e) => { const r = foyer.getBoundingClientRect(); linse.style.setProperty("--x", `${e.clientX - r.left}px`); linse.style.setProperty("--y", `${e.clientY - r.top}px`); foyer.classList.add("az-aktiv"); });
