
import { observeMediaVisibility } from "../../../Menüs/adapter/aporia-media-visibility.js";
import { bewegungReduziert } from "../../../Menüs/adapter/aporia-bewegung.js";

// Originale, gezeichnete Motive. Die zweite Ebene bestimmt, wie das Motiv
// aus seiner Umgebung hervorgeht: z. B. Wurzeln, Gestein, Wasser oder Leiterbahnen.
const motive = new Map([
    ["Humanoide",["#e6bc87","#83c3ec","M16 66L36 49l14 8 14-8 20 17-10 15H26Z M50 17c-9 0-15 7-15 15s6 15 15 15 15-7 15-15-6-15-15-15Z M27 72l23-9 23 9 M50 58v22","arch",0]],
    ["Astralizes",["#c19af8","#8fe5f1","M15 62Q27 13 62 17Q34 42 63 79Q34 91 15 62Z M42 62Q49 28 82 25Q56 54 77 76Q60 88 42 62Z M34 28l4 8-8-4Z M72 58l5 8-10-2Z","rift",1]],
    ["Mykonoiden",["#b8d77e","#e6a977","M14 43Q22 18 50 15Q78 18 86 43L74 54H26Z M44 51l-4 25-21 9 20-2 11-6 11 6 20 2-21-9-4-25Z M27 42l14-9m6 12 10-12m6 10 8-6","root",2]],
    ["Lithoiden",["#b7bece","#e8ad72","M31 16L70 21 83 55 68 81 29 85 16 51Z M31 16L35 47 16 51M70 21L60 51 83 55M35 47L60 51 68 81M29 85L35 47","crystal",3]],
    ["Aeromorphen",["#83dcd8","#cbb8ee","M50 45L39 29 10 23 22 45 41 56 50 73 59 56 78 45 90 23 61 29Z M20 31l23 18M80 31L57 49M46 57l4 6 4-6","wind",4]],
    ["Chitinoiden",["#e0a061","#b7cf8a","M50 14L73 24 80 50 65 73 50 85 35 73 20 50 27 24Z M31 32l19 8 19-8 M24 50l26 10 26-10M50 20v61","shell",5]],
    ["Plasmoiden",["#74d9f1","#b3a0ef","M20 29Q36 4 57 25Q69 37 83 30Q91 50 76 60Q61 70 66 86Q41 93 28 74Q19 64 25 49Q30 40 20 29Z M40 40Q48 29 60 43Q64 55 54 64Q41 67 36 55Z","fluid",6]],
    ["Floranoiden",["#9bdf92","#ecc477","M23 20Q52 17 51 54Q29 53 23 20Z M77 19Q83 49 58 56Q51 32 77 19Z M50 49Q60 72 47 86 M29 75l18-12m10 5 14 10","root",7]],
    ["Symbionten",["#a6dca8","#f4aa8f","M50 12Q78 27 82 54Q79 77 50 88Q21 77 18 54Q22 27 50 12Z M55 38L67 56 54 68 39 60 41 43Z M24 54l14 2m31 2 11-3","nest",8]],
    ["Kolonialwesen",["#e2bc79","#86d7bb","M33 20l11 8v14l-11 8-11-8V28zM67 20l11 8v14l-11 8-11-8V28zM50 49l13 8v15l-13 8-13-8V57zM44 35h12m-23 15 9 7m25-7-9 7","cells",9]],
    ["Kryonoiden",["#b7edfc","#799bec","M50 13l10 22 25 1-17 17 5 25-23-10-23 10 5-25-17-17 25-1Z M50 13v55m35-32L32 53m-17-17 53 17","crystal",10]],
    ["Pyronoiden",["#ff825d","#ffd37d","M46 13Q67 28 61 48Q74 43 77 32Q93 56 77 75Q62 90 43 87Q18 80 22 57L28 46Q29 61 43 62Q35 45 46 13Z M54 52Q68 71 54 78Q38 72 54 52Z","flame",11]],
    ["Elektrozoiden",["#e6ec8f","#78cafa","M49 18L76 67H23Z M44 40l15-11-5 15 9 2-20 20 6-16-9-1Z M49 18v-7m27 56 11 2m-64-2-10 2","cells",12]],
    ["Bioluminoiden",["#85ecd4","#dca7fb","M50 14Q61 27 60 43Q75 43 84 57Q71 68 56 63Q53 78 38 86Q28 74 35 58Q20 54 13 39Q27 29 42 43Q39 28 50 14Z M50 44l8 10-8 9-8-9Z","flare",13]],
    ["Meta Morphen",["#d6a0f0","#f3b087","M34 14L62 23 66 45 46 60 24 48 19 27Z M60 39Q84 32 83 56Q81 82 54 85Q36 78 42 62Q48 50 60 39Z M19 59l3 14 12 7M73 19l10 9 1 13","fluid",14]],
    ["Regeneranten",["#9be0a6","#f0c879","M42 13Q71 13 81 36L70 37Q62 24 44 26Q20 30 24 56Q29 82 54 80Q73 78 79 58L87 59Q84 89 49 91Q15 86 13 54Q11 22 42 13Z M53 35v32M37 51h32","nest",15]],
    ["Parasitoiden",["#f2a994","#cfadf5","M51 13Q71 34 71 58Q69 79 50 86Q30 78 29 58Q29 34 51 13Z M49 26v43 M49 41Q60 40 59 51Q58 58 49 60M48 50Q37 53 38 61","shell",16]],
    ["Ozeaniden",["#70e0dd","#88a2ef","M15 49Q32 20 50 20Q67 20 85 49Q69 81 50 82Q31 80 15 49Z M15 49Q39 28 55 50T85 49 M20 60Q36 41 53 60T79 60","wide",17]],
    ["Kontinentaliden",["#b7d594","#e4b675","M14 59L29 25 48 20 57 34 77 27 86 59 64 77 44 69 26 76Z M29 25l11 24 17-15M40 49l4 20m-4-20 21 7 16-29m-16 29 3 21","terrain",18]],
    ["Lithonetzwerke",["#c6b9e5","#b1ddb5","M21 23L50 17 78 30 81 64 59 80 27 75 17 47Z M21 23l24 21 33-14M45 44l14 36M17 47l28-3 36 20","crystal",19]],
    ["Schwarmarchen",["#dab0ef","#83e4d2","M50 18l7 8-7 8-7-8ZM24 39l7 8-7 8-7-8ZM76 39l7 8-7 8-7-8ZM36 66l7 8-7 8-7-8ZM64 66l7 8-7 8-7-8Z M50 26l26 21-12 27H36L24 47Z","cells",20]],
    ["Geomorphen",["#e5bd8d","#a7c990","M11 71L35 29 50 45 65 22 90 71Z M19 59q18-8 32 0t29-1 M26 70q13-6 25 0t25 0","terrain",21]],
    ["Biophäriden",["#8be1aa","#8fcef4","M50 16a34 34 0 1 0 0 68a34 34 0 1 0 0-68Z M21 46q16-24 29-8q11 14 26-2M22 62q12-6 24 3t33-7 M50 32q11 9 7 17q-10 8-17-5Z","orbit",22]],
    ["Hydronetzwerke",["#81e5f3","#b7dea6","M49 20l5 16-16 15 15 16-2 17 M20 31l11 17 7 3m16-15 15 6 12-11M53 67l22-8m-37-8-15 13","fluid",23]],
    ["Radikalen",["#c9da8d","#e7a77b","M52 16l-1 25-22-12m22 12 20-15M51 41l-6 21-22 12m22-12 7 24m-1-45 11 20 19 15m-19-15 9 23","root",24]],
    ["Megakolonien",["#f1ba9f","#c8a0e9","M50 18l13 20-13 13-13-13Z M25 44l16 9-6 20-17-3-3-15Z M75 44l10 11-3 15-17 3-6-20Z M50 51v27m-15-5 15 5 15-5","cells",25]],
    ["Gravanten",["#dfbd83","#a5cacc","M20 49l12-13 37-1 13 12-6 10H26Z M33 57l-5 20H17m29-19v19h7m13-20 7 20h10M33 37l8-13h21l7 11","terrain",26]],
    ["Aerothanen",["#b5d8fa","#f0c293","M19 46Q29 18 50 18Q74 18 82 46Q76 66 50 70Q24 66 19 46Z M26 46q24-14 48 0M34 58l8 15 8 6 8-6 8-15","wind",27]],
    ["Xerakiden",["#e9b36e","#a8d0b6","M20 30l17-9 13 8 13-8 17 9-7 34-23 17-23-17Z M50 30v46M25 42l25 10 25-10M29 57l21 10 21-10","shell",28]],
    ["Kryotharen",["#8ce5f7","#a8a9ef","M13 27l19-9 17 10 18-9 20 8M18 61q18-20 43-12l18-8-7 15 12 10-20-3q-27 13-46-2Z M23 71q24 13 51 2","wide",29]],
    ["Subterranen",["#d0ab90","#b59cec","M19 20h62M19 83h62 M22 68q5-26 29-19q24 5 24-13q-2-16-20-11 M25 60l9 8m4-15 12 5m8-9 4 10","rift",30]],
    ["Pyrokariden",["#ff7753","#ebbc82","M20 78l15-35 14 6 15-6 16 35Z M42 45l-4 20 13 1-4 10M50 16q-10 12 1 21q12-7-1-21Z","flame",31]],
    ["Velorithen",["#b3c7f6","#81e7e2","M14 34l23 5 13-14 13 14 23-5-20 24-9-3 7 15-14 12-14-12 7-15-9 3Z M50 27v47M25 40l15 8m35-8-15 8","wind",32]],
    ["Nebuloiden",["#dda6ec","#8daaf2","M20 65Q10 48 29 40Q25 22 45 19Q65 17 71 37Q89 33 86 54Q86 71 68 70Q55 88 37 74Q22 77 20 65Z M29 57q12-17 22-6t21-6","nebula",33]],
    ["Magnetoiden",["#81c3f9","#f3a0b1","M50 20v60 M43 23Q2 49 43 78M57 23Q98 49 57 78M43 34Q19 50 43 66M57 34Q81 50 57 66 M50 35l6 15-6 15-6-15Z","orbit",34]],
    ["Plasmaastriden",["#ffb874","#de95fb","M21 69Q29 52 48 43Q67 33 62 16Q84 35 65 49Q43 66 56 81Q37 77 39 60Q36 67 21 69Z M27 49q4-16 20-22m14 43q16-9 15-22","flame",35]],
    ["Gravoiden",["#c6b6ed","#efaf87","M16 25Q50 44 84 25M16 75Q50 56 84 75M26 17Q43 50 26 83M74 17Q57 50 74 83 M50 39a11 11 0 1 0 0 22a11 11 0 1 0 0-22Z","rift",36]],
    ["Vacuoiden",["#a5c9dd","#cca8ea","M19 34V19h15m32 0h15v15m0 32v15H66m-32 0H19V66 M36 36L64 36V64H36Z M45 51h10","rift",37]],
    ["Radiotrophen",["#e9db7c","#9ae6a0","M50 39a11 11 0 1 0 0 22a11 11 0 1 0 0-22Z M41 32L36 16Q50 8 64 16l-5 16m9 22 16 6q2 16-14 21L59 68m-18 0-11 13Q14 76 16 60l16-6","flare",38]],
    ["Exosphärenwesen",["#86d9fd","#ead2a2","M14 67q36-38 72 0M18 56q32-38 64 0M24 44q26-28 52 0M54 15l5 8 8 5-8 5-5 8-5-8-8-5 8-5Z","wide",39]],
    ["Planetaroiden",["#a0dba9","#86b9fa","M50 19a31 31 0 1 0 0 62a31 31 0 1 0 0-62Z M29 32l18-6 8 12-11 11-12-3-8 9m37-10 13 2-3 14-11 9-9-12 M20 58q36 22 60-11","orbit",40]],
    ["Orbitaloiden",["#83d9ef","#e8bb8a","M49 41a9 9 0 1 0 0 18a9 9 0 1 0 0-18Z M19 61Q28 20 62 28Q91 39 81 62Q66 82 34 75 M69 30l6-7 7 6-6 7Z","orbit",41]],
    ["Astravaren",["#cfb7f5","#8ee4df","M50 15l13 24 23 9-24 9-12 25-9-25-26-9 25-9Z M50 30l6 12 11 6-11 5-6 13-5-13-12-5 12-6Z M20 73l16-4m31-43 12-7","wind",42]],
    ["Chronoiden",["#eec382","#94c2ff","M30 14h40M30 86h40 M36 17v11l14 20 14-20V17m-28 66V72l14-20 14 20v11M41 75h18m-9-28v5","arch",43]],
    ["Synaptoiden",["#b6a5fb","#83e9cd","M15 29l18 13v16L15 71m70-42L67 42v16l18 13 M33 44h11m12 0h11M33 56h11m12 0h11 M50 39l7 11-7 11-7-11Z","cells",44]],
    ["Echonoiden",["#8cdfef","#b6aafb","M23 50l7-7 7 7-7 7Z M43 38q14 12 0 24 M53 30q22 20 0 40 M64 23q33 27 0 54 M74 20q43 30 0 60","wide",45]],
    ["Oneiroiden",["#e3bc80","#98b6d2","M60 16Q39 34 46 51Q54 68 76 64Q58 88 34 75Q12 60 27 36Q38 19 60 16Z M65 31l7 5-7 5-7-5Z M31 65q13 7 25 3","nebula",46]],
    ["Kollektiden",["#e5b194","#a6b8f6","M32 22l16 10v18L32 61 16 50V32Z M68 22l16 10v18L68 61 52 50V32Z M50 52l15 10v11L50 83 35 73V62Z M32 45q18-13 36 0m-36 0 18 24 18-24","woven",47]],
    ["Solitiden",["#83dbde","#d0ae93","M24 18l13 11-4 15-15-5-3-12Z M69 22l15 12-5 15-17-7-2-12Z M47 53l14 11-3 17-19-4-3-16Z M24 18l2 13 11-2m32-7 3 13 12-1M47 53l2 16 12-5","crystal",48]],
    ["Memetiden",["#eea8ce","#e8ce8d","M20 27l15-10 15 10v18L35 55 20 45Z M50 54l15-10 15 10v18L65 82 50 72Z M28 32h14m-14 8h8 M58 59h14m-14 8h8 M43 47l15 12","cells",49]],
    ["Biomechnoiden",["#ebad86","#88d4df","M50 20Q25 8 20 39Q14 59 34 68l16 11 23-16V44h8V29H63V17Z M50 20v59m-17-46q8 6 8 14m-12 2q10 4 12 14m20-33h12m-12 9h12","mechanic",50]],
    ["Nanomorphen",["#80e3ec","#c6adf8","M50 18l28 15v31L50 81 22 64V33Z M22 33l28 16 28-16 M50 49v32 M34 42v10l8 5m24-17v10l-8 5m-24 4 7 4v8","mechanic",51]],
    ["Digitaliden",["#a0baf8","#81ebcd","M18 26h64v42H18Z M29 48l7-6-7-6m42 0-7 6 7 6 M43 52h14m-22 26h30m-15-10v10","mechanic",52]],
    ["Autokonstrukte",["#d7bc7e","#9bd7f6","M22 75h56v9H22Z M36 74V61l12-12 16 3 10-12-9-7m8-12 9 5-3 12-9-3-3-8Z M44 31a7 7 0 1 0 0 14a7 7 0 1 0 0-14Z","mechanic",53]],
    ["Technosymbionten",["#89dac8","#e1af8d","M16 55q-6-20 10-31q13-10 29 8 M84 45q6 20-10 31q-13 10-29-8 M31 37h18v26H31Z M51 37h18v26H51Z M38 45h24m-24 10h24","woven",54]],
    ["Rekombinanten",["#b8a1ed","#8ce2b6","M25 17Q25 39 50 50Q75 61 75 83M75 17Q75 39 50 50Q25 61 25 83 M32 24h36m-28 11h20m-20 30h20m-28 11h36","woven",55]],
    ["Protokoliden",["#8dcdf2","#d2de89","M50 18l14 14-14 14-14-14Z M23 60l11 11-11 11-11-11Z M77 60l11 11-11 11-11-11Z M36 32H23v28m41-28h13v28 M34 71h32","cells",56]],
    ["Hybriden",["#e5a8aa","#a9c9f0","M50 17L20 34v32l30 17 30-17V34Z M50 17v66M29 51l7-9 7 9-7 9Z M58 42h13v18H58Z M58 51h13","shell",57]],
]);

