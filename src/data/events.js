/**
 * ÉVÉNEMENTS ALÉATOIRES - Random events pour SEO et SEA
 *
 * Événements qui se déclenchent aléatoirement pendant le jeu
 * pour ajouter du challenge et du réalisme
 */

export const EVENTS = {
  SEO: [
    {
      id: "google-core-update",
      name: "Google Core Update",
      type: "negative",
      probability: 0.3,
      duration: 2, // tours
      impact: {
        ranking: -5,
        authority: 0
      },
      description: "Google déploie une mise à jour majeure de son algorithme. Tous les sites sont impactés.",
      icon: "🔄",
      neutralizedBy: ["Consultant SEO Expert"],
      playerMessage: "Vos positions chutent temporairement. Analysez les nouvelles guidelines Google.",
      tips: "Les Core Updates privilégient le contenu de qualité et l'expertise E-E-A-T."
    },

    {
      id: "viral-backlink",
      name: "Article Viral",
      type: "positive",
      probability: 0.1,
      duration: 1,
      impact: {
        backlinks: 50,
        authority: 10,
        ranking: -3 // Amélioration
      },
      description: "Votre site est mentionné dans un article viral sur un média majeur !",
      icon: "🚀",
      playerMessage: "TechCrunch parle de vous ! Vous gagnez 50 backlinks de qualité.",
      tips: "Les backlinks de sites autoritaires ont un impact immédiat sur votre ranking."
    },

    {
      id: "negative-seo",
      name: "Attaque Negative SEO",
      type: "negative",
      probability: 0.15,
      duration: 3,
      impact: {
        ranking: -10,
        authority: -5
      },
      description: "Un concurrent a créé des centaines de backlinks toxiques vers votre site.",
      icon: "☠️",
      neutralizedBy: ["Audit Backlinks Premium"],
      playerMessage: "Google détecte des backlinks suspects. Votre autorité baisse.",
      tips: "Utilisez le Disavow Tool de Google Search Console pour rejeter les liens toxiques."
    },

    {
      id: "content-theft",
      name: "Duplicate Content",
      type: "negative",
      probability: 0.2,
      duration: 2,
      impact: {
        ranking: -3
      },
      description: "Votre contenu a été copié et republié sur d'autres sites.",
      icon: "📋",
      playerMessage: "Google détecte du contenu dupliqué. Vos pages perdent en visibilité.",
      tips: "Utilisez DMCA takedown ou créez du contenu encore plus unique."
    },

    {
      id: "featured-snippet",
      name: "Featured Snippet",
      type: "positive",
      probability: 0.08,
      duration: 3,
      impact: {
        ranking: -5, // Position 0 !
        ctr: 2 // Double le CTR
      },
      description: "Une de vos pages obtient un Featured Snippet (position 0) !",
      icon: "⭐",
      playerMessage: "Position 0 obtenue ! Votre CTR explose.",
      tips: "Les Featured Snippets captent 35% des clics sur mobile."
    },

    {
      id: "technical-issue",
      name: "Problème Technique",
      type: "negative",
      probability: 0.12,
      duration: 1,
      impact: {
        ranking: -8
      },
      description: "Votre site a subi une panne. Google a crawlé pendant le downtime.",
      icon: "🔧",
      neutralizedBy: ["Monitoring Premium"],
      playerMessage: "Erreur 503 détectée. Google a rencontré des pages inaccessibles.",
      tips: "Un uptime de 99.9% minimum est recommandé pour le SEO."
    },

    {
      id: "mobile-first-boost",
      name: "Mobile-First Excellence",
      type: "positive",
      probability: 0.15,
      duration: 2,
      impact: {
        ranking: -4
      },
      description: "Votre site mobile est exemplaire. Google vous récompense.",
      icon: "📱",
      playerMessage: "Core Web Vitals parfaits ! Boost mobile-first indexing.",
      tips: "60% des recherches se font sur mobile. L'optimisation mobile est cruciale."
    }
  ],

  SEA: [
    {
      id: "black-friday",
      name: "Black Friday",
      type: "mixed",
      probability: 0.25,
      duration: 1,
      impact: {
        cpcMultiplier: 2,
        conversionMultiplier: 3,
        competitionMultiplier: 1.5
      },
      description: "C'est le Black Friday ! Les CPC explosent mais les conversions aussi.",
      icon: "🛍️",
      playerMessage: "Les enchères doublent mais vos ventes triplent !",
      tips: "Augmentez votre budget pendant les pics saisonniers pour maximiser le ROI."
    },

    {
      id: "amazon-war",
      name: "Guerre des Prix Amazon",
      type: "negative",
      probability: 0.2,
      duration: 3,
      impact: {
        cpcMultiplier: 1.5,
        competitionMultiplier: 2
      },
      description: "Amazon entre massivement sur vos mots-clés avec un budget illimité.",
      icon: "⚔️",
      neutralizedBy: ["Bid Manager Automatique"],
      playerMessage: "Amazon enchérit agressivement. Vos CPC augmentent de 50%.",
      tips: "Ciblez des mots-clés de longue traîne pour éviter la concurrence directe."
    },

    {
      id: "quality-score-boost",
      name: "Quality Score Boost",
      type: "positive",
      probability: 0.15,
      duration: 2,
      impact: {
        qualityScoreBonus: 2,
        cpcMultiplier: 0.7 // -30% de CPC
      },
      description: "Vos annonces obtiennent un excellent Quality Score !",
      icon: "⭐",
      playerMessage: "QS 9/10 atteint ! Vos CPC baissent de 30%.",
      tips: "Un bon Quality Score réduit vos coûts et améliore vos positions."
    },

    {
      id: "competitor-pause",
      name: "Concurrent en Pause",
      type: "positive",
      probability: 0.1,
      duration: 1,
      impact: {
        cpcMultiplier: 0.7,
        competitionMultiplier: 0.5
      },
      description: "Un concurrent majeur met sa campagne en pause.",
      icon: "😴",
      playerMessage: "BigTech Co a suspendu ses annonces. C'est le moment d'en profiter !",
      tips: "Surveillez toujours vos concurrents avec l'Auction Insights."
    },

    {
      id: "policy-violation",
      name: "Alerte Politique Google",
      type: "negative",
      probability: 0.08,
      duration: 1,
      impact: {
        pausedCampaigns: 1,
        ranking: 0
      },
      description: "Une de vos annonces viole les politiques Google Ads.",
      icon: "⚠️",
      playerMessage: "Annonce suspendue pour violation. Corrigez-la rapidement.",
      tips: "Relisez les Google Ads policies. Les violations répétées peuvent bannir votre compte."
    },

    {
      id: "remarketing-success",
      name: "Remarketing Viral",
      type: "positive",
      probability: 0.12,
      duration: 2,
      impact: {
        conversionMultiplier: 1.5,
        ctr: 1.3
      },
      description: "Votre campagne de remarketing performe exceptionnellement bien.",
      icon: "🎯",
      playerMessage: "Le remarketing convertit 3x mieux ! Vos anciens visiteurs reviennent.",
      tips: "Le remarketing a un ROI moyen 2-3x supérieur aux campagnes classiques."
    },

    {
      id: "ad-fatigue",
      name: "Fatigue Publicitaire",
      type: "negative",
      probability: 0.18,
      duration: 2,
      impact: {
        ctr: 0.7,
        conversionMultiplier: 0.8
      },
      description: "Vos annonces sont trop vues. Le CTR baisse.",
      icon: "😴",
      neutralizedBy: ["Creative Rotation Pro"],
      playerMessage: "Vos audiences sont saturées. Renouvelez vos créatives.",
      tips: "Changez vos annonces tous les 2-3 mois pour éviter la fatigue."
    },

    {
      id: "budget-opportunity",
      name: "Budget Bonus Investisseurs",
      type: "positive",
      probability: 0.05,
      duration: 1,
      impact: {
        budgetBonus: 2000
      },
      description: "Vos investisseurs débloquent un budget supplémentaire !",
      icon: "💰",
      playerMessage: "+2000€ de budget surprise ! Investissez stratégiquement.",
      tips: "Profitez des budgets bonus pour tester de nouveaux mots-clés."
    }
  ]
};

