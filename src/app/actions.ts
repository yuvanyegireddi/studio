'use server';

import { z } from 'zod';
import { analyzeInstagramProfile } from '@/ai/flows/analyze-instagram-profile';
import { generatePersonalizedTripPlan } from '@/ai/flows/generate-personalized-trip-plan';

const instagramSchema = z.object({
  instagramHandle: z.string().min(1, 'Instagram handle cannot be empty.'),
});

export type AnalyzeState = {
  data: { interests: string; ageRange: string } | null;
  error: string | null;
};

export async function handleAnalyzeInstagram(
  prevState: AnalyzeState,
  formData: FormData
): Promise<AnalyzeState> {
  const validatedFields = instagramSchema.safeParse({
    instagramHandle: formData.get('instagramHandle'),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      error: validatedFields.error.flatten().fieldErrors.instagramHandle?.[0] ?? 'Invalid input.',
    };
  }

  try {
    const result = await analyzeInstagramProfile({
      instagramHandle: validatedFields.data.instagramHandle,
    });
    return { data: result, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: 'Failed to analyze profile. Please try again or check the handle.' };
  }
}

export type PlanState = {
  data: { tripPlan: string } | null;
  error: string | null;
};

const planSchema = z.object({
  interests: z.string().min(1),
  ageRange: z.string().min(1),
  travelStyle: z.enum(['solo', 'family', 'couple', 'friends']),
});

export async function handleGeneratePlan(
  prevState: PlanState,
  formData: FormData
): Promise<PlanState> {
  const validatedFields = planSchema.safeParse({
    interests: formData.get('interests'),
    ageRange: formData.get('ageRange'),
    travelStyle: formData.get('travelStyle'),
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
