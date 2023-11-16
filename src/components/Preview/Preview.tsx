import MarkdownHeader from '../MarkdownHeader';
import styles from './Preview.module.scss';

type Props = React.HTMLAttributes<HTMLDivElement>

export default function Preview(props: Props) {
  const { className, ...restProps } = props;

  return (
    <div className={`${styles.container} ${className}`} {...restProps}>
      <MarkdownHeader>PREVIEW</MarkdownHeader>
      <div></div>
    </div>
  );
}
