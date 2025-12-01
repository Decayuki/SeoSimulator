/**
 * MOTEUR SEA - Gestion complète du référencement payant (Google Ads)
 *
 * Responsabilités:
 * - Gérer les enchères sur mots-clés
 * - Simuler des concurrents IA
 * - Calculer le Quality Score
 * - Déterminer la position des annonces
 * - Calculer le coût réel (CPC) et le ROI
 */

export class SEAEngine {
  constructor(initialBudget = 5000) {
    this.budget = initialBudget;
    this.initialBudget = initialBudget;
    this.qualityScore = 5; // Score de qualité initial (1-10)
    this.campaigns = [];
    this.competitors = this.generateCompetitors();
    this.history = [];
  }

  /**
   * Génère des concurrents IA avec différentes stratégies
   * @returns {Array} - Liste de concurrents
   */
  generateCompetitors() {
    return [
      {
        name: "Amazon",
        budget: Infinity,
        strategy: "aggressive",
        qualityScore: 8,
        bidMultiplier: 1.5 // Enchérit 50% au-dessus du marché
      },
      {
        name: "BigTech Co",
        budget: 50000,
        strategy: "balanced",
        qualityScore: 7,
        bidMultiplier: 1.2
      },
      {
        name: "SmallShop",
        budget: 2000,
        strategy: "defensive",
        qualityScore: 5,
        bidMultiplier: 0.8
      },
      {
        name: "MediumCorp",
        budget: 10000,
        strategy: "balanced",
        qualityScore: 6,
        bidMultiplier: 1.0
      }
    ];
  }

  /**
   * Calcule l'Ad Rank (position de l'annonce)
   * Ad Rank = Enchère max × Quality Score
   * @param {number} bid - Enchère maximale
   * @param {number} qualityScore - Score de qualité (1-10)
   * @returns {number} - Ad Rank
   */
  calculateAdRank(bid, qualityScore) {
    return bid * qualityScore;
  }

  /**
   * Obtient l'enchère d'un concurrent pour un mot-clé
   * @param {Object} competitor - Concurrent
   * @param {Object} keyword - Mot-clé
   * @returns {number} - Montant de l'enchère
   */
  getCompetitorBid(competitor, keyword) {
    // Enchère de base selon la compétitivité du mot-clé
    let baseBid = keyword.baselineCPC;

    // Appliquer le multiplicateur de stratégie
    let bid = baseBid * competitor.bidMultiplier;

    // Les stratégies "aggressive" enchérissent plus sur les mots-clés à fort volume
    if (competitor.strategy === "aggressive" && keyword.volume > 5000) {
      bid *= 1.3;
    }

    // Les stratégies "defensive" préfèrent les mots-clés à faible concurrence
    if (competitor.strategy === "defensive" && keyword.competitiveness === "low") {
      bid *= 1.2;
    }

    // Limiter au budget disponible
    if (competitor.budget !== Infinity && bid > competitor.budget / 100) {
      bid = competitor.budget / 100;
    }

    return Math.round(bid * 100) / 100;
  }

  /**
   * Obtient le Quality Score d'un concurrent
   * @param {Object} competitor - Concurrent
   * @returns {number} - Quality Score (1-10)
   */
  getCompetitorQS(competitor) {
    // Ajout d'une petite variation aléatoire
    return Math.max(1, Math.min(10, competitor.qualityScore + (Math.random() - 0.5)));
  }

  /**
   * Simule l'enchère pour un mot-clé donné
   * @param {Object} keyword - Mot-clé
   * @param {number} yourBid - Votre enchère
   * @returns {Object} - Résultat de l'enchère
   */
  runAuction(keyword, yourBid) {
    // 1. Collecter toutes les enchères (concurrents + vous)
    const bids = [];

    // Ajouter les enchères des concurrents
    this.competitors.forEach(competitor => {
      bids.push({
        competitor: competitor.name,
        bid: this.getCompetitorBid(competitor, keyword),
        qualityScore: this.getCompetitorQS(competitor),
        adRank: 0,
        isYou: false
      });
    });

    // Ajouter votre enchère
    bids.push({
      competitor: "VOUS",
      bid: yourBid,
      qualityScore: this.qualityScore,
      adRank: 0,
      isYou: true
    });

    // 2. Calculer l'Ad Rank de chaque enchère
    bids.forEach(bidItem => {
      bidItem.adRank = this.calculateAdRank(bidItem.bid, bidItem.qualityScore);
    });

    // 3. Trier par Ad Rank décroissant
    bids.sort((a, b) => b.adRank - a.adRank);

    // 4. Trouver votre position
    const yourPosition = bids.findIndex(b => b.isYou) + 1;
    const yourBidData = bids.find(b => b.isYou);

    // 5. Calculer le CPC réel (second price auction)
    // CPC réel = (Ad Rank du suivant / Votre QS) + 0.01€
    let actualCPC;
    if (yourPosition < bids.length) {
      const nextBidder = bids[yourPosition]; // Position suivante
      actualCPC = (nextBidder.adRank / this.qualityScore) + 0.01;
    } else {
      // Si vous êtes dernier, vous payez votre enchère
      actualCPC = yourBid;
    }

    // S'assurer que le CPC ne dépasse jamais votre enchère max
    actualCPC = Math.min(actualCPC, yourBid);
    actualCPC = Math.round(actualCPC * 100) / 100;

    return {
      position: yourPosition,
      actualCPC,
      adRank: yourBidData.adRank,
      competitors: bids,
      keyword: keyword.name
    };
  }

