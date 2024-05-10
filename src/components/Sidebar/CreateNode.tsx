import { IconDocument, IconFolder } from '@/assets';
import styles from './Document.module.scss';
import Input from '../Input';
import Text from '../Text';
import { NodeType, useDocumentsStore } from '@/store/documents.store';
import { useEffect, useRef, useState } from 'react';

interface Props {
  node: NodeType;
  path: string;
  onNodeCreated: () => void;
  depth?: number;
}

export default function CreateNode(props: Props) {
  const { node, path, onNodeCreated, depth = 0 } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const [documentName, setDocumentName] = useState('');

  const createNode = useDocumentsStore((state) => state.createNode);

  const handleCreateDocumentSubmit = () => {
    const value = documentName.trim();

    if (!value) {
      onNodeCreated();
      return;
    }

    createNode(path + value + (node === 'document' ? '.md' : ''), node);

    onNodeCreated();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [node]);

  return (
    <div
      className={styles.document}
      style={{ '--depth': depth } as React.CSSProperties}
    >
      <div>
        {node === 'document' ? (
          <IconDocument viewBox="0 0 17 17" className={styles.documentIcon} />
        ) : (
          <IconFolder className={styles.documentIcon} />
        )}
      </div>
      <div className={styles.documentTextWrapper}>
        <Text as="span" variant="S-light" className={styles.documentSubTitle}>
          {node[0].toUpperCase() + node.slice(1)} Name
        </Text>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateDocumentSubmit();
          }}
        >
          <div className={styles.documentInputWrapper}>
            <Input
              ref={inputRef}
              className={styles.documentInput}
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              onBlur={() => handleCreateDocumentSubmit()}
            />
            {node === 'document' && (
              <Text as="span" variant="S-light">
                .md
              </Text>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
