import { IconDarkMode, IconLightMode } from '@/assets';
import styles from './ThemeSwitch.module.scss';
import { ThemeType } from '@/hooks/useTheme';
import Tooltip from '../Tooltip';

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
      <Tooltip
        position="top"
        text={(theme === 'light' ? 'Dark' : 'Light') + ' Mode'}
        offset={12}
      >
        <button
          className={`${styles.switch} ${theme === 'light' ? styles.active : ''} ${
            className || ''
          }`}
          {...restProps}
        />
      </Tooltip>
      <IconLightMode
        className={`${styles.icon} ${theme === 'light' ? styles.active : ''}`}
      />
    </div>
  );
}
