import { useState, useEffect } from 'react';
import styles from './Resizer.module.scss';
import { ExtendedContainerType } from '@/types';

const MARKDOWN_MIN_SIZE = 30;
const MARKDOWN_MAX_SIZE = 70;

interface Props {
  containerRef: React.RefObject<HTMLElement>;
  setResizerPercentage: React.Dispatch<React.SetStateAction<number>>;
  setExtendedContainer: React.Dispatch<React.SetStateAction<ExtendedContainerType>>;
  isResizing: boolean;
  setIsResizing: React.Dispatch<React.SetStateAction<boolean>>;
  isKeyboardResizing: boolean;
  setIsKeyboardResizing: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Resizer(props: Props) {
  const {
    containerRef,
    setResizerPercentage,
    setExtendedContainer,
    isResizing,
    setIsResizing,
    isKeyboardResizing,
    setIsKeyboardResizing,
  } = props;

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlePointerMove = (e: any) => {
      e.preventDefault();

      const container = containerRef.current;

      const x = e.clientX || e.changedTouches[0].clientX;

      if (container) {
        const size = ((x - container.offsetLeft) / container.clientWidth) * 100;

        console.log(size);

        if (size < MARKDOWN_MIN_SIZE / 2) {
          setResizerPercentage(MARKDOWN_MIN_SIZE);
          setExtendedContainer('preview');
        } else if (size > MARKDOWN_MAX_SIZE + (100 - MARKDOWN_MAX_SIZE) / 2) {
          setResizerPercentage(MARKDOWN_MAX_SIZE);
          setExtendedContainer('markdown');
        } else {
          setResizerPercentage(
            Math.min(Math.max(size, MARKDOWN_MIN_SIZE), MARKDOWN_MAX_SIZE)
          );
          setExtendedContainer(null);
        }
      }
    };

    const handlePointerUp = () => {
      setIsResizing(false);
      setIsKeyboardResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handlePointerMove);
      document.addEventListener('mouseup', handlePointerUp);
      document.addEventListener('touchmove', handlePointerMove);
    }

    return () => {
      document.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('mouseup', handlePointerUp);
      document.removeEventListener('touchmove', handlePointerMove);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isResizing]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          {
            setResizerPercentage((state) => {
              const stateNext = state - 1;

              if (stateNext <= MARKDOWN_MIN_SIZE) {
                setExtendedContainer('preview');
                return MARKDOWN_MIN_SIZE;
              }

              setExtendedContainer(null);
              return stateNext;
            });
          }
          break;
        case 'ArrowRight': {
          setResizerPercentage((state) => {
            const stateNext = state + 1;

            if (stateNext >= MARKDOWN_MAX_SIZE) {
              setExtendedContainer('markdown');
              return MARKDOWN_MAX_SIZE;
            }

            setExtendedContainer(null);
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
  }, [isKeyboardResizing, setExtendedContainer, setResizerPercentage]);

  return (
    <button
      className={`${styles.resize} ${
        isResizing || isKeyboardResizing ? styles.active : ''
      }`}
      onMouseDown={() => setIsResizing(true)}
      onTouchStart={() => setIsResizing(true)}
      onTouchEnd={() => setIsResizing(false)}
      onTouchCancel={() => setIsResizing(false)}
      onFocus={() => setIsKeyboardResizing(true)}
      onBlur={() => setIsKeyboardResizing(false)}
    />
  );
}
