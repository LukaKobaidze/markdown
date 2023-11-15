import Button from '../Button';
import Text from '../Text';
import styles from './Sidebar.module.scss';

interface Props extends React.HTMLAttributes<HTMLElement> {
  isExpanded: boolean;
}

export default function Sidebar(props: Props) {
  const { isExpanded, className, ...restProps } = props;

  return (
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
        <Button className={styles.buttonNewDocument}>+ New Document</Button>
      </div>
    </aside>
  );
}
