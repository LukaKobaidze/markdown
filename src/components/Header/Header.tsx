import { useState } from 'react';
import { IconClose, IconDelete, IconDocument, IconMenu, Logo } from '@/assets';
import { DocumentType } from '@/types';
import Text from '../Text';
import styles from './Header.module.scss';
import Modal from '../Modal';
import Heading from '../Heading';
import Button from '../Button';

interface Props extends React.HTMLAttributes<HTMLElement> {
  document: DocumentType;
  isSidebarExpanded: boolean;
  onSidebarToggle: () => void;
  onDeleteDocument: () => void;
}

export default function Header(props: Props) {
  const {
    document,
    isSidebarExpanded,
    onSidebarToggle,
    onDeleteDocument,
    className,
    ...restProps
  } = props;

  const [isDeletingDocument, setIsDeletingDocument] = useState(false);

  return (
    <>
      <header className={`${styles.header} ${className || ''}`} {...restProps}>
        <button
          className={styles.sidebarExpandButton}
          onClick={() => onSidebarToggle()}
        >
          {isSidebarExpanded ? <IconClose /> : <IconMenu />}
        </button>
        <Logo className={styles.logo} />
        <div className={styles.divider} />
        <div className={styles.document}>
          <IconDocument />
          <div className={styles.documentTextWrapper}>
            <Text as="span" variant="S-light" className={styles.documentSubTitle}>
              Document Name
            </Text>
            <button className={styles.documentNameButton}>
              <Text as="span" variant="M" className={styles.documentName}>
                {document.name}
              </Text>
            </button>
          </div>
        </div>
        <button
          className={styles.deleteButton}
          onClick={() => setIsDeletingDocument(true)}
        >
          <IconDelete />
        </button>
      </header>

      {isDeletingDocument && (
        <Modal
          className={styles.deleteModal}
          onClose={() => setIsDeletingDocument(false)}
        >
          <Heading level="3" styleLevel="4">
            Delete this document?
          </Heading>
          <Text
            as="p"
            variant="slab-regular"
            className={styles.deleteModalParagraph}
          >
            Are you sure you want to delete '{document.name}' document and its
            contents? This action cannot be reversed.
          </Text>
          <Button
            className={styles.deleteModalButton}
            onClick={() => {
              onDeleteDocument();
              setIsDeletingDocument(false);
            }}
          >
            Confirm & Delete
          </Button>
        </Modal>
      )}
    </>
  );
}
