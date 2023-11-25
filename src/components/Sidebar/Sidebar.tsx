import { useRef, useState, useContext } from 'react';
import { DocumentType, ThemeType } from '@/types';
import Button from '../Button';
import Text from '../Text';
import Input from '../Input';
import { IconDelete, IconDocument } from '@/assets';
import styles from './Sidebar.module.scss';
import ThemeSwitch from '../ThemeSwitch';
import { MenuContext } from '@/context/menu.context';

interface Props extends React.HTMLAttributes<HTMLElement> {
  isExpanded: boolean;
  documents: DocumentType[];
  currentDocument: number;
  theme: ThemeType;
  onThemeToggle: () => void;
  onOpenDocument: (index: number) => void;
  onCreateDocument: (name: string) => void;
  onDeleteDocument: (index: number) => void;
}

export default function Sidebar(props: Props) {
  const {
    isExpanded,
    documents,
    currentDocument,
    theme,
    onThemeToggle,
    onOpenDocument,
    onCreateDocument,
    onDeleteDocument,
    className,
    ...restProps
  } = props;

  const { renderMenu } = useContext(MenuContext);
  const createDocumentInput = useRef<HTMLInputElement>(null);
  const [isCreatingDocument, setIsCreatingDocument] = useState(false);

  const handleCreateDocumentInputBlur = () => {
    const value = createDocumentInput.current?.value.trim();

    if (value) {
      onCreateDocument(value);
    }
    setIsCreatingDocument(false);
  };

  const handleCreateDocumentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const value = createDocumentInput.current?.value.trim();

    if (!value || documents.some((document) => document.name === value + '.md')) {
      return;
    }

    onCreateDocument(value);
    setIsCreatingDocument(false);
  };

  const handleDocumentContextMenu = (
    e: React.MouseEvent<HTMLButtonElement>,
    documentIndex: number
  ) => {
    e.preventDefault();

    renderMenu({
      items: [
        { name: { text: 'Rename Document' }, action: () => {} },
        {
          name: { Icon: IconDelete, text: 'Delete Document' },
          action: () => onDeleteDocument(documentIndex),
        },
      ],
      windowPos: { x: e.pageX, y: e.pageY },
    });
  };

  return (
    <>
      <aside
        className={`${styles.sidebar} ${!isExpanded ? styles.hidden : ''} ${
          className || ''
        }`}
        {...restProps}
      >
        <div className={styles.contentWrapper}>
          <Text as="p" variant="S" className={styles.textMyDocuments}>
            MY DOCUMENTS
          </Text>
          <Button
            className={styles.buttonNewDocument}
            onClick={() => setIsCreatingDocument(true)}
          >
            + New Document
          </Button>

          <div className={styles.documents}>
            {isCreatingDocument && (
              <div className={`${styles.document} ${className || ''}`}>
                <div>
                  <IconDocument />
                </div>
                <div className={styles.documentTextWrapper}>
                  <Text
                    as="span"
                    variant="S-light"
                    className={styles.documentSubTitle}
                  >
                    Document Name
                  </Text>
                  <form onSubmit={handleCreateDocumentSubmit}>
                    <div className={styles.documentInputWrapper}>
                      <Input
                        ref={createDocumentInput}
                        className={styles.documentInput}
                        autoFocus
                        onBlur={handleCreateDocumentInputBlur}
                      />
                      <Text as="span" variant="S-light">
                        .md
                      </Text>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {documents.map((documentData, documentIndex) => (
              <button
                key={documentIndex}
                className={`${styles.document} ${styles['document--button']} ${
                  documentIndex === currentDocument ? styles.active : ''
                } ${className || ''}`}
                onClick={() => onOpenDocument(documentIndex)}
                onContextMenu={(e) => handleDocumentContextMenu(e, documentIndex)}
              >
                <IconDocument />
                <div className={styles.documentTextWrapper}>
                  <Text
                    as="span"
                    variant="S-light"
                    className={styles.documentSubTitle}
                  >
                    Document Name
                  </Text>
                  <Text as="span" variant="M" className={styles.documentName}>
                    {documentData.name}
                  </Text>
                </div>
              </button>
            ))}
          </div>

          <ThemeSwitch
            classNameContainer={styles.themeSwitch}
            theme={theme}
            onClick={() => onThemeToggle()}
          />
        </div>
      </aside>
    </>
  );
}
