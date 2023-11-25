import { useState, useEffect } from 'react';
import styles from './Resizer.module.scss';

const MARKDOWN_MIN_SIZE = 30;
const MARKDOWN_MAX_SIZE = 70;

interface Props {
  containerRef: React.RefObject<HTMLElement>;
  setIsMarkdownHidden: React.Dispatch<React.SetStateAction<boolean>>;
  setMarkdownSize: React.Dispatch<React.SetStateAction<number>>;
}

export default function Resizer(props: Props) {
  const { containerRef, setIsMarkdownHidden, setMarkdownSize } = props;

  const [isResizing, setIsResizing] = useState(false);
  const [isKeyboardResizing, setIsKeyboardResizing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const container = containerRef.current;

      if (container) {
        const size =
          ((e.pageX - container.offsetLeft) / container.clientWidth) * 100;

        if (size < MARKDOWN_MIN_SIZE / 2) {
          setMarkdownSize(MARKDOWN_MIN_SIZE);
          setIsMarkdownHidden(true);
        } else if (size > MARKDOWN_MAX_SIZE + (100 - MARKDOWN_MAX_SIZE) / 2) {
          setMarkdownSize(100);
        } else {
          setMarkdownSize(
            Math.min(Math.max(size, MARKDOWN_MIN_SIZE), MARKDOWN_MAX_SIZE)
          );
          setIsMarkdownHidden(false);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [containerRef, isResizing, setIsMarkdownHidden, setMarkdownSize]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          {
            setMarkdownSize((state) => {
              const stateNext = state - 1;

              if (stateNext < MARKDOWN_MIN_SIZE) {
                setIsMarkdownHidden(true);
                return MARKDOWN_MIN_SIZE;
              }

              return stateNext;
            });
          }
          break;
        case 'ArrowRight': {
          setMarkdownSize((state) => {
            const stateNext = state + 1;

            return stateNext;
          });
        }
      }
    };

    if (isKeyboardResizing) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isKeyboardResizing]);

  return (
    <button
      className={`${styles.resize} ${
        isResizing || isKeyboardResizing ? styles.active : ''
      }`}
      onMouseDown={() => setIsResizing(true)}
      onFocus={() => setIsKeyboardResizing(true)}
      onBlur={() => setIsKeyboardResizing(false)}
    />
  );
}
