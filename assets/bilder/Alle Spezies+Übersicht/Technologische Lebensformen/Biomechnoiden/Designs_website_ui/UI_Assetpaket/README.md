# APORIA – Biomechnoiden | Bild- und UI-Assetpaket

Dieses Paket ist für das lokale APORIA-Weltenarchiv (HTML/CSS/JS) vorbereitet.
Alle neu getrennten UI-Einzelteile sind **PNG mit Alphakanal**. Enthalten sind
außerdem die neun Seitenentwürfe, Ausschnitte aus diesen Entwürfen und die
vom Nutzer bereitgestellten ursprünglichen Referenzbilder.

## Verzeichnisstruktur

- `ui/rahmen/`: transparente Content-, Portrait- und Bildrahmen
- `ui/navigation/`: Sidebar, Tabs und Navigationsmuster
- `ui/buttons/`: Button-Grafiken für Normal/Hover/Aktiv; mit und ohne Text
- `ui/icons/`: biomechanische Navigations- und Fachbereichsicons
- `ui/ornamente/`: Kristallmotive, Linien, Eckdekorationen, Scrollleisten
- `ui/status/`: Hinweise, Schalter, Fortschritts- und Auswahlgrafiken
- `ui/panels/`: Hintergrundtexturen, Info- und Datenpanels
- `bildmotive/konzeptausschnitte/`: Ausschnitte der bereits generierten Seitenkonzepte
- `designvorlagen/`: neun vollständige Seiten-Mockups (JPEG), nicht als Live-Webseite gedacht
- `quellatlanten/`: generierte Assetbögen (WebP) zur manuellen Weiterbearbeitung
- `referenzen/vom_nutzer/`: ursprünglich bereitgestellte Bildreferenzen, unverändert
- `katalog/`: Übersichtsbilder der transparenten UI-Grafiken samt Dateinamen
- `asset_manifest.json`: maschinenlesbare Liste jedes Bildes, Name und Herkunft

## Wichtige Hinweise für die Integration

1. Für echte Website-Texte HTML nutzen; die bildhaften Rahmen und Icons enthalten nach Möglichkeit **keine Beschriftung**.
2. Die Elemente mit `_mit_schrift` und `_beispiel` sind Designmuster und enthalten Pixeltext. Für dynamische Tabs/Buttons die Varianten `_ohne_text` verwenden.
3. Die transparenten Grafiken wurden aus generierten UI-Atlanten ausgeschnitten. Teilweise enthalten die großen Rahmen noch dunkle Schattierungen und innen transparente Bereiche, weil die Grafik selbst organisch aufgebaut ist.
4. Rahmen mit unregelmäßigen Ecken möglichst als Overlay per `position:absolute; pointer-events:none` oder als CSS `border-image` nutzen; nicht unproportional strecken.
5. Die Bilder in `bildmotive/konzeptausschnitte/` stammen aus fertigen Mockups und können **eingebackene UI-Teile und Schrift** enthalten. Das sind visuelle Platzhalter, nicht saubere eigenständige Hero-Illustrationen.
6. Die Ordner `referenzen/vom_nutzer/` enthalten ursprüngliche Referenzbilder und sind **keine neu generierten Bilder**. Vor Veröffentlichung bitte Nutzungsrechte klären.
7. Für neue selbstständige Illustrationen ohne eingebackene UI sind weitere Produktionsbilder erforderlich.
8. Die Daten in Mockups sind gestalterisch, nicht automatisch APORIA-Kanon (keine erfundenen Jahreszahlen, Gaswerte, Städtenamen oder Speziesmerkmale übernehmen).

## Bild-Beschriftung

Jede Datei besitzt einen beschreibenden Namen und eine erläuternde Zeile im Manifest.
Die Kontaktbögen im Ordner `katalog` zeigen die Namen direkt unter den Grafiken.

## Umfang

- Insgesamt 104 Bilder in der Sammlung.
- Transparente UI-Assets: 74 Einzelgrafiken.
- Neun Designvorlagen.
- Sechs ursprünglich bereitgestellte Referenzen.

Die Kategorieübersicht und genauen Pixeldimensionen stehen in `asset_manifest.json`.
