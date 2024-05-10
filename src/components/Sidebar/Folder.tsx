import {
  DirectoryState,
  NodeType,
  useDocumentsStore,
} from '@/store/documents.store';
import stylesDocument from './Document.module.scss';
import {
  IconDelete,
  IconDocument,
  IconFolder,
  IconFolderOpen,
  IconRename,
} from '@/assets';
import Text from '../Text';
import RenameInput from './RenameInput';
import { useContext, useEffect, useState } from 'react';
import { MenuContext } from '@/context/menu.context';
import Directory from './Directory';
import styles from './Folder.module.scss';

interface Props {
  path: string;
  name: string;
  directory: DirectoryState;
  depth: number;
}

export default function Folder(props: Props) {
  const { path, name, directory, depth = 0 } = props;

  const deleteNode = useDocumentsStore((state) => state.deleteNode);
  const renameNode = useDocumentsStore((state) => state.renameNode);

  const { renderMenu } = useContext(MenuContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isCreatingNode, setIsCreatingNode] = useState<NodeType | null>(null);

  const handleContextMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    renderMenu({
      items: [
        {
          name: { Icon: IconDocument, text: 'New Document...' },
          action: () => setIsCreatingNode('document'),
        },
        {
          name: { Icon: IconFolder, text: 'New Folder...' },
          action: () => setIsCreatingNode('folder'),
        },
        {
          name: { Icon: IconRename, text: 'Rename Folder...' },
          action: () => setIsRenaming(true),
        },
        {
          name: { Icon: IconDelete, text: 'Delete Folder' },
          action: () => deleteNode(path + name),
        },
      ],
      windowPos: { x: e.clientX, y: e.clientY },
    });
  };

  const handleRenameSubmit = (newName: string) => {
    renameNode(newName, path + name);
    setIsRenaming(false);
  };

  useEffect(() => {
    if (isCreatingNode) {
      setIsExpanded(true);
    }
  }, [isCreatingNode]);

  return (
    <>
      <button
        className={`${stylesDocument.document} ${stylesDocument['document--button']}`}
        style={{ '--depth': depth } as React.CSSProperties}
        onContextMenu={(e) => handleContextMenu(e)}
        onClick={() => setIsExpanded((state) => !state)}
      >
        <div>
          {isExpanded ? (
            <IconFolderOpen className={stylesDocument.documentIcon} />
          ) : (
            <IconFolder className={stylesDocument.documentIcon} />
          )}
        </div>
        <div className={stylesDocument.documentTextWrapper}>
          <Text
            as="span"
            variant="S-light"
            className={stylesDocument.documentSubTitle}
          >
            Folder Name
          </Text>
          {isRenaming ? (
            <RenameInput name={name} onRenameSubmit={handleRenameSubmit} />
          ) : (
            <Text as="span" variant="M" className={stylesDocument.documentName}>
              {name}
            </Text>
          )}
        </div>
      </button>

      {isExpanded && (
        <div
          className={styles.directoryWrapper}
          style={{ '--depth': depth } as React.CSSProperties}
        >
          <Directory
            data={directory}
            path={path + name + '/'}
            isCreatingNode={isCreatingNode}
            onNodeCreated={() => setIsCreatingNode(null)}
            depth={depth + 1}
          />
        </div>
      )}
    </>
  );
}
