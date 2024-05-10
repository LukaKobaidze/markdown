import { useEffect } from 'react';
import { useLayoutStore } from '@/store/layout.store';
import styles from './Resizer.module.scss';

interface Props {
  containerRef: React.RefObject<HTMLElement>;
}

export default function Resizer(props: Props) {
  const { containerRef } = props;

  const isResizing = useLayoutStore((state) => state.isResizing);
  const isKeyboardResizing = useLayoutStore((state) => state.isKeyboardResizing);
  const resizingStarted = useLayoutStore((state) => state.resizingStarted);
  const resizingDone = useLayoutStore((state) => state.resizingDone);
  const keyboardResizingStarted = useLayoutStore(
    (state) => state.keyboardResizingStarted
  );
  const keyboardResizingDone = useLayoutStore((state) => state.keyboardResizingDone);
  const updateResizerPercentage = useLayoutStore(
    (state) => state.updateResizerPercentage
  );
  const resizerKeyboardArrowLeft = useLayoutStore(
    (state) => state.resizerKeyboardArrowLeft
  );
  const resizerKeyboardArrowRight = useLayoutStore(
    (state) => state.resizerKeyboardArrowRight
  );

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlePointerMove = (e: any) => {
      e.preventDefault();

      const container = containerRef.current;

      const x = e.clientX || e.changedTouches[0].clientX;

      if (container) {
        updateResizerPercentage(
          ((x - container.offsetLeft) / container.clientWidth) * 100
        );
      }
    };

    const handlePointerUp = () => {
      resizingDone();
      keyboardResizingDone();
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
          resizerKeyboardArrowLeft();
          break;
        case 'ArrowRight': {
          resizerKeyboardArrowRight();
        }
      }
    };

    if (isKeyboardResizing) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isKeyboardResizing]);

  return (
    <button
      className={`${styles.resize} ${
        isResizing || isKeyboardResizing ? styles.active : ''
      }`}
      onMouseDown={() => resizingStarted()}
      onTouchStart={() => resizingStarted()}
      onTouchEnd={() => resizingDone()}
      onTouchCancel={() => resizingDone()}
      onFocus={() => keyboardResizingStarted()}
      onBlur={() => keyboardResizingDone()}
    />
  );
}
