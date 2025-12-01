import React, { useState } from 'react';
import { DollarSign, Newspaper, TrendingUp, BarChart3, Store } from 'lucide-react';

export default function App() {
  // États existants
  const [gameState, setGameState] = useState('menu');
  const [currentTab, setCurrentTab] = useState('game');
  const [currentTurn, setCurrentTurn] = useState(1);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0));
  const [logs, setLogs] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDetailedTools, setShowDetailedTools] = useState(false);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [showAleaModal, setShowAleaModal] = useState(false);
  const [currentAlea, setCurrentAlea] = useState(null);
  const [showToolTip, setShowToolTip] = useState(null);
  const [showNegotiationModal, setShowNegotiationModal] = useState(false);
  const [negotiationCode, setNegotiationCode] = useState('');
  
  // Codes de négociation secrets
  const negotiationCodes = {
    'ALPHA2K': 1000,
    'BETA5K': 5000,
    'GAMMA10K': 10000,
    'DELTA15K': 15000,
    'OMEGA25K': 25000,
    'ALPHAOMEGA': 26000,
    'CRISIS50K': 50000,
    'PHOENIX100K': 100000
  };
  
  const [groupe, setGroupe] = useState({
    nom: "Équipe Alpha",
    budget: 10000,
    plan_marketing: {
      produit: "",
      prix: "",
      distribution: "",
      communication: ""
    },
    cibles: {
      jeunes: false,
      etudiants: false,
      jeunes_actifs: false,
      familles: false,
      familles_mono: false,
      seniors: false,
      seniors_actifs: false,
      professionnels: false,
      tpe_pme: false,
      grandes_entreprises: false,
      csp_plus: false,
      csp_moins: false,
      urbains: false,
      ruraux: false,
      eco_responsables: false,
      technophiles: false,
      early_adopters: false,
      luxe: false
    },
    investissements: {
      prix_effort: 0,
      distribution_effort: 0,
      communication_budget: 0
    },
    points: {
      clarte: 0,
      pertinence: 0,
      creativite: 0,
      coherence: 0
    },
    outils_utilises: [],
    etat: "en_lecture",
    feedback: "",
    historique_scores: [],
    observations: "",
    negociation_utilisee: false,
    negociation_bloquee: 0,
    kpi: {
      parts_marche: 0,
      penetration: 0,
      notoriete: 0,
      satisfaction: 0,
      ventes: 0,
      segments: {
        jeunes: 0,
        familles: 0,
        seniors: 0,
        professionnels: 0
      }
    }
  });

  const brief = {
    client: "TechnoVert Inc.",
    produit: "Purificateur d'air intelligent",
    marche: "Japon"
  };

  // Configuration enrichie des outils avec voies et synergies
  const [outils] = useState([
    {
      nom: "Focus group local",
      effet_visible: "Comprendre les attentes locales",
      effet_reel: "+15% pertinence, déblocage insights culturels",
      cout: 2000,
      disponibilite: "Tour 1",
      permanent: false,
      categorie: "recherche",
      conseil: "Les Japonais valorisent le silence et la compacité. Adaptez votre produit à leurs espaces de vie !",
      synergie: ["Consultant culturel", "R&D Adaptation technique"]
    },
    {
      nom: "Étude terrain prix",
      effet_visible: "Analyse de la sensibilité prix",
      effet_reel: "+10% cohérence prix, révèle le prix psychologique",
      cout: 3000,
      disponibilite: "Tour 2",
      permanent: false,
      categorie: "recherche",
      conseil: "Au Japon, le rapport qualité/prix prime. Un prix trop bas = méfiance !",
      synergie: ["Analyse de la concurrence"]
    },
    {
      nom: "Traduction localisée",
      effet_visible: "Adaptation linguistique pro",
      effet_reel: "+10% cohérence, +5% tous les KPIs Japon",
      cout: 1500,
      disponibilite: "Tour 1",
      permanent: false,
      categorie: "adaptation",
      conseil: "Au-delà de la traduction, adaptez le ton : humble et respectueux.",
      synergie: ["Consultant culturel"]
    },
    {
      nom: "R&D Adaptation technique",
      effet_visible: "Développement features locales",
      effet_reel: "+30% pertinence, mode Tatami, protection régulations",
      cout: 4500,
      disponibilite: "Tour 2",
      permanent: true,
      categorie: "adaptation",
      conseil: "Le mode 'Tatami' ultra-silencieux sera votre killer feature !",
      synergie: ["Focus group local", "Consultant culturel"]
    },
    {
      nom: "Consultant culturel",
      effet_visible: "Expertise interculturelle",
      effet_reel: "+15% cohérence, révèle les codes cachés, synergies x2",
      cout: 2500,
      disponibilite: "Tour 2",
      permanent: true,
      categorie: "expertise",
      conseil: "Le 'Wa' (harmonie) guide tout. Votre produit doit s'intégrer, pas s'imposer.",
      synergie: ["Traduction localisée", "R&D Adaptation technique", "Campagne influenceurs"]
    },
    {
      nom: "Campagne influenceurs",
      effet_visible: "Visibilité réseaux sociaux",
      effet_reel: "+20% créativité com, +15% notoriété si budget >2k€",
      cout: 4000,
      disponibilite: "Tour 2",
      permanent: false,
      categorie: "communication",
      conseil: "Les macro-influenceurs japonais sont sélectifs. Qualité > Quantité.",
      synergie: ["Consultant culturel"]
    },
    {
      nom: "Cabinet lobbying",
      effet_visible: "Relations institutionnelles",
      effet_reel: "Protection taxes/régulations, avantages fiscaux",
      cout: 5000,
      disponibilite: "Tour 3",
      permanent: true,
      categorie: "protection",
      conseil: "Les relations gouvernementales sont cruciales en Asie."
    },
    {
      nom: "Networking",
      effet_visible: "Développer son carnet d'adresses",
      effet_reel: "Déblocage d'opportunités, accès aux décideurs",
      cout: 2000,
      disponibilite: "Tour 1",
      permanent: false,
      categorie: "reseau",
      conseil: "Les soirées de l'ambassade sont LE lieu pour networker au Japon.",
      debloque: ["Rencontre fructueuse", "Rencontre douteuse"]
    },
    {
      nom: "Rencontre fructueuse",
      effet_visible: "Contact haut placé prometteur",
      effet_reel: "+20% chance partenariats premium, accès VIP",
      cout: 3000,
      disponibilite: "Après Networking",
      permanent: false,
      categorie: "reseau",
      prerequis: "Networking",
      conseil: "Le PDG de Takashimaya vous a donné sa carte. Opportunity!",
      debloque: ["Décideurs politiques"]
    },
    {
      nom: "Rencontre douteuse",
      effet_visible: "Contact dans la zone grise",
      effet_reel: "Gains rapides mais risqués, distribution parallèle",
      cout: 1000,
      disponibilite: "Après Networking + Négociation",
      permanent: false,
      categorie: "reseau",
      prerequis: ["Networking", "negociation_utilisee"],
      conseil: "Ces messieurs peuvent 'faciliter' beaucoup de choses...",
      risque: "Taxe mafieuse permanente"
    },
    {
      nom: "Décideurs politiques",
      effet_visible: "Accès ministériel",
      effet_reel: "Avantages fiscaux -30%, fast-track admin",
      cout: 8000,
      disponibilite: "Voie réseau avancée",
      permanent: true,
      categorie: "reseau",
      prerequis: "Rencontre fructueuse",
      conseil: "Le ministre vous soutient. Attention aux journalistes...",
      risque: "Enquête corruption"
    }
  ]);

  // Liste des aléas
  const [aleas] = useState([
    {
      nom: "Taxes Trump",
      titre: "Nouvelle politique protectionniste US",
      description: "Donald Trump annonce une taxe de 40% sur tous les produits étrangers. 'America First' frappe encore.",
      effet: "-30% sur les revenus si pas de protection",
      condition: "tous",
      neutralise_par: "Cabinet lobbying",
      probabilite: 0.3
    },
    {
      nom: "Guerre commerciale",
      titre: "Escalade Chine-USA-Europe",
      description: "Les tensions s'intensifient. Pénurie de puces, chaînes logistiques perturbées.",
      effet: "Coût des outils +30% pendant 2 tours",
      condition: "tous",
      probabilite: 0.35
    },
    {
      nom: "Séisme majeur",
      titre: "Tremblement de terre 7.2 à Tokyo",
      description: "Un séisme majeur frappe la région. Infrastructures endommagées.",
      effet: "Distribution paralysée 1 tour, -20% ventes",
      condition: "marche_japon",
      probabilite: 0.1
    },
    {
      nom: "Crypto boom",
      titre: "Bitcoin à 100k$ - Euphorie crypto",
      description: "La crypto explose, les investisseurs tech sont euphoriques.",
      effet: "+5000€ si produit positionné 'tech/innovant'",
      condition: "opportunite",
      type: "positif",
      probabilite: 0.2
    },
    {
      nom: "Taxe mafieuse",
      titre: "Les 'amis' veulent leur part",
      description: "Vos partenaires alternatifs exigent leur commission.",
      effet: "-2000€/tour pendant 3 tours",
      condition: "voie_douteuse",
      probabilite: 0.8
    }
  ]);

  // Fonction pour générer les observations contextuelles
  const genererObservations = () => {
    let observations = "🔍 OBSERVATIONS TERRAIN :\n\n";
    const turnIndex = groupe.historique_scores.length - 1;
    const evolution = turnIndex > 0 ? groupe.historique_scores[turnIndex] - groupe.historique_scores[turnIndex - 1] : 0;
    
    // Évolution de la stratégie
    if (evolution > 0) {
      observations += "📈 **Évolution positive** : La nouvelle stratégie porte ses fruits ! ";
      observations += `(+${evolution} points vs tour précédent)\n\n`;
    } else if (evolution < 0) {
      observations += "📉 **Alerte** : La stratégie régresse ! ";
      observations += `(${evolution} points vs tour précédent)\n\n`;
    }
    
    // Observations dynamiques sur les influenceurs
    if (groupe.outils_utilises.includes("Campagne influenceurs")) {
      observations += "📱 **Réseaux sociaux** : ";
      if (groupe.plan_marketing.communication.toLowerCase().includes("influenceur")) {
        const impactBudget = groupe.investissements.communication_budget;
        const followers = Math.floor(impactBudget * 15 + Math.random() * 5000);
        const engagement = (impactBudget / 500 + Math.random() * 2).toFixed(1);
        
        if (impactBudget > 2000) {
          observations += `Campagne virale ! @TokyoLifestyle booste votre visibilité. +${followers} followers cette semaine. Taux d'engagement : ${engagement}%. `;
          observations += "Les stories montrent des files d'attente devant Yodobashi Camera.\n\n";
        } else if (impactBudget > 1000) {
          observations += `Progression stable. +${followers} followers. Engagement : ${engagement}%. `;
          observations += "Les micro-influenceurs maintiennent l'intérêt.\n\n";
        } else {
          observations += `Impact limité. Seulement +${followers} followers. `;
          observations += "Budget insuffisant pour créer un vrai mouvement.\n\n";
        }
      } else {
        observations += "⚠️ Outil acheté mais non exploité dans votre communication !\n\n";
      }
    }
    
    // Impact de l'étude de prix avec variations
    if (groupe.outils_utilises.includes("Étude terrain prix")) {
      observations += "💰 **Comportement prix** : ";
      const prixEffort = groupe.investissements.prix_effort;
      const conversion = Math.min(80, prixEffort / 30 + Math.random() * 20);
      
      if (prixEffort > 1500) {
        observations += `Stratégie agressive payante ! Taux de conversion : ${conversion.toFixed(0)}%. `;
        observations += "Un client : 'この価格なら即買い！' (À ce prix, j'achète direct !)\n\n";
      } else if (prixEffort > 800) {
        observations += `Prix compétitif. Conversion : ${conversion.toFixed(0)}%. `;
        observations += "Les clients comparent mais finissent par choisir TechnoVert.\n\n";
      } else {
        observations += `Prix peu attractif. Seulement ${conversion.toFixed(0)}% de conversion. `;
        observations += "Beaucoup regardent mais peu achètent.\n\n";
      }
    }
    
    // Évolution de la distribution
    if (groupe.investissements.distribution_effort > 1000) {
      const stockLevel = 95 + Math.random() * 5;
      observations += `🏪 **Distribution** : Excellence opérationnelle ! Stock : ${stockLevel.toFixed(0)}%. `;
      observations += "Livraisons J+1, SAV réactif. Les revendeurs adorent travailler avec vous.\n\n";
    } else if (groupe.investissements.distribution_effort > 500) {
      observations += "🏪 **Distribution** : Correcte mais perfectible. ";
      observations += "Quelques ruptures le weekend. Délais de 3-5 jours.\n\n";
    }
    
    // Impact des adaptations culturelles
    if (groupe.outils_utilises.includes("R&D Adaptation technique")) {
      const satisfaction = 75 + Math.random() * 20;
      observations += `🎌 **Innovation produit** : Le mode 'Tatami' cartonne ! Satisfaction : ${satisfaction.toFixed(0)}%. `;
      observations += "Article dans Nikkei Tech : 'やっと日本人のための製品' (Enfin un produit pour les Japonais).\n\n";
    } else if (groupe.outils_utilises.includes("Consultant culturel")) {
      observations += "🎌 **Adaptation culturelle** : Les codes sont respectés. ";
      observations += "Les Japonais apprécient l'effort mais attendent plus d'innovations techniques.\n\n";
    }
    
    // Voies et networking
    if (groupe.outils_utilises.includes("Networking")) {
      if (groupe.outils_utilises.includes("Rencontre fructueuse")) {
        observations += "🤝 **Réseau premium** : Vos contacts ouvrent des portes ! ";
        observations += "Invitation exclusive au Tokyo Business Summit. ";
        if (groupe.outils_utilises.includes("Décideurs politiques")) {
          observations += "Le ministre vous cite en exemple de réussite franco-japonaise.\n\n";
        } else {
          observations += "Les décideurs s'intéressent à votre cas.\n\n";
        }
      } else if (groupe.outils_utilises.includes("Rencontre douteuse")) {
        observations += "💼 **Réseau alternatif** : Distribution éclair mais... ";
        observations += "Des hommes en costume noir supervisent les livraisons. ";
        observations += "Cash only. Pas de questions.\n\n";
      }
    }
    
    // Focus group insights
    if (groupe.outils_utilises.includes("Focus group local")) {
      const produitAdapte = groupe.plan_marketing.produit.toLowerCase();
      if (produitAdapte.includes("compact") && produitAdapte.includes("silencieux")) {
        observations += "👥 **Focus group** : Validation totale ! ";
        observations += "'Parfait pour nos appartements' disent-ils. Note : 9/10.\n\n";
      } else if (produitAdapte.includes("compact") || produitAdapte.includes("silencieux")) {
        observations += "👥 **Focus group** : Sur la bonne voie. ";
        observations += "Il manque " + (!produitAdapte.includes("compact") ? "la compacité" : "le silence") + ".\n\n";
      } else {
        observations += "👥 **Focus group** : Décalage important ! ";
        observations += "Le produit ne correspond pas aux attentes japonaises.\n\n";
      }
    }
    
    // Analyse de la concurrence si outil présent
    if (groupe.outils_utilises.includes("Analyse de la concurrence")) {
      observations += "🔎 **Veille concurrentielle** : ";
      if (groupe.kpi.parts_marche > 15) {
        observations += "Alerte ! Sharp lance un modèle similaire -30% moins cher. ";
        observations += "Daikin accélère sa R&D. La riposte s'organise.\n\n";
      } else {
        observations += "Les leaders vous ignorent encore. ";
        observations += "Profitez-en pour consolider votre position.\n\n";
      }
    }
    
    // Ambiance générale avec plus de nuances
    const dernierScore = groupe.historique_scores[groupe.historique_scores.length - 1] || 0;
    const moyenneScore = groupe.historique_scores.reduce((a, b) => a + b, 0) / groupe.historique_scores.length || 0;
    
    observations += "🎯 **Bilan général** : ";
    if (dernierScore < 4) {
      observations += "Situation critique ! ";
      const problems = [];
      if (!groupe.outils_utilises.length) problems.push("aucun outil");
      if (Object.values(groupe.cibles).filter(v => v).length > 5) problems.push("trop de cibles");
      if (groupe.investissements.communication_budget < 1000) problems.push("budget com faible");
      observations += `Problèmes : ${problems.join(", ") || "stratégie inadaptée"}. `;
      observations += "Changement radical nécessaire !";
    } else if (dernierScore < 8) {
      observations += `Progression ${evolution > 0 ? "encourageante" : "à consolider"}. `;
      observations += `Score actuel : ${dernierScore}/12. `;
      const strengths = [];
      if (groupe.outils_utilises.includes("R&D Adaptation technique")) strengths.push("produit adapté");
      if (groupe.investissements.communication_budget > 2000) strengths.push("bonne visibilité");
      if (strengths.length) observations += `Points forts : ${strengths.join(", ")}. `;
      observations += "Continuez les efforts !";
    } else {
      observations += "Excellence opérationnelle ! ";
      observations += `Performance : ${dernierScore}/12 (moy: ${moyenneScore.toFixed(1)}). `;
      observations += "Les concurrents s'inquiètent. ";
      if (groupe.kpi.parts_marche > 20) {
        observations += "Vous devenez un acteur majeur du marché !";
      } else {
        observations += "La percée est proche !";
      }
    }
    
    // Alertes spéciales
    if (groupe.budget < 2000 && !pendingEvents.some(e => e.type === "taxe_mafia")) {
      observations += "\n\n⚠️ **ALERTE BUDGET** : Trésorerie faible ! Négociation urgente recommandée.";
    }
    
    if (pendingEvents.some(e => e.type === "taxe_mafia")) {
      observations += "\n\n💸 **TAXE MAFIEUSE ACTIVE** : -2000€/tour. Vos 'amis' n'oublient jamais...";
    }
    
    return observations;
  };

  // Fonction pour vérifier les synergies
  const checkSynergies = (groupe) => {
    let bonusSynergie = 0;
    let synergiesActives = [];
    
    outils.forEach(outil => {
      if (groupe.outils_utilises.includes(outil.nom) && outil.synergie) {
        outil.synergie.forEach(synergieNom => {
          if (groupe.outils_utilises.includes(synergieNom)) {
            bonusSynergie += 5;
            synergiesActives.push(`${outil.nom} + ${synergieNom}`);
          }
        });
      }
    });
    
    return { bonusSynergie, synergiesActives };
  };

  const addLog = (message, type = 'normal') => {
    setLogs(prev => [...prev, { message, type, timestamp: Date.now() }]);
  };

  const triggerAleaImmediate = () => {
    let aleasPossibles = aleas.filter(a => {
      if (a.condition === "tous") return true;
      if (a.condition === "marche_japon" && brief.marche === "Japon") return true;
      if (a.condition === "voie_douteuse" && groupe.outils_utilises.includes("Rencontre douteuse")) return true;
      return false;
    });
    
    if (aleasPossibles.length > 0) {
      return aleasPossibles[Math.floor(Math.random() * aleasPossibles.length)];
    }
    return null;
  };

  const applyAleaEffect = (alea) => {
    switch(alea.nom) {
      case "Taxes Trump":
        const perte = Math.floor(groupe.budget * 0.3);
        setGroupe(prev => ({ ...prev, budget: prev.budget - perte }));
        addLog(`💸 Perte de ${perte}€ due aux taxes`, "error");
        break;
      case "Taxe mafieuse":
        setPendingEvents(prev => [...prev, { type: "taxe_mafia", tours: 3, montant: 2000 }]);
        break;
      case "Guerre commerciale":
        setPendingEvents(prev => [...prev, { type: "inflation_outils", tours: 2, taux: 1.3 }]);
        break;
      case "Crypto boom":
        if (groupe.plan_marketing.produit.toLowerCase().includes("tech")) {
          setGroupe(prev => ({ ...prev, budget: prev.budget + 5000 }));
          addLog(`💰 +5000€ d'investissement crypto !`, "success");
        }
        break;
    }
  };

  const updateKPIs = (scores) => {
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    const newKPIs = { ...groupe.kpi };
    
    // Parts de marché réalistes (0-10% max pour un nouveau produit)
    let partsBase = totalScore * 0.5; // Max 6% avec score parfait
    if (groupe.outils_utilises.includes("R&D Adaptation technique")) partsBase += 1;
    if (groupe.outils_utilises.includes("Focus group local")) partsBase += 0.5;
    if (groupe.outils_utilises.includes("Joint-venture local")) partsBase += 2;
    newKPIs.parts_marche = Math.min(10, Math.max(0, partsBase));
    
    // Pénétration réaliste (0-15% max)
    let penetrationBase = scores.pertinence * 2;
    if (groupe.investissements.distribution_effort > 1000) penetrationBase += 2;
    if (groupe.outils_utilises.includes("Expert supply chain")) penetrationBase += 3;
    newKPIs.penetration = Math.min(15, Math.max(0, penetrationBase));
    
    // Notoriété (0-30% max pour nouveau produit)
    let notorieteBase = scores.creativite * 3;
    if (groupe.investissements.communication_budget > 1000) notorieteBase += 3;
    if (groupe.investissements.communication_budget > 2000) notorieteBase += 3;
    if (groupe.outils_utilises.includes("Campagne influenceurs")) notorieteBase += 5;
    newKPIs.notoriete = Math.min(30, Math.max(0, notorieteBase));
    
    // Satisfaction (30-90%)
    let satisfactionBase = 30 + (scores.coherence + scores.clarte) * 10;
    if (groupe.outils_utilises.includes("R&D Adaptation technique")) satisfactionBase += 15;
    if (groupe.outils_utilises.includes("Consultant culturel")) satisfactionBase += 10;
    newKPIs.satisfaction = Math.min(90, Math.max(30, satisfactionBase));
    
    // Calcul des ventes basé sur tous les KPIs
    const baseVentes = 100; // Ventes de base même sans outils
    const multiplierPDM = 1 + (newKPIs.parts_marche / 10);
    const multiplierPenetration = 1 + (newKPIs.penetration / 20);
    const multiplierNotoriete = 1 + (newKPIs.notoriete / 40);
    const multiplierSatisfaction = newKPIs.satisfaction / 60;
    
    newKPIs.ventes = Math.floor(
      baseVentes * 
      multiplierPDM * 
      multiplierPenetration * 
      multiplierNotoriete * 
      multiplierSatisfaction *
      (1 + totalScore / 10)
    );
    
    // Segments avec des valeurs plus réalistes
    const nbCibles = Object.values(groupe.cibles).filter(v => v).length;
    const penaliteCibles = nbCibles > 5 ? (nbCibles - 5) * 2 : 0;
    
    newKPIs.segments.jeunes = groupe.cibles.jeunes ? Math.max(0, Math.min(25, scores.creativite * 5 - penaliteCibles)) : 0;
    newKPIs.segments.familles = groupe.cibles.familles ? Math.max(0, Math.min(20, scores.coherence * 5 - penaliteCibles)) : 0;
    newKPIs.segments.seniors = groupe.cibles.seniors ? Math.max(0, Math.min(15, scores.clarte * 5 - penaliteCibles)) : 0;
    newKPIs.segments.professionnels = groupe.cibles.professionnels ? Math.max(0, Math.min(30, scores.pertinence * 6 - penaliteCibles)) : 0;
    
    // Appliquer les synergies
    const { bonusSynergie } = checkSynergies(groupe);
    if (bonusSynergie > 0) {
      Object.keys(newKPIs).forEach(key => {
        if (typeof newKPIs[key] === 'number' && key !== 'ventes') {
          newKPIs[key] = Math.min(100, newKPIs[key] * (1 + bonusSynergie / 100));
        }
      });
      newKPIs.ventes = Math.floor(newKPIs.ventes * (1 + bonusSynergie / 100));
    }
    
    setGroupe(prev => ({ ...prev, kpi: newKPIs }));
  };

  const simulerIAMarche = (plan, invest) => {
    const scores = { clarte: 0, pertinence: 0, creativite: 0, coherence: 0 };
    let feedback = "📊 Analyse du marché japonais :\n\n";
    
    const hasCible = Object.values(groupe.cibles).some(v => v === true);
    if (!hasCible) {
      return { scores, feedback: "❌ REJETÉ : Sélectionnez au moins une cible !" };
    }
    
    const nbCibles = Object.values(groupe.cibles).filter(v => v === true).length;
    if (nbCibles > 5) {
      feedback += "⚠️ Trop de cibles ! Risque de dispersion.\n";
      scores.coherence = -1;
    }
    
    // Analyse produit
    if (plan.produit.length > 30) {
      const adapte = plan.produit.toLowerCase().includes('compact') || 
                     plan.produit.toLowerCase().includes('silencieux');
      scores.pertinence = adapte ? 2 : 1;
      scores.clarte = 1;
      feedback += adapte ? "✓ Adaptation culturelle détectée.\n" : "⚠️ Adaptation limitée.\n";
    }
    
    // Analyse prix
    if (plan.prix.length > 20) {
      if (invest.prix_effort > 2000) {
        return { scores, feedback: feedback + "\n🚫 REJETÉ : Effort prix trop important !" };
      }
      scores.coherence += 1;
      feedback += "✓ Stratégie prix définie.\n";
    }
    
    // Analyse distribution
    if (plan.distribution.length > 20) {
      scores.pertinence += 1;
      feedback += "✓ Canaux définis.\n";
    }
    
    // Analyse communication
    if (plan.communication.length > 50) {
      scores.creativite = invest.communication_budget >= 1500 ? 2 : 1;
      feedback += "✓ Communication structurée.\n";
    }
    
    // Bonus outils
    if (groupe.outils_utilises.includes("Focus group local")) scores.pertinence = Math.min(3, scores.pertinence + 1);
    if (groupe.outils_utilises.includes("Consultant culturel")) scores.coherence = Math.min(3, scores.coherence + 1);
    
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    
    if (totalScore < 4) {
      feedback += "\n😡 Performance très faible.";
    } else if (totalScore < 8) {
      feedback += "\n🤔 Des progrès mais insuffisant.";
    } else {
      feedback += "\n😊 Bonne compréhension du marché !";
    }
    
    return { scores, feedback };
  };

  const soumettreplan = () => {
    if (!groupe.plan_marketing.produit || !groupe.plan_marketing.prix || 
        !groupe.plan_marketing.distribution || !groupe.plan_marketing.communication) {
      addLog("⚠️ Remplissez tous les champs !", "warning");
      return;
    }
    
    const totalInvesti = Object.values(groupe.investissements).reduce((a, b) => a + b, 0);
    if (totalInvesti > groupe.budget) {
      addLog("❌ Budget insuffisant !", "error");
      return;
    }
    
    setIsAnimating(true);
    addLog("📤 Envoi du plan...", "info");
    
    setTimeout(() => {
      const { scores, feedback } = simulerIAMarche(groupe.plan_marketing, groupe.investissements);
      
      if (feedback.includes("REJETÉ")) {
        addLog(feedback, "error");
        setIsAnimating(false);
        return;
      }
      
      const totalPoints = Object.values(scores).reduce((a, b) => a + b, 0);
      
      // Nouveau système de gains plus équilibré
      let gains = 0;
      
      // Revenus de base plus modestes
      const revenusBase = 300 + totalPoints * 100;
      
      // Multiplicateurs selon la stratégie (plus modérés)
      let multiplicateur = 1;
      
      // Bonus produit adapté
      if (groupe.plan_marketing.produit.toLowerCase().includes("compact") && 
          groupe.plan_marketing.produit.toLowerCase().includes("silencieux")) {
        multiplicateur *= 1.3;
      } else if (groupe.plan_marketing.produit.toLowerCase().includes("compact") || 
                 groupe.plan_marketing.produit.toLowerCase().includes("silencieux")) {
        multiplicateur *= 1.15;
      }
      
      // Bonus outils (réduits)
      if (groupe.outils_utilises.includes("R&D Adaptation technique")) multiplicateur *= 1.25;
      if (groupe.outils_utilises.includes("Focus group local")) multiplicateur *= 1.1;
      if (groupe.outils_utilises.includes("Consultant culturel")) multiplicateur *= 1.1;
      if (groupe.outils_utilises.includes("Campagne influenceurs")) multiplicateur *= 1.15;
      
      // Bonus investissements (plus progressifs)
      if (groupe.investissements.prix_effort > 1000) {
        multiplicateur *= 1.1;
      } else if (groupe.investissements.prix_effort > 500) {
        multiplicateur *= 1.05;
      }
      
      if (groupe.investissements.distribution_effort > 1000) {
        multiplicateur *= 1.12;
      } else if (groupe.investissements.distribution_effort > 500) {
        multiplicateur *= 1.06;
      }
      
      if (groupe.investissements.communication_budget > 2000) {
        multiplicateur *= 1.15;
      } else if (groupe.investissements.communication_budget > 1000) {
        multiplicateur *= 1.08;
      } else if (groupe.investissements.communication_budget > 500) {
        multiplicateur *= 1.04;
      }
      
      // Calcul final des gains
      gains = Math.floor(revenusBase * multiplicateur);
      
      // Pénalités plus sévères
      if (totalPoints < 3) gains = Math.floor(gains * 0.3); // Très mauvaise performance
      if (totalPoints < 5) gains = Math.floor(gains * 0.6); // Performance faible
      
      const nbCibles = Object.values(groupe.cibles).filter(v => v).length;
      if (nbCibles > 5) gains = Math.floor(gains * 0.7); // Trop de cibles
      if (nbCibles === 0) gains = 0; // Aucune cible
      
      // Sans outils au premier tour, gains très limités
      if (groupe.outils_utilises.length === 0 && currentTurn === 1) {
        gains = Math.min(gains, 500);
      }
      
      const nouveauBudget = groupe.budget - totalInvesti + gains;
      
      addLog(`💰 ${gains >= 0 ? 'Gains' : 'Pertes'} : ${gains}€`, gains >= 0 ? "success" : "error");
      
      // Afficher le feedback ligne par ligne
      feedback.split('\n').forEach(line => {
        if (line.trim()) {
          addLog(line, "info");
        }
      });
      
      const observationsGenerees = genererObservations();
      
      setGroupe(prev => ({
        ...prev,
        points: scores,
        budget: nouveauBudget,
        etat: "en_feedback",
        feedback: feedback,
        historique_scores: [...prev.historique_scores, totalPoints],
        observations: observationsGenerees
      }));
      
      updateKPIs(scores);
      setIsAnimating(false);
      
      // Déclencher aléa
      if (Math.random() > 0.5) {
        setTimeout(() => {
          const alea = triggerAleaImmediate();
          if (alea) {
            setCurrentAlea(alea);
            setShowAleaModal(true);
          }
        }, 2000);
      }
    }, 1500);
  };

  const acheterOutil = (outil) => {
    if (groupe.budget < outil.cout) {
      addLog(`❌ Budget insuffisant pour ${outil.nom}`, "error");
      return;
    }
    
    if (groupe.outils_utilises.includes(outil.nom)) {
      addLog(`❌ Déjà possédé : ${outil.nom}`, "error");
      return;
    }
    
    // Vérifier prérequis
    if (outil.prerequis) {
      const prereqs = Array.isArray(outil.prerequis) ? outil.prerequis : [outil.prerequis];
      const hasAllPrereqs = prereqs.every(p => {
        if (p === "negociation_utilisee") return groupe.negociation_utilisee;
        return groupe.outils_utilises.includes(p);
      });
      
      if (!hasAllPrereqs) {
        addLog(`❌ Prérequis manquants`, "error");
        return;
      }
    }
    
    setGroupe(prev => ({
      ...prev,
      budget: prev.budget - outil.cout,
      outils_utilises: [...prev.outils_utilises, outil.nom]
    }));
    
    addLog(`✅ ${outil.nom} acheté !`, "success");
    
    if (outil.conseil) {
      setShowToolTip({ nom: outil.nom, conseil: outil.conseil });
    }
  };

  const commanderVeille = () => {
    if (groupe.budget < 800) {
      addLog("❌ Budget insuffisant pour la veille", "error");
      return;
    }
    
    setGroupe(prev => ({ ...prev, budget: prev.budget - 800 }));
    addLog("💰 Veille commandée -800€", "info");
    
    setTimeout(() => {
      const score_moyen = groupe.historique_scores.reduce((a, b) => a + b, 0) / groupe.historique_scores.length || 0;
      const dernierScore = groupe.historique_scores[groupe.historique_scores.length - 1] || 0;
      
      // Veille presse variée selon la performance
      addLog("\n📰 REVUE DE PRESSE INTERNATIONALE", "press");
      
      if (score_moyen < 4) {
        addLog("🇯🇵 Nikkei Business: 'TechnoVert peine à convaincre le marché japonais'", "press");
        addLog("🇺🇸 WSJ: 'Another Western company struggles in Japan'", "press");
        addLog("🇫🇷 Les Échos: 'Les défis de l'adaptation culturelle pour TechnoVert'", "press");
      } else if (score_moyen < 8) {
        addLog("🇯🇵 Nikkei: 'TechnoVert progresse lentement mais sûrement'", "press");
        addLog("🇺🇸 Forbes: 'Learning curve - TechnoVert adapts to Japanese market'", "press");
        if (groupe.outils_utilises.includes("R&D Adaptation technique")) {
          addLog("🇯🇵 Tech Review JP: 'Le mode Tatami, une innovation prometteuse'", "press");
        }
      } else {
        addLog("🇯🇵 Nikkei: 'Success story - Comment TechnoVert a conquis le Japon'", "press");
        addLog("🇺🇸 Harvard Business Review: 'Case study: TechnoVert's Japanese triumph'", "press");
        addLog("🇫🇷 Capital: 'TechnoVert, la réussite française au pays du Soleil Levant'", "press");
      }
      
      // Analyse de la concurrence
      if (dernierScore > 6) {
        addLog("📊 Analyse: Sharp et Daikin préparent une riposte", "press");
      }
      
      // Tendances marché
      if (groupe.investissements.communication_budget > 2000) {
        addLog("📈 Tendance: Forte visibilité sur les réseaux sociaux japonais", "press");
      }
      
      if (groupe.kpi.satisfaction > 50) {
        addLog("😊 Sondage: Les clients japonais plébiscitent TechnoVert", "press");
      }
      
      // Rumeurs selon les voies
      if (groupe.outils_utilises.includes("Rencontre fructueuse")) {
        addLog("🤝 Rumeur: Partenariat majeur en négociation", "press");
      }
      if (groupe.outils_utilises.includes("Rencontre douteuse")) {
        addLog("🕵️ Enquête: Des circuits de distribution alternatifs inquiètent", "press");
      }
    }, 1000);
  };

  const validateNegotiationCode = () => {
    const code = negotiationCode.toUpperCase().trim();
    
    if (negotiationCodes[code]) {
      const montant = negotiationCodes[code];
      setGroupe(prev => ({ 
        ...prev, 
        budget: prev.budget + montant,
        negociation_utilisee: true 
      }));
      addLog(`✅ +${montant}€ négociés !`, "success");
      setShowNegotiationModal(false);
      setNegotiationCode('');
    } else {
      addLog("❌ Code invalide", "error");
    }
  };

  const tourSuivant = () => {
    // Appliquer événements en cours
    pendingEvents.forEach(evt => {
      if (evt.type === "taxe_mafia" && evt.tours > 0) {
        setGroupe(prev => ({ ...prev, budget: prev.budget - evt.montant }));
        addLog(`💸 Taxe mafieuse : -${evt.montant}€`, "error");
        evt.tours--;
      }
    });
    
    setPendingEvents(prev => prev.filter(evt => evt.tours > 0));
    setCurrentTurn(prev => prev + 1);
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
    
    setGroupe(prev => ({
      ...prev,
      etat: "en_lecture",
      investissements: { prix_effort: 0, distribution_effort: 0, communication_budget: 0 }
    }));
    
    addLog(`\n━━━ TOUR ${currentTurn + 1} ━━━`, "turn");
    
    if (currentTurn === 3) {
      setShowDetailedTools(true);
      addLog("🔓 Analyses détaillées débloquées !", "success");
    }
    
    // Vérifier si c'est la fin du jeu
    if (currentTurn >= 12) {
      setTimeout(() => {
        setGameState('fin');
      }, 1000);
    }
  };

  const renderKPITab = () => (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-mono text-stone-800 mb-4">Indicateurs de Performance</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg border border-stone-200">
          <h3 className="font-semibold text-stone-700 mb-2">Parts de marché</h3>
          <div className="text-3xl font-mono text-emerald-600">{groupe.kpi.parts_marche.toFixed(1)}%</div>
          <div className="w-full bg-stone-200 rounded-full h-2 mt-2">
            <div className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
              style={{width: `${groupe.kpi.parts_marche * 10}%`}} />
          </div>
          <p className="text-xs text-stone-500 mt-1">Objectif : 5%</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-stone-200">
          <h3 className="font-semibold text-stone-700 mb-2">Taux de pénétration</h3>
          <div className="text-3xl font-mono text-sky-600">{groupe.kpi.penetration.toFixed(1)}%</div>
          <div className="w-full bg-stone-200 rounded-full h-2 mt-2">
            <div className="bg-sky-500 h-2 rounded-full transition-all duration-500" 
              style={{width: `${groupe.kpi.penetration * 6.67}%`}} />
          </div>
          <p className="text-xs text-stone-500 mt-1">Max réaliste : 15%</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-stone-200">
          <h3 className="font-semibold text-stone-700 mb-2">Notoriété</h3>
          <div className="text-3xl font-mono text-violet-600">{groupe.kpi.notoriete.toFixed(1)}%</div>
          <div className="w-full bg-stone-200 rounded-full h-2 mt-2">
            <div className="bg-violet-500 h-2 rounded-full transition-all duration-500" 
              style={{width: `${groupe.kpi.notoriete * 3.33}%`}} />
          </div>
          <p className="text-xs text-stone-500 mt-1">Max nouveau produit : 30%</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-stone-200">
          <h3 className="font-semibold text-stone-700 mb-2">Satisfaction client</h3>
          <div className="text-3xl font-mono text-amber-600">{groupe.kpi.satisfaction.toFixed(0)}%</div>
          <div className="w-full bg-stone-200 rounded-full h-2 mt-2">
            <div className="bg-amber-500 h-2 rounded-full transition-all duration-500" 
              style={{width: `${groupe.kpi.satisfaction}%`}} />
          </div>
          <p className="text-xs text-stone-500 mt-1">Objectif : 60%</p>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg border border-stone-200">
        <h3 className="font-semibold text-stone-700 mb-2">Ventes</h3>
        <div className="text-4xl font-mono text-emerald-600">{groupe.kpi.ventes} unités</div>
        <p className="text-sm text-stone-600 mt-2">
          Revenus générés : {groupe.kpi.ventes * 5}€
        </p>
        <p className="text-xs text-stone-500 mt-1">Objectif : 1000 unités</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg border border-stone-200">
        <h3 className="font-semibold text-stone-700 mb-4">Pénétration par segment</h3>
        <div className="space-y-3">
          {Object.entries(groupe.kpi.segments).map(([segment, value]) => (
            <div key={segment}>
              <div className="flex justify-between text-sm mb-1">
                <span className="capitalize">{segment}</span>
                <span className="font-mono">{value.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-1.5">
                <div className="bg-indigo-500 h-1.5 rounded-full" style={{width: `${value}%`}} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderVisualizationTab = () => (
    <div className="p-6 bg-stone-100 h-full">
      <h2 className="text-2xl font-mono text-stone-800 mb-4">Visualisation Marché</h2>
      <div className="bg-white p-8 rounded-lg border-2 border-stone-300 shadow-lg">
        <div className="text-center text-stone-600">
          <Store className="w-24 h-24 mx-auto mb-4" />
          <p>Visualisation en développement</p>
        </div>
      </div>
    </div>
  );

  if (gameState === 'menu') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-8 p-4 bg-amber-50">
        <h1 className="text-4xl font-mono text-stone-800">MARKETING INTERNATIONAL</h1>
        <p className="text-stone-600 max-w-md text-center">
          Lancez un produit sur un marché étranger. Gérez votre budget, adaptez votre stratégie.
        </p>
        <button 
          onClick={() => {
            setGameState('jeu');
            addLog("🌏 Bienvenue dans le serious game Marketing International", "info");
            addLog(`Client : ${brief.client}`, "normal");
            addLog(`Produit : ${brief.produit}`, "normal");
            addLog(`Marché cible : ${brief.marche}`, "normal");
          }}
          className="px-6 py-3 bg-stone-700 hover:bg-stone-800 text-white transition-colors rounded-sm"
        >
          COMMENCER
        </button>
      </div>
    );
  }

  if (gameState === 'fin') {
    const score_total = groupe.historique_scores.reduce((a, b) => a + b, 0);
    const score_moyen = score_total / groupe.historique_scores.length || 0;
    const objectifPDM = 5; // 5% de parts de marché
    const objectifVentes = 1000; // 1000 ventes
    const objectifSatisfaction = 60; // 60% de satisfaction
    
    const succes = groupe.kpi.parts_marche >= objectifPDM && 
                   groupe.kpi.ventes >= objectifVentes && 
                   groupe.kpi.satisfaction >= objectifSatisfaction;
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-6 p-4 bg-amber-50">
        <h1 className={`text-4xl font-mono ${succes ? 'text-emerald-600' : 'text-rose-600'}`}>
          {succes ? '🎉 SUCCÈS !' : '😔 FIN DE PARTIE'}
        </h1>
        
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl">
          <h2 className="text-2xl font-mono text-stone-800 mb-4 text-center">
            {succes ? 'Félicitations ! Vous avez conquis le marché japonais !' : 'Le marché japonais reste difficile à conquérir...'}
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 border rounded">
              <p className="text-sm text-stone-600">Tours joués</p>
              <p className="text-2xl font-mono text-stone-800">{currentTurn}/12</p>
            </div>
            <div className="text-center p-4 border rounded">
              <p className="text-sm text-stone-600">Score moyen</p>
              <p className="text-2xl font-mono text-stone-800">{score_moyen.toFixed(1)}/12</p>
            </div>
            <div className="text-center p-4 border rounded">
              <p className="text-sm text-stone-600">Budget final</p>
              <p className={`text-2xl font-mono ${groupe.budget >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {groupe.budget}€
              </p>
            </div>
            <div className="text-center p-4 border rounded">
              <p className="text-sm text-stone-600">Ventes totales</p>
              <p className="text-2xl font-mono text-stone-800">{groupe.kpi.ventes}</p>
            </div>
          </div>
          
          <div className="space-y-3 mb-6">
            <h3 className="font-mono text-lg text-stone-800">Objectifs :</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Parts de marché ≥ {objectifPDM}%</span>
                <span className={groupe.kpi.parts_marche >= objectifPDM ? 'text-emerald-600' : 'text-rose-600'}>
                  {groupe.kpi.parts_marche.toFixed(1)}% {groupe.kpi.parts_marche >= objectifPDM ? '✓' : '✗'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Ventes ≥ {objectifVentes}</span>
                <span className={groupe.kpi.ventes >= objectifVentes ? 'text-emerald-600' : 'text-rose-600'}>
                  {groupe.kpi.ventes} {groupe.kpi.ventes >= objectifVentes ? '✓' : '✗'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Satisfaction ≥ {objectifSatisfaction}%</span>
                <span className={groupe.kpi.satisfaction >= objectifSatisfaction ? 'text-emerald-600' : 'text-rose-600'}>
                  {groupe.kpi.satisfaction.toFixed(0)}% {groupe.kpi.satisfaction >= objectifSatisfaction ? '✓' : '✗'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <button onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-stone-700 hover:bg-stone-800 text-white rounded-sm">
              NOUVELLE PARTIE
            </button>
            {currentTurn < 12 && (
              <button onClick={() => setGameState('jeu')} 
                className="block mx-auto px-4 py-2 bg-stone-500 hover:bg-stone-600 text-white rounded-sm text-sm">
                Continuer à jouer
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="flex border-b border-stone-300 bg-white">
        <button onClick={() => setCurrentTab('game')}
          className={`px-6 py-3 font-mono ${currentTab === 'game' ? 'bg-stone-700 text-white' : 'text-stone-600 hover:bg-stone-100'}`}>
          Jeu
        </button>
        <button onClick={() => setCurrentTab('kpi')}
          className={`px-6 py-3 font-mono flex items-center gap-2 ${currentTab === 'kpi' ? 'bg-stone-700 text-white' : 'text-stone-600 hover:bg-stone-100'}`}>
          <BarChart3 className="w-4 h-4" />
          KPIs
        </button>
        <button onClick={() => setCurrentTab('visualization')}
          className={`px-6 py-3 font-mono flex items-center gap-2 ${currentTab === 'visualization' ? 'bg-stone-700 text-white' : 'text-stone-600 hover:bg-stone-100'}`}>
          <Store className="w-4 h-4" />
          Visualisation
        </button>
      </div>
      
      {currentTab === 'game' && (
        <div className="flex h-[calc(100vh-48px)]">
          <div className="w-1/2 p-4 border-r border-stone-200 bg-amber-50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-mono text-stone-800">JOURNAL</h2>
              <div className="text-right text-stone-500">
                Tour {currentTurn}
              </div>
            </div>
            <div className="h-[calc(100vh-140px)] overflow-y-auto space-y-2 font-mono text-sm bg-white/50 p-4 rounded-sm">
              {logs.map((log, i) => (
                <div key={i} className={`
                  ${log.type === 'info' ? 'text-sky-600' : ''}
                  ${log.type === 'success' ? 'text-emerald-600' : ''}
                  ${log.type === 'error' ? 'text-rose-600' : ''}
                  ${log.type === 'warning' ? 'text-amber-700' : ''}
                  ${log.type === 'press' ? 'text-indigo-600' : ''}
                  ${log.type === 'turn' ? 'text-stone-800 font-bold' : ''}
                  ${log.type === 'normal' ? 'text-stone-600' : ''}
                `}>
                  {log.message}
                </div>
              ))}
            </div>
          </div>
          
          <div className="w-1/2 p-4 overflow-y-auto bg-stone-50">
            <div className="mb-6 p-4 border border-stone-200 bg-white rounded-sm">
              <div className="flex justify-between items-center">
                <h3 className="font-mono text-lg text-stone-800">{groupe.nom}</h3>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span className={`font-mono ${groupe.budget < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {groupe.budget}€
                  </span>
                </div>
              </div>
            </div>
            
            {groupe.etat === 'en_lecture' && (
              <div className="space-y-6">
                <div className="p-4 border border-stone-200 bg-white rounded-sm">
                  <h3 className="font-mono text-lg mb-4 text-stone-800">EFFORTS COMMERCIAUX</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-stone-600 mb-1">
                        Effort prix ({groupe.investissements.prix_effort}€)
                      </label>
                      <input type="range" min="0" max="3000" step="100"
                        value={groupe.investissements.prix_effort}
                        onChange={(e) => setGroupe(prev => ({
                          ...prev,
                          investissements: { ...prev.investissements, prix_effort: parseInt(e.target.value) }
                        }))}
                        className="w-full" />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-stone-600 mb-1">
                        Excellence distribution ({groupe.investissements.distribution_effort}€)
                      </label>
                      <input type="range" min="0" max="2000" step="100"
                        value={groupe.investissements.distribution_effort}
                        onChange={(e) => setGroupe(prev => ({
                          ...prev,
                          investissements: { ...prev.investissements, distribution_effort: parseInt(e.target.value) }
                        }))}
                        className="w-full" />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-stone-600 mb-1">
                        Budget Communication ({groupe.investissements.communication_budget}€)
                      </label>
                      <input type="range" min="0" max="4000" step="100"
                        value={groupe.investissements.communication_budget}
                        onChange={(e) => setGroupe(prev => ({
                          ...prev,
                          investissements: { ...prev.investissements, communication_budget: parseInt(e.target.value) }
                        }))}
                        className="w-full" />
                    </div>
                    
                    <div className="pt-2 border-t text-sm">
                      <span>Total investi : </span>
                      <span className={`font-mono ${Object.values(groupe.investissements).reduce((a, b) => a + b, 0) > groupe.budget ? 'text-rose-600' : ''}`}>
                        {Object.values(groupe.investissements).reduce((a, b) => a + b, 0)}€
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-mono text-lg text-stone-800">PLAN MARKETING</h3>
                  
                  <div className="p-4 border border-stone-200 bg-white rounded-sm">
                    <h4 className="font-semibold text-stone-700 mb-3">Cibles et Segmentation ({Object.values(groupe.cibles).filter(v => v).length} sélectionnées)</h4>
                    
                    <div className="space-y-4">
                      {/* Démographique */}
                      <div>
                        <h5 className="text-sm font-medium text-stone-600 mb-2 uppercase tracking-wide">👥 Démographique</h5>
                        <div className="grid grid-cols-2 gap-2 text-sm pl-3">
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" checked={groupe.cibles.jeunes}
                              onChange={(e) => setGroupe(prev => ({
                                ...prev, cibles: { ...prev.cibles, jeunes: e.target.checked }
                              }))}
                              className="w-4 h-4" />
                            <span>Jeunes (18-25)</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" checked={groupe.cibles.etudiants}
                              onChange={(e) => setGroupe(prev => ({
                                ...prev, cibles: { ...prev.cibles, etudiants: e.target.checked }
                              }))}
                              className="w-4 h-4" />
                            <span>Étudiants</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" checked={groupe.cibles.jeunes_actifs}
                              onChange={(e) => setGroupe(prev => ({
                                ...prev, cibles: { ...prev.cibles, jeunes_actifs: e.target.checked }
                              }))}
                              className="w-4 h-4" />
                            <span>Jeunes actifs</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" checked={groupe.cibles.familles}
                              onChange={(e) => setGroupe(prev => ({
                                ...prev, cibles: { ...prev.cibles, familles: e.target.checked }
                              }))}
                              className="w-4 h-4" />
                            <span>Familles</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" checked={groupe.cibles.familles_mono}
                              onChange={(e) => setGroupe(prev => ({
                                ...prev, cibles: { ...prev.cibles, familles_mono: e.target.checked }
                              }))}
                              className="w-4 h-4" />
                            <span>Familles mono.</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" checked={groupe.cibles.seniors}
                              onChange={(e) => setGroupe(prev => ({
                                ...prev, cibles: { ...prev.cibles, seniors: e.target.checked }
                              }))}
                              className="w-4 h-4" />
                            <span>Seniors (60+)</span>
                          </label>
                        </div>
                      </div>
                      
                      {/* Socio-professionnel */}
                      <div className="pt-3 border-t">
                        <h5 className="text-sm font-medium text-stone-600 mb-2 uppercase tracking-wide">💼 Socio-professionnel</h5>
                        <div className="grid grid-cols-2 gap-2 text-sm pl-3">
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" checked={groupe.cibles.csp_plus}
                              onChange={(e) => setGroupe(prev => ({
                                ...prev, cibles: { ...prev.cibles, csp_plus: e.target.checked }
                              }))}
                              className="w-4 h-4" />
                            <span>CSP+</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" checked={groupe.cibles.csp_moins}
                              onChange={(e) => setGroupe(prev => ({
                                ...prev, cibles: { ...prev.cibles, csp_moins: e.target.checked }
                              }))}
                              className="w-4 h-4" />
                            <span>CSP-</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" checked={groupe.cibles.professionnels}
                              onChange={(e) => setGroupe(prev => ({
                                ...prev, cibles: { ...prev.cibles, professionnels: e.target.checked }
                              }))}
                              className="w-4 h-4" />
                            <span>Professionnels</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" checked={groupe.cibles.tpe_pme}
                              onChange={(e) => setGroupe(prev => ({
                                ...prev, cibles: { ...prev.cibles, tpe_pme: e.target.checked }
                              }))}
                              className="w-4 h-4" />
                            <span>TPE/PME</span>
                          </label>
                        </div>
                      </div>
                      
                      {/* Géographique */}
                      <div className="pt-3 border-t">
                        <h5 className="text-sm font-medium text-stone-600 mb-2 uppercase tracking-wide">📍 Géographique</h5>
                        <div className="grid grid-cols-2 gap-2 text-sm pl-3">
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" checked={groupe.cibles.urbains}
                              onChange={(e) => setGroupe(prev => ({
                                ...prev, cibles: { ...prev.cibles, urbains: e.target.checked }
                              }))}
                              className="w-4 h-4" />
                            <span>Urbains</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" checked={groupe.cibles.ruraux}
                              onChange={(e) => setGroupe(prev => ({
                                ...prev, cibles: { ...prev.cibles, ruraux: e.target.checked }
                              }))}
                              className="w-4 h-4" />
                            <span>Ruraux</span>
                          </label>
                        </div>
                      </div>
                      
                      {/* Psychographique */}
                      <div className="pt-3 border-t">
                        <h5 className="text-sm font-medium text-stone-600 mb-2 uppercase tracking-wide">🎯 Psychographique</h5>
                        <div className="grid grid-cols-2 gap-2 text-sm pl-3">
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" checked={groupe.cibles.eco_responsables}
                              onChange={(e) => setGroupe(prev => ({
                                ...prev, cibles: { ...prev.cibles, eco_responsables: e.target.checked }
                              }))}
                              className="w-4 h-4" />
                            <span>Éco-responsables</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" checked={groupe.cibles.technophiles}
                              onChange={(e) => setGroupe(prev => ({
                                ...prev, cibles: { ...prev.cibles, technophiles: e.target.checked }
                              }))}
                              className="w-4 h-4" />
                            <span>Technophiles</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" checked={groupe.cibles.early_adopters}
                              onChange={(e) => setGroupe(prev => ({
                                ...prev, cibles: { ...prev.cibles, early_adopters: e.target.checked }
                              }))}
                              className="w-4 h-4" />
                            <span>Early adopters</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" checked={groupe.cibles.luxe}
                              onChange={(e) => setGroupe(prev => ({
                                ...prev, cibles: { ...prev.cibles, luxe: e.target.checked }
                              }))}
                              className="w-4 h-4" />
                            <span>Luxe/Premium</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    {Object.values(groupe.cibles).filter(v => v).length > 5 && (
                      <p className="text-xs text-amber-600 mt-3">⚠️ Trop de cibles ! Risque de dispersion.</p>
                    )}
                    {Object.values(groupe.cibles).filter(v => v).length === 0 && (
                      <p className="text-xs text-rose-600 mt-3">❌ Sélectionnez au moins une cible !</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm text-stone-600 mb-1">Produit</label>
                    <textarea 
                      value={groupe.plan_marketing.produit}
                      onChange={(e) => setGroupe(prev => ({
                        ...prev,
                        plan_marketing: { ...prev.plan_marketing, produit: e.target.value }
                      }))}
                      className="w-full p-2 bg-white border border-stone-200 text-sm rounded-sm"
                      rows="3" 
                      placeholder="Décrivez votre adaptation produit..." 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-stone-600 mb-1">Prix</label>
                    <textarea 
                      value={groupe.plan_marketing.prix}
                      onChange={(e) => setGroupe(prev => ({
                        ...prev,
                        plan_marketing: { ...prev.plan_marketing, prix: e.target.value }
                      }))}
                      className="w-full p-2 bg-white border border-stone-200 text-sm rounded-sm"
                      rows="2" 
                      placeholder="Stratégie de prix..." 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-stone-600 mb-1">Distribution</label>
                    <textarea 
                      value={groupe.plan_marketing.distribution}
                      onChange={(e) => setGroupe(prev => ({
                        ...prev,
                        plan_marketing: { ...prev.plan_marketing, distribution: e.target.value }
                      }))}
                      className="w-full p-2 bg-white border border-stone-200 text-sm rounded-sm"
                      rows="2" 
                      placeholder="Canaux de distribution..." 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-stone-600 mb-1">Communication</label>
                    <textarea 
                      value={groupe.plan_marketing.communication}
                      onChange={(e) => setGroupe(prev => ({
                        ...prev,
                        plan_marketing: { ...prev.plan_marketing, communication: e.target.value }
                      }))}
                      className="w-full p-2 bg-white border border-stone-200 text-sm rounded-sm"
                      rows="2" 
                      placeholder="Stratégie de communication..." 
                    />
                  </div>
                  
                  <button 
                    onClick={soumettreplan}
                    disabled={isAnimating || Object.values(groupe.investissements).reduce((a, b) => a + b, 0) > groupe.budget}
                    className="w-full py-2 bg-stone-700 hover:bg-stone-800 disabled:bg-stone-300 text-white font-mono rounded-sm"
                  >
                    {isAnimating ? 'ANALYSE...' : 'SOUMETTRE LE PLAN'}
                  </button>
                </div>
                
                {groupe.observations && currentTurn > 1 && (
                  <div className="p-4 border-2 border-amber-300 bg-amber-50 rounded-lg">
                    <h3 className="font-mono text-lg mb-3 text-stone-800">
                      OBSERVATIONS CONTEXTUELLES
                    </h3>
                    <div className="text-sm text-stone-700 whitespace-pre-line">
                      {groupe.observations}
                    </div>
                  </div>
                )}
                
                <div className="p-4 border border-dashed border-stone-400 rounded-sm bg-stone-50">
                  <button 
                    onClick={() => setShowNegotiationModal(true)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-mono rounded-sm"
                  >
                    💼 AJOUTER DES FONDS
                  </button>
                </div>
              </div>
            )}
            
            {groupe.etat === 'en_feedback' && (
              <div className="space-y-6">
                <div className="p-4 border border-stone-200 bg-white rounded-sm">
                  <h3 className="font-mono text-lg mb-3 text-stone-800">ÉVALUATION</h3>
                  <div className="space-y-2">
                    {Object.entries(groupe.points).map(([critere, score]) => (
                      <div key={critere} className="flex justify-between items-center">
                        <span className="capitalize text-stone-600">{critere}</span>
                        <div className="flex space-x-1">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className={`w-4 h-4 rounded-sm ${i < score ? 'bg-emerald-500' : 'bg-stone-200'}`} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-mono text-lg mb-3 text-stone-800">OUTILS MARKETING</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {outils.filter(o => {
                      if (o.prerequis) {
                        const prereqs = Array.isArray(o.prerequis) ? o.prerequis : [o.prerequis];
                        return prereqs.every(p => {
                          if (p === "negociation_utilisee") return groupe.negociation_utilisee;
                          return groupe.outils_utilises.includes(p);
                        });
                      }
                      if (o.disponibilite.includes("Tour")) {
                        const tourRequis = parseInt(o.disponibilite.match(/\d+/)[0]);
                        return currentTurn >= tourRequis;
                      }
                      return true;
                    }).map(outil => (
                      <div key={outil.nom} className={`p-3 border border-stone-200 bg-white rounded-sm ${
                        outil.categorie === 'reseau' ? 'bg-gradient-to-r from-white to-amber-50' : ''
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-stone-800">
                              {outil.nom}
                              {outil.categorie === 'reseau' && <span className="text-xs bg-amber-200 px-1 rounded ml-2">RÉSEAU</span>}
                            </h4>
                            <p className="text-sm text-emerald-600">
                              {showDetailedTools ? outil.effet_reel : outil.effet_visible}
                            </p>
                            {outil.risque && (
                              <p className="text-xs text-rose-600 mt-1">⚠️ {outil.risque}</p>
                            )}
                          </div>
                          <p className="text-stone-700 font-semibold">{outil.cout}€</p>
                        </div>
                        <button 
                          onClick={() => acheterOutil(outil)}
                          disabled={groupe.budget < outil.cout || groupe.outils_utilises.includes(outil.nom)}
                          className="w-full py-1 bg-stone-100 hover:bg-stone-200 disabled:bg-gray-100 text-sm rounded-sm"
                        >
                          {groupe.outils_utilises.includes(outil.nom) ? 'POSSÉDÉ' : 'ACHETER'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <button 
                    onClick={commanderVeille}
                    disabled={groupe.budget < 800}
                    className="w-full py-2 bg-stone-600 hover:bg-stone-700 disabled:bg-stone-300 text-white font-mono rounded-sm"
                  >
                    <Newspaper className="w-4 h-4 inline mr-2" />
                    VEILLE PRESSE (800€)
                  </button>
                  
                  <button 
                    onClick={tourSuivant}
                    className="w-full py-2 bg-stone-700 hover:bg-stone-800 text-white font-mono rounded-sm"
                  >
                    {currentTurn >= 11 ? 'TERMINER LE JEU' : 'TOUR SUIVANT →'}
                  </button>
                </div>
                
                {groupe.observations && (
                  <div className="p-4 border-2 border-amber-300 bg-amber-50 rounded-lg">
                    <h3 className="font-mono text-lg mb-3 text-stone-800">
                      OBSERVATIONS CONTEXTUELLES
                    </h3>
                    <div className="text-sm text-stone-700 whitespace-pre-line">
                      {groupe.observations}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {currentTab === 'kpi' && renderKPITab()}
      {currentTab === 'visualization' && renderVisualizationTab()}
      
      {/* Modal Négociation */}
      {showNegotiationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-mono text-stone-800 mb-4">Validation Négociation</h3>
            <input
              type="text"
              value={negotiationCode}
              onChange={(e) => setNegotiationCode(e.target.value)}
              placeholder="Code de négociation..."
              className="w-full p-2 border border-stone-300 rounded mb-4 font-mono uppercase"
            />
            <div className="flex gap-2">
              <button onClick={validateNegotiationCode}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded">
                Valider
              </button>
              <button onClick={() => setShowNegotiationModal(false)}
                className="flex-1 py-2 bg-stone-500 hover:bg-stone-600 text-white rounded">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal Aléa */}
      {showAleaModal && currentAlea && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 ${
            currentAlea.type === 'positif' ? 'border-2 border-emerald-500' : 'border-2 border-rose-500'
          }`}>
            <h3 className={`text-xl font-mono mb-4 ${
              currentAlea.type === 'positif' ? 'text-emerald-600' : 'text-rose-600'
            }`}>
              {currentAlea.type === 'positif' ? '🎉' : '🎲'} ÉVÉNEMENT !
            </h3>
            <h4 className="text-lg font-bold text-stone-800 mb-2">{currentAlea.titre}</h4>
            <p className="text-stone-600 mb-4">{currentAlea.description}</p>
            <p className="text-stone-700 font-semibold mb-4">Impact : {currentAlea.effet}</p>
            {currentAlea.neutralise_par && groupe.outils_utilises.includes(currentAlea.neutralise_par) && (
              <p className="text-emerald-600 font-semibold mb-4">
                🛡️ Heureusement, {currentAlea.neutralise_par} vous protège !
              </p>
            )}
            <button
              onClick={() => {
                setShowAleaModal(false);
                setCurrentAlea(null);
                if (!currentAlea.neutralise_par || !groupe.outils_utilises.includes(currentAlea.neutralise_par)) {
                  applyAleaEffect(currentAlea);
                }
              }}
              className="w-full py-2 bg-stone-700 hover:bg-stone-800 text-white rounded"
            >
              Compris
            </button>
          </div>
        </div>
      )}
      
      {/* Tooltip */}
      {showToolTip && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" 
          onClick={() => setShowToolTip(null)}>
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 border-2 border-emerald-500">
            <h3 className="text-lg font-mono text-emerald-600 mb-3">
              ✨ {showToolTip.nom} activé !
            </h3>
            <p className="text-stone-700">{showToolTip.conseil}</p>
            <button onClick={() => setShowToolTip(null)}
              className="w-full mt-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded">
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}