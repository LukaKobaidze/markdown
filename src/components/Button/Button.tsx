import { forwardRef } from 'react';
import styles from './Button.module.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
type Ref = HTMLButtonElement;

export default forwardRef<Ref, Props>(function Button(props, ref) {
  const { className, children, ...restProps } = props;

  return (
    <button
      ref={ref}
      className={`${styles.button} ${className || ''}`}
      {...restProps}
    >
      {children}
    </button>
  );
});
