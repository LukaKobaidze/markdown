import { useRef, useState, useContext } from 'react';
import { MenuContext } from '@/context/menu.context';
import { DocumentsContext } from '@/context/documents.context';
import { ThemeType } from '@/types';
import {
  IconClose,
  IconDelete,
  IconDocument,
  IconDocumentAdd,
  IconHide,
  IconRename,
  Logo,
} from '@/assets';
import { MenuProps } from '../Menu';
import Button from '../Button';
import Text from '../Text';
import Input from '../Input';
import ThemeSwitch from '../ThemeSwitch';
import AlertOutsideAction from '../AlertOutsideAction';
import styles from './Sidebar.module.scss';

interface Props extends React.HTMLAttributes<HTMLElement> {
  isExpanded: boolean;
  theme: ThemeType;
  setIsSidebarExtended: React.Dispatch<React.SetStateAction<boolean>>;
  onThemeToggle: () => void;
  windowWidth: number;
  sidebarHamburgerRef: React.RefObject<HTMLButtonElement>;
}

export default function Sidebar(props: Props) {
  const {
    isExpanded,
    theme,
    setIsSidebarExtended,
    onThemeToggle,
    windowWidth,
    sidebarHamburgerRef,
    className,
    ...restProps
  } = props;

  const {
    documents,
    currentDocument,
    onCreateDocument,
    onDeleteDocument,
    onRenameDocument,
    setCurrentDocument,
  } = useContext(DocumentsContext);
  const { renderMenu } = useContext(MenuContext);
  const createDocumentInput = useRef<HTMLInputElement>(null);
  const [isCreatingDocument, setIsCreatingDocument] = useState(false);
  const [renamingDocument, setRenamingDocument] = useState(-1);
  const [renamingDocumentNewName, setRenamingDocumentNewName] = useState('');

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

  const handleSidebarContextMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    renderMenu({
      items: [
        {
          name: { Icon: IconDocumentAdd, text: 'New Document' },
          action: () => setIsCreatingDocument(true),
        },
        {
          name: { Icon: IconHide, text: 'Hide Sidebar' },
          action: () => setIsSidebarExtended(false),
        },
      ],
      windowPos: { x: e.pageX, y: e.pageY },
    });
  };

  const handleDocumentContextMenu = (
    e: React.MouseEvent<HTMLButtonElement>,
    documentIndex: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const menuItems: MenuProps['items'] = [
      {
        name: { Icon: IconRename, text: 'Rename Document' },
        action: () => {
          setRenamingDocument(documentIndex);
          setRenamingDocumentNewName(documents[documentIndex].name.slice(0, -3));
        },
      },
    ];

    if (documents[documentIndex].deletable) {
      menuItems.push({
        name: { Icon: IconDelete, text: 'Delete Document' },
        action: () => onDeleteDocument(documentIndex),
      });
    }

    renderMenu({
      items: menuItems,
      windowPos: { x: e.pageX, y: e.pageY },
    });
  };

  const handleRenameSubmit = () => {
    onRenameDocument(renamingDocumentNewName, renamingDocument);
    setRenamingDocument(-1);
    setRenamingDocumentNewName('');
  };

  return (
    <aside
      className={`${styles.sidebar} ${!isExpanded ? styles.hidden : ''} ${
        className || ''
      }`}
      {...restProps}
    >
      <AlertOutsideAction
        event="click"
        onOutsideAction={() => setIsSidebarExtended(false)}
        className={styles.contentWrapper}
        onContextMenu={handleSidebarContextMenu}
        handleWhen={windowWidth < 600 && isExpanded}
        ignore={[sidebarHamburgerRef]}
      >
        <div className={styles.containerPadding}>
          {windowWidth <= 290 && (
            <button className={styles.buttonClose} onClick={() => setIsSidebarExtended(false)}>
              <IconClose className={styles.buttonCloseIcon} />
            </button>
          )}
          {windowWidth <= 768 && <Logo className={styles.logo} />}
          <Text as="p" variant="S" className={styles.textMyDocuments}>
            MY DOCUMENTS
          </Text>
          <Button
            className={styles.buttonNewDocument}
            onClick={() => setIsCreatingDocument(true)}
          >
            + New Document
          </Button>
        </div>

        <div className={`${styles.documents}`}>
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
              onClick={() => setCurrentDocument(documentIndex)}
              onContextMenu={(e) => handleDocumentContextMenu(e, documentIndex)}
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
                {documentIndex === renamingDocument ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleRenameSubmit();
                    }}
                  >
                    <div className={styles.documentInputWrapper}>
                      <Input
                        ref={createDocumentInput}
                        className={styles.documentInput}
                        autoFocus
                        onBlur={handleRenameSubmit}
                        value={renamingDocumentNewName}
                        onChange={(e) => setRenamingDocumentNewName(e.target.value)}
                      />
                      <Text as="span" variant="S-light">
                        .md
                      </Text>
                    </div>
                  </form>
                ) : (
                  <Text as="span" variant="M" className={styles.documentName}>
                    {documentData.name}
                  </Text>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className={`${styles.themeSwitchWrapper} ${styles.containerPadding}`}>
          <ThemeSwitch
            classNameContainer={styles.themeSwitch}
            theme={theme}
            onClick={() => onThemeToggle()}
          />
        </div>
      </AlertOutsideAction>
    </aside>
  );
}
