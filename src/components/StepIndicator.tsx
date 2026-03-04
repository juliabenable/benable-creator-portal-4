import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { CAMPAIGN_STEPS, getStepIndex, type CampaignStep } from '@/types';

interface StepIndicatorProps {
  currentStep: CampaignStep;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const activeIndex = getStepIndex(currentStep);

  return (
    <div className="flex items-center justify-between w-full px-2">
      {CAMPAIGN_STEPS.map((step, i) => {
        const isCompleted = i < activeIndex;
        const isActive = i === activeIndex;

        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all shrink-0',
                  isCompleted && 'bg-primary text-primary-foreground',
                  isActive && 'bg-primary text-primary-foreground ring-4 ring-primary/20',
                  !isCompleted && !isActive && 'bg-muted text-muted-foreground'
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  'text-[11px] font-medium text-center leading-tight',
                  isActive ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>
            {i < CAMPAIGN_STEPS.length - 1 && (
              <div
                className={cn(
                  'h-0.5 flex-1 mx-2 mt-[-18px] transition-all',
                  i < activeIndex ? 'bg-primary' : 'bg-muted'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