  /**
   * Calcule le CTR (Click-Through Rate) selon la position
   * @param {number} position - Position de l'annonce
   * @returns {number} - CTR (entre 0 et 1)
   */
  getCTRByPosition(position) {
    // Données basées sur des statistiques réelles Google Ads
    const ctrByPosition = {
      1: 0.08,  // 8% pour la position 1
      2: 0.06,  // 6% pour la position 2
      3: 0.04,  // 4% pour la position 3
      4: 0.025, // 2.5% pour la position 4
      5: 0.015, // 1.5% pour la position 5
    };

    return ctrByPosition[position] || 0.01; // 1% par défaut si position > 5
  }

  /**
   * Estime les impressions quotidiennes pour un mot-clé
   * @param {Object} keyword - Mot-clé
   * @returns {number} - Nombre d'impressions estimées
   */
  getImpressions(keyword) {
    // Les impressions dépendent du volume de recherche et de la position
    // On estime qu'on capture 10% du volume quotidien
    const dailySearches = keyword.volume / 30; // Volume mensuel → quotidien
    return Math.floor(dailySearches * 0.1);
  }

  /**
   * Simule une journée de campagne
   * @param {Array} campaigns - Liste des campagnes actives
   * @returns {Object} - Résultats de la journée
   */
  simulateDay(campaigns) {
    let totalCost = 0;
    let totalClicks = 0;
    let totalConversions = 0;
    let totalImpressions = 0;

    const campaignResults = [];

    campaigns.forEach(campaign => {
      // Lancer l'enchère
      const auction = this.runAuction(campaign.keyword, campaign.bid);

      // Calculer les impressions
      const impressions = this.getImpressions(campaign.keyword);

      // Calculer le CTR selon la position
      const ctr = this.getCTRByPosition(auction.position);

      // Calculer les clics
      const clicks = Math.floor(impressions * ctr);

      // Calculer le taux de conversion basé sur:
      // - Quality Score de l'annonce
      // - Pertinence de la landing page (simulée)
      const landingPageScore = campaign.landingPageScore || 50;
      const baseConversionRate = 0.02; // 2% de base
      const qsBonus = (this.qualityScore - 5) * 0.005; // +0.5% par point de QS au-dessus de 5
      const lpBonus = (landingPageScore - 50) / 1000; // Bonus landing page
      const conversionRate = baseConversionRate + qsBonus + lpBonus;

      const conversions = Math.floor(clicks * conversionRate);

      // Calculer le coût
      const cost = clicks * auction.actualCPC;

      // Stocker les résultats
      campaignResults.push({
        keyword: campaign.keyword.name,
        position: auction.position,
        impressions,
        clicks,
        ctr: (ctr * 100).toFixed(2),
        cpc: auction.actualCPC,
        cost,
        conversions,
        conversionRate: (conversionRate * 100).toFixed(2),
        adRank: auction.adRank
      });

      totalCost += cost;
      totalClicks += clicks;
      totalConversions += conversions;
      totalImpressions += impressions;
    });

    // Calculer le chiffre d'affaires (50€ par conversion)
    const revenue = totalConversions * 50;

    // Calculer le ROI
    const roi = totalCost > 0 ? ((revenue - totalCost) / totalCost * 100) : 0;

    // Déduire du budget
    this.budget -= totalCost;

    // Enregistrer dans l'historique
    this.history.push({
      day: this.history.length + 1,
      cost: totalCost,
      clicks: totalClicks,
      conversions: totalConversions,
      revenue,
      roi,
      budget: this.budget,
      timestamp: Date.now()
    });

    return {
      cost: Math.round(totalCost * 100) / 100,
      clicks: totalClicks,
      conversions: totalConversions,
      impressions: totalImpressions,
      revenue,
      roi: Math.round(roi),
      avgCPC: totalClicks > 0 ? Math.round((totalCost / totalClicks) * 100) / 100 : 0,
      avgPosition: campaignResults.reduce((sum, c) => sum + c.position, 0) / campaignResults.length,
      campaigns: campaignResults,
      remainingBudget: Math.round(this.budget * 100) / 100
    };
  }

  /**
   * Met à jour le Quality Score en fonction des performances
   * @param {Object} dayResults - Résultats de la journée
   */
  updateQualityScore(dayResults) {
    // Le Quality Score s'améliore avec:
    // - Un bon CTR
    // - Un bon taux de conversion
    // - Un faible taux de rebond (simulé)

    const avgCTR = dayResults.clicks / dayResults.impressions;
    const avgConversionRate = dayResults.conversions / dayResults.clicks;

    let qsChange = 0;

    // Bonus CTR
    if (avgCTR > 0.05) qsChange += 0.2;
    else if (avgCTR < 0.02) qsChange -= 0.1;

    // Bonus conversions
    if (avgConversionRate > 0.03) qsChange += 0.2;
    else if (avgConversionRate < 0.01) qsChange -= 0.1;

    // Appliquer le changement
    this.qualityScore = Math.max(1, Math.min(10, this.qualityScore + qsChange));
  }

  /**
   * Réinitialise le moteur pour une nouvelle partie
   */
  reset() {
    this.budget = this.initialBudget;
    this.qualityScore = 5;
    this.campaigns = [];
    this.history = [];
  }
}

export default SEAEngine;
