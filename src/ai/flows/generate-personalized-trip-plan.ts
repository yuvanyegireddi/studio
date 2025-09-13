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
  destination: z.string().describe('The destination city and country (e.g., Paris, France).'),
  interests: z
    .string()
    .describe('A comma separated string of user interests extracted from the instagram handle.'),
  ageRange: z.string().describe('The age range of the user (e.g., 20-30).'),
  travelStyle: z.enum(['solo', 'family', 'couple', 'friends']).describe('The travel style of the user.'),
  duration: z.number().describe('The duration of the trip in days (e.g., 3).'),
});
export type GeneratePersonalizedTripPlanInput = z.infer<typeof GeneratePersonalizedTripPlanInputSchema>;

const ItineraryItemSchema = z.object({
  time: z.string().describe("The time of the activity (e.g., 'Morning', '9:00 AM')."),
  activity: z.string().describe('The activity planned for that time.'),
  description: z.string().describe('A short description of the activity.'),
  estimatedDuration: z.string().optional().describe('The estimated duration for the activity (e.g., "2 hours", "30 minutes").')
});

const DailyPlanSchema = z.object({
  day: z.number().describe('The day number of the trip (e.g., 1).'),
  title: z.string().describe("A title for the day's plan (e.g., 'Arrival and Exploration')."),
  items: z.array(ItineraryItemSchema).describe('A list of itinerary items for the day.'),
});

// Define the output schema for the trip plan generation.
const GeneratePersonalizedTripPlanOutputSchema = z.object({
  tripTitle: z.string().describe("A catchy title for the entire trip."),
  tripPlan: z.array(DailyPlanSchema).describe('An array of daily plans for the trip.'),
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

Based on the user's interests, age range, travel style, and destination, generate a detailed and personalized trip plan. Make sure to include famous landmarks and attractions. Create a catchy title for the trip. For each day, provide a title and a schedule of activities from morning to night. For each activity, include an estimated duration.

Destination: {{{destination}}}
Interests: {{{interests}}}
Age Range: {{{ageRange}}}
Travel Style: {{{travelStyle}}}
Duration: {{{duration}}} days

Generate a complete itinerary for the specified number of days.`,
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
