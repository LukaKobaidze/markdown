import { useState } from 'react';
import styles from './App.module.scss';
import Header from '@/components/Header';
import Sidebar from './components/Sidebar';
import { DocumentType } from './types';
import { initializeDocuments } from './helpers';

export default function App() {
  const [documents, setDocuments] = useState<DocumentType[]>(initializeDocuments);
  const [currentDocument, setCurrentDocument] = useState(0);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const currentDocumentData = documents[currentDocument];

  return (
    <div className={styles.layout}>
      <Sidebar className={styles.sidebar} isExpanded={isSidebarExpanded} />
      <Header
        className={styles.header}
        document={currentDocumentData}
        isSidebarExpanded={isSidebarExpanded}
        onSidebarToggle={() => setIsSidebarExpanded((state) => !state)}
      />
      <main className={styles.main}></main>
    </div>
  );
}
