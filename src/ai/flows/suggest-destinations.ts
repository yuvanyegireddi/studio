'use server';
/**
 * @fileOverview Suggests travel destinations based on a user's query.
 *
 * - suggestDestinations - A function that suggests destinations.
 * - SuggestDestinationsInput - The input type for the suggestDestinations function.
 * - SuggestDestinationsOutput - The return type for the suggestDestinations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDestinationsInputSchema = z.object({
  query: z.string().describe('The partial query for a destination city.'),
});
export type SuggestDestinationsInput = z.infer<typeof SuggestDestinationsInputSchema>;

const SuggestDestinationsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of destination suggestions (e.g., ["Paris, France", "Park City, Utah"]).'),
});
export type SuggestDestinationsOutput = z.infer<typeof SuggestDestinationsOutputSchema>;

export async function suggestDestinations(
  input: SuggestDestinationsInput
): Promise<SuggestDestinationsOutput> {
  return suggestDestinationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDestinationsPrompt',
  input: {schema: SuggestDestinationsInputSchema},
  output: {schema: SuggestDestinationsOutputSchema},
  prompt: `You are a travel assistant. Given a partial query, provide a list of 5 potential travel destinations (city and country/state).

  Query: {{{query}}}
  
  Provide up to 5 suggestions.`,
});

const suggestDestinationsFlow = ai.defineFlow(
  {
    name: 'suggestDestinationsFlow',
    inputSchema: SuggestDestinationsInputSchema,
    outputSchema: SuggestDestinationsOutputSchema,
  },
  async input => {
    if (!input.query) {
      return { suggestions: [] };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
