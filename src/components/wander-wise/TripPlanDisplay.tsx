'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Logo } from './Logo';
import type { PlanData } from '@/app/page';

export function TripPlanDisplay({ plan, onReset }: { plan: PlanData; onReset: () => void }) {
  const mapImage = PlaceHolderImages.find(img => img.id === 'map');

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 animate-fade-in">
      <header className="flex justify-between items-center mb-6 max-w-7xl mx-auto">
        <Logo />
        <Button variant="outline" onClick={onReset}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Start Over
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <div className="lg:col-span-2">
          <Card className="h-full shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-headline">Your Personalized Itinerary</CardTitle>
              <CardDescription>An AI-crafted journey based on your unique style.</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <div
                className="prose prose-sm sm:prose-base dark:prose-invert max-w-none whitespace-pre-wrap font-body leading-relaxed text-foreground/90"
              >
                {plan.tripPlan}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="shadow-lg animate-fade-in" style={{ animationDelay: '200ms' }}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <CardTitle>Trip Overview</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {mapImage && (
                <div className="aspect-video relative rounded-lg overflow-hidden border">
                  <Image
                    src={mapImage.imageUrl}
                    alt={mapImage.description}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    data-ai-hint={mapImage.imageHint}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
