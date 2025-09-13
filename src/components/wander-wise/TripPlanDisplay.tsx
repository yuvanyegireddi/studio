'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowLeft, MapPin, Calendar, Clock, Utensils, Bed } from 'lucide-react';
import { Logo } from './Logo';
import type { PlanData } from '@/app/page';

function getIconForActivity(activity: string) {
  const lowerActivity = activity.toLowerCase();
  if (lowerActivity.includes('breakfast') || lowerActivity.includes('lunch') || lowerActivity.includes('dinner') || lowerActivity.includes('food') || lowerActivity.includes('restaurant') || lowerActivity.includes('cafe')) {
    return <Utensils className="h-5 w-5 text-accent" />;
  }
  if (lowerActivity.includes('check-in') || lowerActivity.includes('hotel') || lowerActivity.includes('rest')) {
    return <Bed className="h-5 w-5 text-blue-400" />;
  }
  if (lowerActivity.includes('explore') || lowerActivity.includes('tour') || lowerActivity.includes('visit') || lowerActivity.includes('walk')) {
    return <MapPin className="h-5 w-5 text-green-400" />;
  }
  return <Clock className="h-5 w-5 text-primary" />;
}

export function TripPlanDisplay({ plan, onReset }: { plan: PlanData; onReset: () => void }) {
  const mapImage = PlaceHolderImages.find(img => img.id === 'map');

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 animate-fade-in">
      <header className="flex justify-between items-center mb-6 max-w-5xl mx-auto">
        <Logo />
        <Button variant="outline" onClick={onReset}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Start Over
        </Button>
      </header>
      
      <main className="max-w-5xl mx-auto">
        <Card className="mb-8 shadow-lg border-2 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl font-headline text-primary">{plan.tripTitle}</CardTitle>
              <CardDescription className="text-lg">An AI-crafted journey based on your unique style.</CardDescription>
            </CardHeader>
        </Card>

        {mapImage && (
            <div className="mb-8 aspect-[16/7] relative rounded-2xl overflow-hidden border shadow-lg">
                <Image
                src={mapImage.imageUrl}
                alt={mapImage.description}
                fill
                className="object-cover"
                data-ai-hint={mapImage.imageHint}
                priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
        )}

        <div className="space-y-12">
          {plan.tripPlan.map((dayPlan) => (
            <div key={dayPlan.day}>
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Calendar className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold font-headline">Day {dayPlan.day}</h2>
                  <p className="text-muted-foreground text-lg">{dayPlan.title}</p>
                </div>
              </div>

              <div className="relative pl-8">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-border rounded-full" style={{transform: 'translateX(11px)'}}/>
                {dayPlan.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="relative mb-8 last:mb-0">
                    <div className="absolute -left-0.5 top-1.5 h-6 w-6 rounded-full bg-background border-2 border-primary flex items-center justify-center" style={{transform: 'translateX(1px)'}}>
                      <div className="h-3 w-3 rounded-full bg-primary"/>
                    </div>
                    <Card className="ml-8 bg-card/50 backdrop-blur-sm border-l-4 border-primary/50 shadow-md hover:shadow-xl transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-4">
                           {getIconForActivity(item.activity)}
                          <div>
                            <p className="text-sm font-semibold text-muted-foreground">{item.time}</p>
                            <CardTitle className="text-xl">{item.activity}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground/80">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
