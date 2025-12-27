import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Receipt, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Expense {
  item: string;
  amount: number;
  consumers: string[];
}

interface ExpensesSectionProps {
  expenses: Expense[];
  participants: string[];
  onAdd: (expense: Expense) => void;
  onRemove: (index: number) => void;
}

export function ExpensesSection({ expenses, participants, onAdd, onRemove }: ExpensesSectionProps) {
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedConsumers, setSelectedConsumers] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { t, language } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (item.trim() && amount && selectedConsumers.length > 0) {
      onAdd({
        item: item.trim(),
        amount: parseFloat(amount),
        consumers: selectedConsumers,
      });
      setItem('');
      setAmount('');
      setSelectedConsumers([]);
    }
  };

  const toggleConsumer = (consumer: string) => {
    setSelectedConsumers(prev =>
      prev.includes(consumer)
        ? prev.filter(c => c !== consumer)
        : [...prev, consumer]
    );
  };

  const selectAll = () => setSelectedConsumers([...participants]);
  const clearAll = () => setSelectedConsumers([]);

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

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
          <Receipt className="w-8 h-8 text-accent-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">{t('expenses')}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder={t('itemNamePlaceholder')}
            className="h-12"
          />
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={t('amount')}
            className="h-12"
            min="0"
          />
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={cn(
              "w-full h-12 px-4 text-start bg-background border border-input rounded-lg flex items-center justify-between transition-colors",
              "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            )}
          >
            <span className={cn(selectedConsumers.length === 0 && "text-muted-foreground")}>
              {selectedConsumers.length === 0
                ? t('selectConsumers')
                : `${selectedConsumers.length} ${t('selected')}`}
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
                <div className="flex gap-2 p-3 border-b border-border bg-muted/50">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={selectAll}
                    className="flex-1"
                  >
                    {t('selectAll')}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                    className="flex-1"
                  >
                    {t('clearAll')}
                  </Button>
                </div>
                <div className="max-h-48 overflow-y-auto p-2">
                  {participants.map((participant) => (
                    <button
                      key={participant}
                      type="button"
                      onClick={() => toggleConsumer(participant)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                        selectedConsumers.includes(participant)
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      )}
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                          selectedConsumers.includes(participant)
                            ? "bg-primary border-primary"
                            : "border-muted-foreground"
                        )}
                      >
                        {selectedConsumers.includes(participant) && (
                          <Check className="w-3 h-3 text-primary-foreground" />
                        )}
                      </div>
                      <span className="text-sm font-medium">{participant}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button
          type="submit"
          disabled={!item.trim() || !amount || selectedConsumers.length === 0}
          className="w-full h-12 gradient-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5 me-2" />
          {t('addExpense')}
        </Button>
      </form>

      <div className="space-y-3">
        {expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border rounded-xl">
            <Receipt className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">{t('noExpenses')}</p>
          </div>
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              {expenses.map((expense, index) => (
                <motion.div
                  key={`${expense.item}-${index}`}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-4 bg-secondary rounded-xl border border-border"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-secondary-foreground truncate">{expense.item}</p>
                    <p className="text-sm text-muted-foreground">
                      {expense.consumers.join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ms-4">
                    <span className="font-bold text-primary whitespace-nowrap">
                      {formatNumber(expense.amount)} {t('currency')}
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
              <span className="font-medium text-foreground">{t('totalExpenses')}</span>
              <span className="font-bold text-lg text-primary">
                {formatNumber(totalExpenses)} {t('currency')}
              </span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
