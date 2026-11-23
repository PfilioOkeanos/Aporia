const reiterSelector = 'nav:is([class$="-reiter"], .thl-reiterleiste, [class*="-reiter "], .dossier-seitennavigation)';

export function ordneDossier(main) {
    const tabs = main?.querySelector(reiterSelector);
    if (!tabs) return;
    if (main.hasAttribute("data-lesefluss")) return baueLesekopf(main, tabs);
    tabs.classList.add("dossier-seitennavigation");
    // Die vorhandene Komposition aus Text, Illustration und ggf. Video bleibt im Seitenkopf.
    const title = main.querySelector("h1");
    const hero = title?.closest("header, section[class*='-hero'], section[class*='-banner']");
    if (hero && tabs.classList.contains("dossier-reiter") && !tabs.closest(".human-seitenkopf") &&
        !hero.contains(tabs) && hero.parentElement === main && hero.nextElementSibling !== tabs) {
        hero.after(tabs);
    }
}
function baueLesekopf(main, tabs) {
    const title = main.querySelector("h1");
    if (!title) return;
    const oldHead = main.querySelector(":scope > .human-seitenkopf");
    const source = title.closest("header,section[class*='hero']") || title.parentElement;
    const head = document.createElement("div");
    head.className = "lesekopf";
    const hero = document.createElement("header");
    hero.className = "lesekopf-buehne";
    const copy = document.createElement("div");
    copy.className = "lesekopf-text";
    const eyebrow = source.querySelector("p[class*='kicker'],p.eyebrow");
    if (eyebrow) copy.append(eyebrow);
    const next = title.nextElementSibling;
    copy.append(title);
    if (next?.matches("p")) copy.append(next);
    const candidate = [...source.querySelectorAll("img[src]"), ...main.querySelectorAll("img[src]")].find(img =>
        !img.closest("nav,dialog,h1") && !/ico_|icon|logo|titelzug|\.svg/i.test(img.src));
    const image = oldHead?.querySelector(".dossier-panorama img") || document.createElement("img");
    if (!image.hasAttribute("src")) {
        image.src = main.dataset.dossierTitelbild && !/ico_|icon/i.test(main.dataset.dossierTitelbild) ?
            main.dataset.dossierTitelbild : candidate?.src || new URL("../../../assets/bilder/Sternenkarte/Platzhalter.png", import.meta.url).href;
        image.alt = candidate?.src === image.src ? candidate.alt : "";
    }
    image.className = "lesekopf-motiv";
    image.fetchPriority = "high";
    hero.append(copy, image);
    const film = source.querySelector(".human-film");
    if (film) hero.append(film);
    tabs.classList.add("dossier-seitennavigation");
    head.append(hero, tabs);
    main.prepend(head);
    oldHead?.remove();
    if (source.matches("header,section[class*='hero']")) {
        for (const img of source.querySelectorAll("img")) {
            if (img.src === image.src && !img.closest("a,figure,button")) img.remove();
        }
        if (!source.textContent.trim() && !source.querySelector("img,video,audio,button")) source.remove();
        else source.classList.add("lesekopf-ergaenzung");
    }
}
