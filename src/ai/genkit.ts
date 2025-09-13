import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

if (!process.env.GEMINI_API_KEY) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'The GEMINI_API_KEY environment variable is not set. Please add it to your environment variables.'
    );
  } else {
    console.warn(
      'The GEMINI_API_KEY environment variable is not set. The app will not work correctly.'
    );
  }
}

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});
