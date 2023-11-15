import { IconMenu } from '@/assets';
import styles from './Header.module.scss';

interface Props extends React.HTMLAttributes<HTMLElement> {}

export default function Header(props: Props) {
  const { className } = props;

  return <header className={`${className || ''}`}>
    <button className={styles.sidebarExpandButton}>
      <IconMenu />
    </button>
  </header>;
}
