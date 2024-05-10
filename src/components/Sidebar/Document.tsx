import { useContext, useState } from 'react';
import { MenuContext } from '@/context/menu.context';
import { useDocumentsStore } from '@/store/documents.store';
import { IconDelete, IconDocument, IconRename } from '@/assets';
import Text from '../Text';
import styles from './Document.module.scss';
import RenameInput from './RenameInput';

interface Props {
  path: string;
  name: string;
  depth?: number;
}

export default function Document(props: Props) {
  const { path, name, depth = 0 } = props;

  const { renderMenu } = useContext(MenuContext);
  const [isRenaming, setIsRenaming] = useState(false);
  const activeDocumentPath = useDocumentsStore((state) => state.activeDocumentPath);
  const openDocument = useDocumentsStore((state) => state.openDocument);
  const renameNode = useDocumentsStore((state) => state.renameNode);
  const deleteNode = useDocumentsStore((state) => state.deleteNode);

  const handleContextMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    renderMenu({
      items: [
        {
          name: { Icon: IconRename, text: 'Rename Document...' },
          action: () => setIsRenaming(true),
        },
        {
          name: { Icon: IconDelete, text: 'Delete Document' },
          action: () => deleteNode(path + name),
        },
      ],
      windowPos: { x: e.pageX, y: e.pageY },
    });
  };

  const handleRenameSubmit = (newName: string) => {
    renameNode(newName + '.md', path + name);
    setIsRenaming(false);
  };

  return (
    <button
      className={`${styles.document} ${styles['document--button']} ${
        path + name === activeDocumentPath ? styles.active : ''
      }`}
      style={{ '--depth': depth } as React.CSSProperties}
      onClick={() => openDocument(path + name)}
      onContextMenu={(e) => handleContextMenu(e)}
    >
      <div>
        <IconDocument viewBox="0 0 17 17" className={styles.documentIcon} />
      </div>
      <div className={styles.documentTextWrapper}>
        <Text as="span" variant="S-light" className={styles.documentSubTitle}>
          Document Name
        </Text>
        {isRenaming ? (
          <RenameInput
            name={name.slice(0, -3)}
            onRenameSubmit={handleRenameSubmit}
            isDocument
          />
        ) : (
          <Text as="span" variant="M" className={styles.documentName}>
            {name}
          </Text>
        )}
      </div>
    </button>
  );
}
