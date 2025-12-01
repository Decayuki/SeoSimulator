import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Code, RotateCcw, Check, Lock } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

/**
 * CodeEditor - Éditeur de code avec Monaco Editor
 *
 * Permet aux élèves de :
 * - Voir le code HTML initial
 * - Modifier le code directement
 * - Voir le code corrigé (protégé par mot de passe)
 * - Réinitialiser leurs modifications
 */

export default function CodeEditor({
  initialCode = '',
  correctCode = '',
  userCode = '',
  onCodeChange,
  purchasedHints = [],
  errors = [],
  className
}) {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showCorrectCode, setShowCorrectCode] = useState(false);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const decorationsRef = useRef([]); // Stocker les IDs des décorations

  // Mot de passe prof (en production, ceci devrait être configurable)
  const PROFESSOR_PASSWORD = 'prof2024';

  // Gérer le montage de l'éditeur
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Configurer les décorations pour surligner les erreurs révélées
    updateErrorDecorations(editor, monaco);
  };

  // Mettre à jour les décorations d'erreur quand purchasedHints ou errors changent
  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      updateErrorDecorations(editorRef.current, monacoRef.current);
    }
  }, [purchasedHints, errors]);

  // Mettre à jour les décorations d'erreur
  const updateErrorDecorations = (editor, monaco) => {
    if (!editor || !monaco) return;

    // Créer les nouvelles décorations
    const newDecorations = purchasedHints.map(hintId => {
      const error = errors.find(e => e.id === hintId);
      if (!error || !error.line) return null;

      return {
        range: new monaco.Range(error.line, 1, error.line, 1000), // Ligne entière
        options: {
          isWholeLine: true,
          className: 'error-line-highlight',
          glyphMarginClassName: 'error-line-glyph',
          hoverMessage: {
            value: `**${error.title}**\n\n${error.description}\n\nImpact: ${error.impact} points`
          },
          minimap: {
            color: '#ef4444',
            position: 1
          }
        }
      };
    }).filter(Boolean);

    // Mettre à jour les décorations en utilisant deltaDecorations
    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, newDecorations);
  };

  // Réinitialiser le code
  const handleReset = () => {
    if (editorRef.current) {
      editorRef.current.setValue(initialCode);
      onCodeChange(initialCode);
    }
  };

  // Vérifier le mot de passe
  const handlePasswordSubmit = () => {
    if (password === PROFESSOR_PASSWORD) {
      setShowCorrectCode(true);
      setShowPasswordDialog(false);
      setPassword('');
      setPasswordError('');
    } else {
      setPasswordError('Mot de passe incorrect. Demandez le code à votre professeur.');
      setPassword('');
    }
  };

  // Fermer le dialog de mot de passe
  const handlePasswordDialogClose = () => {
    setShowPasswordDialog(false);
    setPassword('');
    setPasswordError('');
  };

  // Tenter d'accéder au code corrigé
  const handleAccessCorrectCode = () => {
    setShowPasswordDialog(true);
  };

  // Options de l'éditeur Monaco
  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 13,
    lineNumbers: 'on',
    roundedSelection: false,
    scrollBeyondLastLine: false,
    readOnly: false,
    theme: 'vs-dark',
    automaticLayout: true,
    wordWrap: 'on',
    tabSize: 2,
    folding: true,
    lineDecorationsWidth: 10,
    lineNumbersMinChars: 3,
    glyphMargin: true,
    renderLineHighlight: 'all',
  };

  return (
    <>
      <Card className={cn('flex flex-col', className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              Éditeur de code
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">
                HTML
              </Badge>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Modifiez le code pour corriger les erreurs révélées
          </p>
        </CardHeader>

        <CardContent className="flex flex-col pb-4">
          <Tabs defaultValue="editor" className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <TabsList className="grid w-fit grid-cols-2">
                <TabsTrigger value="editor">Votre code</TabsTrigger>
                <TabsTrigger
                  value="solution"
                  onClick={() => !showCorrectCode && handleAccessCorrectCode()}
                  className="relative"
                >
                  <Lock className="w-3 h-3 mr-1" />
                  Code corrigé
                </TabsTrigger>
              </TabsList>

              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="gap-1"
              >
                <RotateCcw className="w-4 h-4" />
                Réinitialiser
              </Button>
            </div>

            {/* Onglet éditeur */}
            <TabsContent value="editor" className="mt-0 border rounded-lg overflow-hidden" style={{ height: '500px' }}>
              <Editor
                height="500px"
                defaultLanguage="html"
                value={userCode || initialCode}
                onChange={onCodeChange}
                onMount={handleEditorDidMount}
                options={editorOptions}
                theme="vs-dark"
              />
            </TabsContent>

            {/* Onglet solution (protégé) */}
            <TabsContent value="solution" className="mt-0" style={{ height: '500px' }}>
              {showCorrectCode ? (
                <div className="border rounded-lg overflow-hidden" style={{ height: '500px' }}>
                  <Editor
                    height="500px"
                    defaultLanguage="html"
                    value={correctCode}
                    options={{
                      ...editorOptions,
                      readOnly: true,
                    }}
                    theme="vs-dark"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center border rounded-lg bg-secondary/20" style={{ height: '500px' }}>
                  <div className="text-center space-y-4 p-8 max-w-md">
                    <div className="w-16 h-16 mx-auto rounded-full bg-warning/20 flex items-center justify-center">
                      <Lock className="w-8 h-8 text-warning" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Code corrigé protégé
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Cette section est réservée aux professeurs.
                        Un mot de passe est requis pour accéder au code corrigé.
                      </p>
                    </div>
                    <Button onClick={handleAccessCorrectCode} className="gap-2">
                      <Lock className="w-4 h-4" />
                      Demander l'accès
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Indice : nombre d'erreurs révélées */}
          {purchasedHints.length > 0 && (
            <Alert className="mt-3 bg-info/10 border-info">
              <Check className="h-4 w-4 text-info" />
              <AlertDescription className="text-sm">
                {purchasedHints.length} erreur{purchasedHints.length > 1 ? 's' : ''} révélée{purchasedHints.length > 1 ? 's' : ''}
                {' '}• Corrigez-{purchasedHints.length > 1 ? 'les' : 'la'} dans le code ci-dessus
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Dialog de mot de passe */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-warning" />
              Accès protégé
            </DialogTitle>
            <DialogDescription>
              Vraiment ? Tu pensais <i>vraiment</i> que j'allais laisser l'accès à la correction librement ?
              Tu es dorénavant dernier sur la liste...et interdiction d'appeler une IA à la rescousse !
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
                autoFocus
              />
            </div>

            {passwordError && (
              <Alert variant="destructive">
                <AlertDescription className="text-sm">
                  {passwordError}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handlePasswordDialogClose}>
              Annuler
            </Button>
            <Button onClick={handlePasswordSubmit}>
              Valider
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Styles personnalisés pour les décorations d'erreur */}
      <style>{`
        .error-line-highlight {
          background: rgba(239, 68, 68, 0.15) !important;
          border-left: 3px solid rgba(239, 68, 68, 0.6) !important;
          padding-left: 4px !important;
        }
        .error-line-glyph {
          background: rgba(239, 68, 68, 0.8) !important;
          width: 4px !important;
          margin-left: 3px !important;
        }
        .monaco-editor .error-line-highlight {
          background: rgba(239, 68, 68, 0.15) !important;
        }
      `}</style>
    </>
  );
}
