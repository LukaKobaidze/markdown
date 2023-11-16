import Text from '../Text';
import styles from './MarkdownHeader.module.scss';

type Props = React.HTMLAttributes<HTMLParagraphElement>;

export default function MarkdownHeader(props: Props) {
  const { className, children } = props;

  return (
    <Text as="p" variant="S" className={`${styles.header} ${className || ''}`}>
      {children}
    </Text>
  );
}
