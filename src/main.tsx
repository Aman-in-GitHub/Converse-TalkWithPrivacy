import ReactDOM from 'react-dom/client';
import { NextUIProvider } from '@nextui-org/react';
import { Toaster } from 'sonner';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <NextUIProvider>
    <Toaster richColors={true} position="top-center" expand={true} />
    <App />
  </NextUIProvider>
);
