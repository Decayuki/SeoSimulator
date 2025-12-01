/**
 * MOTS-CLÉS SEA - Keywords Google Ads
 *
 * Collection de mots-clés réalistes pour le module SEA
 * avec volume de recherche, compétitivité et CPC de base
 */

export const SEA_KEYWORDS = [
  {
    id: 'purificateur-air',
    name: "purificateur air",
    volume: 12000, // Recherches mensuelles
    competitiveness: "high",
    baselineCPC: 2.5,
    category: "générique",
    description: "Mot-clé principal très compétitif",
    matchType: "broad", // broad, phrase, exact
    estimatedConversions: 150,
    avgPosition: 3.2,
    info: {
      difficulty: "Très difficile - Dominé par les grandes marques",
      opportunity: "Volume élevé mais CPC important",
      recommendation: "Nécessite un bon Quality Score pour être rentable"
    }
  },

  {
    id: 'purificateur-air-maison',
    name: "purificateur air maison",
    volume: 5400,
    competitiveness: "medium",
    baselineCPC: 1.8,
    category: "spécifique",
    description: "Mot-clé avec intention d'achat claire",
    matchType: "phrase",
    estimatedConversions: 95,
    avgPosition: 2.5,
    info: {
      difficulty: "Moyen - Bon équilibre volume/compétition",
      opportunity: "Meilleur taux de conversion que le mot générique",
      recommendation: "Excellent pour démarrer une campagne"
    }
  },

  {
    id: 'purificateur-japonais',
    name: "purificateur air japonais",
    volume: 800,
    competitiveness: "low",
    baselineCPC: 0.8,
    category: "longue traîne",
    description: "Niche avec faible concurrence",
    matchType: "exact",
    estimatedConversions: 25,
    avgPosition: 1.8,
    info: {
      difficulty: "Facile - Peu de concurrents",
      opportunity: "Excellent ROI si le produit correspond",
      recommendation: "Parfait pour les budgets limités"
    }
  },

  {
    id: 'acheter-purificateur-air',
    name: "acheter purificateur air",
    volume: 3200,
    competitiveness: "high",
    baselineCPC: 3.2,
    category: "transactionnel",
    description: "Forte intention d'achat immédiate",
    matchType: "phrase",
    estimatedConversions: 120,
    avgPosition: 2.8,
    info: {
      difficulty: "Difficile - Forte concurrence commerciale",
      opportunity: "Très bon taux de conversion",
      recommendation: "Rentable si Quality Score > 7"
    }
  },

  {
    id: 'meilleur-purificateur-air-2024',
    name: "meilleur purificateur air 2024",
    volume: 2100,
    competitiveness: "medium",
    baselineCPC: 1.5,
    category: "informationnel",
    description: "Recherche comparative",
    matchType: "phrase",
    estimatedConversions: 45,
    avgPosition: 3.5,
    info: {
      difficulty: "Moyen - Mélange de sites éditoriaux et e-commerce",
      opportunity: "Bonne opportunité pour du contenu comparatif",
      recommendation: "Créer une landing page comparative"
    }
  }
];

/**
 * GROUPES DE MOTS-CLÉS SUGGÉRÉS
 * Stratégies pré-configurées pour faciliter le jeu
 */
export const KEYWORD_STRATEGIES = {
  aggressive: {
    name: "Stratégie Agressive",
    description: "Cibler les mots-clés à fort volume",
    keywords: ['purificateur-air', 'acheter-purificateur-air', 'purificateur-air-maison'],
    budget: 4000,
    expectedROI: "150-250%",
    risk: "Élevé"
  },

  balanced: {
    name: "Stratégie Équilibrée",
    description: "Mix volume et rentabilité",
    keywords: ['purificateur-air-maison', 'acheter-purificateur-air', 'meilleur-purificateur-air-2024'],
    budget: 3000,
    expectedROI: "200-350%",
    risk: "Moyen"
  },

  niche: {
    name: "Stratégie Niche",
    description: "Cibler la longue traîne",
    keywords: ['purificateur-japonais', 'meilleur-purificateur-air-2024'],
    budget: 1500,
    expectedROI: "300-500%",
    risk: "Faible"
  }
};

/**
 * DONNÉES DE MARCHÉ RÉALISTES
 */
export const MARKET_DATA = {
  averageCPC: 2.1,
  averageConversionRate: 0.025, // 2.5%
  averageOrderValue: 50, // 50€ par conversion
  peakHours: [9, 10, 11, 14, 15, 20, 21], // Heures de pic
  seasonality: {
    winter: 1.3, // +30% en hiver (pollution, chauffage)
    spring: 1.1, // +10% au printemps (allergies)
    summer: 0.8, // -20% en été
    fall: 1.0   // Normal en automne
  }
};

/**
 * Obtient un mot-clé par son ID
 */
export function getKeywordById(id) {
  return SEA_KEYWORDS.find(kw => kw.id === id);
}

/**
 * Filtre les mots-clés par compétitivité
 */
export function getKeywordsByCompetitiveness(level) {
  return SEA_KEYWORDS.filter(kw => kw.competitiveness === level);
}

/**
 * Calcule le score de difficulté d'un mot-clé
 */
export function calculateKeywordDifficulty(keyword) {
  const volumeScore = Math.min(100, (keyword.volume / 15000) * 100);
  const cpcScore = Math.min(100, (keyword.baselineCPC / 5) * 100);

  const competitivenessScores = {
    low: 30,
    medium: 60,
    high: 90
  };

  const compScore = competitivenessScores[keyword.competitiveness] || 50;

  return Math.round((volumeScore + cpcScore + compScore) / 3);
}

export default SEA_KEYWORDS;
