# Teryn-System – Arbeitsstand fehlende Himmelskörperkarten

Stand: 23.11.2026

## Auftrag
Nur Teryn-Systemkörper ergänzen, für die noch keine Himmelskörperkarte existiert. Keine bereits ausgearbeiteten Karten/Assets überschreiben. Bestehende Karten- und Dossiergeneratoren, Bildarchive, Medienadapter und Kategorien verwenden.

## Quelle und Zielstruktur
- Systemdaten: `scripts/planeten/systeme/teryn-system.json`
- Kartenobjekte: `Menüs/adapter/Sternenkarte/Kartendaten/objekte.json`
- Dossier-Templates/Generator: `scripts/planeten/koerper-bauen.mjs`, `scripts/planeten/planetendossier.mjs`, `scripts/planeten/kapitel-bauen.mjs`
- Himmelskörperkategorien: `inhalte/himmelskoerper/{planeten,monde,asteroiden,kometen,sterne,...}`
- Bildassets: `assets/bilder/Himmelskörper/<passende-Untergruppe>/<dossier-slug>/hauptseite/`
- Bildarchive je Kategorie: `inhalte/himmelskoerper/<kategorie>/bildarchiv.json`
- Medienadapter: `inhalte/medien/medien.json`

## Bereits vorhandene Dossiers – nicht anfassen
Iskara, Veldros, Othes, Kaltor und Saevor haben bereits Karten/Dossierlinks.

## Fehlt noch (Teryn-Stern plus 18 Körper)
Teryn; Dareth; Nura; Thenn; Elvar; Tovek; Phel; Veylan-Asteroidengürtel; Mirven; Rhal; Orima; Kesth; Droven; Ynderal; Veraq; Teshil; Narim; äußere Kleinkörperregion; Nemor.

## Schon begonnen
- Einzelbild für Teryn (orangefarbener K4V-Stern) erzeugt und abgelegt unter `assets/bilder/Himmelskörper/Sterne/elaris-a/hauptseite/Teryn.png`.
- Noch zu verknüpfen: Bildarchiv, `medien.json`, Kartenobjekt `archivLink`/Vorschau und Dossierordner.

## Nächste Schritte
1. Für jeden fehlenden Körper Daten aus der Systemdatei konkretisieren (nur neue Karten, keine Änderungen an bestehenden Einträgen).
2. Je fehlendem Objekt ein individuelles Bild generieren und im passenden Asset-Unterordner ablegen.
3. Je Kategorie einen neuen Bildarchiv-Eintrag und passende Medien-ID hinzufügen.
4. Für neue Körper die Sternenkartenobjekte gezielt ergänzen; bestehende Objektwerte unverändert lassen.
5. Vorlagenordner je Kategorie für neue Slugs anlegen und mit den vorhandenen Dossiergeneratoren befüllen.
6. Kategorieübersichten/Karten prüfen, damit alle neuen Körper korrekt verlinkt sind.

## Hinweis zu den Bauskripten
`koerper-bauen.mjs` benötigt einen vorhandenen Dossierpfad (`archivLink`) und ein Templatekapitelgerüst. Vor dem Lauf nur fehlende Objektpfade und fehlende Ordner anlegen. Der Generator respektiert manuell gepflegte `.inhalt.json`-Dateien ohne `_erzeugt: "koerper-bauen"`; bestehende Karten nicht neu bauen.

## Fortschritt nach Wiederaufnahme (23.11.2026)
- Unverändert vorhandene Dossiers: Iskara, Veldros, Othes, Kaltor, Saevor.
- Teryn-Sternbilddatei vorhanden: `assets/bilder/Himmelskörper/Sterne/elaris-a/hauptseite/Teryn.png`.
- Wichtig: Die zunächst übertragenen Bildziele Dareth, Nura, Thenn, Elvar, Tovek, Phel, Veylan und Mirven sind aktuell leere Ordner mit `.png`-Namen, keine Bilddateien. Diese müssen vor Verlinkung durch gültige PNGs ersetzt werden.
- Keine neuen Sternenkarten- oder Archivverknüpfungen für diese fehlenden Objekte sind bislang erfolgt.
- Das Git-Arbeitsverzeichnis enthält zahlreiche andere bestehende Änderungen; diese nicht anfassen. Vor Änderungen nur gezielt die Teryn-Zieldateien prüfen.
- Nächster Schritt: valide Einzelbilder erzeugen und nachweislich als Dateien (nicht Ordner) speichern; erst danach Medienadapter, Bildarchive, Kartenobjekte und Dossiers ergänzen.
