'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { handleGeneratePlan, type PlanState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { TripStyleSelector } from './TripStyleSelector';
import { LoadingScreen } from './LoadingScreen';
import type { AnalysisData, PlanData } from '@/app/page';

function FormContent({ analysis }: { analysis: AnalysisData }) {
  const { pending } = useFormStatus();

  if (pending) {
    return <LoadingScreen />;
  }

  return <TripStyleSelector analysis={analysis} />;
}

export function PlanFormWrapper({
  analysis,
  onPlanGenerated,
}: {
  analysis: AnalysisData;
  onPlanGenerated: (plan: PlanData) => void;
}) {
  const initialState: PlanState = { data: null, error: null };
  const [state, formAction] = useFormState(handleGeneratePlan, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: state.error,
      });
    }
    if (state.data) {
      onPlanGenerated(state.data);
    }
  }, [state, onPlanGenerated, toast]);

  return (
    <form action={formAction}>
      <FormContent analysis={analysis} />
    </form>
  );
}
