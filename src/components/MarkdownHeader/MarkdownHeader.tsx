import styles from './MarkdownHeader.module.scss';

type Props = React.HTMLAttributes<HTMLDivElement>;

export default function MarkdownHeader(props: Props) {
  const { className, children } = props;

  return <div className={`${styles.header} ${className || ''}`}>{children}</div>;
}
