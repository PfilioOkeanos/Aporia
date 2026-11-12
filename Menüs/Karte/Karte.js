import { getAporiaRoute } from "../adapter/aporia-routes.js";
const entries = {
 universe:{type:"KOSMISCHE EBENE",title:"Universum Aporia",copy:"Der gesamte bekannte Kosmos. Von hier führt die Karte über großräumige Strukturen bis zu einzelnen Welten.",meta:"Oberste Ebene der kosmischen Ordnung."},
 web:{type:"GROSSSTRUKTUR",title:"Cosmic Web",copy:"Ein Netz aus Filamenten, Knoten und weitläufigen Leerräumen verbindet die größten Strukturen des Universums.",meta:"Darstellung schematisch, nicht maßstabsgetreu."},
 filament:{type:"KOSMISCHES FILAMENT",title:"Lokales Filament",copy:"Ein großräumiger Strang des Cosmic Web. Entlang solcher Strukturen liegen Galaxiengruppen und Superhaufen.",meta:"Name und Nachbarschaften werden später ergänzt."},
 supercluster:{type:"SUPERHAUFEN",title:"Laniakea",copy:"Der Superhaufen, in dem die Milchstraße und damit das Heimatsystem der Menschen liegt.",meta:"Kosmischer Bezugspunkt für den bekannten lokalen Raum."},
 cluster:{type:"GALAXIENHAUFEN",title:"Lokaler Galaxienhaufen",copy:"Diese Ebene ordnet Galaxien innerhalb des Superhaufens. Die Karte hält den Pfad bis zur Milchstraße bereit.",meta:"Einzelne Haufen werden später eingetragen."},
 galaxy:{type:"GALAXIE",title:"Milchstraße",copy:"Die Heimatgalaxie der Menschheit. In ihrer Orion-Spur liegt der für die Karte wichtige Sektor 02.",meta:"Galaxienansicht wird später ergänzt."},
 sector:{type:"SEKTOR",title:"Orion-Spur · Sektor 02",copy:"Der lokale Kartenbereich des Sonnensystems. Von hier geht es weiter zu Sternen und ihren Planetensystemen.",meta:"Lokales Bezugssystem innerhalb der Orion-Spur."},
 shapley:{type:"KARTENMARKER",title:"Shapley-Region",copy:"Ein weiterer eingetragener Großraum. Dieser Marker ist vorerst Orientierung auf der schematischen Übersicht.",meta:"Detaillierter Eintrag folgt."},
 perseus:{type:"KARTENMARKER",title:"Perseus–Pisces",copy:"Eine markierte Region des kosmischen Netzes. Weitere Hierarchie- und Dossierdaten können später ergänzt werden.",meta:"Detaillierter Eintrag folgt."},
 comas:{type:"KARTENMARKER",title:"Coma-Region",copy:"Ein Orientierungspunkt in der Übersicht der kosmischen Großstrukturen.",meta:"Detaillierter Eintrag folgt."},
 horologium:{type:"KARTENMARKER",title:"Horologium–Reticulum",copy:"Eine weitere markierte Großregion. Die Karte kann mit späteren Einträgen erweitert werden.",meta:"Detaillierter Eintrag folgt."},
 orvaya:{type:"STERNENSYSTEM",title:"Orvaya-System",copy:"Das Heimatsystem der Waldfeen. Öffne von hier das Orvaya-Dossier.",meta:"Verknüpft mit dem Planetendossier Orvaya.",route:"orvaya",label:"Orvaya-Dossier öffnen"}
};
const viewport=document.querySelector("[data-map-viewport]"),space=document.querySelector("[data-map-space]"),panel=document.querySelector("[data-info-panel]");
const title=panel.querySelector("[data-info-title]"),type=panel.querySelector("[data-info-type]"),copy=panel.querySelector("[data-info-copy]"),meta=panel.querySelector("[data-info-meta]"),link=panel.querySelector("[data-info-link]");
let zoom=1,panX=0,panY=0,drag=null;
function renderTransform(){space.style.setProperty("--zoom",zoom);space.style.setProperty("--pan-x",panX+"px");space.style.setProperty("--pan-y",panY+"px")}
function showEntry(key,pin=false){const entry=entries[key];if(!entry)return;document.querySelectorAll(".map-node").forEach(n=>n.classList.toggle("is-selected",n.dataset.node===key&&pin));type.textContent=entry.type;title.textContent=entry.title;copy.textContent=entry.copy;meta.textContent=entry.meta;link.hidden=!entry.route;if(entry.route){const href=getAporiaRoute(entry.route);if(href){link.href=href;link.textContent=entry.label}else link.hidden=true}}
document.querySelectorAll(".map-node").forEach(node=>{node.addEventListener("mouseenter",()=>showEntry(node.dataset.node));node.addEventListener("focus",()=>showEntry(node.dataset.node));node.addEventListener("click",()=>showEntry(node.dataset.node,true))});
document.querySelectorAll("[data-zoom]").forEach(button=>button.addEventListener("click",()=>{zoom=Math.min(1.65,Math.max(.65,zoom+(button.dataset.zoom==="in"?.15:-.15)));renderTransform()}));
document.querySelector("[data-reset]").addEventListener("click",()=>{zoom=1;panX=0;panY=0;renderTransform()});
viewport.addEventListener("wheel",e=>{e.preventDefault();zoom=Math.min(1.65,Math.max(.65,zoom+(e.deltaY<0?.08:-.08)));renderTransform()},{passive:false});
viewport.addEventListener("pointerdown",e=>{if(e.target.closest(".map-node"))return;drag={x:e.clientX-panX,y:e.clientY-panY};viewport.classList.add("is-dragging");viewport.setPointerCapture(e.pointerId)});
viewport.addEventListener("pointermove",e=>{if(!drag)return;panX=e.clientX-drag.x;panY=e.clientY-drag.y;renderTransform()});
function stopDrag(){drag=null;viewport.classList.remove("is-dragging")};viewport.addEventListener("pointerup",stopDrag);viewport.addEventListener("pointercancel",stopDrag);renderTransform();
