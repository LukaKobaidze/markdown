import { IconClose, IconMenu, Logo } from '@/assets';
import styles from './Header.module.scss';
import { DocumentType } from '@/types';
import Document from '../Document';

interface Props extends React.HTMLAttributes<HTMLElement> {
  document: DocumentType;
  isSidebarExpanded: boolean;
  onSidebarToggle: () => void;
}

export default function Header(props: Props) {
  const { document, isSidebarExpanded, onSidebarToggle, className, ...restProps } =
    props;

  return (
    <header className={`${styles.header} ${className || ''}`} {...restProps}>
      <button
        className={styles.sidebarExpandButton}
        onClick={() => onSidebarToggle()}
      >
        {isSidebarExpanded ? <IconClose /> : <IconMenu />}
      </button>
      <Logo className={styles.logo} />
      <div className={styles.divider} />
      <Document as="div" documentName={document.name} className={styles.document} />
    </header>
  );
}
