import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './global.scss';
import { MenuContextProvider } from './context/menu.context.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MenuContextProvider>
      <App />
    </MenuContextProvider>
  </React.StrictMode>
);
