import { useRef, useState, useEffect, useContext } from 'react';
import { DocumentsContext } from './context/documents.context';
import { ExtendedContainerType } from './types';
import { useLocalStorageState, useTheme, useWindowDimensions } from './hooks';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Markdown from './components/Markdown';
import Preview from './components/Preview';
import Resizer from './components/Resizer';
import styles from './App.module.scss';

export default function App() {
  const { documents, currentDocument, onMarkdownEdit } =
    useContext(DocumentsContext);
  const { theme, setTheme } = useTheme();
  const [isSidebarExpanded, setIsSidebarExpanded] = useLocalStorageState(
    'markdown-sidebar',
    false
  );
  const [extendedContainer, setExtendedContainer] =
    useLocalStorageState<ExtendedContainerType>('markdown-extended-container', null);
  const [resizerPercentage, setResizerPercentage] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [isKeyboardResizing, setIsKeyboardResizing] = useState(false);
  const [windowWidth] = useWindowDimensions();
  const mainRef = useRef<HTMLElement>(null);
  const markdownRef = useRef<HTMLTextAreaElement>(null);
  const sidebarHamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.title = `${documents[currentDocument].name} | Markdown Editor`;
  }, [documents, currentDocument]);

  useEffect(() => {
    markdownRef.current?.focus();
  }, [currentDocument]);

  return (
    <div className={styles.layout}>
      <Sidebar
        className={styles.sidebar}
        isExpanded={isSidebarExpanded}
        theme={theme}
        setIsSidebarExtended={setIsSidebarExpanded}
        onThemeToggle={() =>
          setTheme((state) => (state === 'light' ? 'dark' : 'light'))
        }
        windowWidth={windowWidth}
        sidebarHamburgerRef={sidebarHamburgerRef}
      />
      <Header
        className={styles.header}
        isSidebarExpanded={isSidebarExpanded}
        onSidebarToggle={() => setIsSidebarExpanded((state) => !state)}
        windowWidth={windowWidth}
        sidebarHamburgerRef={sidebarHamburgerRef}
        style={windowWidth <= 350 ? { minWidth: windowWidth } : undefined}
      />
      <main
        ref={mainRef}
        className={styles.main}
        style={windowWidth <= 350 ? { minWidth: windowWidth } : undefined}
      >
        <Markdown
          content={documents[currentDocument].content}
          onEdit={onMarkdownEdit}
          textareaRef={markdownRef}
          className={styles.markdown}
          isExtended={extendedContainer === 'markdown'}
          onToggleExtend={() =>
            setExtendedContainer((state) =>
              state === 'markdown' ? null : 'markdown'
            )
          }
          style={{
            width:
              extendedContainer === 'markdown'
                ? '100%'
                : extendedContainer === 'preview'
                ? 0
                : resizerPercentage + '%',
            transition: isResizing ? undefined : 'width 200ms',
          }}
        />

        <Resizer
          containerRef={mainRef}
          setResizerPercentage={setResizerPercentage}
          setExtendedContainer={setExtendedContainer}
          isResizing={isResizing}
          setIsResizing={setIsResizing}
          isKeyboardResizing={isKeyboardResizing}
          setIsKeyboardResizing={setIsKeyboardResizing}
        />
        {extendedContainer !== 'markdown' && (
          <Preview
            className={styles.preview}
            markdownContent={documents[currentDocument].content}
            isExtended={extendedContainer === 'preview'}
            onToggleExtend={() =>
              setExtendedContainer((state) => (state === null ? 'preview' : null))
            }
          />
        )}
      </main>
    </div>
  );
}
