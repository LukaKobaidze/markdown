import MarkdownHeader from '../MarkdownHeader';
import Text from '../Text';
import styles from './Markdown.module.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
  onEdit: (content: string) => void;
}

export default function Markdown(props: Props) {
  const { content, onEdit, className, ...restProps } = props;

  return (
    <div className={`${styles.container} ${className}`} {...restProps}>
      <MarkdownHeader>MARKDOWN</MarkdownHeader>
      <textarea
        className={styles.textarea}
        value={content}
        onChange={(e) => onEdit(e.target.value)}
      />
    </div>
  );
}
