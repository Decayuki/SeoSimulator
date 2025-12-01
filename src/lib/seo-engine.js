/**
 * MOTEUR SEO - Gestion complète du référencement naturel
 *
 * Responsabilités:
 * - Générer des pages HTML avec erreurs réalistes
 * - Détecter automatiquement les erreurs SEO
 * - Calculer le score et la position dans SERP
 * - Appliquer les corrections
 * - Gérer les backlinks et l'autorité de domaine
 */

export class SEOEngine {
  constructor() {
    this.baseRanking = 100; // Position de départ (100 = page 10 de Google)
    this.authority = 0;     // Domain Authority (0-100)
    this.backlinks = [];    // Liste des backlinks
    this.history = [];      // Historique des positions
  }

  /**
   * Génère une page HTML avec erreurs aléatoires selon le niveau de difficulté
   * @param {string} type - Type de page (homepage, product, blog, etc.)
   * @param {number} difficulty - Niveau de difficulté (1-5)
   * @returns {Object} - { html, errors, correctHTML }
   */
  generatePage(type, difficulty) {
    // Sélectionner une page template selon le type
    const templates = this.getPageTemplates();
    const template = templates[type];

    if (!template) {
      throw new Error(`Type de page inconnu: ${type}`);
    }

    // Générer les erreurs selon la difficulté
    const errors = this.generateErrors(type, difficulty);

    // Créer le HTML avec erreurs
    const html = this.injectErrors(template.base, errors);

    return {
      html,
      errors,
      correctHTML: template.base,
      type,
      difficulty
    };
  }

  /**
   * Détecte toutes les erreurs SEO dans une page HTML
   * @param {string} html - Code HTML à analyser
   * @returns {Object} - { critical, important, minor, score }
   */
  auditPage(html) {
    const errors = {
      critical: [],
      important: [],
      minor: [],
      score: 100
    };

    // Vérifier balise title
    if (!html.match(/<title>(.+?)<\/title>/)) {
      errors.critical.push({
        id: 'no-title',
        severity: 'critical',
        title: 'Balise <title> manquante',
        description: 'La balise title est essentielle pour le SEO. Elle apparaît dans les résultats de recherche.',
        impact: -10,
        fixCost: 1,
        line: this.findLineNumber(html, '<head>')
      });
    } else {
      // Vérifier longueur du title
      const titleMatch = html.match(/<title>(.+?)<\/title>/);
      const titleLength = titleMatch[1].length;
      if (titleLength < 30) {
        errors.important.push({
          id: 'title-too-short',
          severity: 'important',
          title: 'Title trop court',
          description: `Le title fait ${titleLength} caractères. Optimal : 50-60 caractères.`,
          impact: -3,
          fixCost: 1,
          line: this.findLineNumber(html, '<title>')
        });
      } else if (titleLength > 60) {
        errors.important.push({
          id: 'title-too-long',
          severity: 'important',
          title: 'Title trop long',
          description: `Le title fait ${titleLength} caractères. Il sera tronqué dans les résultats.`,
          impact: -2,
          fixCost: 1,
          line: this.findLineNumber(html, '<title>')
        });
      }
    }

    // Vérifier meta description
    if (!html.match(/<meta\s+name="description"\s+content="(.+?)"/)) {
      errors.critical.push({
        id: 'no-meta-description',
        severity: 'critical',
        title: 'Meta description manquante',
        description: 'Google va générer un snippet aléatoire depuis votre contenu.',
        impact: -8,
        fixCost: 1,
        line: this.findLineNumber(html, '<head>')
      });
    }

    // Vérifier H1
    const h1Matches = html.match(/<h1[^>]*>(.+?)<\/h1>/g);
    if (!h1Matches || h1Matches.length === 0) {
      errors.critical.push({
        id: 'no-h1',
        severity: 'critical',
        title: 'Pas de balise H1',
        description: 'Le H1 structure votre page et indique le sujet principal à Google.',
        impact: -7,
        fixCost: 1,
        line: this.findLineNumber(html, '<body>')
      });
    } else if (h1Matches.length > 1) {
      errors.important.push({
        id: 'multiple-h1',
        severity: 'important',
        title: 'Plusieurs H1 détectés',
        description: `${h1Matches.length} H1 trouvés. Il devrait y en avoir un seul par page.`,
        impact: -4,
        fixCost: 1,
        line: this.findLineNumber(html, '<h1')
      });
    }

    // Vérifier images alt
    const imgMatches = html.match(/<img[^>]*>/g) || [];
    let imgsWithoutAlt = 0;
    imgMatches.forEach(img => {
      if (!img.match(/alt="(.+?)"/)) {
        imgsWithoutAlt++;
      }
    });
    if (imgsWithoutAlt > 0) {
      errors.important.push({
        id: 'images-without-alt',
        severity: 'important',
        title: `${imgsWithoutAlt} image(s) sans attribut alt`,
        description: 'Les attributs alt aident Google à comprendre vos images.',
        impact: -2 * imgsWithoutAlt,
        fixCost: 1,
        line: this.findLineNumber(html, '<img')
      });
    }

    // Vérifier liens sans texte descriptif
    const linkMatches = html.match(/<a[^>]*>(.+?)<\/a>/g) || [];
    let badLinks = 0;
    linkMatches.forEach(link => {
      const text = link.match(/>(.+?)</)[1].toLowerCase();
      if (text.includes('cliquez ici') || text.includes('ici') || text.length < 3) {
        badLinks++;
      }
    });
    if (badLinks > 0) {
      errors.minor.push({
        id: 'bad-anchor-text',
        severity: 'minor',
        title: `${badLinks} lien(s) avec texte non descriptif`,
        description: 'Utilisez des textes de liens descriptifs (évitez "cliquez ici").',
        impact: -1 * badLinks,
        fixCost: 0.5,
        line: this.findLineNumber(html, '<a')
      });
    }

    // Vérifier longueur du contenu
    const bodyContent = html.match(/<body[^>]*>(.*?)<\/body>/s);
    if (bodyContent) {
      const textContent = bodyContent[1].replace(/<[^>]+>/g, '').trim();
      const wordCount = textContent.split(/\s+/).length;
      if (wordCount < 300) {
        errors.important.push({
          id: 'thin-content',
          severity: 'important',
          title: 'Contenu trop court',
          description: `${wordCount} mots détectés. Recommandé : 300+ mots minimum.`,
          impact: -5,
          fixCost: 2,
          line: this.findLineNumber(html, '<body>')
        });
      }
    }

    // Vérifier structure sémantique
    if (!html.includes('<header>')) {
      errors.minor.push({
        id: 'no-header',
        severity: 'minor',
        title: 'Pas de balise <header>',
        description: 'Les balises sémantiques HTML5 améliorent la structure.',
        impact: -1,
        fixCost: 0.5,
        line: this.findLineNumber(html, '<body>')
      });
    }
    if (!html.includes('<main>')) {
      errors.minor.push({
        id: 'no-main',
        severity: 'minor',
        title: 'Pas de balise <main>',
        description: 'La balise <main> identifie le contenu principal.',
        impact: -1,
        fixCost: 0.5,
        line: this.findLineNumber(html, '<body>')
      });
    }

    // Calculer le score final
    const totalImpact = [
      ...errors.critical,
      ...errors.important,
      ...errors.minor
    ].reduce((sum, err) => sum + err.impact, 0);

    errors.score = Math.max(0, Math.min(100, 100 + totalImpact));

    return errors;
  }

