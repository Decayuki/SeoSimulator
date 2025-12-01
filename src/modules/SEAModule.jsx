import React, { useState, useEffect } from 'react';
import { ArrowRight, TrendingUp, Award, Zap, AlertCircle, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import BiddingPanel from '@/components/custom/BiddingPanel';
import MetricsCard, { MetricsGrid } from '@/components/custom/MetricsCard';
import SEAEngine from '@/lib/sea-engine';
import { SEA_KEYWORDS, KEYWORD_STRATEGIES } from '@/data/keywords-sea';

/**
 * Module SEA - Serious game de publicité Google Ads
 *
 * Le joueur doit gérer des campagnes publicitaires sur 7 jours
 * pour atteindre un ROI > 200% avec un budget de 5000€
 */

export default function SEAModule({ onComplete, onBack }) {
  const [engine] = useState(() => new SEAEngine(5000)); // Budget initial 5000€
  const [gameState, setGameState] = useState('intro'); // intro, playing, results
  const [currentDay, setCurrentDay] = useState(1);
  const [selectedKeywords, setSelectedKeywords] = useState([]); // Mots-clés actifs
  const [bids, setBids] = useState({}); // {keywordId: bidAmount}
  const [landingPageScore, setLandingPageScore] = useState(5); // Score qualité landing page (1-10)
  const [dayResults, setDayResults] = useState(null); // Résultats de la journée
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalConversions, setTotalConversions] = useState(0);
  const [dayHistory, setDayHistory] = useState([]); // Historique des journées

  const MAX_DAYS = 7;
  const INITIAL_BUDGET = 5000;

  // Gérer la sélection/désélection d'un mot-clé
  const handleToggleKeyword = (keywordId) => {
    setSelectedKeywords(prev => {
      if (prev.includes(keywordId)) {
        // Désélectionner
        const newBids = { ...bids };
        delete newBids[keywordId];
        setBids(newBids);
        return prev.filter(id => id !== keywordId);
      } else {
        // Sélectionner (max 3 mots-clés)
        if (prev.length >= 3) {
          return prev; // Limite atteinte
        }
        // Initialiser l'enchère avec le CPC suggéré
        const keyword = SEA_KEYWORDS.find(k => k.id === keywordId);
        setBids(prevBids => ({
          ...prevBids,
          [keywordId]: keyword.baselineCPC
        }));
        return [...prev, keywordId];
      }
    });
  };

  // Mettre à jour l'enchère d'un mot-clé
  const handleBidChange = (keywordId, bidAmount) => {
    setBids(prev => ({
      ...prev,
      [keywordId]: bidAmount
    }));
  };

  // Lancer la campagne du jour
  const handleRunCampaign = () => {
    if (selectedKeywords.length === 0) {
      return; // Aucun mot-clé sélectionné
    }

    // Préparer les campagnes
    const campaigns = selectedKeywords.map(keywordId => {
      const keyword = SEA_KEYWORDS.find(k => k.id === keywordId);
      return {
        keyword: keyword.name,
        maxBid: bids[keywordId] || keyword.baselineCPC,
        landingPageScore: landingPageScore
      };
    });

    // Simuler une journée
    const results = engine.simulateDay(campaigns);

    // Calculer les totaux
    const dayRevenue = results.reduce((sum, r) => sum + r.revenue, 0);
    const dayCost = results.reduce((sum, r) => sum + r.cost, 0);
    const dayConversions = results.reduce((sum, r) => sum + r.conversions, 0);

    setTotalRevenue(prev => prev + dayRevenue);
    setTotalCost(prev => prev + dayCost);
    setTotalConversions(prev => prev + dayConversions);

    // Sauvegarder l'historique
    setDayHistory(prev => [...prev, {
      day: currentDay,
      results,
      revenue: dayRevenue,
      cost: dayCost,
      conversions: dayConversions,
      roi: dayCost > 0 ? ((dayRevenue - dayCost) / dayCost * 100) : 0,
      qualityScore: engine.qualityScore
    }]);

    setDayResults(results);
  };

  // Passer au jour suivant
  const handleNextDay = () => {
    if (currentDay >= MAX_DAYS) {
      // Fin du jeu
      setGameState('results');
      return;
    }

    setCurrentDay(prev => prev + 1);
    setDayResults(null);
    setSelectedKeywords([]);
    setBids({});
  };

  // Écran d'introduction
  if (gameState === 'intro') {
    return (
      <div className="min-h-screen bg-background p-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-sea" />
              <CardTitle className="text-3xl text-sea">Module SEA - Google Ads Master</CardTitle>
            </div>
            <CardDescription className="text-base">
              Maîtrisez la publicité Google Ads et maximisez votre ROI
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Vous gérez les campagnes Google Ads d'un e-commerce de purificateurs d'air.
                  Votre objectif : atteindre un <strong className="text-sea">ROI supérieur à 200%</strong> en 7 jours
                  avec un budget de <strong>5000€</strong>.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Comment jouer</h3>
                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                  <li>Chaque jour, sélectionnez jusqu'à <strong>3 mots-clés</strong> parmi les 5 disponibles</li>
                  <li>Définissez votre <strong>enchère maximale</strong> pour chaque mot-clé</li>
                  <li>Lancez la campagne et analysez les résultats (impressions, clics, conversions)</li>
                  <li>Optimisez vos enchères en fonction des performances et de la concurrence</li>
                  <li>Gérez votre <strong>Quality Score</strong> pour réduire vos coûts</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Concepts clés Google Ads</h3>
                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                  <li><strong>Ad Rank :</strong> Enchère × Quality Score (détermine votre position)</li>
                  <li><strong>Second Price Auction :</strong> Vous payez juste au-dessus du concurrent suivant</li>
                  <li><strong>Quality Score :</strong> Note de 1 à 10 basée sur vos performances (CTR, conversions)</li>
                  <li><strong>ROI :</strong> (Revenus - Coûts) / Coûts × 100</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Ressources</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li><strong>Budget :</strong> 5000€ pour 7 jours de campagne</li>
                  <li><strong>Objectif :</strong> ROI supérieur à 200%</li>
                  <li><strong>Quality Score initial :</strong> 5/10 (évolutif selon vos performances)</li>
                </ul>
              </div>
            </div>

            <div className="p-5 bg-sea/10 border border-sea/50 rounded-lg">
              <p className="text-sm text-sea font-medium leading-relaxed">
                <strong>Conseil stratégique :</strong> Un Quality Score élevé vous permet d'obtenir de meilleures positions
                avec des enchères plus faibles. Concentrez-vous sur les mots-clés avec le meilleur potentiel de conversion !
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex gap-3">
            <Button variant="outline" onClick={onBack} className="flex-1">
              Retour au menu
            </Button>
            <Button
              onClick={() => setGameState('playing')}
              className="flex-1 bg-sea hover:bg-sea/90"
            >
              Commencer la campagne
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Écran de jeu
  if (gameState === 'playing') {
    const remainingBudget = INITIAL_BUDGET - totalCost;
    const currentROI = totalCost > 0 ? ((totalRevenue - totalCost) / totalCost * 100) : 0;

    return (
      <div className="min-h-screen bg-background p-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-sea">Google Ads Master</h1>
              <p className="text-sm text-muted-foreground">
                Jour {currentDay}/{MAX_DAYS}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Budget restant</p>
                <p className="text-2xl font-bold font-mono text-primary">
                  {Math.round(remainingBudget)}€
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Quality Score</p>
                <p className="text-2xl font-bold font-mono">
                  {engine.qualityScore}/10
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">ROI actuel</p>
                <p className={`text-2xl font-bold font-mono ${currentROI >= 200 ? 'text-success' : currentROI >= 100 ? 'text-warning' : 'text-error'}`}>
                  {Math.round(currentROI)}%
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progression</span>
              <span>{currentDay}/{MAX_DAYS} jours</span>
            </div>
            <Progress value={(currentDay / MAX_DAYS) * 100} className="h-2" />
          </div>
        </div>

        {/* Contenu principal */}
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Sélection des mots-clés */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-sea" />
                Sélection des mots-clés (max 3)
              </CardTitle>
              <CardDescription>
                Choisissez les mots-clés sur lesquels vous souhaitez enchérir aujourd'hui
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SEA_KEYWORDS.map(keyword => {
                  const isSelected = selectedKeywords.includes(keyword.id);
                  const canSelect = selectedKeywords.length < 3 || isSelected;

                  return (
                    <button
                      key={keyword.id}
                      onClick={() => canSelect && handleToggleKeyword(keyword.id)}
                      disabled={!canSelect}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? 'border-sea bg-sea/10'
                          : canSelect
                          ? 'border-border hover:border-sea/50'
                          : 'border-border opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold">{keyword.name}</h4>
                        <Badge variant={
                          keyword.competitiveness === 'high' ? 'destructive' :
                          keyword.competitiveness === 'medium' ? 'default' :
                          'secondary'
                        } className="text-xs">
                          {keyword.competitiveness === 'high' ? 'HAUTE' :
                           keyword.competitiveness === 'medium' ? 'MOYENNE' :
                           'FAIBLE'}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Volume : {keyword.volume.toLocaleString()}/mois</p>
                        <p>CPC suggéré : {keyword.baselineCPC}€</p>
                        <p className="text-xs">{keyword.info.opportunity}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Panels d'enchères */}
          {selectedKeywords.length > 0 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Configuration des enchères</h2>
                <Alert className="bg-info/10 border-info">
                  <AlertDescription className="text-sm text-info">
                    <strong>Ajustez vos enchères</strong> pour chaque mot-clé sélectionné.
                    La <strong>Position</strong> (ex: #1, #2, #3) indique votre classement dans les résultats Google Ads par rapport aux concurrents.
                    Plus la position est basse (#1 est la meilleure), plus vous aurez de clics et de conversions.
                  </AlertDescription>
                </Alert>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {selectedKeywords.map(keywordId => {
                  const keyword = SEA_KEYWORDS.find(k => k.id === keywordId);
                  const currentBid = bids[keywordId] || keyword.baselineCPC;

                  return (
                    <BiddingPanel
                      key={keywordId}
                      keyword={keyword}
                      currentBid={currentBid}
                      onBidChange={(newBid) => handleBidChange(keywordId, newBid)}
                      competitors={engine.competitors}
                      qualityScore={engine.qualityScore}
                      budget={remainingBudget}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Bouton lancer campagne */}
          {selectedKeywords.length > 0 && !dayResults && (
            <Button
              onClick={handleRunCampaign}
              className="w-full"
              size="lg"
              disabled={remainingBudget <= 0}
            >
              <Play className="w-4 h-4 mr-2" />
              Lancer la campagne du jour {currentDay}
            </Button>
          )}

          {/* Résultats de la journée */}
          {dayResults && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-info" />
                  Résultats du jour {currentDay}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Métriques globales */}
                <MetricsGrid columns={4}>
                  <MetricsCard
                    title="Impressions"
                    value={dayResults.reduce((sum, r) => sum + r.impressions, 0).toLocaleString()}
                    variant="info"
                    subtitle="Affichages"
                  />
                  <MetricsCard
                    title="Clics"
                    value={dayResults.reduce((sum, r) => sum + r.clicks, 0)}
                    variant="default"
                    subtitle="Visites"
                  />
                  <MetricsCard
                    title="Conversions"
                    value={dayResults.reduce((sum, r) => sum + r.conversions, 0)}
                    variant="success"
                    subtitle="Ventes"
                  />
                  <MetricsCard
                    title="Coût"
                    value={`${Math.round(dayResults.reduce((sum, r) => sum + r.cost, 0))}€`}
                    variant="destructive"
                    subtitle={`Revenus: ${Math.round(dayResults.reduce((sum, r) => sum + r.revenue, 0))}€`}
                  />
                </MetricsGrid>

                {/* Détails par mot-clé */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Détail par mot-clé</h3>
                  {dayResults.map((result, idx) => (
                    <div key={idx} className="p-4 bg-secondary/30 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{result.keyword}</h4>
                          <p className="text-sm text-muted-foreground">Position #{result.position}</p>
                        </div>
                        <Badge variant={result.position <= 3 ? 'default' : 'secondary'}>
                          Ad Rank: {Math.round(result.adRank)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-5 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Impressions</p>
                          <p className="font-mono font-bold">{result.impressions.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Clics</p>
                          <p className="font-mono font-bold">{result.clicks}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">CPC réel</p>
                          <p className="font-mono font-bold">{result.actualCPC.toFixed(2)}€</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Conversions</p>
                          <p className="font-mono font-bold text-success">{result.conversions}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">ROI</p>
                          <p className={`font-mono font-bold ${result.roi >= 100 ? 'text-success' : 'text-error'}`}>
                            {Math.round(result.roi)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Nouveau Quality Score */}
                <Alert className={`${engine.qualityScore >= 7 ? 'bg-success/10 border-success' : 'bg-info/10 border-info'}`}>
                  <AlertDescription className={engine.qualityScore >= 7 ? 'text-success' : 'text-info'}>
                    Quality Score mis à jour : {engine.qualityScore}/10
                    {engine.qualityScore >= 7 && ' - Excellent ! Vos coûts vont diminuer.'}
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={handleNextDay}
                  className="w-full"
                  size="lg"
                  variant={currentDay < MAX_DAYS ? 'default' : 'outline'}
                >
                  {currentDay < MAX_DAYS ? (
                    <>
                      Jour suivant ({currentDay + 1}/{MAX_DAYS})
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Voir les résultats finaux
                      <Award className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Écran de résultats
  if (gameState === 'results') {
    const finalROI = totalCost > 0 ? ((totalRevenue - totalCost) / totalCost * 100) : 0;

    // Système de notation dynamique basé sur le ROI
    let grade, title, message, color;

    if (finalROI >= 300) {
      grade = 'A+';
      title = 'EXPERT GOOGLE ADS !';
      message = `ROI de ${Math.round(finalROI)}% ! Tu es un véritable ninja du SEA. Les agences vont se battre pour t'embaucher !`;
      color = 'text-success';
    } else if (finalROI >= 200) {
      grade = 'A';
      title = 'OBJECTIF ATTEINT !';
      message = `ROI de ${Math.round(finalROI)}%. Objectif rempli ! Tu maîtrises Google Ads comme un pro.`;
      color = 'text-success';
    } else if (finalROI >= 100) {
      grade = 'B';
      title = 'Rentable mais...';
      message = `ROI de ${Math.round(finalROI)}%. C'est rentable, mais l'objectif était 200%. Optimise tes enchères !`;
      color = 'text-warning';
    } else if (finalROI >= 0) {
      grade = 'C';
      title = 'Pas terrible...';
      message = `ROI de ${Math.round(finalROI)}%. Juste rentable. Le Quality Score et le choix des mots-clés, ça te parle ?`;
      color = 'text-orange-500';
    } else {
      grade = 'F';
      title = 'DÉSASTRE !';
      message = `ROI de ${Math.round(finalROI)}%. Tu as PERDU de l'argent ! C'est l'inverse du but. Recommence et lis les conseils !`;
      color = 'text-error';
    }

    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <Card className="max-w-4xl w-full">
          <CardHeader>
            <CardTitle className={`text-4xl text-center ${color} mb-2`}>
              {title}
            </CardTitle>
            <CardDescription className="text-center text-lg">
              Campagne terminée - Note finale: <span className="font-bold text-2xl">{grade}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Métriques principales */}
            <MetricsGrid columns={4}>
              <MetricsCard
                title="ROI Final"
                value={`${Math.round(finalROI)}%`}
                variant={finalROI >= 200 ? 'success' : finalROI >= 100 ? 'default' : 'destructive'}
                subtitle={`Objectif: 200%`}
              />
              <MetricsCard
                title="Revenus"
                value={`${Math.round(totalRevenue)}€`}
                variant="success"
                subtitle="Total généré"
              />
              <MetricsCard
                title="Coûts"
                value={`${Math.round(totalCost)}€`}
                variant="destructive"
                subtitle={`${Math.round((totalCost/INITIAL_BUDGET)*100)}% du budget`}
              />
              <MetricsCard
                title="Conversions"
                value={totalConversions}
                variant="info"
                subtitle="Ventes totales"
              />
            </MetricsGrid>

            {/* Feedback personnalisé */}
            <div className={`p-6 rounded-lg text-center border-2 ${
              finalROI >= 200 ? 'bg-success/10 border-success' :
              finalROI >= 100 ? 'bg-warning/10 border-warning' :
              'bg-error/10 border-error'
            }`}>
              <p className={`text-xl font-bold ${color} mb-3`}>
                {message}
              </p>
            </div>

            {/* Historique des jours */}
            {dayHistory.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-center">Évolution sur {MAX_DAYS} jours</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {dayHistory.map((day, idx) => (
                    <div key={idx} className="p-3 bg-secondary/30 rounded-lg text-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Jour {day.day}</span>
                        <Badge variant={day.roi >= 100 ? 'default' : 'secondary'}>
                          QS: {day.qualityScore}/10
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Revenus</p>
                          <p className="font-mono font-bold text-success">{Math.round(day.revenue)}€</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Coûts</p>
                          <p className="font-mono font-bold text-error">{Math.round(day.cost)}€</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Conversions</p>
                          <p className="font-mono font-bold">{day.conversions}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">ROI</p>
                          <p className={`font-mono font-bold ${day.roi >= 100 ? 'text-success' : 'text-error'}`}>
                            {Math.round(day.roi)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats globales */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-secondary/30 rounded text-center">
                <p className="text-2xl font-bold font-mono">{MAX_DAYS}</p>
                <p className="text-xs text-muted-foreground">Jours de campagne</p>
              </div>
              <div className="p-3 bg-secondary/30 rounded text-center">
                <p className="text-2xl font-bold font-mono">{engine.qualityScore}/10</p>
                <p className="text-xs text-muted-foreground">Quality Score final</p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex gap-3">
            <Button variant="outline" onClick={onBack} className="flex-1">
              Retour au menu
            </Button>
            <Button
              onClick={() => {
                // Reset
                setGameState('intro');
                setCurrentDay(1);
                setSelectedKeywords([]);
                setBids({});
                setDayResults(null);
                setTotalRevenue(0);
                setTotalCost(0);
                setTotalConversions(0);
                setDayHistory([]);
                engine.budget = INITIAL_BUDGET;
                engine.qualityScore = 5;
                engine.history = [];
              }}
              className="flex-1 bg-sea hover:bg-sea/90"
            >
              Rejouer
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return null;
}
