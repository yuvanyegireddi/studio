'use client';

import { useState, useEffect } from 'react';
import { Hero } from '@/components/wander-wise/Hero';
import { PlanFormWrapper } from '@/components/wander-wise/PlanFormWrapper';
import { TripPlanDisplay } from '@/components/wander-wise/TripPlanDisplay';

type Stage = 'initial' | 'selecting_style' | 'displaying_plan';

export type AnalysisData = {
  interests: string;
  ageRange: string;
};

export type PlanData = {
  tripPlan: string;
};

export default function Home() {
  const [stage, setStage] = useState<Stage>('initial');
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [planData, setPlanData] = useState<PlanData | null>(null);

  useEffect(() => {
    try {
      const savedPlan = localStorage.getItem('wanderWiseTripPlan');
      if (savedPlan) {
        setPlanData(JSON.parse(savedPlan));
        setStage('displaying_plan');
      }
    } catch (error) {
      console.error('Failed to parse saved plan from localStorage', error);
      localStorage.removeItem('wanderWiseTripPlan');
    }
  }, []);

  const handleAnalysisComplete = (data: AnalysisData) => {
    setAnalysisData(data);
    setStage('selecting_style');
  };

  const handlePlanGenerated = (data: PlanData) => {
    setPlanData(data);
    setStage('displaying_plan');
    try {
      localStorage.setItem('wanderWiseTripPlan', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save plan to localStorage', error);
    }
  };

  const handleReset = () => {
    setStage('initial');
    setAnalysisData(null);
    setPlanData(null);
    try {
      localStorage.removeItem('wanderWiseTripPlan');
    } catch (error) {
      console.error('Failed to clear localStorage', error);
    }
  };

  return (
    <main>
      {stage === 'initial' && <Hero onAnalysisComplete={handleAnalysisComplete} />}
      {stage === 'selecting_style' && analysisData && (
        <PlanFormWrapper analysis={analysisData} onPlanGenerated={handlePlanGenerated} />
      )}
      {stage === 'displaying_plan' && planData && (
        <TripPlanDisplay plan={planData} onReset={handleReset} />
      )}
    </main>
  );
}
