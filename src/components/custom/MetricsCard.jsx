import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * MetricsCard - Carte de métrique réutilisable
 *
 * Affiche une métrique avec:
 * - Titre et icône
 * - Valeur principale
 * - Évolution (optionnel)
 * - Graphique sparkline (optionnel)
 */

export default function MetricsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  change,
  trend = 'neutral', // up, down, neutral
  variant = 'default', // default, success, warning, error
  sparkline = null,
  compact = false
}) {
  // Couleurs selon le variant
  const variantStyles = {
    default: {
      bg: 'bg-card',
      text: 'text-foreground',
      icon: 'text-primary'
    },
    success: {
      bg: 'bg-success/10',
      text: 'text-success',
      icon: 'text-success'
    },
    warning: {
      bg: 'bg-warning/10',
      text: 'text-warning',
      icon: 'text-warning'
    },
    error: {
      bg: 'bg-error/10',
      text: 'text-error',
      icon: 'text-error'
    },
    info: {
      bg: 'bg-info/10',
      text: 'text-info',
      icon: 'text-info'
    }
  };

  const styles = variantStyles[variant] || variantStyles.default;

  // Icône de tendance
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  // Version compacte
  if (compact) {
    return (
      <div className={cn('p-4 rounded-lg border border-border', styles.bg)}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">{title}</p>
            <p className={cn('text-2xl font-bold font-mono', styles.text)}>{value}</p>
          </div>
          {Icon && (
            <div className={cn('p-2 rounded-full bg-background/50', styles.icon)}>
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>
        {change !== undefined && (
          <div className={cn(
            'flex items-center gap-1 mt-2 text-xs font-semibold',
            trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-muted-foreground'
          )}>
            <TrendIcon className="w-3 h-3" />
            <span>{change > 0 ? '+' : ''}{change}%</span>
          </div>
        )}
      </div>
    );
  }

  // Version complète
  return (
    <Card className={cn('overflow-hidden', styles.bg)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          {Icon && (
            <div className={cn('p-2 rounded-lg bg-background/50', styles.icon)}>
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Valeur principale */}
        <div className="flex items-baseline gap-2">
          <span className={cn('text-4xl font-bold font-mono', styles.text)}>
            {value}
          </span>
        </div>

        {/* Évolution */}
        {change !== undefined && (
          <div className="flex items-center gap-2">
            <div className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-md text-sm font-semibold',
              trend === 'up' ? 'bg-success/20 text-success' :
              trend === 'down' ? 'bg-error/20 text-error' :
              'bg-secondary text-muted-foreground'
            )}>
              <TrendIcon className="w-4 h-4" />
              <span>{change > 0 ? '+' : ''}{change}%</span>
            </div>
            <span className="text-xs text-muted-foreground">vs période précédente</span>
          </div>
        )}

        {/* Sparkline (graphique mini) */}
        {sparkline && sparkline.length > 0 && (
          <div className="h-12 flex items-end gap-0.5">
            {sparkline.map((value, idx) => {
              const max = Math.max(...sparkline);
              const height = (value / max) * 100;
              return (
                <div
                  key={idx}
                  className={cn(
                    'flex-1 rounded-t transition-all',
                    styles.bg === 'bg-success/10' ? 'bg-success' :
                    styles.bg === 'bg-error/10' ? 'bg-error' :
                    styles.bg === 'bg-warning/10' ? 'bg-warning' :
                    'bg-primary'
                  )}
                  style={{ height: `${height}%` }}
                  title={`${value}`}
                />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Grille de métriques
 */
export function MetricsGrid({ children, columns = 4 }) {
  return (
    <div className={cn(
      'grid gap-4',
      columns === 2 && 'grid-cols-1 md:grid-cols-2',
      columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      columns === 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    )}>
      {children}
    </div>
  );
}
