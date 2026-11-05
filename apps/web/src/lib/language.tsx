import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Language = 'id' | 'en';
type LanguageContextValue = { language: Language; setLanguage: (next: Language) => void; en: boolean; pick: (id: string, en: string) => string };
const LanguageContext = createContext<LanguageContextValue | null>(null);
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Indonesian is the default for first-time visitors. The choice is kept on-device.
  const [language, setLanguageState] = useState<Language>('id');
  useEffect(() => {
    try { if (localStorage.getItem('snbm_language') === 'en') setLanguageState('en'); } catch { /* storage unavailable */ }
  }, []);
  const setLanguage = (next: Language) => {
    setLanguageState(next);
    try { localStorage.setItem('snbm_language', next); } catch { /* storage unavailable */ }
    document.documentElement.lang = next;
  };
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  const value = useMemo(() => ({ language, setLanguage, en: language === 'en', pick: (id: string, english: string) => language === 'en' ? english : id }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}