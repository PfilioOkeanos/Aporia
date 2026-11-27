import { bewegungErlaubt } from "../../astralizes-basis.js";
const knoepfe = [...document.querySelectorAll(".az-filter button")], werke = [...document.querySelectorAll(".az-salon-werk")];
knoepfe.forEach((b) => b.addEventListener("click", () => { knoepfe.forEach((x) => x.setAttribute("aria-pressed", String(x === b))); werke.forEach((w) => { w.hidden = !!b.dataset.saal && w.dataset.saal !== b.dataset.saal; }); }));
