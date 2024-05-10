import React from 'react';
import ReactDOM from 'react-dom/client';
import { MenuContextProvider } from './context/menu.context.tsx';
import App from './App.tsx';
import './global.scss';
import { ViewportContextProvider } from './context/viewport.context.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ViewportContextProvider>
      <MenuContextProvider>
        <App />
      </MenuContextProvider>
    </ViewportContextProvider>
  </React.StrictMode>
);
