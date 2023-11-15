import { IconClose, IconDocument, IconMenu, Logo } from '@/assets';
import styles from './Header.module.scss';
import { DocumentType } from '@/types';
import Text from '../Text';

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
      <div className={styles.document}>
        <IconDocument />
        <div className={styles.documentTextWrapper}>
          <Text as="span" variant="S-light" className={styles.documentSubTitle}>
            Document Name
          </Text>
          <Text as="span" variant="M">
            {document.name}
          </Text>
        </div>
      </div>
    </header>
  );
}
