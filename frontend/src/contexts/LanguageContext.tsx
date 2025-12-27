import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'fa';

interface Translations {
  [key: string]: {
    en: string;
    fa: string;
  };
}

const translations: Translations = {
  // App
  appName: { en: 'PartyPay', fa: 'پارتی‌پی' },
  appTagline: { en: 'Split bills, not friendships', fa: 'هزینه‌ها رو تقسیم کن، نه دوستی‌ها' },
  
  // Header
  darkMode: { en: 'Dark', fa: 'تاریک' },
  lightMode: { en: 'Light', fa: 'روشن' },
  
  // Steps
  step: { en: 'Step', fa: 'مرحله' },
  participants: { en: 'Participants', fa: 'شرکت‌کنندگان' },
  expenses: { en: 'Expenses', fa: 'هزینه‌ها' },
  payers: { en: 'Payers', fa: 'پرداخت‌کنندگان' },
  results: { en: 'Results', fa: 'نتایج' },
  
  // Participants
  addParticipant: { en: 'Add participant', fa: 'افزودن شرکت‌کننده' },
  participantName: { en: 'Name', fa: 'نام' },
  addName: { en: 'Add', fa: 'افزودن' },
  noParticipants: { en: 'Add people who were at the party', fa: 'افرادی که در مهمانی بودند را اضافه کنید' },
  participantsCount: { en: 'participants', fa: 'نفر' },
  enterName: { en: 'Enter a name...', fa: 'نام را وارد کنید...' },
  
  // Expenses
  addExpense: { en: 'Add expense', fa: 'افزودن هزینه' },
  itemName: { en: 'Item name', fa: 'نام آیتم' },
  amount: { en: 'Amount', fa: 'مبلغ' },
  consumers: { en: 'Consumers', fa: 'مصرف‌کنندگان' },
  selectConsumers: { en: 'Select consumers', fa: 'مصرف‌کنندگان را انتخاب کنید' },
  selectAll: { en: 'Select all', fa: 'انتخاب همه' },
  clearAll: { en: 'Clear all', fa: 'پاک کردن همه' },
  noExpenses: { en: 'No expenses added yet', fa: 'هنوز هزینه‌ای اضافه نشده' },
  totalExpenses: { en: 'Total expenses', fa: 'مجموع هزینه‌ها' },
  itemNamePlaceholder: { en: 'e.g., Pizza', fa: 'مثلاً پیتزا' },
  
  // Payers
  addPayer: { en: 'Add payment', fa: 'افزودن پرداخت' },
  payerName: { en: 'Payer', fa: 'پرداخت‌کننده' },
  amountPaid: { en: 'Amount paid', fa: 'مبلغ پرداختی' },
  selectPayer: { en: 'Select payer', fa: 'پرداخت‌کننده را انتخاب کنید' },
  noPayers: { en: 'No payments recorded yet', fa: 'هنوز پرداختی ثبت نشده' },
  totalPaid: { en: 'Total paid', fa: 'مجموع پرداخت‌ها' },
  balanceWarning: { en: 'Total paid does not match total expenses!', fa: 'مجموع پرداخت‌ها با مجموع هزینه‌ها برابر نیست!' },
  balanceOk: { en: 'Balance is correct ✓', fa: 'تراز صحیح است ✓' },
  
  // Results
  calculate: { en: 'Calculate', fa: 'محاسبه کن' },
  calculating: { en: 'Calculating...', fa: 'در حال محاسبه...' },
  noResults: { en: 'Click calculate to see the results', fa: 'برای مشاهده نتایج روی محاسبه کلیک کنید' },
  resultTitle: { en: 'Settlement Summary', fa: 'خلاصه تسویه' },
  error: { en: 'An error occurred', fa: 'خطایی رخ داد' },
  tryAgain: { en: 'Try again', fa: 'تلاش مجدد' },
  
  // Table Headers
  person: { en: 'Person', fa: 'شخص' },
  share: { en: 'Share (Cost)', fa: 'سهم (هزینه)' },
  paidAmount: { en: 'Paid', fa: 'پرداختی' },
  finalBalance: { en: 'Final Balance', fa: 'مانده نهایی' },
  
  // Settlement
  settlementPlan: { en: 'Settlement Plan', fa: 'برنامه تسویه' },
  viewDetails: { en: 'View Calculation Details', fa: 'مشاهده جزئیات محاسبه' },
  
  // Validation
  addParticipantsFirst: { en: 'Please add participants first', fa: 'لطفاً ابتدا شرکت‌کنندگان را اضافه کنید' },
  addExpensesFirst: { en: 'Please add at least one expense', fa: 'لطفاً حداقل یک هزینه اضافه کنید' },
  addPayersFirst: { en: 'Please add at least one payment', fa: 'لطفاً حداقل یک پرداخت اضافه کنید' },
  
  // Common
  add: { en: 'Add', fa: 'افزودن' },
  remove: { en: 'Remove', fa: 'حذف' },
  next: { en: 'Next', fa: 'بعدی' },
  previous: { en: 'Previous', fa: 'قبلی' },
  selected: { en: 'selected', fa: 'انتخاب شده' },
  currency: { en: '', fa: 'تومان' },
  paid: { en: 'paid', fa: 'پرداخت کرد' },
  
  // Footer
  madeWith: { en: 'Made with', fa: 'ساخته شده با' },
  forFriendships: { en: 'for all lasting friendships by', fa: 'برای تمام رفاقت‌های پایدار توسط' },
  
  // Support
  supportProject: { en: 'Support Project', fa: 'حمایت از پروژه' },
  supportComingSoon: { en: 'Coming Soon!', fa: 'به زودی!' },
  supportComingSoonDesc: { en: 'Payment integration will be available soon.', fa: 'امکان پرداخت به زودی فعال می‌شود.' },
  
  // Share & Screenshot
  copyImage: { en: 'Copy', fa: 'کپی' },
  downloadImage: { en: 'Download', fa: 'دانلود' },
  shareResult: { en: 'Share', fa: 'اشتراک‌گذاری' },
  shareText: { en: 'Check out our party expense split!', fa: 'تقسیم هزینه‌های مهمانی ما رو ببین!' },
  downloadSuccess: { en: 'Image downloaded successfully!', fa: 'تصویر با موفقیت دانلود شد!' },
  shareSuccess: { en: 'Shared successfully!', fa: 'با موفقیت به اشتراک گذاشته شد!' },
  copySuccess: { en: 'Image copied to clipboard!', fa: 'تصویر در کلیپ‌بورد کپی شد!' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const dir = language === 'fa' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
