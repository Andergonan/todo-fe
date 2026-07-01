import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export function Header() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <span className="text-xl font-extrabold text-foreground">{t('common.appTitle')}</span>
        <LanguageSwitcher />
      </div>
    </header>
  );
}

export default Header;
