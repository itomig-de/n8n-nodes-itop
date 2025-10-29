# n8n Community Node - Entwicklungsumgebung Setup Anleitung

Eine vollständige Schritt-für-Schritt-Anleitung zum Einrichten einer professionellen Entwicklungsumgebung für n8n Community Nodes.

---

## 📋 Voraussetzungen

### Systemanforderungen
- **Node.js**: Version 18.17.0 oder höher (empfohlen: Node.js 20 LTS)
- **npm**: Kommt mit Node.js (alternativ: pnpm oder yarn)
- **Git**: Für Versionskontrolle
- **Code Editor**: VS Code (empfohlen)

### Installationsprüfung
```bash
# Node.js Version prüfen
node --version  # Sollte >= v18.17.0 sein

# npm Version prüfen
npm --version

# Git Version prüfen
git --version
```

---

## 🚀 1. Neuen Node erstellen

### Option A: Mit npm create (Empfohlen - Schnellste Methode)

```bash
# Interaktive Node-Erstellung
npm create @n8n/node@latest

# Oder mit Name als Argument
npm create @n8n/node@latest n8n-nodes-mein-service

# Mit Template-Auswahl
npm create @n8n/node@latest n8n-nodes-mein-service -- --template declarative/custom
```

**Der interaktive Wizard fragt:**
- Node-Name (muss mit `n8n-nodes-` beginnen)
- Node-Typ: 
  - **HTTP API** (empfohlen für REST APIs - schnellere Approval)
  - **Other** (programmatisch - volle Flexibilität)
- Template (bei HTTP API):
  - **GitHub Issues API** - Beispiel mit mehreren Operations
  - **Start from scratch** - Leeres Template
- API Base URL (bei HTTP API)
- Authentifizierungstyp:
  - API Key
  - OAuth2
  - Basic Auth
  - None

### Option B: Von Template Repository (Alternative)

```bash
# 1. Repository als Template verwenden (via GitHub UI)
# Gehe zu: https://github.com/n8n-io/n8n-nodes-starter
# Klicke "Use this template" → "Create a new repository"

# 2. Dein neues Repository clonen
git clone https://github.com/<dein-username>/n8n-nodes-mein-service.git
cd n8n-nodes-mein-service

# 3. Dependencies installieren
npm install
```

---

## 📁 2. Projektstruktur verstehen

Nach der Erstellung hast du folgende Struktur:

```
n8n-nodes-mein-service/
├── src/
│   ├── nodes/
│   │   └── MeinService/
│   │       ├── MeinService.node.ts       # Haupt-Node-Logik
│   │       └── MeinService.node.json     # Node-Metadaten
│   └── credentials/
│       ├── MeinServiceApi.credentials.ts  # Auth-Logik
│       └── MeinServiceApi.credentials.json # Credential-Metadaten
├── package.json                           # Projekt-Konfiguration
├── tsconfig.json                          # TypeScript-Konfiguration
├── .eslintrc.js                          # Linting-Rules
└── README.md                             # Dokumentation
```

---

## 🎯 3. package.json konfigurieren

Öffne `package.json` und überprüfe/bearbeite:

```json
{
  "name": "n8n-nodes-mein-service",
  "version": "0.1.0",
  "description": "n8n Community Node für [Dein Service]",
  "keywords": [
    "n8n-community-node-package"
  ],
  "license": "MIT",
  "homepage": "https://github.com/<dein-username>/n8n-nodes-mein-service",
  "author": {
    "name": "Dein Name",
    "email": "deine.email@example.com"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/<dein-username>/n8n-nodes-mein-service.git"
  },
  "n8n": {
    "n8nNodesApiVersion": 1,
    "nodes": [
      "dist/nodes/MeinService/MeinService.node.js"
    ],
    "credentials": [
      "dist/credentials/MeinServiceApi.credentials.js"
    ]
  }
}
```

