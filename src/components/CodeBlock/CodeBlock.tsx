import Text from '../Text';
import styles from './CodeBlock.module.scss';

interface Props extends React.HTMLAttributes<HTMLElement> {}

export default function CodeBlock(props: Props) {
  const { className, children, ...restProps } = props;

  return (
    <pre className={styles.pre}>
      <code className={`${styles.code} ${className}`} {...restProps}>
        <Text as="span" variant="mono-regular">
          {children}
        </Text>
      </code>
    </pre>
  );
}
