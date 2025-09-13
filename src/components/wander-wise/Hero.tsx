'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Instagram, Search, Loader2 } from 'lucide-react';
import { handleAnalyzeInstagram, type AnalyzeState } from '@/app/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from './Logo';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { AnalysisData } from '@/app/page';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <Search className="mr-2 h-4 w-4" />
          Analyze Profile
        </>
      )}
    </Button>
  );
}

export function Hero({ onAnalysisComplete }: { onAnalysisComplete: (data: AnalysisData) => void }) {
  const initialState: AnalyzeState = { data: null, error: null };
  const [state, formAction] = useFormState(handleAnalyzeInstagram, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: state.error,
      });
    }
    if (state.data) {
      onAnalysisComplete(state.data);
    }
  }, [state, onAnalysisComplete, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-grid-pattern">
      <Card className="w-full max-w-lg shadow-2xl animate-fade-in backdrop-blur-sm bg-background/80">
        <form action={formAction}>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Logo />
            </div>
            <CardTitle className="text-3xl font-headline">Craft Your Perfect Getaway</CardTitle>
            <CardDescription className="text-lg">
              Let our AI create a personalized travel itinerary from your Instagram.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Instagram className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                name="instagramHandle"
                placeholder="e.g., natgeotravel"
                className="pl-12 text-base h-12"
                required
                aria-label="Instagram Handle"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
