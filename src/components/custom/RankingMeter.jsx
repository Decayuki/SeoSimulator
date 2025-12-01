import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * RankingMeter - Affiche la position dans les SERP
 *
 * Composant visuel pour montrer la position actuelle dans Google
 * avec animation et code couleur
 */

export default function RankingMeter({ current, previous, target = 10 }) {
  // Calculer l'évolution
  const evolution = previous ? previous - current : 0; // Négatif = amélioration
  const hasImproved = evolution > 0;
  const hasWorsened = evolution < 0;

  // Déterminer la couleur selon la position
  const getColorClass = (position) => {
    if (position <= 3) return 'text-success border-success bg-success/10';
    if (position <= 10) return 'text-seo border-seo bg-seo/10';
    if (position <= 30) return 'text-warning border-warning bg-warning/10';
    return 'text-error border-error bg-error/10';
  };

  // Calculer le pourcentage de progression vers l'objectif
  const progressPercent = Math.min(100, ((100 - current) / (100 - target)) * 100);

  // Icône d'évolution
  const EvolutionIcon = hasImproved
    ? TrendingUp
    : hasWorsened
    ? TrendingDown
    : Minus;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
          <span>Position SERP</span>
          <Badge variant="outline" className="text-xs">
            Objectif: #{target}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Position actuelle */}
        <div className="flex items-center justify-center">
          <div
            className={cn(
              'relative flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 transition-all duration-500',
              getColorClass(current)
            )}
          >
            <span className="text-4xl font-bold font-mono">#{current}</span>
            <span className="text-xs text-muted-foreground mt-1">
              {current <= 10 ? 'Top 10' : current <= 20 ? 'Page 2' : `Page ${Math.ceil(current / 10)}`}
            </span>

            {/* Badge d'évolution */}
            {previous && evolution !== 0 && (
              <div
                className={cn(
                  'absolute -top-2 -right-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold',
                  hasImproved
                    ? 'bg-success text-white'
                    : 'bg-error text-white'
                )}
              >
                <EvolutionIcon className="w-3 h-3" />
                {Math.abs(evolution)}
              </div>
            )}
          </div>
        </div>

        {/* Barre de progression vers l'objectif */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progression vers top {target}</span>
            <span className="font-mono">{progressPercent.toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all duration-700 ease-out',
                current <= target ? 'bg-success' : 'bg-primary'
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Messages contextuels */}
        <div className="text-center text-sm">
          {current <= 3 && (
            <p className="text-success font-medium">
              🏆 Excellent ! Vous êtes dans le top 3 !
            </p>
          )}
          {current > 3 && current <= 10 && (
            <p className="text-seo font-medium">
              ✓ Bien ! Vous êtes en première page.
            </p>
          )}
          {current > 10 && current <= 20 && (
            <p className="text-warning">
              ⚠️ Page 2 - Continuez vos efforts !
            </p>
          )}
          {current > 20 && (
            <p className="text-error">
              ❌ Position faible - Optimisation urgente nécessaire.
            </p>
          )}
        </div>

        {/* Évolution détaillée */}
        {previous && (
          <div className="pt-3 border-t border-border">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Tour précédent:</span>
              <span className="font-mono">#{previous}</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-muted-foreground">Évolution:</span>
              <span
                className={cn(
                  'font-mono font-semibold',
                  hasImproved ? 'text-success' : hasWorsened ? 'text-error' : 'text-muted-foreground'
                )}
              >
                {evolution > 0 ? '+' : ''}{-evolution} positions
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Version compacte pour sidebar
 */
export function RankingMeterCompact({ current, target = 10 }) {
  const getColorClass = (position) => {
    if (position <= 10) return 'text-seo';
    if (position <= 30) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
      <div className={cn('text-3xl font-bold font-mono', getColorClass(current))}>
        #{current}
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">Position SERP</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all',
                current <= target ? 'bg-success' : 'bg-primary'
              )}
              style={{ width: `${Math.min(100, ((100 - current) / (100 - target)) * 100)}%` }}
            />
          </div>
          <span className="text-xs font-mono text-muted-foreground">#{target}</span>
        </div>
      </div>
    </div>
  );
}