**Wichtig:**
- Name **muss** mit `n8n-nodes-` beginnen
- Keyword `n8n-community-node-package` ist **erforderlich**
- License sollte `MIT` sein (für Verification)
---

## 🛠️ 4. Entwicklungsumgebung testen

### Node bauen

```bash
# TypeScript kompilieren
npm run build
```

### Entwicklungsserver starten (mit Hot Reload)

```bash
# n8n mit deinem Node starten
npm run dev

# Oder manuell
npx n8n-node dev
```

Dies startet:
- n8n auf `http://localhost:5678`
- Mit deinem Node geladen
- Hot reload aktiviert (Änderungen werden automatisch neu geladen)

### Browser öffnen

1. Öffne `http://localhost:5678`
2. Erstelle einen neuen Workflow
3. Klicke auf "+" oder drücke `Tab`
4. Suche nach deinem Node-Namen (z.B. "MeinService")

⚠️ **Wichtig**: Suche nach dem **Node-Namen**, nicht dem Package-Namen!
- ✅ Richtig: Suche nach "MeinService"
- ❌ Falsch: Suche nach "n8n-nodes-mein-service"

---

## 🧪 5. Linting und Testing

### Linter ausführen

```bash
# Fehler prüfen
npm run lint

# Automatisch beheben
npm run lint:fix

# Oder mit n8n-node CLI
npx @n8n/scan-community-package n8n-nodes-mein-service
```

### Vor dem Commit immer linting prüfen!

```bash
npm run lint && git commit -m "Your message"
```

---

## 🔄 6. Workflow für die Entwicklung

### Typischer Entwicklungszyklus

```bash
# 1. Neue Feature-Branch erstellen
git checkout -b feature/neue-operation

# 2. Dev-Server im Hintergrund laufen lassen
npm run dev

# 3. Code editieren in VS Code
# - src/nodes/MeinService/MeinService.node.ts
# - Änderungen werden automatisch neu geladen

# 4. Im Browser testen
# - http://localhost:5678
# - Workflow erstellen und testen

# 5. Linting prüfen
npm run lint:fix

# 6. Commit
git add .
git commit -m "feat: neue Operation hinzugefügt"

# 7. Push
git push origin feature/neue-operation
```

---

## 📦 7. Für npm vorbereiten

### Build erstellen

```bash
# Produktion Build
npm run build

# Testen ob das Package funktioniert
npm pack

# Dies erstellt: n8n-nodes-mein-service-0.1.0.tgz
```

### Lokales Testing des npm Packages

```bash
# In einem anderen Verzeichnis
npm install /pfad/zu/n8n-nodes-mein-service-0.1.0.tgz
```

---

## ✅ 8. Checkliste vor der Veröffentlichung

Stelle sicher:

- [ ] Package-Name beginnt mit `n8n-nodes-`
- [ ] Keyword `n8n-community-node-package` ist gesetzt
- [ ] License ist `MIT`
- [ ] README.md ist vollständig
- [ ] Repository ist öffentlich auf GitHub
- [ ] `npm run lint` läuft fehlerfrei durch
- [ ] Node funktioniert in lokalem n8n
- [ ] Keine runtime dependencies (für Verification)
- [ ] Alles ist auf Englisch (Code, Docs, Error Messages)
- [ ] .gitignore ist korrekt konfiguriert

---

## 🚢 9. Auf npm veröffentlichen

### npm Account erstellen

```bash
# Falls noch nicht geschehen
npm adduser

# Oder einloggen
npm login
```

### Package veröffentlichen

```bash
# Mit n8n-node CLI (empfohlen)
npm run release

# Oder manuell
npm publish --access public
```

### Version erhöhen für Updates

```bash
# Patch (0.1.0 -> 0.1.1)
npm version patch

# Minor (0.1.0 -> 0.2.0)
npm version minor

# Major (0.1.0 -> 1.0.0)
npm version major

# Danach publishen
npm publish
```

---

