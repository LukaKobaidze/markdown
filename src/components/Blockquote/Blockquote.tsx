import Text from '../Text';
import styles from './Blockquote.module.scss';

interface Props extends React.HTMLAttributes<HTMLParagraphElement> {}

export default function Blockquote(props: Props) {
  const { className, children, ...restProps } = props;

  return (
    <Text
      as="p"
      variant="slab-bold"
      className={`${styles.blockquote} ${className || ''}`}
      {...restProps}
    >
      {children}
    </Text>
  );
}