/**
 * Déclenche un événement aléatoire
 * @param {string} module - 'SEO' ou 'SEA'
 * @param {number} currentTurn - Tour actuel
 * @param {Array} ownedTools - Outils possédés par le joueur
 * @returns {Object|null} - Événement déclenché ou null
 */
export function triggerRandomEvent(module, currentTurn, ownedTools = []) {
  const events = EVENTS[module];

  if (!events) {
    console.error(`Module inconnu: ${module}`);
    return null;
  }

  // Filtrer les événements éligibles
  const eligibleEvents = events.filter(event => {
    // Vérifier la probabilité
    if (Math.random() > event.probability) {
      return false;
    }

    // Vérifier si l'événement est neutralisé par un outil
    if (event.neutralizedBy && event.neutralizedBy.length > 0) {
      const isNeutralized = event.neutralizedBy.some(tool =>
        ownedTools.includes(tool)
      );
      if (isNeutralized) {
        return false;
      }
    }

    return true;
  });

  // Si aucun événement éligible
  if (eligibleEvents.length === 0) {
    return null;
  }

  // Sélectionner un événement au hasard
  const randomIndex = Math.floor(Math.random() * eligibleEvents.length);
  const selectedEvent = eligibleEvents[randomIndex];

  // Ajouter des métadonnées
  return {
    ...selectedEvent,
    triggeredAt: currentTurn,
    module
  };
}

/**
 * Applique les effets d'un événement
 * @param {Object} event - Événement à appliquer
 * @param {Object} gameState - État actuel du jeu
 * @returns {Object} - Nouvel état du jeu
 */
export function applyEventEffects(event, gameState) {
  const newState = { ...gameState };

  if (event.module === 'SEO') {
    // Appliquer les impacts SEO
    if (event.impact.ranking) {
      newState.ranking = Math.max(1, Math.min(100,
        newState.ranking + event.impact.ranking
      ));
    }
    if (event.impact.authority) {
      newState.authority = Math.max(0, Math.min(100,
        newState.authority + event.impact.authority
      ));
    }
    if (event.impact.backlinks) {
      newState.backlinks = (newState.backlinks || 0) + event.impact.backlinks;
    }
  } else if (event.module === 'SEA') {
    // Appliquer les impacts SEA
    if (event.impact.budgetBonus) {
      newState.budget = (newState.budget || 0) + event.impact.budgetBonus;
    }
    if (event.impact.qualityScoreBonus) {
      newState.qualityScore = Math.max(1, Math.min(10,
        newState.qualityScore + event.impact.qualityScoreBonus
      ));
    }
  }

  // Ajouter l'événement aux événements actifs
  if (!newState.activeEvents) {
    newState.activeEvents = [];
  }
  newState.activeEvents.push({
    ...event,
    remainingDuration: event.duration
  });

  return newState;
}

/**
 * Met à jour les événements actifs (décrémente la durée)
 * @param {Array} activeEvents - Événements actifs
 * @returns {Array} - Événements actifs mis à jour
 */
export function updateActiveEvents(activeEvents = []) {
  return activeEvents
    .map(event => ({
      ...event,
      remainingDuration: event.remainingDuration - 1
    }))
    .filter(event => event.remainingDuration > 0);
}

export default EVENTS;