## 🔍 10. Troubleshooting

### Node erscheint nicht in n8n

```bash
# Cache löschen
rm -rf ~/.n8n-node-cli/.n8n/custom

# Dev-Server neu starten
npm run dev
```

### TypeScript Fehler

```bash
# node_modules löschen und neu installieren
rm -rf node_modules package-lock.json
npm install
```

### Linting Fehler

```bash
# Automatisch beheben
npm run lint:fix

# Konfiguration in .eslintrc.js anpassen
# ABER: Für Verification muss strict mode an bleiben!
```

### Build Fehler

```bash
# Sicherstellen dass TypeScript installiert ist
npm install --save-dev typescript

# tsconfig.json überprüfen
npm run build -- --verbose
```

---

## 📚 11. Nützliche Ressourcen

### Dokumentation
- [n8n Node Development Docs](https://docs.n8n.io/integrations/creating-nodes/)
- [n8n API Reference](https://docs.n8n.io/integrations/creating-nodes/build/reference/)
- [Verification Guidelines](https://docs.n8n.io/integrations/creating-nodes/build/reference/verification-guidelines/)

### Beispiele
- [n8n's eigene Nodes](https://github.com/n8n-io/n8n/tree/master/packages/nodes-base/nodes)
- [n8n-nodes-starter](https://github.com/n8n-io/n8n-nodes-starter)
- [Community Nodes Directory](https://github.com/restyler/awesome-n8n)

### Community
- [n8n Community Forum](https://community.n8n.io/)
- [n8n Discord](https://discord.gg/n8n)

---

## 🎓 12. Best Practices

### Code-Organisation
```typescript
// Klare Struktur in node.ts
export class MeinService implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Mein Service',
    name: 'meinService',
    icon: 'file:meinservice.svg',
    group: ['transform'],
    version: 1,
    description: 'Interagiert mit Mein Service API',
    defaults: {
      name: 'Mein Service',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'meinServiceApi',
        required: true,
      },
    ],
    properties: [
      // Node-Parameter hier
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    // Execution Logic hier
  }
}
```

### Git Commit Messages
```bash
# Conventional Commits verwenden
git commit -m "feat: neue Operation für Daten abrufen"
git commit -m "fix: Fehler bei Authentifizierung behoben"
git commit -m "docs: README aktualisiert"
git commit -m "refactor: Code-Struktur verbessert"
```

### Testing Workflow
1. Schreibe Code
2. Teste im Dev-Server
3. Teste verschiedene Szenarien
4. Prüfe Error Handling
5. Dokumentiere in README
6. Commit & Push

---

## 🎯 Quick Reference

### Häufigste Befehle

```bash
# Projekt erstellen
npm create @n8n/node@latest

# Entwicklung starten
npm run dev

# Build erstellen
npm run build

# Linting
npm run lint
npm run lint:fix

# Veröffentlichen
npm run release

# Version erhöhen
npm version patch|minor|major
```

### Dateistruktur Quick-Check

```
✅ package.json (mit n8n config)
✅ src/nodes/[Name]/[Name].node.ts
✅ src/credentials/[Name]Api.credentials.ts
✅ README.md
✅ .gitignore
✅ LICENSE (MIT für Verification)
```

---

## 🚀 Los geht's!

Du bist jetzt bereit, deinen eigenen n8n Community Node zu entwickeln!

### Nächste Schritte:
1. Führe `npm create @n8n/node@latest` aus
2. Starte den Dev-Server mit `npm run dev`
3. Öffne `http://localhost:5678` und teste deinen Node
4. Lies die [n8n Node Development Docs](https://docs.n8n.io/integrations/creating-nodes/)
5. Schau dir Beispiel-Nodes auf GitHub an

**Viel Erfolg mit deinem n8n Community Node! 🎉**

---

*Letzte Aktualisierung: Oktober 2025*
*Basierend auf n8n-node CLI und aktuellen Best Practices*
