import {genkit, GenkitPlugin} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const plugins: GenkitPlugin[] = [];

if (process.env.GEMINI_API_KEY) {
  plugins.push(googleAI());
} else {
  if (process.env.NODE_ENV === 'production') {
    console.error(
      'The GEMINI_API_KEY environment variable is not set. Please add it to your environment variables. The app will not function correctly.'
    );
  } else {
    console.warn(
      'The GEMINI_API_KEY environment variable is not set. The app will not work correctly.'
    );
  }
}

export const ai = genkit({
  plugins,
  model: 'googleai/gemini-2.5-flash',
});
