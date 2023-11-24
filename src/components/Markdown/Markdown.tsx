import { useState } from 'react';
import MarkdownHeader from '../MarkdownHeader';
import styles from './Markdown.module.scss';
import Resizer from './Resizer';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
  containerRef: React.RefObject<HTMLElement>;
  setIsMarkdownHidden: React.Dispatch<React.SetStateAction<boolean>>;
  onEdit: (content: string) => void;
}

export default function Markdown(props: Props) {
  const {
    content,
    containerRef,
    setIsMarkdownHidden,
    onEdit,
    className,
    style,
    ...restProps
  } = props;

  const [markdownSize, setMarkdownSize] = useState(50);

  return (
    <>
      <div
        className={`${styles.container} ${className}`}
        {...restProps}
        style={{ width: markdownSize + '%', ...style }}
      >
        <MarkdownHeader>MARKDOWN</MarkdownHeader>
        <div className={styles.textareaWrapper}>
          <textarea
            className={styles.textarea}
            value={content}
            onChange={(e) => onEdit(e.target.value)}
          />
        </div>
      </div>
      <Resizer
        containerRef={containerRef}
        setIsMarkdownHidden={setIsMarkdownHidden}
        setMarkdownSize={setMarkdownSize}
      />
    </>
  );
}