const reducedMotion = bewegungReduziert;
const canHover = matchMedia("(any-hover: hover)");
const forms = {
    arch: ["M8 88V50Q8 14 50 6Q92 14 92 50V88Q50 102 8 88Z", "M14 83H86M18 50Q18 21 50 13Q82 21 82 50"],
    rift: ["M9 28L63 2 95 23 83 72 42 98 5 72Z","M9 28L46 49 42 98M46 49L95 23M83 72L46 49"],
    root: ["M50 5C70 4 94 31 92 56C91 77 70 85 50 97C30 85 9 77 8 56C6 31 30 4 50 5Z","M20 46Q16 68 41 84M80 46Q84 68 59 84M50 80V96"],
    crystal: ["M50 2L83 18 98 51 80 85 50 99 20 85 2 51 17 18Z","M50 2L65 36 98 51 65 64 50 99 35 64 2 51 35 36Z"],
    wind: ["M0 35L22 15 50 23 78 15 100 35 77 66 63 91H37L23 66Z","M3 38L32 50 50 67 68 50 97 38M36 77L50 84 64 77"],
    shell: ["M50 3C75 5 94 17 96 34C99 63 79 91 50 98C21 91 1 63 4 34C6 17 25 5 50 3Z","M7 34Q25 17 50 16Q75 17 93 34M9 50L25 56M91 50L75 56M25 79L39 83M75 79L61 83"],
    fluid: ["M16 21C40 0 65 10 72 24C77 34 96 28 99 50C102 69 80 91 52 92C29 94 10 80 5 62C0 43 8 33 16 21Z","M9 62C29 71 46 19 91 46M22 82Q47 70 61 78T85 70"],
    nest: ["M50 4C75 10 95 32 95 55C95 80 76 94 50 98C24 94 5 80 5 55C5 32 25 10 50 4Z","M15 57C15 79 37 84 50 88C63 84 85 79 85 57M28 25Q50 9 72 25"],
    cells: ["M25 8H75L99 50 75 92H25L1 50Z","M25 8L37 28M75 8L63 28M25 92L37 72M75 92L63 72M1 50H25M99 50H75"],
    flame: ["M50 0L61 20 79 15 82 39 100 50 85 67 84 84 64 85 50 100 37 84 17 84 15 66 0 50 19 40 20 16 39 22Z","M15 50L32 43M68 43L85 50M30 76L39 66M61 66L70 76"],
    flare: ["M50 1L58 17 76 8 79 29 98 30 89 49 99 67 79 71 75 93 58 84 50 99 42 84 25 93 21 71 1 67 11 49 2 30 21 29 24 8 42 17Z","M50 13V29M75 19L66 35M87 66L72 59M50 88V71M13 66L28 59M25 19L34 35"],
    wide: ["M3 60Q21 18 50 13Q79 18 97 60L81 81Q50 96 19 81Z","M6 61Q50 40 94 61M15 72Q50 56 85 72M24 81Q50 71 76 81"],
    terrain: ["M3 64L15 37 33 30 48 8 66 22 78 18 97 46 91 81 58 95 20 89Z","M8 64Q21 48 39 50T75 38L91 44M12 76Q33 59 55 65T93 56M21 84Q41 73 64 80T83 69"],
    orbit: ["M5 53C5 23 29 7 50 7C77 7 95 27 95 50C95 77 74 93 50 93C28 93 5 78 5 53Z","M1 62C14 85 94 50 98 27M8 76C32 88 90 62 97 43"],
    nebula: ["M4 55C4 34 28 40 30 20C35 1 67 5 75 21C86 20 97 34 90 46C108 64 91 84 72 80C57 99 28 96 24 78C7 81 0 67 4 55Z","M13 62C31 70 25 24 58 21C73 18 81 32 78 43M26 77C37 94 76 77 84 65"],
    woven: ["M3 31L28 7 50 18 72 7 97 31 86 55 97 70 72 93 50 82 28 93 3 70 14 55Z","M7 31L50 68 93 31M7 69L50 32 93 69M28 8L72 92M72 8L28 92"],
    mechanic: ["M8 25L25 8H75L92 25V75L75 92H25L8 75Z","M13 37H23V23H38M62 23H77V37H87M13 63H23V77H38M62 77H77V63H87"],
};
const calm = new Set();
let frame = 0;
let lastDraw = 0;

