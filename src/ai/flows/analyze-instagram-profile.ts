'use server';

/**
 * @fileOverview Analyzes social media profiles to infer user interests and age range.
 *
 * - analyzeSocialProfiles - A function that handles the social media profile analysis process.
 * - AnalyzeSocialProfilesInput - The input type for the analyzeSocialProfiles function.
 * - AnalyzeSocialProfilesOutput - The return type for the analyzeSocialProfiles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSocialProfilesInputSchema = z.object({
  instagramHandle: z
    .string()
    .optional()
    .describe('The Instagram handle of the user.'),
});
export type AnalyzeSocialProfilesInput = z.infer<
  typeof AnalyzeSocialProfilesInputSchema
>;

const AnalyzeSocialProfilesOutputSchema = z.object({
  interests: z
    .string()
    .describe('A comma separated list of the user interests.'),
  ageRange: z
    .string()
    .describe('An estimated age range of the user (e.g., 20-30).'),
});
export type AnalyzeSocialProfilesOutput = z.infer<
  typeof AnalyzeSocialProfilesOutputSchema
>;

export async function analyzeSocialProfiles(
  input: AnalyzeSocialProfilesInput
): Promise<AnalyzeSocialProfilesOutput> {
  return analyzeSocialProfilesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSocialProfilesPrompt',
  input: {schema: AnalyzeSocialProfilesInputSchema},
  output: {schema: AnalyzeSocialProfilesOutputSchema},
  prompt: `You are an AI assistant specializing in analyzing social media profiles.

  Your task is to extract the user's interests and estimate their age range based on their social media handles.

  Analyze the following social media profiles. At least one will be provided.

  {{#if instagramHandle}}
  Instagram handle: {{{instagramHandle}}}
  {{/if}}

  Provide the output in the following format:
  Interests: <comma separated list of interests>
  Age Range: <estimated age range (e.g., 20-30)>`,
});

const analyzeSocialProfilesFlow = ai.defineFlow(
  {
    name: 'analyzeSocialProfilesFlow',
    inputSchema: AnalyzeSocialProfilesInputSchema,
    outputSchema: AnalyzeSocialProfilesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
