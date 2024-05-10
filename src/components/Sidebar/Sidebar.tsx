import { useState, useContext } from 'react';
import { MenuContext } from '@/context/menu.context';
import { IconClose, IconDocument, IconFolder, IconHide, Logo } from '@/assets';
import Button from '../Button';
import Text from '../Text';
import ThemeSwitch from '../ThemeSwitch';
import AlertOutsideAction from '../AlertOutsideAction';
import { NodeType, useDocumentsStore } from '@/store/documents.store';
import styles from './Sidebar.module.scss';
import { ViewportContext } from '@/context/viewport.context';
import { useLayoutStore } from '@/store/layout.store';
import { ThemeType } from '@/hooks/useTheme';
import Directory from './Directory';
import Tooltip from '../Tooltip';

interface Props extends React.HTMLAttributes<HTMLElement> {
  theme: ThemeType;
  onThemeToggle: () => void;
  sidebarHamburgerRef: React.RefObject<HTMLButtonElement>;
}

export default function Sidebar(props: Props) {
  const { theme, onThemeToggle, sidebarHamburgerRef, className, ...restProps } =
    props;

  const { viewportWidth } = useContext(ViewportContext);
  const isSidebarExpanded = useLayoutStore((state) => state.isSidebarExpanded);
  const hideSidebar = useLayoutStore((state) => state.hideSidebar);
  const directory = useDocumentsStore((state) => state.directory);
  3;
  const { renderMenu } = useContext(MenuContext);
  const [isCreatingNode, setIsCreatingNode] = useState<NodeType | null>(null);

  const handleSidebarContextMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

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
          name: { Icon: IconHide, text: 'Hide Sidebar' },
          action: hideSidebar,
        },
      ],
      windowPos: { x: e.pageX, y: e.pageY },
    });
  };

  return (
    <aside
      className={`${styles.sidebar} ${!isSidebarExpanded ? styles.hidden : ''} ${
        className || ''
      }`}
      {...restProps}
    >
      <AlertOutsideAction
        event="click"
        onOutsideAction={() => hideSidebar()}
        className={styles.contentWrapper}
        onContextMenu={handleSidebarContextMenu}
        handleWhen={viewportWidth < 600 && isSidebarExpanded}
        ignore={[sidebarHamburgerRef]}
      >
        <div className={styles.containerPadding}>
          {viewportWidth <= 290 && (
            <button className={styles.buttonClose} onClick={() => hideSidebar()}>
              <IconClose className={styles.buttonCloseIcon} />
            </button>
          )}
          {viewportWidth <= 768 && <Logo className={styles.logo} />}
          <Text as="p" variant="S" className={styles.textMyDocuments}>
            MY DOCUMENTS
          </Text>
          <div className={styles.buttonNewWrapper}>
            <Tooltip position="bottom" text="New Folder..." offset={10}>
              <Button
                className={styles.buttonNew}
                onClick={() => setIsCreatingNode('folder')}
              >
                <IconFolder className={styles.buttonNewIcon} viewBox="0 0 27 27" />
              </Button>
            </Tooltip>
            <Tooltip position="bottom" text="New Document..." offset={10}>
              <Button
                className={styles.buttonNew}
                onClick={() => setIsCreatingNode('document')}
              >
                <IconDocument className={styles.buttonNewIcon} viewBox="0 0 18 18" />
              </Button>
            </Tooltip>
          </div>
        </div>

        <div className={`${styles.documents}`}>
          <Directory
            data={directory}
            path=""
            isCreatingNode={isCreatingNode}
            onNodeCreated={() => setIsCreatingNode(null)}
          />
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
