'use server';

import { z } from 'zod';
import { analyzeInstagramProfile } from '@/ai/flows/analyze-instagram-profile';
import { generatePersonalizedTripPlan, type GeneratePersonalizedTripPlanOutput } from '@/ai/flows/generate-personalized-trip-plan';
import { suggestDestinations, type SuggestDestinationsOutput } from '@/ai/flows/suggest-destinations';

const instagramSchema = z.object({
  instagramHandle: z.string().min(1, 'Instagram handle cannot be empty.'),
  destination: z.string().min(1, 'Destination cannot be empty.'),
});

export type AnalyzeState = {
  data: { interests: string; ageRange: string; destination: string } | null;
  error: string | null;
};

export async function handleAnalyzeInstagram(
  prevState: AnalyzeState,
  formData: FormData
): Promise<AnalyzeState> {
  const validatedFields = instagramSchema.safeParse({
    instagramHandle: formData.get('instagramHandle'),
    destination: formData.get('destination'),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    const errorMessage = fieldErrors.instagramHandle?.[0] ?? fieldErrors.destination?.[0] ?? 'Invalid input.';
    return {
      data: null,
      error: errorMessage,
    };
  }

  try {
    const result = await analyzeInstagramProfile({
      instagramHandle: validatedFields.data.instagramHandle,
    });
    return { data: { ...result, destination: validatedFields.data.destination }, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: 'Failed to analyze profile. Please try again or check the handle.' };
  }
}

export type PlanState = {
  data: GeneratePersonalizedTripPlanOutput | null;
  error: string | null;
};

const planSchema = z.object({
  interests: z.string().min(1),
  ageRange: z.string().min(1),
  travelStyle: z.enum(['solo', 'family', 'couple', 'friends']),
  destination: z.string().min(1),
});

export async function handleGeneratePlan(
  prevState: PlanState,
  formData: FormData
): Promise<PlanState> {
  const validatedFields = planSchema.safeParse({
    interests: formData.get('interests'),
    ageRange: formData.get('ageRange'),
    travelStyle: formData.get('travelStyle'),
    destination: formData.get('destination'),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      error: 'Invalid input for trip plan generation.',
    };
  }

  try {
    const result = await generatePersonalizedTripPlan(validatedFields.data);
    return { data: result, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: 'Failed to generate trip plan. Please try again.' };
  }
}

const suggestionSchema = z.object({
  query: z.string(),
});

export async function getDestinationSuggestions(
  query: string
): Promise<SuggestDestinationsOutput> {
  const validatedFields = suggestionSchema.safeParse({ query });

  if (!validatedFields.success || !validatedFields.data.query) {
    return { suggestions: [] };
  }

  try {
    const result = await suggestDestinations({ query: validatedFields.data.query });
    return result;
  } catch (error) {
    console.error(error);
    return { suggestions: [] };
  }
}
