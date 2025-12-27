import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Payer {
  name: string;
  amount: number;
}

interface PayersSectionProps {
  payers: Payer[];
  participants: string[];
  totalExpenses: number;
  onAdd: (payer: Payer) => void;
  onRemove: (index: number) => void;
}

export function PayersSection({ payers, participants, totalExpenses, onAdd, onRemove }: PayersSectionProps) {
  const [selectedPayer, setSelectedPayer] = useState('');
  const [amount, setAmount] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { t, language } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPayer && amount) {
      onAdd({
        name: selectedPayer,
        amount: parseFloat(amount),
      });
      setSelectedPayer('');
      setAmount('');
    }
  };

  const totalPaid = payers.reduce((sum, p) => sum + p.amount, 0);
  const isBalanced = Math.abs(totalPaid - totalExpenses) < 0.01;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(language === 'fa' ? 'fa-IR' : 'en-US').format(num);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-accent mb-4">
          <CreditCard className="w-8 h-8 text-accent-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">{t('payers')}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={cn(
                "w-full h-12 px-4 text-start bg-background border border-input rounded-lg flex items-center justify-between transition-colors",
                "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              )}
            >
              <span className={cn(!selectedPayer && "text-muted-foreground")}>
                {selectedPayer || t('selectPayer')}
              </span>
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 left-0 right-0 bg-popover border border-border rounded-xl shadow-lg z-50 overflow-hidden"
                >
                  <div className="max-h-48 overflow-y-auto p-2">
                    {participants.map((participant) => (
                      <button
                        key={participant}
                        type="button"
                        onClick={() => {
                          setSelectedPayer(participant);
                          setIsDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-start",
                          selectedPayer === participant
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted"
                        )}
                      >
                        <span className="text-sm font-medium">{participant}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={t('amountPaid')}
            className="h-12"
            min="0"
          />
        </div>

        <Button
          type="submit"
          disabled={!selectedPayer || !amount}
          className="w-full h-12 gradient-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5 me-2" />
          {t('addPayer')}
        </Button>
      </form>

      <div className="space-y-3">
        {payers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border rounded-xl">
            <CreditCard className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">{t('noPayers')}</p>
          </div>
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              {payers.map((payer, index) => (
                <motion.div
                  key={`${payer.name}-${index}`}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-4 bg-secondary rounded-xl border border-border"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-secondary-foreground">{payer.name}</p>
                    <p className="text-sm text-muted-foreground">{t('paid')}</p>
                  </div>
                  <div className="flex items-center gap-3 ms-4">
                    <span className="font-bold text-primary whitespace-nowrap">
                      {formatNumber(payer.amount)} {t('currency')}
                    </span>
                    <button
                      onClick={() => onRemove(index)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl border border-primary/30">
              <span className="font-medium text-foreground">{t('totalPaid')}</span>
              <span className="font-bold text-lg text-primary">
                {formatNumber(totalPaid)} {t('currency')}
              </span>
            </div>

            {totalExpenses > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border",
                  isBalanced
                    ? "bg-success/10 border-success/30 text-success"
                    : "bg-warning/10 border-warning/30 text-warning"
                )}
              >
                {isBalanced ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                )}
                <span className="text-sm font-medium">
                  {isBalanced ? t('balanceOk') : t('balanceWarning')}
                </span>
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
