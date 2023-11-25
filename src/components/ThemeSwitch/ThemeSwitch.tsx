import { IconDarkMode, IconLightMode } from '@/assets';
import { ThemeType } from '@/types';
import styles from './ThemeSwitch.module.scss';

interface Props
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  theme: ThemeType;
  classNameContainer?: string;
}

export default function ThemeSwitch(props: Props) {
  const { theme, classNameContainer, className, ...restProps } = props;

  return (
    <div className={`${styles.container} ${classNameContainer || ''}`}>
      <IconDarkMode
        className={`${styles.icon} ${theme === 'dark' ? styles.active : ''}`}
      />
      <button
        className={`${styles.switch} ${theme === 'light' ? styles.active : ''} ${
          className || ''
        }`}
        {...restProps}
      />
      <IconLightMode
        className={`${styles.icon} ${theme === 'light' ? styles.active : ''}`}
      />
    </div>
  );
}
