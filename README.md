# WanderWise: Your AI-Powered Trip Planner

WanderWise is a modern web application that leverages the power of generative AI to create personalized travel itineraries. By analyzing a user's Instagram profile, it tailors a unique trip plan complete with daily activities, famous landmarks, and estimated durations, all presented in a clean and intuitive interface.

![WanderWise Screenshot](https://storage.googleapis.com/aip-dev-images/wander-wise-screenshot.png)

## ✨ Features

- **Personalized Itinerary Generation**: Creates detailed, day-by-day trip plans based on user preferences.
- **AI-Powered Interest Analysis**: Analyzes a public Instagram handle to infer a user's interests and age range.
- **Dynamic Destination Suggestions**: Offers autocomplete suggestions for travel destinations as the user types.
- **Customizable Trip Parameters**: Allows users to specify trip duration and travel style (e.g., Solo, Family, Couple).
- **Famous Landmark Integration**: Includes well-known attractions alongside personalized, niche suggestions.
- **Interactive Timeline**: Displays the generated itinerary in a beautiful and easy-to-follow timeline format.
- **Responsive Design**: Provides a seamless experience across desktop and mobile devices.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI**: [Genkit](https://firebase.google.com/docs/genkit) with the Google Gemini model
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Deployment**: Configured for [Netlify](https://www.netlify.com/)

## 🚀 Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en) (v18 or later)
- [npm](https://www.npmjs.com/) (or your preferred package manager)

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <your-repository-name>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of your project and add your Google AI API key. You can obtain a key from [Google AI Studio](https://aistudio.google.com/app/apikey).

```.env
# .env
GEMINI_API_KEY=your_google_ai_api_key
```

### 4. Run the Development Servers

WanderWise requires two development processes to run simultaneously: the Next.js frontend and the Genkit AI flows.

- **Start the Next.js app:**
  ```bash
  npm run dev
  ```
  Your application will be available at `http://localhost:9002`.

- **Start the Genkit development UI (in a separate terminal):**
  ```bash
  npm run genkit:dev
  ```
  This allows you to inspect and debug your AI flows at `http://localhost:4000`.

## 📦 Deployment

This project is pre-configured for one-click deployment on [Netlify](https://www.netlify.com/).

1.  **Push your code** to a GitHub, GitLab, or Bitbucket repository.
2.  **Create a new site on Netlify** and connect it to your repository.
3.  Netlify will automatically detect the `netlify.toml` file and use the correct build command (`npm run build`) and publish directory (`.next`).
4.  **Add your `GEMINI_API_KEY`** as an environment variable in the Netlify site settings.
5.  Click **"Deploy site"**. Your AI-powered trip planner will be live!
