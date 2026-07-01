import { useEffect } from 'react';
import Header from './components/Header';
import TaskList from './features/tasks/components/TaskList';
import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.resolvedLanguage ?? i18n.language;

  useEffect(() => {
    document.title = t('common.appTitle');
    document.documentElement.lang = currentLanguage;
  }, [t, currentLanguage]);

  return (
    <main className="min-h-svh bg-background text-foreground">
      <Header />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6">
        <TaskList />
      </div>
    </main>
  );
}

export default App;
