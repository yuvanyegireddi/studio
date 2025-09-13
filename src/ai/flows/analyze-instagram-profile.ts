'use server';

/**
 * @fileOverview Analyzes an Instagram profile to infer user interests and age range.
 *
 * - analyzeInstagramProfile - A function that handles the Instagram profile analysis process.
 * - AnalyzeInstagramProfileInput - The input type for the analyzeInstagramProfile function.
 * - AnalyzeInstagramProfileOutput - The return type for the analyzeInstagramProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeInstagramProfileInputSchema = z.object({
  instagramHandle: z
    .string()
    .describe('The Instagram handle of the user.'),
});
export type AnalyzeInstagramProfileInput = z.infer<
  typeof AnalyzeInstagramProfileInputSchema
>;

const AnalyzeInstagramProfileOutputSchema = z.object({
  interests: z
    .string()
    .describe('A comma separated list of the user interests.'),
  ageRange: z
    .string()
    .describe('An estimated age range of the user (e.g., 20-30).'),
});
export type AnalyzeInstagramProfileOutput = z.infer<
  typeof AnalyzeInstagramProfileOutputSchema
>;

export async function analyzeInstagramProfile(
  input: AnalyzeInstagramProfileInput
): Promise<AnalyzeInstagramProfileOutput> {
  return analyzeInstagramProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeInstagramProfilePrompt',
  input: {schema: AnalyzeInstagramProfileInputSchema},
  output: {schema: AnalyzeInstagramProfileOutputSchema},
  prompt: `You are an AI assistant specializing in analyzing Instagram profiles.

  Your task is to extract the user's interests and estimate their age range based on their Instagram handle.

  Analyze the following Instagram profile:
  Instagram handle: {{{instagramHandle}}}

  Provide the output in the following format:
  Interests: <comma separated list of interests>
  Age Range: <estimated age range (e.g., 20-30)>`,
});

const analyzeInstagramProfileFlow = ai.defineFlow(
  {
    name: 'analyzeInstagramProfileFlow',
    inputSchema: AnalyzeInstagramProfileInputSchema,
    outputSchema: AnalyzeInstagramProfileOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
