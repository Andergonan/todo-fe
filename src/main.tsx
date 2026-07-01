import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './app/store.ts';
import './i18n/i18n';
import './index.css';
import { TooltipProvider } from './components/ui/tooltip.tsx';
import { Toaster } from './components/ui/sonner.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <TooltipProvider>
        <Toaster richColors position="top-center" />
        <App />
      </TooltipProvider>
    </Provider>
  </StrictMode>
);
