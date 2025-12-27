import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Heart } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="py-8 mt-12 border-t border-border/50"
    >
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5 flex-wrap">
          <span>{t('madeWith')}</span>
          <Heart className="w-4 h-4 text-destructive fill-destructive animate-pulse" />
          <span>{t('forFriendships')}</span>
          <a
            href="https://github.com/DanialMasghati"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
          >
            DanialMasghati
          </a>
        </p>
      </div>
    </motion.footer>
  );
}
