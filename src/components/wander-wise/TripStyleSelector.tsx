'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { User, Users, Heart, Backpack, Sparkles, Loader2 } from 'lucide-react';
import type { AnalysisData } from '@/app/page';

const travelStyles = [
  { id: 'solo', label: 'Solo', icon: User },
  { id: 'family', label: 'Family', icon: Users },
  { id: 'couple', label: 'Couple', icon: Heart },
  { id: 'friends', label: 'Friends', icon: Backpack },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full mt-6 bg-accent text-accent-foreground hover:bg-accent/90">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating Your Adventure...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Trip Plan
        </>
      )}
    </Button>
  );
}

export function TripStyleSelector({ analysis }: { analysis: AnalysisData }) {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md animate-fade-in shadow-2xl">
        <input type="hidden" name="interests" value={analysis.interests} />
        <input type="hidden" name="ageRange" value={analysis.ageRange} />
        <input type="hidden" name="destination" value={analysis.destination} />
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Just a few more details...</CardTitle>
          <CardDescription>We've analyzed your profile. Now, tell us about your trip to <span className="font-semibold text-primary">{analysis.destination}</span>.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="travelStyle" className="font-medium text-base">
              Who are you traveling with?
            </Label>
            <RadioGroup name="travelStyle" defaultValue="solo" className="mt-2 grid grid-cols-2 gap-4">
              {travelStyles.map(({ id, label, icon: Icon }) => (
                <Label
                  key={id}
                  htmlFor={id}
                  className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 cursor-pointer transition-colors hover:bg-accent/10 hover:border-accent [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10"
                >
                  <RadioGroupItem value={id} id={id} className="sr-only" />
                  <Icon className="mb-3 h-7 w-7 text-primary" />
                  <span className="font-semibold">{label}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>
          <SubmitButton />
        </CardContent>
      </Card>
    </div>
  );
}
