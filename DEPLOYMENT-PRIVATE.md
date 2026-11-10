# Private Online-Board: Freigabevoraussetzungen

Das Repo bleibt privat und Änderungen werden zunächst ausschließlich auf einem Arbeitsbranch geprüft. Eine Online-Vorschau ist erst dann zugriffsgeschützt, wenn der gewählte Hosting-Anbieter den gesamten Site-Aufruf einschließlich `/admin` hinter Login/SSO oder einem Access-Gateway stellt. Die TinaCMS-Anmeldung allein schützt die veröffentlichte Website nicht.

Vor einem späteren Deploy müssen folgende Punkte im gewählten Hoster eingerichtet sein:

1. Private Preview/Deployment aktivieren; keine öffentliche Produktionsdomain zuweisen.
2. Site-Zugriff mit erlaubten Benutzerkonten absichern.
3. `PUBLIC_TINA_CLIENT_ID` und `TINA_TOKEN` als Hosting-Secrets setzen, nie in Git committen.
4. TinaCloud-Projekt auf das GitHub-Repo und einen Review-Branch verbinden.
5. Review-Schritte für Content- und Medienänderungen einschalten.

Der Anbieter ist noch nicht gewählt, deshalb werden hier keine Hosting- oder Auth-Provider behauptet oder konfiguriert. `.env.example` enthält nur leere Schlüssel.
