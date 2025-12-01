import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, MousePointer, Target } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * BiddingPanel - Panneau d'enchères SEA
 *
 * Permet de définir l'enchère pour un mot-clé
 * et affiche les prévisions en temps réel
 */

export default function BiddingPanel({
  keyword,
  currentBid = 0,
  onBidChange,
  competitors = [],
  qualityScore = 5,
  budget = 0
}) {
  // Initialiser avec le CPC suggéré si currentBid est 0
  const initialBid = currentBid > 0 ? currentBid : keyword.baselineCPC;
  const [bid, setBid] = useState(initialBid);
  const [estimations, setEstimations] = useState(null);

  // Mettre à jour le bid quand currentBid change
  useEffect(() => {
    if (currentBid > 0) {
      setBid(currentBid);
    }
  }, [currentBid]);

  // Calculer les estimations quand l'enchère change
  useEffect(() => {
    if (bid > 0) {
      calculateEstimations(bid);
    }
  }, [bid, qualityScore]);

  const calculateEstimations = (bidAmount) => {
    // Simuler l'Ad Rank
    const myAdRank = bidAmount * qualityScore;

    // Comparer avec les concurrents
    const allBids = [
      { name: 'VOUS', bid: bidAmount, qualityScore, adRank: myAdRank },
      ...competitors.map(c => ({
        ...c,
        adRank: c.bid * c.qualityScore
      }))
    ];

    // Trier par Ad Rank
    allBids.sort((a, b) => b.adRank - a.adRank);

    // Position
    const position = allBids.findIndex(b => b.name === 'VOUS') + 1;

    // CTR selon la position
    const ctrByPosition = {
      1: 0.08,
      2: 0.06,
      3: 0.04,
      4: 0.025,
      5: 0.015
    };
    const ctr = ctrByPosition[position] || 0.01;

    // Impressions estimées (10% du volume quotidien)
    const dailySearches = keyword.volume / 30;
    const impressions = Math.floor(dailySearches * 0.1);

    // Clics
    const clicks = Math.floor(impressions * ctr);

    // CPC réel (second price auction)
    let actualCPC = bidAmount;
    if (position < allBids.length) {
      const nextBidder = allBids[position];
      actualCPC = (nextBidder.adRank / qualityScore) + 0.01;
      actualCPC = Math.min(actualCPC, bidAmount);
    }
    actualCPC = Math.round(actualCPC * 100) / 100;

    // Coût estimé
    const cost = clicks * actualCPC;

    // Conversions (2.5% de base + bonus QS)
    const conversionRate = 0.025 + ((qualityScore - 5) * 0.005);
    const conversions = Math.floor(clicks * conversionRate);

    // ROI (50€ par conversion)
    const revenue = conversions * 50;
    const roi = cost > 0 ? Math.round(((revenue - cost) / cost) * 100) : 0;

    setEstimations({
      position,
      impressions,
      clicks,
      ctr: (ctr * 100).toFixed(2),
      actualCPC,
      cost: Math.round(cost * 100) / 100,
      conversions,
      revenue,
      roi,
      profitable: roi > 100
    });
  };

  const handleBidChange = (value) => {
    const newBid = value[0];
    setBid(newBid);
    onBidChange && onBidChange(newBid);
  };

  // Couleur selon la position
  const getPositionColor = (pos) => {
    if (pos <= 2) return 'text-success';
    if (pos <= 4) return 'text-warning';
    return 'text-error';
  };

  // Recommandation enchère
  const getRecommendedBid = () => {
    if (competitors.length === 0) return keyword.baselineCPC;

    const avgCompetitorBid = competitors.reduce((sum, c) => sum + c.bid, 0) / competitors.length;
    return Math.round(avgCompetitorBid * 1.1 * 100) / 100;
  };

  const recommended = getRecommendedBid();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">
              {keyword.name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <span>{keyword.volume.toLocaleString()} recherches/mois</span>
              <span>•</span>
              <Badge variant={
                keyword.competitiveness === 'high' ? 'destructive' :
                keyword.competitiveness === 'medium' ? 'warning' : 'outline'
              }>
                {keyword.competitiveness === 'high' ? 'Très compétitif' :
                 keyword.competitiveness === 'medium' ? 'Compétitif' : 'Peu compétitif'}
              </Badge>
            </div>
          </div>

          {estimations && (
            <div className="text-right">
              <div className={cn('text-3xl font-bold font-mono', getPositionColor(estimations.position))}>
                #{estimations.position}
              </div>
              <div className="text-xs text-muted-foreground">Position</div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Slider d'enchère */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Enchère maximale</label>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold font-mono">{bid.toFixed(2)}€</span>
              {bid >= recommended && (
                <Badge variant="outline" className="text-success">
                  Compétitif
                </Badge>
              )}
            </div>
          </div>

          <Slider
            value={[bid]}
            onValueChange={handleBidChange}
            min={0}
            max={Math.max(10, keyword.baselineCPC * 3)}
            step={0.1}
            className="w-full"
          />

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>0€</span>
            <button
              onClick={() => handleBidChange([recommended])}
              className="text-primary hover:underline"
            >
              Recommandé: {recommended}€
            </button>
            <span>{Math.max(10, keyword.baselineCPC * 3)}€</span>
          </div>
        </div>

        {/* Estimations */}
        {estimations && (
          <>
            {/* Métriques principales */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <MousePointer className="w-3 h-3" />
                  <span>Clics/jour</span>
                </div>
                <div className="text-2xl font-bold font-mono">{estimations.clicks}</div>
              </div>

              <div className="p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <DollarSign className="w-3 h-3" />
                  <span>CPC réel</span>
                </div>
                <div className="text-2xl font-bold font-mono">{estimations.actualCPC}€</div>
              </div>

              <div className="p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Target className="w-3 h-3" />
                  <span>Conversions</span>
                </div>
                <div className="text-2xl font-bold font-mono">{estimations.conversions}</div>
              </div>

              <div className={cn(
                'p-3 rounded-lg',
                estimations.profitable ? 'bg-success/10' : 'bg-error/10'
              )}>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>ROI</span>
                </div>
                <div className={cn(
                  'text-2xl font-bold font-mono',
                  estimations.profitable ? 'text-success' : 'text-error'
                )}>
                  {estimations.roi > 0 ? '+' : ''}{estimations.roi}%
                </div>
              </div>
            </div>

            {/* Résumé financier */}
            <div className="p-4 rounded-lg border border-border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Coût estimé/jour:</span>
                <span className="font-mono font-semibold">{estimations.cost}€</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Revenus estimés:</span>
                <span className="font-mono font-semibold text-success">{estimations.revenue}€</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between">
                <span className="font-medium">Profit estimé:</span>
                <span className={cn(
                  'font-mono font-bold',
                  estimations.profitable ? 'text-success' : 'text-error'
                )}>
                  {estimations.profitable ? '+' : ''}{estimations.revenue - estimations.cost}€
                </span>
              </div>
            </div>

            {/* Avertissements */}
            {estimations.cost > budget && (
              <div className="p-3 rounded-lg bg-error/10 border border-error/50 text-sm text-error">
                ⚠️ Coût estimé supérieur au budget disponible ({budget}€)
              </div>
            )}

            {!estimations.profitable && estimations.roi < 100 && (
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/50 text-sm text-warning">
                <strong>⚠️ ROI inférieur à 100%</strong>
                <p className="mt-1">
                  Vous dépensez plus que ce que vous gagnez ({estimations.cost}€ coût pour {estimations.revenue}€ revenus).
                  Solutions : augmentez votre Quality Score en performant bien, ou baissez votre enchère, ou choisissez un mot-clé moins compétitif.
                </p>
              </div>
            )}

            {estimations.position > 3 && (
              <div className="p-3 rounded-lg bg-info/10 border border-info/50 text-sm text-info">
                💡 Position #{estimations.position}. Augmentez votre enchère pour améliorer la visibilité.
              </div>
            )}
          </>
        )}

        {/* Concurrents */}
        {competitors.length > 0 && (
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
              Voir les enchères concurrentes ({competitors.length})
            </summary>
            <div className="mt-3 space-y-2">
              {competitors
                .sort((a, b) => (b.bid * b.qualityScore) - (a.bid * a.qualityScore))
                .map((comp, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded bg-secondary/30 text-sm"
                  >
                    <span className="font-medium">{comp.name}</span>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>QS: {comp.qualityScore}/10</span>
                      <span className="font-mono">{comp.bid}€</span>
                      <Badge variant="outline" className="font-mono text-xs">
                        AR: {(comp.bid * comp.qualityScore).toFixed(1)}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </details>
        )}
      </CardContent>
    </Card>
  );
}
