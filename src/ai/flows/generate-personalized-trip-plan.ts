'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating personalized trip plans.
 *
 * The flow takes user interests, age range, and travel style as input and generates a trip plan using the Gemini API.
 * It exports the following:
 * - `generatePersonalizedTripPlan`: The main function to trigger the trip plan generation.
 * - `GeneratePersonalizedTripPlanInput`: The input type for the function.
 * - `GeneratePersonalizedTripPlanOutput`: The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the trip plan generation.
const GeneratePersonalizedTripPlanInputSchema = z.object({
  interests: z
    .string()
    .describe('A comma separated string of user interests extracted from the instagram handle.'),
  ageRange: z.string().describe('The age range of the user (e.g., 20-30).'),
  travelStyle: z.enum(['solo', 'family', 'couple', 'friends']).describe('The travel style of the user.'),
});
export type GeneratePersonalizedTripPlanInput = z.infer<typeof GeneratePersonalizedTripPlanInputSchema>;

// Define the output schema for the trip plan generation.
const GeneratePersonalizedTripPlanOutputSchema = z.object({
  tripPlan: z.string().describe('A detailed trip plan generated based on the user input.'),
});
export type GeneratePersonalizedTripPlanOutput = z.infer<typeof GeneratePersonalizedTripPlanOutputSchema>;

// Main function to generate a personalized trip plan.
export async function generatePersonalizedTripPlan(
  input: GeneratePersonalizedTripPlanInput
): Promise<GeneratePersonalizedTripPlanOutput> {
  return generatePersonalizedTripPlanFlow(input);
}

// Define the prompt for the Gemini API.
const generatePersonalizedTripPlanPrompt = ai.definePrompt({
  name: 'generatePersonalizedTripPlanPrompt',
  input: {schema: GeneratePersonalizedTripPlanInputSchema},
  output: {schema: GeneratePersonalizedTripPlanOutputSchema},
  prompt: `You are a world-class travel agent.

Based on the user's interests, age range, and travel style, generate a detailed and personalized trip plan.

Interests: {{{interests}}}
Age Range: {{{ageRange}}}
Travel Style: {{{travelStyle}}}

Trip Plan:`,
});

// Define the Genkit flow for generating the trip plan.
const generatePersonalizedTripPlanFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedTripPlanFlow',
    inputSchema: GeneratePersonalizedTripPlanInputSchema,
    outputSchema: GeneratePersonalizedTripPlanOutputSchema,
  },
  async input => {
    const {output} = await generatePersonalizedTripPlanPrompt(input);
    return output!;
  }
);
