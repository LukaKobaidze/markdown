import { useContext, useState } from 'react';
import {
  IconClose,
  IconDelete,
  IconDocument,
  IconMenu,
  IconRename,
  Logo,
} from '@/assets';
import Text from '../Text';
import Modal from '../Modal';
import Heading from '../Heading';
import Button from '../Button';
import Tooltip from '../Tooltip';
import styles from './Header.module.scss';
import { useDocumentsStore } from '@/store/documents.store';
import { ViewportContext } from '@/context/viewport.context';
import { useLayoutStore } from '@/store/layout.store';
import RenameInput from '../Sidebar/RenameInput';
import { findDocumentByPath } from '@/store/documentsStore.helpers';

interface Props extends React.HTMLAttributes<HTMLElement> {
  sidebarHamburgerRef: React.RefObject<HTMLButtonElement>;
}

export default function Header(props: Props) {
  const { sidebarHamburgerRef, className, ...restProps } = props;

  const isSidebarExpanded = useLayoutStore((state) => state.isSidebarExpanded);
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);
  const { viewportWidth } = useContext(ViewportContext);
  const directory = useDocumentsStore((state) => state.directory);
  const activeDocumentPath = useDocumentsStore((state) => state.activeDocumentPath);
  const renameNode = useDocumentsStore((state) => state.renameNode);
  const deleteNode = useDocumentsStore((state) => state.deleteNode);
  const [isDeletingDocument, setIsDeletingDocument] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);

  const activeDocument = findDocumentByPath(activeDocumentPath, directory);
  const documentName = activeDocumentPath.slice(
    activeDocumentPath.lastIndexOf('/') + 1
  );

  return (
    <>
      <header
        className={`${styles.header} ${className || ''}`}
        style={viewportWidth <= 350 ? { minWidth: viewportWidth } : undefined}
        {...restProps}
      >
        <button
          className={styles.sidebarExpandButton}
          onClick={() => toggleSidebar()}
          ref={sidebarHamburgerRef}
        >
          {isSidebarExpanded ? <IconClose /> : <IconMenu />}
        </button>
        {viewportWidth > 768 && (
          <>
            <Logo className={styles.logo} />
            <div className={styles.divider} />
          </>
        )}
        {activeDocument && (
          <div className={styles.document}>
            <IconDocument className={styles.documentIcon} />
            <div className={styles.documentTextWrapper}>
              <Text as="span" variant="S-light" className={styles.documentSubTitle}>
                Document Name
              </Text>
              {isRenaming ? (
                <RenameInput
                  name={documentName.slice(0, -3)}
                  onRenameSubmit={(newName) => {
                    setIsRenaming(false);

                    if (newName.trim().length) {
                      renameNode(newName + '.md');
                    }
                  }}
                  isDocument
                  className={styles.documentRenameForm}
                />
              ) : (
                <button
                  className={styles.documentNameButton}
                  onClick={() => setIsRenaming(true)}
                >
                  <Text
                    as="span"
                    variant="M"
                    className={styles.documentNameButtonText}
                  >
                    {documentName}
                  </Text>
                  <IconRename className={styles.documentNameButtonIcon} />
                </button>
              )}
            </div>
          </div>
        )}
        <Tooltip position="left" text="Delete Document">
          <button
            className={styles.deleteButton}
            onClick={() => setIsDeletingDocument(true)}
          >
            <IconDelete viewBox="0 0 19 19" />
          </button>
        </Tooltip>
      </header>
      {isDeletingDocument && (
        <Modal
          className={styles.deleteModal}
          onClose={() => setIsDeletingDocument(false)}
        >
          <Heading level="3" styleLevel="4" className={styles.deleteModalHeading}>
            Delete this document?
          </Heading>
          <Text
            as="p"
            variant="slab-regular"
            className={styles.deleteModalParagraph}
          >
            Are you sure you want to delete '{activeDocumentPath}' document and its
            contents? This action cannot be reversed.
          </Text>
          <Button
            className={styles.deleteModalButton}
            onClick={() => {
              deleteNode();
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
