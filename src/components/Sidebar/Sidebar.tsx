import { useState } from 'react';
import { DocumentType } from '@/types';
import Button from '../Button';
import Text from '../Text';
import styles from './Sidebar.module.scss';
import Document from '../Document';
import Modal from '../Modal';
import Heading from '../Heading';
import Input from '../Input';
import { IconDocument } from '@/assets';

interface Props extends React.HTMLAttributes<HTMLElement> {
  isExpanded: boolean;
  documents: DocumentType[];
  onOpenDocument: (index: number) => void;
}

export default function Sidebar(props: Props) {
  const { isExpanded, documents, onOpenDocument, className, ...restProps } = props;

  const [isCreatingDocument, setIsCreatingDocument] = useState(false);

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
              <div
                className={`${styles.document} ${styles['document--button']} ${
                  className || ''
                }`}
              >
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
                  <div className={styles.documentInputWrapper}>
                    <Input className={styles.documentInput} />
                    <Text as="span" variant="S-light">
                      .md
                    </Text>
                  </div>
                </div>
              </div>
            )}

            {documents.map((documentData, documentIndex) => (
              <button
                key={documentIndex}
                className={`${styles.document} ${styles['document--button']} ${
                  className || ''
                }`}
                {...restProps}
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
        </div>
      </aside>

      {/* {isCreatingDocument && (
        <Modal onClose={() => setIsCreatingDocument(false)}>
          <Heading level="3" styleLevel="4">
            New Document
          </Heading>
          <div>
            <Input />
            <Text as="span" variant="S-light">
              .md
            </Text>
          </div>
        </Modal>
      )} */}
    </>
  );
}
