import { useEffect, useState } from 'react';
import MarkdownHeader from '../MarkdownHeader';
import styles from './Markdown.module.scss';
import Resizer from './Resizer';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
  containerRef: React.RefObject<HTMLElement>;
  setIsMarkdownHidden: React.Dispatch<React.SetStateAction<boolean>>;
  onEdit: (content: string) => void;
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
}

export default function Markdown(props: Props) {
  const {
    content,
    containerRef,
    setIsMarkdownHidden,
    onEdit,
    textareaRef,
    className,
    style,
    ...restProps
  } = props;

  const [markdownSize, setMarkdownSize] = useState(50);

  useEffect(() => {
    console.log('content change!');
  }, [content]);

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
            ref={textareaRef}
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
