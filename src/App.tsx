import { useEffect, useRef, useState } from 'react';
import { DocumentType } from './types';
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
  const [isResizing, setIsResizing] = useState(false);
  const [markdownSize, setMarkdownSize] = useState(50);
  const mainRef = useRef<HTMLElement>(null);

  const currentDocumentData = documents[currentDocument];

  const handleMarkdownEdit = (content: string) => {
    setDocuments((state) => {
      return [
        ...state.slice(0, currentDocument),
        { ...state[currentDocument], content },
        ...state.slice(currentDocument + 1),
      ];
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const container = mainRef.current;

      if (container) {
        setMarkdownSize(
          ((e.pageX - container.offsetLeft) / container.clientWidth) * 100
        );
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className={styles.layout}>
      <Sidebar
        className={styles.sidebar}
        isExpanded={isSidebarExpanded}
        documents={documents}
        onOpenDocument={(index) => setCurrentDocument(index)}
      />
      <Header
        className={styles.header}
        document={currentDocumentData}
        isSidebarExpanded={isSidebarExpanded}
        onSidebarToggle={() => setIsSidebarExpanded((state) => !state)}
      />
      <main ref={mainRef} className={styles.main}>
        <Markdown
          content={currentDocumentData.content}
          onEdit={handleMarkdownEdit}
          className={styles.markdown}
          style={{ width: markdownSize + '%' }}
        />
        <div className={styles.resize} onMouseDown={() => setIsResizing(true)} />
        <Preview
          className={styles.preview}
          markdownContent={currentDocumentData.content}
        />
      </main>
    </div>
  );
}
