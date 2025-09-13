'use client';

import { Loader2 } from 'lucide-react';
import { Logo } from './Logo';

const messages = [
  'Scouting hidden gems...',
  'Aligning the stars for your adventure...',
  'Packing virtual bags...',
  'Consulting ancient maps...',
  'Translating local greetings...',
  'Finding the best photo spots...',
];

export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background">
      <div className="mb-8">
        <Logo />
      </div>
      <Loader2 className="w-12 h-12 mb-6 text-primary animate-spin" />
      <h2 className="text-2xl font-semibold text-foreground animate-pulse">
        Crafting your dream trip...
      </h2>
      <p className="text-muted-foreground mt-2">This might take a moment.</p>
    </div>
  );
}