function pigment(ctx, top, bottom) {
    const g = ctx.createLinearGradient(4, 10, 91, 94);
    g.addColorStop(0, top);
    g.addColorStop(1, bottom);
    return g;
}

function draw(logo, elapsed = 0) {
    const { ctx, glyph, framePath, detail, metal, light, family, index } = logo;
    const wave = Math.sin(elapsed / (8400 + index % 5 * 850) * Math.PI * 2);
    const running = elapsed > 0;
    ctx.clearRect(0, 0, 550, 200);
    ctx.save();
    ctx.translate(275, 100);

    const aura = ctx.createRadialGradient(0, 0, 18, 0, 0, 120);
    aura.addColorStop(0, light + "18");
    aura.addColorStop(.55, metal + "0b");
    aura.addColorStop(1, light + "00");
    ctx.fillStyle = aura;
    ctx.fillRect(-148, -100, 296, 200);

    const spread = ["wide", "wind", "terrain", "rift"].includes(family) ? 1.72 : 1.44;
    const height = family === "wide" ? 1.29 : 1.45;
    ctx.scale(spread, height);
    ctx.translate(-50, -50);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    // Halbtransparente Konturen statt einer geschlossenen Fläche hinter dem Motiv.
    ctx.lineWidth = .85;
    ctx.strokeStyle = pigment(ctx, metal + "96", light + "33");
    ctx.stroke(framePath);
    ctx.lineWidth = .55;
    ctx.strokeStyle = light + "35";
    ctx.stroke(detail);

    ctx.save();
    ctx.clip(framePath);
    ctx.translate(50, 50);
    if (running) {
        if (["wind", "fluid", "nebula", "wide"].includes(family)) ctx.scale(1 + wave * .035, 1 - wave * .042);
        else if (["orbit", "shell", "rift", "woven"].includes(family)) ctx.rotate(wave * .058);
        else ctx.scale(1 + wave * .021, 1 + wave * .021);
    }
    ctx.scale(.81, .81);
    ctx.translate(-50, -50);
    ctx.fillStyle = pigment(ctx, metal + "38", light + "09");
    ctx.fill(glyph, "evenodd");
    ctx.lineWidth = 3.6;
    ctx.strokeStyle = "#070b1273";
    ctx.stroke(glyph);
    ctx.lineWidth = 2.15;
    ctx.strokeStyle = pigment(ctx, metal, light);
    ctx.stroke(glyph);

    if (running) {
        const x = (elapsed / (8100 + index % 5 * 700) % 1) * 170 - 35;
        const sweep = ctx.createLinearGradient(x - 28, 48, x + 28, 57);
        sweep.addColorStop(0, light + "00");
        sweep.addColorStop(.5, light + "ef");
        sweep.addColorStop(1, light + "00");
        ctx.strokeStyle = sweep;
        ctx.shadowColor = light;
        ctx.shadowBlur = 4;
        ctx.lineWidth = 2.65;
        ctx.stroke(glyph);
    }
    ctx.restore();
    ctx.restore();
}

