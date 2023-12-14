import { IconHide, IconShow } from '@/assets';
import styles from './MainContainerHeader.module.scss';
import Tooltip from '../Tooltip';

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

      <Tooltip
        position="left"
        text={isExtended ? `Unfocus '${title}'` : `Extend '${title}'`}
      >
        <button className={styles.extendButton} onClick={() => onToggleExtend()}>
          {isExtended ? <IconHide /> : <IconShow />}
        </button>
      </Tooltip>
    </div>
  );
}
