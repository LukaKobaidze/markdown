import styles from './Text.module.scss';

interface Props
  extends React.HTMLAttributes<HTMLParagraphElement | HTMLSpanElement> {
  as: 'span' | 'p';
  variant: 'M' | 'S' | 'S-light' | 'slab-regular' | 'slab-bold' | 'mono-regular';
}

export default function Text(props: Props) {
  const { as, variant, className, children, ...restProps } = props;

  const TextAs: keyof JSX.IntrinsicElements = as;

  return (
    <TextAs
      className={`${styles.text} ${styles[`text--${variant}`]} ${className || ''}`}
      {...restProps}
    >
      {children}
    </TextAs>
  );
}
