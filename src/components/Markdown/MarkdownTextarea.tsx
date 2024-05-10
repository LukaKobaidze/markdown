import { useDocumentsStore } from '@/store/documents.store';
import { useEffect, useRef, useState } from 'react';
import { findDocumentByPath } from '@/store/documentsStore.helpers';
import styles from './MarkdownTextarea.module.scss';

export default function MarkdownTextarea() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const directory = useDocumentsStore((state) => state.directory);
  const activeDocumentPath = useDocumentsStore((state) => state.activeDocumentPath);
  const saveDocument = useDocumentsStore((state) => state.saveDocument);
  const activeDocument = findDocumentByPath(activeDocumentPath, directory);
  const [markdownLocal, setMarkdownLocal] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownLocal(e.target.value);
  };

  useEffect(() => {
    textareaRef.current?.focus();
    setMarkdownLocal(activeDocument?.markdown || '');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDocumentPath]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      saveDocument(markdownLocal);
    }, 200);

    return () => {
      clearTimeout(timeout);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markdownLocal]);

  return (
    <div className={styles.textareaWrapper}>
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        value={markdownLocal}
        onChange={handleChange}
        onBlur={() => saveDocument(markdownLocal)}
        disabled={!activeDocument}
        spellCheck="false"
      />
    </div>
  );
}
