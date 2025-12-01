import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target } from 'lucide-react';
import SEOModule from './modules/SEOModule';
import SEAModule from './modules/SEAModule';

/**
 * SEO/SEA SIMULATOR - Application principale
 *
 * Serious game pédagogique pour apprendre le SEO et le SEA
 * Basé sur le code du jeu marketing international existant
 */

export default function App() {
  const [gameState, setGameState] = useState('menu'); // menu, seo, sea, results
  const [currentModule, setCurrentModule] = useState(null); // 'seo' ou 'sea'

  // Menu principal
  if (gameState === 'menu') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <div className="max-w-4xl w-full space-y-8">
          {/* Titre principal */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold font-mono text-foreground">
              SEO/SEA SIMULATOR
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Maîtrisez le référencement naturel et payant dans ce serious game interactif
            </p>
          </div>

          {/* Cards des modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {/* Module SEO */}
            <Card className="hover:border-seo transition-all duration-300 cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="success" className="bg-seo">MODULE 1</Badge>
                  <TrendingUp className="w-8 h-8 text-seo group-hover:scale-110 transition-transform" />
                </div>
                <CardTitle className="text-2xl">SEO Master</CardTitle>
                <CardDescription>
                  Optimisez des pages web, corrigez les erreurs et grimpez dans les résultats Google
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>✓</span>
                  <span>6 pages HTML à optimiser</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>✓</span>
                  <span>Détection automatique d'erreurs</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>✓</span>
                  <span>Position SERP en temps réel</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => {
                    setCurrentModule('seo');
                    setGameState('seo');
                  }}
                  className="w-full bg-seo hover:bg-seo/90"
                >
                  Commencer le Module SEO
                </Button>
              </CardFooter>
            </Card>

            {/* Module SEA */}
            <Card className="hover:border-sea transition-all duration-300 cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="default" className="bg-sea">MODULE 2</Badge>
                  <Target className="w-8 h-8 text-sea group-hover:scale-110 transition-transform" />
                </div>
                <CardTitle className="text-2xl">SEA Master</CardTitle>
                <CardDescription>
                  Gérez des campagnes Google Ads, optimisez vos enchères et maximisez votre ROI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>✓</span>
                  <span>5 mots-clés à cibler</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>✓</span>
                  <span>Enchères contre IA concurrents</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>✓</span>
                  <span>Simulation Quality Score</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => {
                    setCurrentModule('sea');
                    setGameState('sea');
                  }}
                  className="w-full bg-sea hover:bg-sea/90"
                >
                  Commencer le Module SEA
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Footer info */}
          <div className="text-center text-sm text-muted-foreground mt-8">
            <p>Durée estimée : 45-60 minutes par module</p>
            <p className="mt-2">Conçu pour l'apprentissage du marketing digital</p>
          </div>
        </div>
      </div>
    );
  }

  // Module SEO
  if (gameState === 'seo') {
    return (
      <SEOModule
        onComplete={() => setGameState('menu')}
        onBack={() => setGameState('menu')}
      />
    );
  }

  // Module SEA
  if (gameState === 'sea') {
    return (
      <SEAModule
        onComplete={() => setGameState('menu')}
        onBack={() => setGameState('menu')}
      />
    );
  }

  return null;
}
