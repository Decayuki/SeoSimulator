# 🎮 SEO/SEA Simulator - Serious Game

> Serious game pédagogique pour apprendre le référencement naturel (SEO) et payant (SEA) de manière interactive et ludique.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-19.2.0-61dafb)
![Vite](https://img.shields.io/badge/Vite-7.2.2-646cff)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.17-38bdf8)

## 📋 Table des matières

- [À propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Installation](#-installation)
- [Utilisation](#-utilisation)
- [Architecture](#-architecture)
- [Technologies](#-technologies)
- [Progression](#-progression)
- [Contribuer](#-contribuer)

## 🎯 À propos

**SEO/SEA Simulator** est un serious game conçu pour l'enseignement du marketing digital. Il permet aux étudiants et professionnels d'apprendre :

- **SEO (Référencement naturel)** : Optimisation de pages HTML, détection d'erreurs, amélioration du ranking Google
- **SEA (Référencement payant)** : Gestion d'enchères Google Ads, optimisation du ROI, stratégies de bidding

### 🎓 Public cible
- Étudiants en marketing digital
- Professionnels du web marketing
- Entrepreneurs souhaitant comprendre le SEO/SEA
- Formateurs en marketing digital

## ✨ Fonctionnalités

### 📊 Module SEO Master
- ✅ **6 pages HTML** à optimiser avec erreurs réalistes
- ✅ **Détection automatique** d'erreurs SEO (title, meta, H1, images alt, etc.)
- ✅ **Audit en temps réel** avec scores de sévérité (critical, important, minor)
- ✅ **Visualisation du code** avec surlignage des erreurs
- ✅ **Position SERP dynamique** (ranking de 1 à 100)
- ✅ **Système de budget temps** (100 heures à gérer)
- ✅ **Mode avant/après** pour comparer les corrections

### 💰 Module SEA Master
- ⏳ **5 mots-clés** avec volumes et compétitivité réalistes
- ⏳ **Enchères contre IA** (Amazon, BigTech, SmallShop...)
- ⏳ **Système d'Ad Rank** et Quality Score
- ⏳ **Calcul ROI en temps réel**
- ⏳ **Simulation second-price auction**
- ⏳ **Métriques Google Ads** (CPC, CTR, conversions)

### 🎨 Interface moderne
- ✅ **Dark mode** élégant avec palette professionnelle
- ✅ **Composants shadcn/ui** pour une UX premium
- ✅ **Design responsive** (mobile, tablet, desktop)
- ✅ **Animations fluides** et transitions
- ✅ **Accessibilité** optimisée

## 🚀 Installation

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation rapide

```bash
# Cloner le repository
git clone https://github.com/votre-username/seo-simulator.git
cd seo-simulator

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur [http://localhost:5173/seo-simulator/](http://localhost:5173/seo-simulator/)

### Build pour production

```bash
npm run build
```

Les fichiers de production seront dans le dossier `dist/`

## 📖 Utilisation

### Démarrer une partie

1. **Menu principal** : Choisissez entre le module SEO ou SEA
2. **Module SEO** :
   - Lisez l'intro et les règles
   - Analysez chaque page HTML
   - Corrigez les erreurs en gérant votre budget temps
   - Observez votre position SERP s'améliorer
   - Atteignez le top 10 de Google !

3. **Module SEA** (en cours de développement) :
   - Définissez vos enchères sur 5 mots-clés
   - Affrontez des concurrents IA
   - Optimisez votre Quality Score
   - Maximisez votre ROI

### Scores et objectifs

**Module SEO :**
- 🎯 Objectif principal : Atteindre le **top 10** (position #1-#10)
- 💯 Score parfait : **#1-#3** = Note A+
- ⏱️ Budget : **100 heures** à gérer intelligemment
- 📄 Pages : **6 pages** à optimiser

**Module SEA :**
- 🎯 Objectif principal : **ROI > 200%**
- 💰 Budget : **5000€** de budget publicitaire
- 📊 Mots-clés : **5 keywords** avec stratégies variées

## 🏗️ Architecture

### Structure des dossiers

```
seo-simulator/
├── src/
│   ├── components/
│   │   ├── ui/              # Composants shadcn/ui
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── badge.jsx
│   │   │   └── ...
│   │   └── custom/          # Composants métier
│   │       ├── RankingMeter.jsx
│   │       ├── ErrorDetector.jsx
│   │       ├── CodeViewer.jsx
│   │       ├── BiddingPanel.jsx
│   │       └── MetricsCard.jsx
│   ├── modules/
│   │   ├── SEOModule.jsx    # Module SEO complet
│   │   └── SEAModule.jsx    # Module SEA (à venir)
│   ├── lib/
│   │   ├── seo-engine.js    # Moteur SEO
│   │   ├── sea-engine.js    # Moteur SEA
│   │   └── utils.js
│   ├── data/
│   │   ├── pages-seo.js     # Pages HTML avec erreurs
│   │   ├── keywords-sea.js  # Mots-clés Google Ads
│   │   └── events.js        # Événements aléatoires
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

### Composants clés

#### 🎨 Composants UI personnalisés

**RankingMeter** ([src/components/custom/RankingMeter.jsx](src/components/custom/RankingMeter.jsx))
- Affiche la position SERP (1-100)
- Animation d'évolution
- Code couleur selon la position
- Barre de progression vers l'objectif

**ErrorDetector** ([src/components/custom/ErrorDetector.jsx](src/components/custom/ErrorDetector.jsx))
- Liste les erreurs SEO par sévérité
- Boutons de correction
- Gestion du budget
- Statistiques de progression

**CodeViewer** ([src/components/custom/CodeViewer.jsx](src/components/custom/CodeViewer.jsx))
- Visualisation HTML avec numéros de ligne
- Surlignage des erreurs
- Mode diff avant/après
- Coloration syntaxique

**BiddingPanel** ([src/components/custom/BiddingPanel.jsx](src/components/custom/BiddingPanel.jsx))
- Slider d'enchère
- Prévisions temps réel (CPC, clics, ROI)
- Comparaison concurrents
- Recommandations intelligentes

#### ⚙️ Moteurs de jeu

**SEOEngine** ([src/lib/seo-engine.js](src/lib/seo-engine.js))
```javascript
class SEOEngine {
  auditPage(html)              // Détecte les erreurs SEO
  calculateRanking(pageData)    // Calcule la position SERP
  applyFix(error, page)         // Applique une correction
  addBacklink(quality, source)  // Gère les backlinks
}
```

**SEAEngine** ([src/lib/sea-engine.js](src/lib/sea-engine.js))
```javascript
class SEAEngine {
  runAuction(keyword, bid)      // Simule une enchère
  calculateAdRank(bid, qs)      // Calcule l'Ad Rank
  simulateDay(campaigns)        // Simule une journée
  updateQualityScore(results)   // Met à jour le QS
}
```

## 🛠️ Technologies

### Frontend
- **React 19.2** - Framework UI
- **Vite 7.2** - Build tool ultra-rapide
- **Tailwind CSS 4.1** - Styling utility-first
- **shadcn/ui** - Composants UI premium
- **Radix UI** - Composants accessibles
- **Lucide React** - Icônes modernes

### Outils de développement
- **ESLint** - Linter JavaScript
- **Prettier** - Formateur de code
- **PostCSS** - Transformations CSS

### Design System
- **Palette dark mode** professionnelle
- **Variables CSS** pour cohérence
- **Font : Inter** (texte) + **JetBrains Mono** (code)
- **Animations** avec Tailwind

## 📈 Progression du projet

### ✅ Phase 1 : Setup & UI (100%)
- [x] Configuration Vite + React
- [x] Installation shadcn/ui
- [x] Palette dark mode complète
- [x] 10+ composants UI de base
- [x] Structure de dossiers

### ✅ Phase 2 : Moteurs de jeu (100%)
- [x] SEOEngine complet
- [x] SEAEngine complet
- [x] Pages HTML avec erreurs réalistes
- [x] Mots-clés SEA avec données
- [x] Système d'événements aléatoires

### ✅ Phase 3 : Composants custom (100%)
- [x] RankingMeter
- [x] ErrorDetector
- [x] CodeViewer
- [x] BiddingPanel
- [x] MetricsCard

### ✅ Phase 4 : Module SEO (100%)
- [x] Structure du module
- [x] Écran intro
- [x] Écran de jeu avec 3 colonnes
- [x] Système de corrections
- [x] Écran de résultats
- [x] Intégration complète

### ⏳ Phase 5 : Module SEA (0%)
- [ ] Structure du module
- [ ] Écran setup campagnes
- [ ] Système d'enchères
- [ ] Écran résultats jour par jour
- [ ] Intégration complète

### ⏳ Phase 6 : Features bonus (0%)
- [ ] Système achievements
- [ ] LocalStorage sauvegarde
- [ ] Mode tutoriel
- [ ] Leaderboard
- [ ] Export PDF des résultats

### ⏳ Phase 7 : Déploiement (0%)
- [ ] GitHub Actions CI/CD
- [ ] Déploiement GitHub Pages
- [ ] Documentation complète
- [ ] Tests unitaires

## 🎮 Gameplay

### Module SEO - Exemple de partie

**Tour 1 : Homepage**
```
Position actuelle: #100
Budget: 100h
Erreurs détectées: 7

🔴 CRITICAL: Balise <title> manquante (-10 points)
   → Coût: 1h
   → Impact: Position monte de ~8 places

🔴 CRITICAL: Meta description manquante (-8 points)
   → Coût: 1h
   → Impact: Position monte de ~6 places

[... Corrections appliquées ...]

Nouvelle position: #75
Budget restant: 93h
```

### Module SEA - Exemple de journée

**Jour 1 : Configuration initiale**
```
Mot-clé: "purificateur air"
Volume: 12,000 recherches/mois
CPC de base: 2.50€

Votre enchère: 3.20€
Quality Score: 5/10

Concurrents:
- Amazon: 4.80€ (QS: 8/10)
- BigTech: 3.50€ (QS: 7/10)
- Vous: 3.20€ (QS: 5/10)

Position estimée: #3
CPC réel: 2.86€
Clics/jour: ~160
ROI estimé: +180%
```

## 🤝 Contribuer

Les contributions sont les bienvenues !

### Comment contribuer

1. Fork le projet
2. Créez une branche (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

### Guidelines

- Respecter la structure de dossiers existante
- Utiliser les composants shadcn/ui
- Commenter le code en français
- Tester avant de commit
- Suivre la convention de nommage

## 📝 Roadmap future

- [ ] **Module SEA complet** avec enchères live
- [ ] **Mode multijoueur** (compétition entre étudiants)
- [ ] **Statistiques avancées** avec graphiques
- [ ] **Exports PDF** des résultats
- [ ] **Thèmes additionnels** (e-commerce, blog, SaaS)
- [ ] **Mode tutoriel interactif**
- [ ] **Système de badges** et achievements
- [ ] **API de scoring** pour classements
- [ ] **Support multilingue** (EN, ES, DE)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Auteurs

- **Développement initial** - Projet pédagogique
- **Design & UX** - Basé sur shadcn/ui
- **Données SEO/SEA** - Sources professionnelles

## 🙏 Remerciements

- [shadcn/ui](https://ui.shadcn.com/) pour les composants UI
- [Radix UI](https://www.radix-ui.com/) pour les primitives accessibles
- [Lucide](https://lucide.dev/) pour les icônes
- [Tailwind CSS](https://tailwindcss.com/) pour le styling

---

**⭐ N'oubliez pas de mettre une étoile si ce projet vous plaît !**

*Fait avec ❤️ pour l'éducation en marketing digital*
