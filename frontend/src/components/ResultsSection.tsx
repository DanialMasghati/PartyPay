import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Loader2, AlertCircle, RefreshCw, Camera, Share2, Download, Sparkles, ArrowRight, ChevronDown } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

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

interface ResultsSectionProps {
  result: ResultData | null;
  isLoading: boolean;
  error: string | null;
  onCalculate: () => void;
  canCalculate: boolean;
}

const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US');
};

export function ResultsSection({ result, isLoading, error, onCalculate, canCalculate }: ResultsSectionProps) {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const resultRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isReasoningOpen, setIsReasoningOpen] = useState(false);

  const captureImage = async (): Promise<Blob | null> => {
    if (!resultRef.current) return null;
    
    setIsCapturing(true);
    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png', 1.0);
      });
    } catch (err) {
      console.error('Error capturing image:', err);
      return null;
    } finally {
      setIsCapturing(false);
    }
  };

  const handleDownload = async () => {
    const blob = await captureImage();
    if (!blob) {
      toast({ title: t('error'), variant: 'destructive' });
      return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `partypay-result-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({ title: t('downloadSuccess') });
  };

  const handleShare = async () => {
    const blob = await captureImage();
    if (!blob) {
      toast({ title: t('error'), variant: 'destructive' });
      return;
    }

    const file = new File([blob], 'partypay-result.png', { type: 'image/png' });

    if (navigator.share && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: t('appName'),
          text: t('shareText'),
          files: [file],
        });
        toast({ title: t('shareSuccess') });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          handleDownload();
        }
      }
    } else {
      handleDownload();
    }
  };

  const handleCopyImage = async () => {
    const blob = await captureImage();
    if (!blob) {
      toast({ title: t('error'), variant: 'destructive' });
      return;
    }

    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      toast({ title: t('copySuccess') });
    } catch (err) {
      handleDownload();
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
          <Calculator className="w-8 h-8 text-accent-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">{t('results')}</h2>
      </div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={onCalculate}
          disabled={!canCalculate || isLoading}
          className="w-full h-14 text-lg font-semibold gradient-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-glow"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-6 h-6 me-3 animate-spin" />
              {t('calculating')}
            </>
          ) : (
            <>
              <Calculator className="w-6 h-6 me-3" />
              {t('calculate')}
            </>
          )}
        </Button>
      </motion.div>

      <div className="min-h-[200px]">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-6 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive"
          >
            <AlertCircle className="w-12 h-12 mb-4" />
            <p className="font-medium text-center mb-4">{error}</p>
            <Button
              variant="outline"
              onClick={onCalculate}
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <RefreshCw className="w-4 h-4 me-2" />
              {t('tryAgain')}
            </Button>
          </motion.div>
        )}

        {!result && !error && !isLoading && (
          <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-xl">
            <Calculator className="w-12 h-12 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground text-center">{t('noResults')}</p>
          </div>
        )}

        {result && !error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onAnimationComplete={() => setShowActions(true)}
            className="space-y-4"
          >
            {/* Capturable Result Card */}
            <div
              ref={resultRef}
              className="p-6 bg-card rounded-xl border border-border shadow-card"
              style={{ direction: language === 'fa' ? 'rtl' : 'ltr' }}
            >
              {/* Branding Header for Screenshot */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  {t('resultTitle')}
                </h3>
                <span className="text-xs text-muted-foreground font-medium px-2 py-1 bg-muted rounded-full">
                  PartyPay ✨
                </span>
              </div>

              {/* Results Table */}
              <div className="mb-6 rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">{t('person')}</TableHead>
                      <TableHead className="font-semibold text-center">{t('share')}</TableHead>
                      <TableHead className="font-semibold text-center">{t('paidAmount')}</TableHead>
                      <TableHead className="font-semibold text-center">{t('finalBalance')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.table.map((row, index) => (
                      <TableRow key={index} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell className="text-center">{formatNumber(row.share)}</TableCell>
                        <TableCell className="text-center">{formatNumber(row.paid)}</TableCell>
                        <TableCell className="text-center">
                          <span className={`font-semibold px-2 py-1 rounded-md ${
                            row.balance > 0 
                              ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30' 
                              : row.balance < 0 
                                ? 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
                                : 'text-muted-foreground'
                          }`}>
                            {row.balance > 0 ? '+' : ''}{formatNumber(row.balance)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Settlement Plan - Most Important */}
              {result.settlements.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-foreground mb-3 flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-primary" />
                    {t('settlementPlan')}
                  </h4>
                  <div className="grid gap-3">
                    {result.settlements.map((settlement, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl border border-primary/20 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-foreground bg-muted px-3 py-1.5 rounded-lg">
                            {settlement.from}
                          </span>
                          <div className="flex items-center gap-1 text-primary">
                            <ArrowRight className="w-5 h-5" />
                          </div>
                          <span className="font-semibold text-foreground bg-muted px-3 py-1.5 rounded-lg">
                            {settlement.to}
                          </span>
                        </div>
                        <span className="text-lg font-bold text-primary">
                          {formatNumber(settlement.amount)}
                          {t('currency') && <span className="text-sm ms-1">{t('currency')}</span>}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer Branding */}
              <div className="mt-4 pt-3 border-t border-border/50 text-center">
                <p className="text-xs text-muted-foreground">
                  {t('appTagline')} • partypay.app
                </p>
              </div>
            </div>

            {/* Reasoning Accordion - Outside Screenshot Area */}
            {result.reasoning && (
              <Collapsible open={isReasoningOpen} onOpenChange={setIsReasoningOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/50 rounded-lg border border-border"
                  >
                    <span className="font-medium text-muted-foreground">{t('viewDetails')}</span>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isReasoningOpen ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 p-4 bg-muted/30 rounded-lg border border-border text-sm text-muted-foreground whitespace-pre-wrap"
                  >
                    {result.reasoning}
                  </motion.div>
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Share Actions */}
            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap items-center justify-center gap-3"
                >
                  <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleCopyImage}
                      disabled={isCapturing}
                      variant="outline"
                      className="gap-2 px-4 py-2 rounded-full border-primary/30 hover:border-primary hover:bg-primary/10 transition-all"
                    >
                      {isCapturing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4 text-primary" />}
                      <span>{t('copyImage')}</span>
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleDownload}
                      disabled={isCapturing}
                      variant="outline"
                      className="gap-2 px-4 py-2 rounded-full border-primary/30 hover:border-primary hover:bg-primary/10 transition-all"
                    >
                      <Download className="w-4 h-4 text-primary" />
                      <span>{t('downloadImage')}</span>
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleShare}
                      disabled={isCapturing}
                      className="gap-2 px-5 py-2 rounded-full gradient-primary text-primary-foreground shadow-md hover:shadow-glow transition-all"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>{t('shareResult')}</span>
                      <Sparkles className="w-3 h-3" />
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
