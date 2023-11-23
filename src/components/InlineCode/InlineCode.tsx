import Text from '../Text';
import styles from './InlineCode.module.scss';

interface Props extends React.HTMLAttributes<HTMLElement> {}

export default function InlineCode(props: Props) {
  const { className, children, ...restProps } = props;

  return (
    <code className={`${styles.code} ${className || ''}`} {...restProps}>
      <Text as="span" variant="mono-regular" className={`${styles.textContent}`}>
        {children}
      </Text>
    </code>
  );
}