function tick(time) {
    frame = 0;
    if (time - lastDraw >= 32) {
        for (const logo of calm) draw(logo, Math.max(0, time - logo.entered));
        lastDraw = time;
    }
    if (calm.size) frame = requestAnimationFrame(tick);
}

function setMotion(logo, allowed) {
    if (allowed && !calm.has(logo)) {
        logo.entered = performance.now();
        calm.add(logo);
        if (!frame) frame = requestAnimationFrame(tick);
    } else if (!allowed && calm.delete(logo)) {
        draw(logo);
        if (!calm.size) {
            cancelAnimationFrame(frame);
            frame = 0;
        }
    }
}

for (const card of document.querySelectorAll("[data-spezies-emblem]")) {
    const motif = motive.get(card.dataset.speziesEmblem);
    if (!motif) continue;
    const [metal, light, shape, family, index] = motif;
    card.style.setProperty("--emblem-haupt", metal);
    card.style.setProperty("--emblem-akzent", light);
    card.dataset.emblemForm = family;
    const canvas = card.querySelector(".spezies-emblem");
    const ctx = canvas?.getContext("2d");
    if (!ctx || typeof Path2D !== "function") continue;

    const [outline, engraving] = forms[family];
    const logo = { ctx, glyph: new Path2D(shape), framePath: new Path2D(outline),
        detail: new Path2D(engraving), metal, light, family, index, entered: 0 };
    let pointerOver = false;
    let onScreen = false;
    const sync = () => setMotion(logo, pointerOver && onScreen && canHover.matches && !reducedMotion.matches);
    draw(logo);
    card.addEventListener("pointerenter", event => {
        pointerOver = event.pointerType === "mouse";
        sync();
    });
    const stop = () => { pointerOver = false; sync(); };
    card.addEventListener("pointerleave", stop);
    card.addEventListener("pointercancel", stop);
    reducedMotion.addEventListener("change", sync);
    canHover.addEventListener("change", sync);
    if ("IntersectionObserver" in window) {
        observeMediaVisibility(canvas, visible => {
            onScreen = visible;
            if (!visible) pointerOver = false;
            sync();
        });
    } else {
        onScreen = true;
        document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); });
    }
}
