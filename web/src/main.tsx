import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);

const cap = (window as any).Capacitor
if (cap?.isNativePlatform?.()) {
  cap.Plugins?.CapacitorUpdater?.notifyAppReady?.().catch(() => {})
}
