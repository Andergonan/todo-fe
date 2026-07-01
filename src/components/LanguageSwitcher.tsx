import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { LANGUAGES, LANGUAGE_STORAGE_KEY, type Language } from '../i18n/i18n';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckIcon, ChevronDownIcon } from '@hugeicons/core-free-icons';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.resolvedLanguage as Language;
  const currentLanguageLabel = LANGUAGES[currentLanguage];

  const handleChangeLanguage = (language: Language) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    void i18n.changeLanguage(language);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="gap-2">
          {currentLanguageLabel}
          <HugeiconsIcon className="text-xs text-muted-foreground" icon={ChevronDownIcon} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {Object.entries(LANGUAGES).map(([language, label]) => {
          const typedLanguage = language as Language;
          const isActive = currentLanguage === typedLanguage;

          return (
            <DropdownMenuItem
              key={language}
              onSelect={() => handleChangeLanguage(typedLanguage)}
              className="dropdownMenuItem flex items-center justify-between gap-4"
            >
              <span>{label}</span>
              {isActive && <HugeiconsIcon icon={CheckIcon} />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
