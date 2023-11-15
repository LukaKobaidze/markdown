import styles from './Heading.module.scss';

type HeadingLevel = '1' | '2' | '3' | '4' | '5' | '6';

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
  level: HeadingLevel;
  styleLevel?: HeadingLevel;
}

export default function Heading(props: Props) {
  const { level, styleLevel = level, children, ...restProps } = props;

  const HeadingLevel: keyof JSX.IntrinsicElements = `h${level}`;

  return (
    <HeadingLevel
      className={`${styles.heading} ${styles[`heading--${styleLevel}`]}`}
      {...restProps}
    >
      {children}
    </HeadingLevel>
  );
}
