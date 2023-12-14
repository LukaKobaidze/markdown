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
import styles from './Header.module.scss';
import Modal from '../Modal';
import Heading from '../Heading';
import Button from '../Button';
import Input from '../Input';
import { DocumentsContext } from '@/context/documents.context';
import Tooltip from '../Tooltip';

interface Props extends React.HTMLAttributes<HTMLElement> {
  isSidebarExpanded: boolean;
  onSidebarToggle: () => void;
}

export default function Header(props: Props) {
  const { isSidebarExpanded, onSidebarToggle, className, ...restProps } = props;

  const { documents, currentDocument, onRenameDocument, onDeleteDocument } =
    useContext(DocumentsContext);
  const [isDeletingDocument, setIsDeletingDocument] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renamingNewName, setRenamingNewName] = useState('');

  const handleStartRename = () => {
    setIsRenaming(true);
    setRenamingNewName(documents[currentDocument].name.slice(0, -3));
  };

  const handleRenameDocumentSubmit = () => {
    onRenameDocument(renamingNewName);
    setIsRenaming(false);
    setRenamingNewName('');
  };

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
            {isRenaming ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRenameDocumentSubmit();
                }}
              >
                <Input
                  value={renamingNewName}
                  onChange={(e) => setRenamingNewName(e.target.value)}
                  onBlur={() => handleRenameDocumentSubmit()}
                  autoFocus
                />
                <Text as="span" variant="S-light">
                  .md
                </Text>
              </form>
            ) : (
              <button
                className={styles.documentNameButton}
                onClick={() => handleStartRename()}
              >
                <Text as="span" variant="M" className={styles.documentName}>
                  {documents[currentDocument].name}
                </Text>
                <IconRename className={styles.documentNameButtonIcon} />
              </button>
            )}
          </div>
        </div>

        {documents[currentDocument].deletable && (
          <Tooltip position="left" text="Delete Document">
            <button
              className={styles.deleteButton}
              onClick={() => setIsDeletingDocument(true)}
            >
              <IconDelete />
            </button>
          </Tooltip>
        )}
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
            Are you sure you want to delete '{documents[currentDocument].name}'
            document and its contents? This action cannot be reversed.
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
