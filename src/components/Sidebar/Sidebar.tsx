import { DocumentType } from '@/types';
import Button from '../Button';
import Text from '../Text';
import styles from './Sidebar.module.scss';
import Document from '../Document';

interface Props extends React.HTMLAttributes<HTMLElement> {
  isExpanded: boolean;
  documents: DocumentType[];
  onOpenDocument: (index: number) => void;
}

export default function Sidebar(props: Props) {
  const { isExpanded, documents, onOpenDocument, className, ...restProps } = props;

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

        <div className={styles.documents}>
          {documents.map((documentData, documentIndex) => (
            <Document
              as="button"
              documentName={documentData.name}
              onClick={() => onOpenDocument(documentIndex)}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
