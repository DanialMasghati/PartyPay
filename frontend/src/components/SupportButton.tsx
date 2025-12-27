import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Heart, Sparkles, ExternalLink } from 'lucide-react';

// Support link - can be changed later
const SUPPORT_LINK = 'https://github.com/DanialMasghati';

export function SupportButton() {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5, type: 'spring', stiffness: 100 }}
      className="flex justify-center mt-6"
    >
      <a
        href={SUPPORT_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group"
      >
        {/* Animated glow rings */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/30 blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20 blur-2xl"
          animate={{
            scale: [1.2, 1.5, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.3,
          }}
        />

        {/* Main button */}
        <motion.div
          whileHover={{ scale: 1.08, y: -3 }}
          whileTap={{ scale: 0.95 }}
          className="relative overflow-hidden gradient-primary text-primary-foreground px-7 py-3.5 rounded-full font-semibold shadow-lg cursor-pointer"
        >
          {/* Animated shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
            animate={{
              x: ['-150%', '150%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 2,
              ease: 'easeInOut',
            }}
          />

          {/* Floating particles */}
          <motion.div
            className="absolute top-1 left-4 w-1 h-1 bg-white/60 rounded-full"
            animate={{
              y: [-2, -8, -2],
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0,
            }}
          />
          <motion.div
            className="absolute top-2 right-6 w-1.5 h-1.5 bg-white/50 rounded-full"
            animate={{
              y: [-2, -10, -2],
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: 0.5,
            }}
          />
          <motion.div
            className="absolute bottom-2 left-8 w-1 h-1 bg-white/40 rounded-full"
            animate={{
              y: [2, -6, 2],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              delay: 1,
            }}
          />

          {/* Button content */}
          <span className="relative flex items-center gap-2.5">
            {/* Animated heart */}
            <motion.span
              animate={{
                scale: [1, 1.25, 1],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatDelay: 0.5,
                ease: 'easeInOut',
              }}
            >
              <Heart className="w-5 h-5 fill-current" />
            </motion.span>

            <span className="text-sm sm:text-base">{t('supportProject')}</span>

            {/* Rotating sparkles */}
            <motion.span
              animate={{
                rotate: [0, 180, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.span>
          </span>

          {/* Hover border glow */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white/0 group-hover:border-white/30 transition-colors duration-300"
          />
        </motion.div>

        {/* External link indicator on hover */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileHover={{ opacity: 1, scale: 1 }}
          className="absolute -top-1 -right-1 bg-card border border-border rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <ExternalLink className="w-3 h-3 text-primary" />
        </motion.div>
      </a>
    </motion.div>
  );
}
