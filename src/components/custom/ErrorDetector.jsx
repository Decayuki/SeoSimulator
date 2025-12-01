import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Info, Zap, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

/**
 * ErrorDetector - Liste et gère les erreurs SEO
 *
 * Affiche les erreurs détectées avec leur sévérité,
 * leur impact et permet de les corriger
 */

export default function ErrorDetector({
  errors = [],
  budget = 0,
  onFixError,
  fixedErrors = [],
  compact = false
}) {
  const [selectedError, setSelectedError] = useState(null);

  // Grouper les erreurs par sévérité
  const criticalErrors = errors.filter(e => e.severity === 'critical');
  const importantErrors = errors.filter(e => e.severity === 'important');
  const minorErrors = errors.filter(e => e.severity === 'minor');

  // Calculer le score total possible
  const totalImpact = errors.reduce((sum, err) => sum + Math.abs(err.impact), 0);
  const fixedImpact = fixedErrors.reduce((sum, id) => {
    const err = errors.find(e => e.id === id);
    return sum + (err ? Math.abs(err.impact) : 0);
  }, 0);

  // Icône selon la sévérité
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="w-4 h-4 text-error" />;
      case 'important':
        return <Info className="w-4 h-4 text-warning" />;
      case 'minor':
        return <Zap className="w-4 h-4 text-info" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  // Badge selon la sévérité
  const getSeverityBadge = (severity) => {
    const variants = {
      critical: 'destructive',
      important: 'warning',
      minor: 'outline'
    };
    return variants[severity] || 'outline';
  };

  // Composant ErrorItem
  const ErrorItem = ({ error, isFixed }) => {
    const canAfford = budget >= error.fixCost;
    const alreadyFixed = fixedErrors.includes(error.id);

    return (
      <div
        className={cn(
          'p-4 rounded-lg border transition-all',
          alreadyFixed
            ? 'bg-success/10 border-success/50'
            : 'bg-card border-border hover:border-primary'
        )}
      >
        <div className="flex items-start gap-3">
          {/* Icône */}
          <div className="mt-1">
            {alreadyFixed ? (
              <CheckCircle2 className="w-5 h-5 text-success" />
            ) : (
              getSeverityIcon(error.severity)
            )}
          </div>

          {/* Contenu */}
          <div className="flex-1 space-y-2">
            {/* En-tête */}
            <div className="flex items-start justify-between gap-2">
              <h4 className={cn(
                'font-semibold text-sm',
                alreadyFixed ? 'text-success line-through' : 'text-foreground'
              )}>
                {error.title}
              </h4>
              <Badge variant={getSeverityBadge(error.severity)} className="shrink-0">
                {error.severity}
              </Badge>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground">
              {error.description}
            </p>

            {/* Métadonnées */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <span className={cn(
                  'font-mono font-semibold',
                  error.impact < 0 ? 'text-error' : 'text-success'
                )}>
                  {error.impact > 0 ? '+' : ''}{error.impact}
                </span>
                <span>points</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span className="font-mono">{error.fixCost}h</span>
              </div>
              {error.line && (
                <span className="font-mono">Ligne {error.line}</span>
              )}
            </div>

            {/* Actions */}
            {!alreadyFixed && (
              <div className="flex items-center gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={() => onFixError(error)}
                  disabled={!canAfford}
                  className={cn(
                    error.severity === 'critical' && 'bg-error hover:bg-error/90'
                  )}
                >
                  Corriger ({error.fixCost}h)
                </Button>
                {!canAfford && (
                  <span className="text-xs text-error">Budget insuffisant</span>
                )}
              </div>
            )}

            {alreadyFixed && (
              <div className="flex items-center gap-2 text-xs text-success">
                <CheckCircle2 className="w-4 h-4" />
                <span>Corrigé !</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Version compacte
  if (compact) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Erreurs détectées</span>
            <Badge variant="outline">
              {errors.length - fixedErrors.length} / {errors.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {errors.slice(0, 3).map(error => (
              <ErrorItem key={error.id} error={error} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Version complète
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Audit SEO</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={criticalErrors.length > 0 ? 'destructive' : 'outline'}>
              {criticalErrors.length} critiques
            </Badge>
            <Badge variant="outline">
              {errors.length} total
            </Badge>
          </div>
        </div>

        {/* Statistiques */}
        <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Impact corrigé</span>
            <span className="font-mono font-semibold">
              {fixedImpact} / {totalImpact} points
            </span>
          </div>
          <div className="mt-2 h-2 bg-background rounded-full overflow-hidden">
            <div
              className="h-full bg-success transition-all duration-500"
              style={{ width: `${(fixedImpact / totalImpact) * 100}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[500px]">
          <Accordion type="multiple" className="space-y-4">
            {/* Erreurs critiques */}
            {criticalErrors.length > 0 && (
              <AccordionItem value="critical" className="border-none">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-error" />
                    <span className="font-semibold">
                      Erreurs Critiques ({criticalErrors.length})
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-3">
                  {criticalErrors.map(error => (
                    <ErrorItem key={error.id} error={error} />
                  ))}
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Erreurs importantes */}
            {importantErrors.length > 0 && (
              <AccordionItem value="important" className="border-none">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-warning" />
                    <span className="font-semibold">
                      Erreurs Importantes ({importantErrors.length})
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-3">
                  {importantErrors.map(error => (
                    <ErrorItem key={error.id} error={error} />
                  ))}
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Erreurs mineures */}
            {minorErrors.length > 0 && (
              <AccordionItem value="minor" className="border-none">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-info" />
                    <span className="font-semibold">
                      Erreurs Mineures ({minorErrors.length})
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-3">
                  {minorErrors.map(error => (
                    <ErrorItem key={error.id} error={error} />
                  ))}
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
