import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  canProceed: boolean;
}

export function NavigationButtons({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  canProceed,
}: NavigationButtonsProps) {
  const { t, dir } = useLanguage();

  const PrevIcon = dir === 'rtl' ? ChevronRight : ChevronLeft;
  const NextIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;

  return (
    <div className="flex items-center justify-between pt-6 mt-6 border-t border-border">
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentStep === 0}
          className="h-11 px-6"
        >
          <PrevIcon className="w-5 h-5 me-2" />
          {t('previous')}
        </Button>
      </motion.div>

      {currentStep < totalSteps - 1 && (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={onNext}
            disabled={!canProceed}
            className="h-11 px-6 gradient-primary text-primary-foreground hover:opacity-90"
          >
            {t('next')}
            <NextIcon className="w-5 h-5 ms-2" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
