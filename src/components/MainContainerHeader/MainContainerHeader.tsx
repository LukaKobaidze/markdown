import { IconHide, IconShow } from '@/assets';
import styles from './MainContainerHeader.module.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  isExtended: boolean;
  onToggleExtend: () => void;
}

export default function MainContainerHeader(props: Props) {
  const { title, isExtended, onToggleExtend, className, ...restProps } = props;

  return (
    <div className={`${styles.header} ${className || ''}`} {...restProps}>
      <span className={styles.title}>{title}</span>

      <button className={styles.extendButton} onClick={() => onToggleExtend()}>
        {isExtended ? <IconHide /> : <IconShow />}
      </button>
    </div>
  );
}
