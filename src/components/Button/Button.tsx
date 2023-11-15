import styles from './Button.module.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export default function Button(props: Props) {
  const { className, children, ...restProps } = props;

  return (
    <button className={`${styles.button} ${className || ''}`} {...restProps}>
      {children}
    </button>
  );
}
