import { useRef, useState, useEffect } from 'react';
import { DocumentType, ThemeType } from './types';
import { initializeDocuments } from './helpers';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Markdown from './components/Markdown';
import Preview from './components/Preview';
import styles from './App.module.scss';

export default function App() {
  const [documents, setDocuments] = useState<DocumentType[]>(initializeDocuments);
  const [currentDocument, setCurrentDocument] = useState(1);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMarkdownHidden, setIsMarkdownHidden] = useState(false);
  const [theme, setTheme] = useState<ThemeType>('dark');
  const mainRef = useRef<HTMLElement>(null);
  const markdownRef = useRef<HTMLTextAreaElement>(null);

  const currentDocumentData = documents[currentDocument];

  useEffect(() => {
    document.title = `${currentDocumentData.name} | Markdown Editor`;
  }, [currentDocumentData]);

  useEffect(() => {
    markdownRef.current?.focus();
  }, [currentDocument]);

  useEffect(() => {
    document.body.classList.add(theme);
    document.body.classList.remove(theme === 'dark' ? 'light' : 'dark');
  }, [theme]);

  const handleMarkdownEdit = (content: string) => {
    setDocuments((state) => {
      return [
        ...state.slice(0, currentDocument),
        { ...state[currentDocument], content },
        ...state.slice(currentDocument + 1),
      ];
    });
  };

  const handleCreateDocument = (name: string) => {
    setDocuments((state) => {
      return [{ name: name + '.md', createdAt: new Date(), content: '' }, ...state];
    });
    setCurrentDocument(0);
  };

  const handleDeleteDocument = () => {
    setCurrentDocument((currentDocumentState) => {
      setDocuments((documentsState) => {
        return [
          ...documentsState.slice(0, currentDocumentState),
          ...documentsState.slice(currentDocumentState + 1),
        ];
      });

      return Math.max(currentDocumentState - 1, 0);
    });
  };

  return (
    <div className={styles.layout}>
      <Sidebar
        className={styles.sidebar}
        isExpanded={isSidebarExpanded}
        documents={documents}
        currentDocument={currentDocument}
        theme={theme}
        onThemeToggle={() =>
          setTheme((state) => (state === 'light' ? 'dark' : 'light'))
        }
        onOpenDocument={(index) => setCurrentDocument(index)}
        onCreateDocument={handleCreateDocument}
        onDeleteDocument={handleDeleteDocument}
      />
      <Header
        className={styles.header}
        document={currentDocumentData}
        isSidebarExpanded={isSidebarExpanded}
        onSidebarToggle={() => setIsSidebarExpanded((state) => !state)}
        onDeleteDocument={handleDeleteDocument}
      />
      <main ref={mainRef} className={styles.main}>
        <Markdown
          content={currentDocumentData.content}
          onEdit={handleMarkdownEdit}
          containerRef={mainRef}
          setIsMarkdownHidden={setIsMarkdownHidden}
          textareaRef={markdownRef}
          className={styles.markdown}
          style={isMarkdownHidden ? { width: 0 } : undefined}
        />
        <Preview
          className={styles.preview}
          markdownContent={currentDocumentData.content}
          isMarkdownHidden={isMarkdownHidden}
          onToggleMarkdown={() => setIsMarkdownHidden((state) => !state)}
        />
      </main>
    </div>
  );
}
