import { useTranslation } from 'react-i18next';
import { Spinner } from './ui/spinner';
import { cn } from '@/lib/utils';

type LoaderProps = {
  isCenter?: boolean;
  text?: string;
};

export function Loader({ isCenter = false, text = 'common.loading' }: LoaderProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'flex items-center gap-2 text-sm text-muted-foreground',
        isCenter && 'justify-center'
      )}
    >
      <Spinner /> {t(text)}
    </div>
  );
}

export default Loader;
