import { useRef, useEffect, useContext } from 'react';
import { useTheme } from './hooks';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Markdown from './components/Markdown';
import Preview from './components/Preview';
import Resizer from './components/Resizer';
import styles from './App.module.scss';
import { useDocumentsStore } from './store/documents.store';
import { ViewportContext } from './context/viewport.context';
import { useLayoutStore } from './store/layout.store';

export default function App() {
  const extendedContainer = useLayoutStore((state) => state.extendedContainer);
  const activeDocumentPath = useDocumentsStore((state) => state.activeDocumentPath);
  const { viewportWidth } = useContext(ViewportContext);
  const { theme, toggleTheme } = useTheme();

  const mainRef = useRef<HTMLElement>(null);
  const sidebarHamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let keyPressed: Record<string, boolean> = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      keyPressed[e.key] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keyPressed[e.key] = false;
      keyPressed = {};
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    document.title = `${activeDocumentPath} | Markdown Editor`;
  }, [activeDocumentPath]);

  return (
    <div className={styles.layout}>
      <Sidebar
        className={styles.sidebar}
        theme={theme}
        onThemeToggle={toggleTheme}
        sidebarHamburgerRef={sidebarHamburgerRef}
      />
      <Header className={styles.header} sidebarHamburgerRef={sidebarHamburgerRef} />
      <main
        ref={mainRef}
        className={styles.main}
        style={viewportWidth <= 350 ? { minWidth: viewportWidth } : undefined}
      >
        <Markdown className={styles.markdown} />
        <Resizer containerRef={mainRef} />
        {extendedContainer !== 'markdown' && <Preview className={styles.preview} />}
      </main>
    </div>
  );
}
