import { motion } from 'framer-motion';
import { Check, Users, Receipt, CreditCard, Calculator } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}

const stepIcons = [Users, Receipt, CreditCard, Calculator];

export function StepIndicator({ currentStep, totalSteps, onStepClick }: StepIndicatorProps) {
  const { t } = useLanguage();
  
  const stepNames = ['participants', 'expenses', 'payers', 'results'];

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const Icon = stepIcons[index];
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <motion.div
              key={index}
              className="flex items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.button
                onClick={() => onStepClick(index)}
                className={cn(
                  "relative flex flex-col items-center gap-2 transition-all duration-300",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg p-2",
                  isCurrent && "scale-110"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                    isCompleted && "gradient-primary shadow-glow",
                    isCurrent && "bg-primary shadow-glow",
                    !isCompleted && !isCurrent && "bg-muted"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-primary-foreground" />
                  ) : (
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-colors",
                        isCurrent ? "text-primary-foreground" : "text-muted-foreground"
                      )}
                    />
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium transition-colors hidden sm:block",
                    isCurrent ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {t(stepNames[index])}
                </span>
              </motion.button>
              
              {index < totalSteps - 1 && (
                <div
                  className={cn(
                    "w-8 sm:w-16 h-0.5 mx-1 sm:mx-2 rounded-full transition-colors duration-300",
                    index < currentStep ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
