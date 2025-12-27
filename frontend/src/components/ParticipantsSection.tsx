import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';

interface ParticipantsSectionProps {
  participants: string[];
  onAdd: (name: string) => void;
  onRemove: (name: string) => void;
}

export function ParticipantsSection({ participants, onAdd, onRemove }: ParticipantsSectionProps) {
  const [name, setName] = useState('');
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && !participants.includes(name.trim())) {
      onAdd(name.trim());
      setName('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
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
          <Users className="w-8 h-8 text-accent-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">{t('participants')}</h2>
        <p className="text-muted-foreground">{t('noParticipants')}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('enterName')}
          className="flex-1 h-12 text-base"
        />
        <Button
          type="submit"
          disabled={!name.trim()}
          className="h-12 px-6 gradient-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5 me-2" />
          {t('add')}
        </Button>
      </form>

      <div className="min-h-[120px]">
        {participants.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border rounded-xl">
            <Users className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">{t('noParticipants')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {participants.length} {t('participantsCount')}
            </p>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence mode="popLayout">
                {participants.map((participant) => (
                  <motion.div
                    key={participant}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="group flex items-center gap-2 bg-secondary px-4 py-2 rounded-full border border-border hover:border-primary/50 transition-colors"
                  >
                    <span className="text-sm font-medium text-secondary-foreground">{participant}</span>
                    <button
                      onClick={() => onRemove(participant)}
                      className="w-5 h-5 flex items-center justify-center rounded-full bg-muted hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
