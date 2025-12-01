import React, { useState } from 'react';
import { Code, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

/**
 * CodeViewer - Visualisation de code HTML avec erreurs surlignées
 *
 * Affiche le code source HTML avec:
 * - Numéros de ligne
 * - Surlignage des erreurs
 * - Mode avant/après corrections
 */

export default function CodeViewer({
  html,
  errors = [],
  fixedErrors = [],
  correctHTML = null,
  onLineClick
}) {
  const [showErrors, setShowErrors] = useState(true);
  const [currentView, setCurrentView] = useState('current'); // current, fixed, diff

  // Analyser le HTML ligne par ligne
  const lines = html.split('\n');

  // Trouver les lignes avec erreurs
  const errorLines = new Set(errors.map(err => err.line));

  // Vérifier si une ligne a une erreur
  const hasError = (lineNumber) => errorLines.has(lineNumber);

  // Obtenir les erreurs pour une ligne
  const getErrorsForLine = (lineNumber) => {
    return errors.filter(err => err.line === lineNumber);
  };

  // Coloration syntaxique basique
  const highlightHTML = (code) => {
    return code
      .replace(/(&lt;!--.*?--&gt;)/g, '<span class="text-muted-foreground italic">$1</span>')
      .replace(/(&lt;\/?[a-zA-Z][^&gt;]*&gt;)/g, '<span class="text-primary">$1</span>')
      .replace(/(["'].*?["'])/g, '<span class="text-success">$1</span>');
  };

  // Échapper le HTML pour affichage
  const escapeHTML = (str) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // Composant Ligne de code
  const CodeLine = ({ line, lineNumber }) => {
    const errors = getErrorsForLine(lineNumber);
    const hasErr = hasError(lineNumber) && showErrors;

    return (
      <div
        className={cn(
          'group flex hover:bg-secondary/30 transition-colors',
          hasErr && 'bg-error/10 border-l-2 border-error'
        )}
        onClick={() => onLineClick && onLineClick(lineNumber)}
      >
        {/* Numéro de ligne */}
        <div className={cn(
          'select-none w-12 flex-shrink-0 text-right pr-4 text-muted-foreground font-mono text-xs',
          hasErr && 'text-error font-semibold'
        )}>
          {lineNumber}
        </div>

        {/* Code */}
        <div className="flex-1 font-mono text-sm whitespace-pre">
          <span
            dangerouslySetInnerHTML={{
              __html: highlightHTML(escapeHTML(line))
            }}
          />
        </div>

        {/* Indicateur d'erreur */}
        {hasErr && (
          <div className="flex-shrink-0 px-2 flex items-center">
            <AlertTriangle className="w-4 h-4 text-error" />
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            <span>Code Source HTML</span>
          </CardTitle>

          <div className="flex items-center gap-2">
            {/* Toggle erreurs */}
            <button
              onClick={() => setShowErrors(!showErrors)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors',
                showErrors
                  ? 'bg-error/20 text-error'
                  : 'bg-secondary text-muted-foreground'
              )}
            >
              {showErrors ? (
                <>
                  <Eye className="w-4 h-4" />
                  Erreurs visibles
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4" />
                  Erreurs masquées
                </>
              )}
            </button>

            <Badge variant="outline">
              {lines.length} lignes
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {correctHTML ? (
          // Mode avec onglets (avant/après/diff)
          <Tabs value={currentView} onValueChange={setCurrentView}>
            <div className="px-6 border-b border-border">
              <TabsList>
                <TabsTrigger value="current">
                  Code actuel
                  <Badge variant="outline" className="ml-2">
                    {errorLines.size} erreurs
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="fixed">
                  Code corrigé
                </TabsTrigger>
                <TabsTrigger value="diff">
                  Différences
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="current" className="m-0">
              <ScrollArea className="h-[500px]">
                <div className="p-4 bg-background font-mono text-sm">
                  {lines.map((line, index) => (
                    <CodeLine
                      key={index}
                      line={line}
                      lineNumber={index + 1}
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="fixed" className="m-0">
              <ScrollArea className="h-[500px]">
                <div className="p-4 bg-background font-mono text-sm">
                  {correctHTML.split('\n').map((line, index) => (
                    <div key={index} className="flex hover:bg-secondary/30">
                      <div className="select-none w-12 text-right pr-4 text-muted-foreground text-xs">
                        {index + 1}
                      </div>
                      <div className="flex-1 whitespace-pre">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlightHTML(escapeHTML(line))
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="diff" className="m-0">
              <ScrollArea className="h-[500px]">
                <div className="p-4 bg-background font-mono text-sm space-y-4">
                  <div className="text-muted-foreground text-xs mb-4">
                    <span className="text-error">- Lignes supprimées/modifiées</span>
                    {' | '}
                    <span className="text-success">+ Lignes ajoutées/corrigées</span>
                  </div>

                  {/* Afficher les différences principales */}
                  {errors.filter(e => !fixedErrors.includes(e.id)).map((error, idx) => (
                    <div key={idx} className="border border-border rounded-lg p-3">
                      <div className="text-xs text-muted-foreground mb-2">
                        Ligne {error.line} - {error.title}
                      </div>
                      <div className="bg-error/10 border-l-2 border-error p-2 mb-1">
                        <span className="text-error">- </span>
                        <span className="text-muted-foreground">Erreur détectée</span>
                      </div>
                      {error.solution && (
                        <div className="bg-success/10 border-l-2 border-success p-2">
                          <span className="text-success">+ </span>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: highlightHTML(escapeHTML(error.solution))
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        ) : (
          // Mode simple (code actuel uniquement)
          <ScrollArea className="h-[500px]">
            <div className="p-4 bg-background font-mono text-sm">
              {lines.map((line, index) => (
                <CodeLine
                  key={index}
                  line={line}
                  lineNumber={index + 1}
                />
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Légende des erreurs */}
        {showErrors && errorLines.size > 0 && (
          <div className="border-t border-border p-4 bg-secondary/30">
            <div className="text-sm font-medium mb-2">
              Erreurs détectées ({errorLines.size} lignes)
            </div>
            <div className="space-y-1">
              {Array.from(errorLines).slice(0, 5).map(lineNum => {
                const lineErrors = getErrorsForLine(lineNum);
                return (
                  <div key={lineNum} className="flex items-start gap-2 text-xs">
                    <Badge variant="outline" className="font-mono">
                      L{lineNum}
                    </Badge>
                    <span className="text-muted-foreground">
                      {lineErrors.map(e => e.title).join(', ')}
                    </span>
                  </div>
                );
              })}
              {errorLines.size > 5 && (
                <div className="text-xs text-muted-foreground italic">
                  +{errorLines.size - 5} autres erreurs...
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Version compacte pour preview rapide
 */
export function CodeViewerCompact({ html, maxLines = 10 }) {
  const lines = html.split('\n').slice(0, maxLines);

  return (
    <div className="bg-background border border-border rounded-lg p-3 font-mono text-xs overflow-hidden">
      {lines.map((line, index) => (
        <div key={index} className="flex">
          <span className="text-muted-foreground mr-2">{index + 1}</span>
          <span className="truncate">{line}</span>
        </div>
      ))}
      {html.split('\n').length > maxLines && (
        <div className="text-muted-foreground italic mt-1">
          ... {html.split('\n').length - maxLines} lignes supplémentaires
        </div>
      )}
    </div>
  );
}
