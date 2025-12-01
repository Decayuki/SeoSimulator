import React from 'react';
import { Lightbulb, Lock, Check, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

/**
 * HintShop - Système d'achat d'indices
 *
 * Nouvelle mécanique pédagogique :
 * - Les élèves achètent des INDICES (pas des corrections)
 * - Chaque indice révèle une erreur + ligne + description
 * - Les élèves doivent ensuite modifier le code manuellement
 */

export default function HintShop({
  errors = [],
  purchasedHints = [],
  budget = 100,
  onPurchaseHint
}) {
  // Grouper les erreurs par catégorie
  const groupedErrors = {
    structure: errors.filter(e =>
      e.id.includes('title') || e.id.includes('meta') || e.id.includes('h1') || e.id.includes('semantic')
    ),
    content: errors.filter(e =>
      e.id.includes('content') || e.id.includes('text')
    ),
    images: errors.filter(e =>
      e.id.includes('img') || e.id.includes('alt')
    ),
    seo: errors.filter(e =>
      e.id.includes('schema') || e.id.includes('breadcrumb') || e.id.includes('anchor') || e.id.includes('link')
    )
  };

  // Supprimer les catégories vides
  Object.keys(groupedErrors).forEach(key => {
    if (groupedErrors[key].length === 0) {
      delete groupedErrors[key];
    }
  });

  // Si aucune catégorie détectée, mettre tout dans "general"
  if (Object.keys(groupedErrors).length === 0 && errors.length > 0) {
    groupedErrors.general = errors;
  }

  const categoryLabels = {
    structure: 'Structure & Balises Meta',
    content: 'Contenu',
    images: 'Images & Médias',
    seo: 'SEO Avancé',
    general: 'Général'
  };

  const categoryIcons = {
    structure: '🏗️',
    content: '📝',
    images: '🖼️',
    seo: '🎯',
    general: '⚙️'
  };

  // Vérifier si un indice a été acheté
  const isHintPurchased = (errorId) => {
    return purchasedHints.includes(errorId);
  };

  // Compter les indices achetés et totaux
  const totalHints = errors.length;
  const purchasedCount = purchasedHints.length;
  const remainingCount = totalHints - purchasedCount;

  return (
    <Card className="flex flex-col" style={{ maxHeight: '600px' }}>
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-warning" />
              Boutique d'indices
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Achetez des indices pour révéler les erreurs SEO cachées
            </p>
          </div>
          <Badge variant="outline" className="text-lg font-mono">
            {budget}h
          </Badge>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="p-3 rounded-lg bg-secondary/50 text-center">
            <p className="text-2xl font-bold font-mono text-foreground">{totalHints}</p>
            <p className="text-xs text-muted-foreground mt-1">Total</p>
          </div>
          <div className="p-3 rounded-lg bg-success/10 text-center">
            <p className="text-2xl font-bold font-mono text-success">{purchasedCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Révélés</p>
          </div>
          <div className="p-3 rounded-lg bg-warning/10 text-center">
            <p className="text-2xl font-bold font-mono text-warning">{remainingCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Cachés</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        <div className="pr-4 overflow-y-auto" style={{ maxHeight: '400px' }}>
          <div className="space-y-6">
            {/* Message si tout est révélé */}
            {purchasedCount === totalHints && totalHints > 0 && (
              <Alert className="bg-success/10 border-success">
                <Check className="h-4 w-4 text-success" />
                <AlertDescription className="text-success">
                  Tous les indices ont été révélés ! Modifiez le code pour corriger les erreurs.
                </AlertDescription>
              </Alert>
            )}

            {/* Message si aucune erreur */}
            {totalHints === 0 && (
              <Alert>
                <Check className="h-4 w-4" />
                <AlertDescription>
                  Aucune erreur détectée sur cette page. Excellent travail !
                </AlertDescription>
              </Alert>
            )}

            {/* Indices groupés par catégorie */}
            {Object.entries(groupedErrors).map(([category, categoryErrors]) => (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{categoryIcons[category]}</span>
                  <h3 className="font-semibold text-foreground">
                    {categoryLabels[category]}
                  </h3>
                  <Badge variant="secondary" className="ml-auto">
                    {categoryErrors.filter(e => isHintPurchased(e.id)).length}/{categoryErrors.length}
                  </Badge>
                </div>

                <div className="space-y-2">
                  {categoryErrors.map((error) => {
                    const purchased = isHintPurchased(error.id);
                    const canAfford = budget >= error.fixCost;

                    return (
                      <div
                        key={error.id}
                        className={cn(
                          'p-4 rounded-lg border transition-all',
                          purchased
                            ? 'bg-success/5 border-success/50'
                            : 'bg-card border-border hover:border-primary/50'
                        )}
                      >
                        {/* En-tête de l'indice */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {purchased ? (
                                <Check className="w-4 h-4 text-success flex-shrink-0" />
                              ) : (
                                <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              )}
                              <h4 className={cn(
                                'font-medium',
                                purchased ? 'text-foreground' : 'text-muted-foreground'
                              )}>
                                {purchased ? error.title : `Indice SEO #${error.id.split('-').pop()}`}
                              </h4>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge
                                variant={
                                  error.severity === 'critical' ? 'destructive' :
                                  error.severity === 'important' ? 'default' :
                                  'secondary'
                                }
                                className="text-xs"
                              >
                                {error.severity === 'critical' ? 'CRITIQUE' :
                                 error.severity === 'important' ? 'IMPORTANT' :
                                 'MINEUR'}
                              </Badge>
                              {purchased && (
                                <span className="text-xs text-muted-foreground">
                                  Ligne {error.line}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Bouton d'achat */}
                          {!purchased && (
                            <Button
                              size="sm"
                              onClick={() => onPurchaseHint(error)}
                              disabled={!canAfford}
                              className="flex-shrink-0"
                            >
                              <Lightbulb className="w-4 h-4 mr-1" />
                              {error.fixCost}h
                            </Button>
                          )}
                          {purchased && (
                            <Badge variant="outline" className="bg-success/10 text-success border-success flex-shrink-0">
                              Révélé
                            </Badge>
                          )}
                        </div>

                        {/* Détails de l'erreur (si acheté) */}
                        {purchased && (
                          <div className="space-y-2 pl-6">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {error.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs">
                              <AlertCircle className="w-3 h-3 text-warning" />
                              <span className="text-warning font-medium">
                                Impact : {error.impact} points
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Message si pas assez de budget */}
                        {!purchased && !canAfford && (
                          <div className="mt-2 pl-6">
                            <p className="text-xs text-error">
                              Budget insuffisant (besoin de {error.fixCost}h)
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
