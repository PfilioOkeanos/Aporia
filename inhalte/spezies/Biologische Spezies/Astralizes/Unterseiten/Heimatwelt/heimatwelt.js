import { bewegungErlaubt } from "../../astralizes-basis.js";
const p = document.querySelector(".az-panorama");
p?.addEventListener("wheel", (e) => { if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && p.scrollWidth > p.clientWidth) { const ende = p.scrollLeft + p.clientWidth >= p.scrollWidth - 2, anfang = p.scrollLeft <= 0; if ((e.deltaY > 0 && !ende) || (e.deltaY < 0 && !anfang)) { e.preventDefault(); p.scrollLeft += e.deltaY; } } }, { passive: false });
