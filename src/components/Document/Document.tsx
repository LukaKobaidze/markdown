/* eslint-disable @typescript-eslint/no-unused-vars */

import styles from './Document.module.scss';
import { IconDocument } from '@/assets';
import Text from '../Text';

type Props = { documentName: string } & (
  | ({
      as: 'div';
    } & React.HTMLAttributes<HTMLDivElement>)
  | ({ as: 'button' } & React.ButtonHTMLAttributes<HTMLButtonElement>)
);

export default function Document(props: Props) {
  const renderContent = (
    <>
      <IconDocument />
      <div className={styles.documentTextWrapper}>
        <Text as="span" variant="S-light" className={styles.documentSubTitle}>
          Document Name
        </Text>
        <Text as="span" variant="M" className={styles.documentName}>
          {props.documentName}
        </Text>
      </div>
    </>
  );

  switch (props.as) {
    case 'div': {
      const { as, className, ...restProps } = props;

      return (
        <div className={`${styles.document} ${className}`} {...restProps}>
          {renderContent}
        </div>
      );
    }
    case 'button': {
      const { as, className, ...restProps } = props;

      return (
        <button
          className={`${styles.document} ${styles['document--button']} ${
            className || ''
          }`}
          {...restProps}
        >
          {renderContent}
        </button>
      );
    }
  }
}
