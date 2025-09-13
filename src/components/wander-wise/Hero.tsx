'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Instagram, Search, Loader2, MapPin } from 'lucide-react';
import { handleAnalyzeInstagram, type AnalyzeState, getDestinationSuggestions } from '@/app/actions';
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
          Analyze Profile
        </>
      )}
    </Button>
  );
}

export function Hero({ onAnalysisComplete }: { onAnalysisComplete: (data: AnalysisData) => void }) {
  const initialState: AnalyzeState = { data: null, error: null };
  const [state, formAction] = useActionState(handleAnalyzeInstagram, initialState);
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
              Let our AI create a personalized travel itinerary from your Instagram.
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
