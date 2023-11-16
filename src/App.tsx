import { useState } from 'react';
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
      <main className={styles.main}>
        <Markdown
          content={currentDocumentData.content}
          onEdit={handleMarkdownEdit}
          className={styles.markdown}
        />
        <div className={styles.resize} />
        <Preview className={styles.preview} />
      </main>
    </div>
  );
}
