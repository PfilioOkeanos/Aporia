import { bewegungErlaubt } from "../astralizes-basis.js";
if (bewegungErlaubt) addEventListener("pointermove", (e) => { document.body.style.setProperty("--px", ((e.clientX / innerWidth) * 2 - 1).toFixed(3)); document.body.style.setProperty("--py", ((e.clientY / innerHeight) * 2 - 1).toFixed(3)); }, { passive: true });
