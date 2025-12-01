import React, { useState, useEffect } from 'react';
import { ArrowRight, Clock, Award, Send, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import RankingMeter from '@/components/custom/RankingMeter';
import HintShop from '@/components/custom/HintShop';
import CodeEditor from '@/components/custom/CodeEditor';
import MetricsCard, { MetricsGrid } from '@/components/custom/MetricsCard';
import SEOEngine from '@/lib/seo-engine';
import { validateCode, calculateNewRanking, generateReport } from '@/lib/validator';
import { SEO_PAGES } from '@/data/pages-seo';

/**
 * Module SEO - Serious game de référencement naturel
 *
 * Le joueur doit optimiser 6 pages HTML en corrigeant
 * les erreurs SEO pour atteindre le top 10 de Google
 */

export default function SEOModule({ onComplete, onBack }) {
  const [engine] = useState(() => new SEOEngine());
  const [gameState, setGameState] = useState('intro'); // intro, playing, results
  const [currentTurn, setCurrentTurn] = useState(1);
  const [currentPageId, setCurrentPageId] = useState('homepage');
  const [currentPage, setCurrentPage] = useState(null);
  const [detectedErrors, setDetectedErrors] = useState([]);
  const [purchasedHints, setPurchasedHints] = useState([]); // Indices achetés
  const [userCode, setUserCode] = useState(''); // Code modifié par l'élève
  const [lastSubmittedCode, setLastSubmittedCode] = useState(''); // Dernier code soumis
  const [validationReport, setValidationReport] = useState(null); // Résultat de validation
  const [budget, setBudget] = useState(100); // heures disponibles
  const [ranking, setRanking] = useState(100);
  const [previousRanking, setPreviousRanking] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [showValidationFeedback, setShowValidationFeedback] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0); // Temps passé en heures (chrono)
  const [turnHistory, setTurnHistory] = useState([]); // Historique de chaque tour

  const MAX_TURNS = 6;
  const pages = Object.values(SEO_PAGES);
  const TJM_RATE = 27; // Taux journalier moyen SEO : 27€/h

  // Chronomètre : 5 minutes réelles = 1 heure de jeu
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 0.2); // +0.2h toutes les minutes (5min = 1h)
    }, 60000); // 1 minute = 60000ms

    return () => clearInterval(interval);
  }, [gameState]);

  // Charger la page courante au démarrage
  useEffect(() => {
    if (gameState === 'playing' && !currentPage) {
      loadPage(currentPageId);
    }
  }, [gameState, currentPageId]);

  // Charger une page
  const loadPage = (pageId) => {
    const pageData = SEO_PAGES[pageId];
    if (!pageData) {
      console.error('Page non trouvée:', pageId);
      return;
    }

    // Auditer la page
    const audit = engine.auditPage(pageData.html);

    setCurrentPage(pageData);
    setDetectedErrors(pageData.errors || []);
    setPurchasedHints([]);
    setUserCode(pageData.html); // Initialiser avec le code original
    setLastSubmittedCode(''); // Réinitialiser le dernier code soumis
    setValidationReport(null);
    setShowValidationFeedback(false);

    // Calculer la position initiale
    const initialRanking = engine.calculateRanking({
      seoScore: audit.score
    });
    setRanking(initialRanking);
  };

  // Acheter un indice
  const handlePurchaseHint = (error) => {
    if (budget < error.fixCost) {
      return; // Le composant HintShop gère déjà l'affichage du message
    }

    // Déduire le coût
    setBudget(prev => prev - error.fixCost);

    // Ajouter l'indice aux indices achetés
    setPurchasedHints(prev => [...prev, error.id]);
  };

  // Mettre à jour le code utilisateur
  const handleCodeChange = (newCode) => {
    setUserCode(newCode);
    setShowValidationFeedback(false); // Masquer le feedback quand on modifie
  };

  // Valider le code soumis par l'élève
  const handleSubmitCode = () => {
    if (!currentPage) return;

    // Vérifier si le code a changé depuis la dernière soumission
    if (userCode === lastSubmittedCode) {
      // Code identique, afficher un message
      setValidationReport({
        generalMessage: '⚠️ Aucune modification détectée depuis la dernière soumission.',
        summary: { fixed: 0, partial: 0, remaining: detectedErrors.length },
        ranking: { old: ranking, new: ranking, improvement: 0 },
        feedback: [{
          type: 'warning',
          message: 'Vous devez modifier le code avant de soumettre à nouveau.'
        }]
      });
      setShowValidationFeedback(true);
      return;
    }

    try {
      // Valider le code
      const validation = validateCode(
        userCode,
        currentPage.correctHTML || currentPage.html,
        detectedErrors
      );

      // Calculer le nouveau ranking
      const newRank = calculateNewRanking(validation, ranking);

      // Générer le rapport
      const report = generateReport(validation, ranking, newRank);

      // Mettre à jour le state
      setPreviousRanking(ranking);
      setRanking(newRank);
      setValidationReport(report);
      setShowValidationFeedback(true);
      setLastSubmittedCode(userCode); // Sauvegarder le code soumis

      // Mettre à jour le score total
      setTotalScore(prev => prev + validation.score);
    } catch (error) {
      // Gérer les erreurs de validation
      console.error('Erreur lors de la validation du code:', error);
      
      setValidationReport({
        generalMessage: '❌ Une erreur est survenue lors de la validation de votre code.',
        summary: { fixed: 0, partial: 0, remaining: detectedErrors.length },
        ranking: { old: ranking, new: ranking, improvement: 0 },
        feedback: [{
          type: 'error',
          message: `Erreur technique: ${error.message || 'Erreur inconnue'}. Veuillez réessayer ou contacter le support.`
        }]
      });
      setShowValidationFeedback(true);
    }
  };

  // Passer au tour suivant
  const handleNextTurn = () => {
    // Sauvegarder l'historique du tour actuel
    const turnData = {
      turn: currentTurn,
      pageName: currentPage?.name || 'Inconnue',
      pageType: currentPage?.type || 'unknown',
      timeSpent: timeSpent,
      cost: Math.round(timeSpent * TJM_RATE * 100) / 100,
      ranking: ranking,
      errorsFixed: validationReport?.summary?.fixed || 0,
      score: validationReport?.summary?.score || 0
    };
    setTurnHistory(prev => [...prev, turnData]);

    if (currentTurn >= MAX_TURNS) {
      // Fin du jeu
      setGameState('results');
      return;
    }

    // Passer à la page suivante
    const nextTurn = currentTurn + 1;
    const nextPageId = pages[nextTurn - 1]?.id;

    setCurrentTurn(nextTurn);
    setCurrentPageId(nextPageId);
    setPreviousRanking(ranking);
    loadPage(nextPageId);
  };

  // Écran d'intro
  if (gameState === 'intro') {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="text-3xl text-seo">Module SEO Master</CardTitle>
            <CardDescription>
              Optimisez 6 pages web et grimpez dans les résultats Google
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="space-y-6 text-muted-foreground">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Votre mission</h3>
                <p className="leading-relaxed">
                  Vous êtes consultant SEO. Votre client TechShop.fr vous confie l'optimisation
                  de son site. Vous devez atteindre le <strong>top 10 de Google</strong> en
                  détectant et corrigeant les erreurs SEO dans le code HTML.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Comment jouer</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Achetez des indices pour révéler les erreurs SEO cachées</li>
                  <li>Modifiez directement le code HTML pour corriger les problèmes</li>
                  <li>Soumettez vos modifications pour validation</li>
                  <li>Observez votre position grimper dans les SERP</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Ressources</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li><strong>Budget:</strong> 100 heures de travail pour acheter des indices</li>
                  <li><strong>Indices disponibles:</strong> 42 indices répartis sur 6 pages</li>
                  <li><strong>Objectif:</strong> Atteindre le top 10 de Google sur chaque page</li>
                  <li><strong>Pages:</strong> 6 pages à optimiser (chaque page = nouveau défi)</li>
                </ul>
              </div>
            </div>

            <div className="p-5 bg-seo/10 border border-seo/50 rounded-lg">
              <p className="text-sm text-seo font-medium leading-relaxed">
                <strong>Conseil :</strong> Commencez par acheter des indices pour détecter les erreurs critiques.
                Ces erreurs ont le plus d'impact sur votre référencement.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex gap-3">
            <Button variant="outline" onClick={onBack}>
              Retour au menu
            </Button>
            <Button onClick={() => setGameState('playing')} className="bg-seo hover:bg-seo/90">
              Commencer le module
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Écran de jeu
  if (gameState === 'playing' && currentPage) {
    return (
      <div className="min-h-screen bg-background p-4">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-seo">SEO Master</h1>
              <p className="text-sm text-muted-foreground">
                Tour {currentTurn}/{MAX_TURNS} - {currentPage.name}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Temps écoulé</p>
                <p className="text-lg font-bold font-mono flex items-center gap-1 text-warning">
                  <Clock className="w-4 h-4" />
                  {Math.round(timeSpent * 10) / 10}h
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Budget restant</p>
                <p className="text-2xl font-bold font-mono flex items-center gap-1">
                  <Clock className="w-5 h-5 text-primary" />
                  {budget}h
                </p>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">
                Score: {totalScore}
              </Badge>
            </div>
          </div>

          {/* Progression */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Progression globale</span>
              <span>{currentTurn}/{MAX_TURNS} pages</span>
            </div>
            <Progress value={(currentTurn / MAX_TURNS) * 100} className="h-2" />
          </div>
        </div>

        {/* Contenu principal */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne gauche : Éditeur de code */}
          <div className="lg:col-span-2 space-y-6">
            <CodeEditor
              initialCode={currentPage.html}
              correctCode={currentPage.correctHTML || currentPage.html}
              userCode={userCode}
              onCodeChange={handleCodeChange}
              purchasedHints={purchasedHints}
              errors={detectedErrors}
            />

            {/* Feedback de validation */}
            {showValidationFeedback && validationReport && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-info" />
                    Résultat de la validation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Message général */}
                  <Alert className="bg-info/10 border-info">
                    <AlertDescription className="text-info font-medium">
                      {validationReport.generalMessage}
                    </AlertDescription>
                  </Alert>

                  {/* Score */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-success/10 text-center">
                      <p className="text-2xl font-bold font-mono text-success">
                        {validationReport.summary.fixed}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Corrigées</p>
                    </div>
                    <div className="p-3 rounded-lg bg-warning/10 text-center">
                      <p className="text-2xl font-bold font-mono text-warning">
                        {validationReport.summary.partial}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Partielles</p>
                    </div>
                    <div className="p-3 rounded-lg bg-error/10 text-center">
                      <p className="text-2xl font-bold font-mono text-error">
                        {validationReport.summary.remaining}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Restantes</p>
                    </div>
                  </div>

                  {/* Amélioration du ranking */}
                  {validationReport.ranking.improvement > 0 && (
                    <Alert className="bg-success/10 border-success">
                      <AlertDescription className="text-success">
                        Position améliorée : #{validationReport.ranking.old} → #{validationReport.ranking.new}
                        (+{validationReport.ranking.improvement} places !)
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Feedback détaillé */}
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {validationReport.feedback.map((fb, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded text-xs ${
                          fb.type === 'success' ? 'bg-success/10 text-success' :
                          fb.type === 'warning' ? 'bg-warning/10 text-warning' :
                          'bg-error/10 text-error'
                        }`}
                      >
                        {fb.message}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bouton de soumission */}
            <Button
              onClick={handleSubmitCode}
              className="w-full"
              size="lg"
              variant="default"
            >
              <Send className="w-4 h-4 mr-2" />
              Soumettre mes modifications
            </Button>
          </div>

          {/* Colonne droite : Ranking + Boutique d'indices */}
          <div className="space-y-6">
            <RankingMeter
              current={ranking}
              previous={previousRanking}
              target={10}
            />

            <HintShop
              errors={detectedErrors}
              purchasedHints={purchasedHints}
              budget={budget}
              onPurchaseHint={handlePurchaseHint}
            />

            <Button
              onClick={handleNextTurn}
              className="w-full"
              size="lg"
              variant="outline"
            >
              {currentTurn < MAX_TURNS ? (
                <>
                  Page suivante
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Voir les résultats
                  <Award className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Écran de résultats avec notation dynamique
  if (gameState === 'results') {
    // Système de notation dynamique basé sur le ranking
    let grade, title, message, color, emoji;

    if (ranking <= 10) {
      grade = ranking <= 3 ? 'A+' : 'A';
      title = ranking === 1 ? '🏆 CHAMPION SEO !' : ranking <= 3 ? '🎉 TOP 3 !' : '✅ TOP 10 ATTEINT !';
      message = ranking === 1
        ? 'INCROYABLE ! Numéro 1 sur Google ! Tu es un véritable expert SEO. Tes clients vont t\'adorer.'
        : ranking <= 3
        ? 'Excellent ! Top 3 sur Google, c\'est du travail de pro. Tu peux être fier de toi !'
        : 'Bravo ! Top 10 atteint, l\'objectif est rempli. Ton site est visible en première page !';
      color = 'text-success';
      emoji = '🚀';
    } else if (ranking <= 20) {
      grade = 'B';
      title = '😅 Mouais... Page 2';
      message = 'Page 2 de Google ? Sérieux ? Personne ne va là-bas. C\'est comme être le meilleur joueur d\'une équipe qui perd 10-0. Essaie encore !';
      color = 'text-warning';
      emoji = '📄';
    } else if (ranking <= 30) {
      grade = 'C';
      title = '😬 Houston, on a un problème...';
      message = 'Position #' + ranking + ' ? Même ta grand-mère fait mieux avec Wix. Les erreurs critiques, ça te parle ? Retente ta chance.';
      color = 'text-orange-500';
      emoji = '🤦';
    } else if (ranking <= 50) {
      grade = 'D';
      title = '💀 Catastrophique';
      message = 'Position #' + ranking + '... Tu te moques de nous ? À ce stade, mets juste une pancarte "Site Invisible" et rentre chez toi.';
      color = 'text-error';
      emoji = '☠️';
    } else {
      grade = 'F';
      title = '🗑️ DÉSASTRE ABSOLU';
      message = 'Position #' + ranking + '. Même les robots de Google ont pitié. As-tu au moins ouvert les indices ? C\'est une blague ?';
      color = 'text-error';
      emoji = '💩';
    }

    // Calcul du coût total
    const totalCost = Math.round(timeSpent * TJM_RATE * 100) / 100;

    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <Card className="max-w-4xl w-full">
          <CardHeader>
            <CardTitle className={`text-4xl text-center ${color} mb-2`}>
              {title}
            </CardTitle>
            <CardDescription className="text-center text-lg">
              Module SEO terminé - Note finale: <span className="font-bold text-2xl">{grade}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Métriques principales */}
            <MetricsGrid columns={3}>
              <MetricsCard
                title="Position finale"
                value={`#${ranking}`}
                variant={ranking <= 10 ? 'success' : ranking <= 30 ? 'warning' : 'destructive'}
                icon={Award}
                subtitle="Dans les SERP"
              />
              <MetricsCard
                title="Score total"
                value={totalScore}
                variant="info"
                subtitle="Points gagnés"
              />
              <MetricsCard
                title="Temps écoulé"
                value={`${Math.round(timeSpent * 10) / 10}h`}
                variant={timeSpent < 50 ? 'success' : 'warning'}
                icon={Clock}
                subtitle="Temps économisé"
              />
            </MetricsGrid>

            {/* Feedback personnalisé */}
            <div className={`p-6 rounded-lg text-center border-2 ${
              ranking <= 10 ? 'bg-success/10 border-success' :
              ranking <= 30 ? 'bg-warning/10 border-warning' :
              'bg-error/10 border-error'
            }`}>
              <p className={`text-xl font-bold ${color} mb-3`}>
                {emoji} {message}
              </p>
            </div>

            {/* Coût financier */}
            <div className="p-4 bg-secondary/50 rounded-lg">
              <h3 className="font-semibold mb-3 text-center">💶 Récapitulatif financier</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Temps de travail:</span>
                  <span className="font-mono font-bold">{Math.round(timeSpent * 10) / 10}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taux horaire SEO:</span>
                  <span className="font-mono">{TJM_RATE}€/h</span>
                </div>
                <div className="h-px bg-border my-2"></div>
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Coût total:</span>
                  <span className="font-mono font-bold text-primary">{totalCost}€</span>
                </div>
              </div>
            </div>

            {/* Historique des tours */}
            {turnHistory.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-center">📊 Détail par page</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {turnHistory.map((turn, idx) => (
                    <div key={idx} className="p-3 bg-secondary/30 rounded-lg text-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{turn.pageName}</span>
                        <Badge variant="outline">#{turn.ranking}</Badge>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{turn.errorsFixed} erreur(s) corrigée(s)</span>
                        <span>{Math.round(turn.cost)}€</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats globales */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-secondary/30 rounded text-center">
                <p className="text-2xl font-bold font-mono">{MAX_TURNS}</p>
                <p className="text-xs text-muted-foreground">Pages optimisées</p>
              </div>
              <div className="p-3 bg-secondary/30 rounded text-center">
                <p className="text-2xl font-bold font-mono">{budget}h</p>
                <p className="text-xs text-muted-foreground">Budget restant</p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex gap-3">
            <Button variant="outline" onClick={onBack} className="flex-1">
              Retour au menu
            </Button>
            <Button
              onClick={() => {
                setGameState('intro');
                setCurrentTurn(1);
                setBudget(100);
                setTotalScore(0);
                setRanking(100);
                setPreviousRanking(null);
                setPurchasedHints([]);
                setValidationReport(null);
                setLastSubmittedCode('');
                setTimeSpent(0);
                setTurnHistory([]);
              }}
              className="flex-1 bg-seo hover:bg-seo/90"
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
