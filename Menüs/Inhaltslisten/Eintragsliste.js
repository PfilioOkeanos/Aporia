import '../TopBar/Top_bar.js';
import {applyAporiaRoutes, contentCategories} from '../adapter/aporia-routes.js';
const main=document.querySelector('.archive-list');
const key=document.body.dataset.contentList;
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
try{
 const response=await fetch(new URL('./eintraege.json',import.meta.url));if(!response.ok)throw Error('Katalog nicht erreichbar');
 const data=(await response.json())[key];if(!data)throw Error('Bereich nicht gefunden');
 const layouts={
  'Werkstatt & Herstellung':['workshop','Werkstattarchiv','Verfahren, Bauideen und Materialien erkunden.'],
  'Technologien':['workshop','Technologiearchiv','Technische Konzepte und ihre Grundlagen.'],
  'Ausrüstung & Gegenstände':['catalog','Ausrüstungskatalog','Gegenstände und Ausrüstung im Detail.'],
  'Fahrzeuge & Raumschiffe':['catalog','Fahrzeughangar','Fahrzeuge, Antriebe und Komponenten.'],
  'Bauwerke & Siedlungen':['atlas','Bauwerksatlas','Architektur, Lebensräume und Infrastruktur.'],
  'Flora & Fauna':['atlas','Naturarchiv','Lebewesen, Lebensräume und ökologische Zusammenhänge.'],
  'Charaktere & Persönlichkeiten':['dossier','Personenarchiv','Figuren, Beziehungen und überlieferte Informationen.'],
  'Geschichte & Ereignisse':['chronicle','Chronikarchiv','Ereignisse und historische Quellen entdecken.'],
  'Wirtschaft & Handel':['workshop','Wirtschaftsarchiv','Handelswege, Organisationen und wirtschaftliche Zusammenhänge.'],
  'Fähigkeiten & Evolution':['dossier','Entwicklungsarchiv','Entwicklung, Anpassung und Fähigkeiten erforschen.'],
  'Kultur & Zivilisation':['dossier','Kulturarchiv','Gemeinschaften, Überlieferungen und Lebensweisen.'],
  'Anomalien & Phänomene':['atlas','Beobachtungsarchiv','Ungewöhnliche Orte und Erscheinungen untersuchen.'],
  'Medien & Unterhaltung':['media','Mediathek','Bilder, Aufnahmen und Filme aus dem Archiv.'],
  'Spielsysteme':['workshop','Systemhandbuch','Mechaniken und ihre Verbindungen in der Spielwelt.']
 };
 const [layout,layoutTitle,description]=layouts[data.category]||['catalog','Archiv','Einträge aus dem Weltenarchiv.'];
 document.body.dataset.listTheme=data.theme;
 document.body.dataset.archiveLayout=layout;
 main.replaceChildren();
 const hero=el('header','list-hero');const heroImage=data.entries.find(e=>e.type==='Bild');if(heroImage){const image=el('img');image.src=heroImage.url;image.alt='';hero.append(image);}
 const copy=el('div','hero-copy');const back=el('a','back',data.category+' › Übersicht');back.dataset.route=data.back;copy.append(back,el('p','eyebrow','APORIA · EINTRAGSARCHIV'),el('h1','',data.title),el('p','subtitle','Medien, Themen und Quellen aus dem Weltenarchiv'));hero.append(copy);main.append(hero);
 hero.querySelector('.eyebrow').textContent='APORIA · '+layoutTitle.toUpperCase();
 hero.querySelector('.subtitle').textContent=description;
 const overview=el('section','archive-context');
 const intro=el('div','context-copy');intro.append(el('span','context-kicker',layoutTitle),el('h2','',data.title+' entdecken'),el('p','',description));overview.append(intro);
 const counts=el('div','context-counts');for(const [type,label] of [['Bild','Motive'],['Infomaterial','Quellen'],['Audio','Aufnahmen'],['Video','Filme']]){const count=data.entries.filter(e=>e.type===type).length;if(count){const item=el('div','context-count');item.append(el('b','',String(count)),el('span','',label));counts.append(item);}}overview.append(counts);main.append(overview);
 const siblings=el('nav','topic-links');siblings.setAttribute('aria-label','Weitere Themen dieser Hauptgruppe');for(const child of contentCategories.find(c=>c.route===data.back)?.children||[]){const a=el('a','',child.label);a.dataset.route=child.route;if(child.route===key)a.setAttribute('aria-current','page');siblings.append(a);}main.append(siblings);
 const toolbar=el('section','list-toolbar');toolbar.setAttribute('aria-label','Einträge filtern');
 const search=el('input');search.type='search';search.placeholder='Einträge durchsuchen …';search.setAttribute('aria-label','Einträge durchsuchen');
 function select(label,options){const wrapper=el('label','filter',label+' '),s=el('select');for(const [value,text] of options){const o=el('option','',text);o.value=value;s.append(o);}wrapper.append(s);toolbar.append(wrapper);return s;}
 toolbar.append(search);
 const type=select('Typ',[['','Alle'],['Bild','Bilder'],['Audio','Audio'],['Video','Video'],['Infomaterial','Infomaterial']]);
 const status=select('Quellen',[['','Alle'],['Mit Infomaterial','Mit Infomaterial'],['Medienmotiv','Medienmotive']]);
 const sort=select('Sortierung',[['title','Titel A–Z'],['date','Dateidatum ↓']]);
 const views=el('div','views');let view='grid';for(const [v,label] of [['grid','Karten'],['rows','Liste']]){const b=el('button','',label);b.type='button';b.setAttribute('aria-pressed',String(v===view));b.onclick=()=>{view=v;for(const btn of views.children)btn.setAttribute('aria-pressed',String(btn===b));render();};views.append(b);}toolbar.append(views);main.append(toolbar);
 const tally=el('p','tally');tally.setAttribute('aria-live','polite');const results=el('section','entries');results.setAttribute('aria-label','Archiv-Einträge');const pager=el('nav','pager');pager.setAttribute('aria-label','Ergebnisseiten');main.append(tally,results,pager);
 let page=1;const size=24;
 function render(){
  const query=search.value.trim().toLocaleLowerCase('de');const entries=data.entries.filter(e=>(!type.value||e.type===type.value)&&(!status.value||e.status===status.value)&&(!query||(e.title+' '+e.source+' '+(e.excerpt||'')).toLocaleLowerCase('de').includes(query))).sort((a,b)=>sort.value==='date'?b.date.localeCompare(a.date):a.title.localeCompare(b.title,'de',{numeric:true}));
  const pages=Math.max(1,Math.ceil(entries.length/size));page=Math.min(page,pages);results.replaceChildren();results.dataset.view=view;
  tally.textContent=entries.length+' Einträge · '+data.category+' / '+data.title;
  for(const e of entries.slice((page-1)*size,page*size)){
   const card=el('details','entry');card.dataset.entryType=e.type;const summary=el('summary');const preview=el('div','preview');if(e.type==='Bild'){const img=el('img');img.src=e.url;img.alt=e.title;img.loading='lazy';preview.append(img);}else preview.append(el('span','media-symbol',e.type==='Audio'?'♫':e.type==='Infomaterial'?'▤':'▶'));
   const title=el('div','entry-title');title.append(el('small','',e.type+' · '+data.title),el('h2','',e.title),el('span','badge',e.status));summary.append(preview,title,el('span','expand','＋'));card.append(summary);
   const body=el('div','entry-body');body.append(el('p','',e.status==='Medienmotiv'?'Dieses Motiv ist anhand seines Dateinamens oder Projektordners diesem Thema zugeordnet. Ein eigenes Dossier ist noch nicht hinterlegt.':'Zu diesem Thema liegt zusätzliches Infomaterial aus dem Projekt vor.'));
   body.append(el('p','source','Datei: '+e.source),el('p','source','Dateidatum: '+e.date));
   if(e.excerpt){body.append(el('h3','','Auszug aus dem Infomaterial'),el('p','document-excerpt',e.excerpt));}
   if(e.type==='Audio'||e.type==='Video'){const player=el(e.type==='Audio'?'audio':'video');player.controls=true;player.preload='none';player.src=e.url;player.setAttribute('aria-label',e.title);if(e.type==='Video')player.playsInline=true;body.append(player);}
   const original=el('a','open-source','Originaldatei öffnen ↗');original.href=e.url;original.target='_blank';original.rel='noopener';body.append(original);
   for(const source of e.sources){const link=el('a','open-source','Infomaterial: '+source.title);link.href=source.url;link.target='_blank';link.rel='noopener';body.append(link);}
   if(e.excerpt){const teaser=el('p','entry-teaser',e.excerpt.slice(0,220)+' …');title.append(teaser);}
   card.append(body);results.append(card);
   if(layout==='media'&&(e.type==='Audio'||e.type==='Video'))card.open=true;
   card.addEventListener('toggle',()=>{if(!card.open)card.querySelectorAll('audio,video').forEach(p=>p.pause());});
  }
  if(!entries.length)results.append(el('p','empty',data.entries.length?'Keine Einträge für diese Filter.':'Für diesen Bereich sind noch keine eindeutig zuordenbaren Medien vorhanden. Die Seite ist für weitere Einträge vorbereitet.'));
  pager.replaceChildren();const previous=el('button','','← Zurück'),next=el('button','','Weiter →');previous.disabled=page<=1;next.disabled=page>=pages;previous.onclick=()=>{page--;render();};next.onclick=()=>{page++;render();};pager.append(previous,el('span','','Seite '+page+' / '+pages),next);
 }
 for(const input of [search,type,status,sort])input.addEventListener(input===search?'input':'change',()=>{page=1;render();});
 render();applyAporiaRoutes(document);
}catch(error){main.replaceChildren(el('h1','','Eintragsliste'),el('p','','Die Einträge konnten nicht geladen werden. Bitte die Seite über den lokalen Webserver öffnen oder erneut laden.'));console.error(error);}
