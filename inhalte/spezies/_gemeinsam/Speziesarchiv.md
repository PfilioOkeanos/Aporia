# Speziesarchiv als Vorlage

Die Mykonoiden sind die erste Anwendung. Für eine weitere Spezies die acht Seitenordner als Vorlage verwenden und Namen, Bilder und Texte ersetzen. Die Hauptseite nutzt home-hero, facts und card-grid. Fachseiten nutzen archive-banner, chapter-block und chapter-reverse. Für das Medienarchiv stehen gallery-layout, media-cards und model zur Verfügung.

In der Spezies.js den Namen und den Routenschlüssel an initializeSpeciesArchive übergeben. Die Übersicht und ihre sieben Fachrouten im Aporia-Adapter eintragen. Pro Seite den Ordnernamen in data-species-page und data-species-navigation als Einhängepunkt für die Topbar verwenden. Die Mykonoiden-Medienlogik kann mit denselben Galerie-Markierungen und anderen Bildkategorien übernommen werden.

Farben an der jeweiligen Spezies über --archive-background, --archive-text, --archive-edge, --archive-glow, --archive-accent und --archive-panel anpassen. Unter chapter-visual kann ein Bild, ein Bildausschnitt oder ein Symbol stehen. Fachquellen im jeweiligen Info-Material pflegen.

## Wissensraster

wissenslayout.css und arrangeKnowledgeCards aus wissenslayout.js sind auch ohne die Archiv-Topbar einsetzbar. Das Raster erkennt chapter-block in source-content und species-detail-panel in species-detail-panels. Kartentypen lassen sich über data-card-type vorgeben: bildtext, textbild, thema, fakten, fach, vergleich, galerie, besonderheit oder vollbreite. Für Varianten und Bildreihen stehen data-comparison und data-gallery bereit. Ohne Vorgabe bestimmen Bilder, Tabellen und Textumfang die Breite.
