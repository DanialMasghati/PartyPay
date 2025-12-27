import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { StepIndicator } from '@/components/StepIndicator';
import { ParticipantsSection } from '@/components/ParticipantsSection';
import { ExpensesSection } from '@/components/ExpensesSection';
import { PayersSection } from '@/components/PayersSection';
import { ResultsSection } from '@/components/ResultsSection';
import { NavigationButtons } from '@/components/NavigationButtons';
import { Footer } from '@/components/Footer';
import { SupportButton } from '@/components/SupportButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface Expense {
  item: string;
  amount: number;
  consumers: string[];
}

interface Payer {
  name: string;
  amount: number;
}

interface TableRow {
  name: string;
  share: number;
  paid: number;
  balance: number;
  status: string;
}

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

interface ResultData {
  table: TableRow[];
  settlements: Settlement[];
  reasoning: string;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [participants, setParticipants] = useState<string[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [payers, setPayers] = useState<Payer[]>([]);
  const [result, setResult] = useState<ResultData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { t } = useLanguage();
  const { toast } = useToast();

  const totalSteps = 4;
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const addParticipant = (name: string) => {
    if (!participants.includes(name)) {
      setParticipants([...participants, name]);
    }
  };

  const removeParticipant = (name: string) => {
    setParticipants(participants.filter(p => p !== name));
    setExpenses(expenses.map(e => ({
      ...e,
      consumers: e.consumers.filter(c => c !== name)
    })).filter(e => e.consumers.length > 0));
    setPayers(payers.filter(p => p.name !== name));
  };

  const addExpense = (expense: Expense) => {
    setExpenses([...expenses, expense]);
  };

  const removeExpense = (index: number) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const addPayer = (payer: Payer) => {
    setPayers([...payers, payer]);
  };

  const removePayer = (index: number) => {
    setPayers(payers.filter((_, i) => i !== index));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return participants.length >= 2;
      case 1:
        return expenses.length > 0;
      case 2:
        return payers.length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!canProceed()) {
      const messages = [
        t('addParticipantsFirst'),
        t('addExpensesFirst'),
        t('addPayersFirst'),
      ];
      toast({
        title: messages[currentStep],
        variant: 'destructive',
      });
      return;
    }
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    if (step <= currentStep || canProceed()) {
      setCurrentStep(step);
    }
  };

  const handleCalculate = async () => {
    if (participants.length === 0 || expenses.length === 0 || payers.length === 0) {
      toast({
        title: t('error'),
        description: t('addParticipantsFirst'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

    try {
      // ۲. استفاده از متغیر baseUrl در آدرس‌دهی
      const response = await fetch(`${baseUrl}/api/calculate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participants,
          expenses,
          payers,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate');
      }

      const data = await response.json();
      
      // Parse the new JSON format
      const resultData: ResultData = {
        table: data.table || [],
        settlements: data.settlements || [],
        reasoning: data.reasoning || '',
      };
      
      setResult(resultData);
    } catch (err) {
      setError(t('error'));
      toast({
        title: t('error'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ParticipantsSection
            participants={participants}
            onAdd={addParticipant}
            onRemove={removeParticipant}
          />
        );
      case 1:
        return (
          <ExpensesSection
            expenses={expenses}
            participants={participants}
            onAdd={addExpense}
            onRemove={removeExpense}
          />
        );
      case 2:
        return (
          <PayersSection
            payers={payers}
            participants={participants}
            totalExpenses={totalExpenses}
            onAdd={addPayer}
            onRemove={removePayer}
          />
        );
      case 3:
        return (
          <ResultsSection
            result={result}
            isLoading={isLoading}
            error={error}
            onCalculate={handleCalculate}
            canCalculate={participants.length > 0 && expenses.length > 0 && payers.length > 0}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <StepIndicator
          currentStep={currentStep}
          totalSteps={totalSteps}
          onStepClick={handleStepClick}
        />

        <motion.div
          layout
          className="bg-card rounded-2xl border border-border shadow-card p-6 sm:p-8"
        >
          <AnimatePresence mode="wait">
            <motion.div key={currentStep}>
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          <NavigationButtons
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevious={handlePrevious}
            onNext={handleNext}
            canProceed={canProceed()}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          {t('appTagline')}
        </motion.p>

        <SupportButton />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
