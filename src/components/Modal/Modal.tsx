import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import FocusTrap from 'focus-trap-react';
import AlertOutsideAction from '../AlertOutsideAction';
import styles from './Modal.module.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal(props: Props) {
  const { onClose, className, children, ...restProps } = props;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div className={styles.container}>
      <FocusTrap>
        <AlertOutsideAction
          event="mousedown"
          onOutsideAction={onClose}
          className={`${styles.modal} ${className}`}
          {...restProps}
        >
          {children}
        </AlertOutsideAction>
      </FocusTrap>
    </div>,
    document.body
  );
}
