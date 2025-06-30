import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* Logo - Positioned at the far right with increased scale */}
<div className="flex items-center ml-4 mt-10">
  <img 
    src="/logo.png" 
    alt="CreatorFlow Logo" 
    className="h-14 w-auto sm:h-16 md:h-20 lg:h-24 xl:h-28 object-contain transition-all duration-200 hover:scale-110"
    style={{ marginRight: '-1rem' }}
    onError={(e) => {
      // Fallback if logo doesn't load
      e.currentTarget.style.display = 'none';
    }}
  />
</div>
  </StrictMode>
);
