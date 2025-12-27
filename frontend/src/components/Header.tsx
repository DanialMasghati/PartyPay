import { motion } from 'framer-motion';
import { Moon, Sun, Languages, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 glass border-b border-border/50"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Wallet className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{t('appName')}</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">{t('appTagline')}</p>
          </div>
        </motion.div>

        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLanguage(language === 'en' ? 'fa' : 'en')}
              className="relative overflow-hidden"
            >
              <Languages className="w-5 h-5" />
              <span className="absolute -bottom-1 text-[10px] font-bold text-primary">
                {language === 'en' ? 'FA' : 'EN'}
              </span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="relative"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 transition-transform" />
              ) : (
                <Sun className="w-5 h-5 transition-transform" />
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
