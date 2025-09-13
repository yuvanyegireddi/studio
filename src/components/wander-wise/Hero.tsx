'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Instagram, Search, Loader2, MapPin } from 'lucide-react';
import { handleAnalyzeSocials, type AnalyzeState, getDestinationSuggestions } from '@/app/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from './Logo';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { AnalysisData } from '@/app/page';
import { useDebounce } from '@/hooks/use-debounce';

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
          Analyze Profiles
        </>
      )}
    </Button>
  );
}

const TikTokIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-music"><path d="M9 18V5l12-2v13"/><path d="M9 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M21 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/></svg>
);

const PinterestIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pinterest"><path d="M13.2 13.6s.4-1.2.6-1.8c.2-.7.3-1.2.3-1.6 0-1.2-.5-2.2-1.6-2.2-1.2 0-2 .8-2 1.8 0 .4.2.8.4 1.2l-1.3 4.5c-.3 1.3-1 3.2-3 3.2-1.3 0-2.3-1.2-2.3-2.8 0-2 1.3-3.6 3.2-3.6.8 0 1.5.3 2 .8.2-.5 1-2.2 1-2.2-1-.6-1.7-2-1.7-3.4 0-2.2 1.8-4.4 5-4.4 2.7 0 4.4 2 4.4 4C18 10.3 17 12 15.6 12c-.7 0-1.4-.4-1.6-.8-.2-.3-.2-.5 0-.8.3-.7.5-1.5.5-2.2 0-1-1.3-1.8-2.3-1.8-1 0-1.8.8-1.8 2.2 0 .5.3.8.5 1.2s.3.6.3.6l-1 4.2c-.2.8.1 1.8 1.2 1.8 1.5 0 2.5-1.5 2.5-3.3 0-1.2-.4-2.3-1-3Z"/></svg>
);


export function Hero({ onAnalysisComplete }: { onAnalysisComplete: (data: AnalysisData) => void }) {
  const initialState: AnalyzeState = { data: null, error: null };
  const [state, formAction] = useActionState(handleAnalyzeSocials, initialState);
  const { toast } = useToast();
  
  const [destination, setDestination] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const debouncedDestination = useDebounce(destination, 300);
  const suggestionBoxRef = useRef<HTMLDivElement>(null);


  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length > 2) {
      const result = await getDestinationSuggestions(query);
      setSuggestions(result.suggestions);
      setIsSuggestionsVisible(true);
    } else {
      setSuggestions([]);
      setIsSuggestionsVisible(false);
    }
  }, []);

  useEffect(() => {
    fetchSuggestions(debouncedDestination);
  }, [debouncedDestination, fetchSuggestions]);

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

  const handleSuggestionClick = (suggestion: string) => {
    setDestination(suggestion);
    setSuggestions([]);
    setIsSuggestionsVisible(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionBoxRef.current && !suggestionBoxRef.current.contains(event.target as Node)) {
        setIsSuggestionsVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [suggestionBoxRef]);

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
              Let our AI create a personalized travel itinerary from your social profiles.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative" ref={suggestionBoxRef}>
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                name="destination"
                placeholder="e.g., Paris, France"
                className="pl-12 text-base h-12"
                required
                aria-label="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                autoComplete="off"
              />
              {isSuggestionsVisible && suggestions.length > 0 && (
                <Card className="absolute z-10 w-full mt-1 bg-background shadow-lg">
                  <CardContent className="p-2">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="p-2 hover:bg-accent rounded-md cursor-pointer"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
            <div className="relative">
              <Instagram className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                name="instagramHandle"
                placeholder="Instagram handle (e.g., natgeotravel)"
                className="pl-12 text-base h-12"
                aria-label="Instagram Handle"
              />
            </div>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                <TikTokIcon />
              </div>
              <Input
                name="tiktokHandle"
                placeholder="TikTok handle (optional)"
                className="pl-12 text-base h-12"
                aria-label="TikTok Handle"
              />
            </div>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                <PinterestIcon />
              </div>
              <Input
                name="pinterestHandle"
                placeholder="Pinterest handle (optional)"
                className="pl-12 text-base h-12"
                aria-label="Pinterest Handle"
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