  /**
   * Calcule la position dans les résultats de recherche (SERP)
   * @param {Object} pageData - Données de la page
   * @param {Array} competitors - Concurrents
   * @param {Array} events - Événements actifs
   * @returns {number} - Position dans SERP (1-100)
   */
  calculateRanking(pageData, competitors = [], events = []) {
    let score = this.baseRanking;

    // Facteurs On-Page (60% de l'impact)
    const onPageScore = pageData.seoScore || 50;
    score -= (100 - onPageScore) * 0.6;

    // Facteurs Off-Page (40% de l'impact)
    // Backlinks
    const backlinksScore = Math.min(100, this.backlinks.length * 2);
    score -= backlinksScore * 0.3;

    // Domain Authority
    score -= this.authority * 0.1;

    // Appliquer les modificateurs d'événements
    events.forEach(event => {
      if (event.rankingImpact) {
        score += event.rankingImpact;
      }
    });

    // S'assurer que le score reste entre 1 et 100
    const finalRank = Math.max(1, Math.min(100, Math.round(score)));

    // Ajouter à l'historique
    this.history.push({
      rank: finalRank,
      score: onPageScore,
      timestamp: Date.now()
    });

    return finalRank;
  }

  /**
   * Applique une correction à une erreur
   * @param {Object} error - L'erreur à corriger
   * @param {string} page - HTML de la page
   * @returns {Object} - { newHTML, impactScore, cost }
   */
  applyFix(error, page) {
    let newHTML = page;
    const impactScore = Math.abs(error.impact);
    const cost = error.fixCost;

    // Logique de correction selon le type d'erreur
    switch (error.id) {
      case 'no-title':
        newHTML = newHTML.replace(
          '</head>',
          '  <title>Page Titre - Site Web</title>\n</head>'
        );
        break;

      case 'no-meta-description':
        newHTML = newHTML.replace(
          '</head>',
          '  <meta name="description" content="Description de la page pour les résultats de recherche.">\n</head>'
        );
        break;

      case 'no-h1':
        newHTML = newHTML.replace(
          '<body>',
          '<body>\n  <h1>Titre Principal de la Page</h1>'
        );
        break;

      // Autres corrections...
      default:
        console.warn(`Correction non implémentée pour: ${error.id}`);
    }

    return {
      newHTML,
      impactScore,
      cost
    };
  }

  /**
   * Ajoute un backlink au site
   * @param {number} quality - Qualité du backlink (1-100)
   * @param {string} source - Source du backlink
   */
  addBacklink(quality, source) {
    this.backlinks.push({
      quality,
      source,
      date: Date.now()
    });

    // Impact sur l'autorité de domaine
    this.authority = Math.min(100, this.authority + (quality * 0.5));
  }

  /**
   * Utilitaires
   */
  findLineNumber(html, search) {
    const lines = html.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(search)) {
        return i + 1;
      }
    }
    return 1;
  }

  getPageTemplates() {
    // Les templates seront importés depuis les fichiers de données
    return {};
  }

  generateErrors(type, difficulty) {
    // Génération d'erreurs selon la difficulté
    // Cette méthode sera enrichie avec les données réelles
    return [];
  }

  injectErrors(html, errors) {
    // Injection d'erreurs dans le HTML
    return html;
  }
}

export default SEOEngine;
