/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from 'react';
import styles from './Menu.module.scss';
import { MenuContext } from '@/context/menu.context';
import Text from '../Text';
import AlertOutsideAction from '../AlertOutsideAction';

export interface MenuProps {
  items: ({ name: { Icon?: any; text: string } } & {
    action: () => void;
  })[];
  windowPos: { x: number; y: number };
}

interface Props extends MenuProps {
  onClose: () => void;
}

export default function Menu(props: Props) {
  const { items, windowPos, onClose } = props;

  const { removeMenu } = useContext(MenuContext);
  const [windowPosRendered, setWindowPosRendered] = useState(windowPos);
  const [directionChecked, setDirectionChecked] = useState(false);
  const [keyboardSelectedAction, setKeyboardActionSelected] = useState<
    number | null
  >(null);

  const iconProps: any = {
    className: styles.itemIcon,
    width: '22',
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();

      switch (e.key) {
        case 'ArrowDown':
          {
            setKeyboardActionSelected((state) => {
              if (state === null || state === items.length - 1) {
                return 0;
              }

              return state + 1;
            });
          }
          break;
        case 'ArrowUp':
          {
            setKeyboardActionSelected((state) => {
              if (!state) {
                return items.length - 1;
              }
              return state - 1;
            });
          }
          break;
        case 'Enter':
        case ' ':
          {
            if (keyboardSelectedAction !== null) {
              items[keyboardSelectedAction].action();
              onClose();
            }
          }
          break;
        case 'Escape':
        case 'Tab':
          {
            onClose();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [items, keyboardSelectedAction, onClose]);

  return (
    <AlertOutsideAction event="mousedown" onOutsideAction={onClose}>
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
        {items.map((item, itemIndex) => (
          <li key={item.name.text}>
            <button
              className={`${styles.item} ${
                keyboardSelectedAction === itemIndex ? styles.active : ''
              }`}
              onClick={() => {
                item.action();
                removeMenu();
              }}
              tabIndex={-1}
            >
              {item.name.Icon && <item.name.Icon {...iconProps} />}
              <Text as="span" variant="S" className={styles.itemText}>
                {item.name.text}
              </Text>
            </button>
          </li>
        ))}
      </ul>
    </AlertOutsideAction>
  );
}
