import { useState } from 'react';
import MainContainerHeader from '../MainContainerHeader';
import styles from './Markdown.module.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
  onEdit: (content: string) => void;
  isExtended: boolean;
  onToggleExtend: () => void;
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
}

export default function Markdown(props: Props) {
  const {
    content,
    onEdit,
    isExtended,
    onToggleExtend,
    textareaRef,
    className,
    ...restProps
  } = props;

  const [textareaFocusOutline, setTextareaFocusOutline] = useState(true);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onEdit(e.target.value);
    setTextareaFocusOutline(false);
  };

  const handleTextareaFocus = () => {
    setTextareaFocusOutline(true);
  };

  return (
    <>
      <div className={`${styles.container} ${className}`} {...restProps}>
        <MainContainerHeader
          title="Markdown"
          isExtended={isExtended}
          onToggleExtend={onToggleExtend}
        />
        <div className={styles.textareaWrapper}>
          <textarea
            className={`${styles.textarea} ${
              !textareaFocusOutline ? styles['textarea--hide-outline'] : ''
            }`}
            value={content}
            onChange={handleTextareaChange}
            onFocus={handleTextareaFocus}
            ref={textareaRef}
          />
        </div>
      </div>
    </>
  );
}
