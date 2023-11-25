/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from 'react';
import styles from './Menu.module.scss';
import { MenuContext } from '@/context/menu.context';
import Text from '../Text';

export interface MenuProps {
  items: ({ name: { Icon?: any; text: string } } & {
    action: () => void;
  })[];
  windowPos: { x: number; y: number };
}

export default function Menu(props: MenuProps) {
  const { items, windowPos } = props;

  const { removeMenu } = useContext(MenuContext);
  const [windowPosRendered, setWindowPosRendered] = useState(windowPos);
  const [directionChecked, setDirectionChecked] = useState(false);

  const iconProps: any = {
    className: styles.itemIcon,
    width: '22',
    height: '22',
  };

  return (
    <ul
      className={styles.container}
      ref={(node) => {
        if (directionChecked || !node) return;
        setDirectionChecked(true);

        setWindowPosRendered((state) => {
          // Fix if menu is overflowing from window
          const copy = { ...state };

          if (window.innerWidth < windowPos.x + node.clientWidth) {
            copy.x -= node.clientWidth;
          }
          if (window.innerHeight < windowPos.y + node.clientHeight) {
            copy.y -= node.clientHeight;
          }

          return copy;
        });
      }}
      style={{
        transform: `translate(${windowPosRendered.x}px, ${windowPosRendered.y}px)`,
      }}
    >
      {items.map((item) => (
        <li key={item.name.text}>
          <button
            className={styles.item}
            onClick={() => {
              item.action();
              removeMenu();
            }}
          >
            {item.name.Icon && <item.name.Icon {...iconProps} />}
            <Text as="span" variant="S" className={styles.itemText}>
              {item.name.text}
            </Text>
          </button>
        </li>
      ))}
    </ul>
  );
}
