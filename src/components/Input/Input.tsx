import { forwardRef } from 'react';
import styles from './Input.module.scss';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}
type Ref = HTMLInputElement;

export default forwardRef<Ref, Props>(function Input(props, ref) {
  const { className, ...restProps } = props;

  return (
    <input
      ref={ref}
      className={`${styles.input} ${className || ''}`}
      {...restProps}
    />
  );
});
