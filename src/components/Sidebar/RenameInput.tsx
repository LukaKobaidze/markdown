import Input from '../Input';
import Text from '../Text';
import { useState } from 'react';
import styles from './RenameInput.module.scss';

interface Props {
  name: string;
  onRenameSubmit: (newName: string) => void;
  isDocument?: boolean;
  className?: string;
}

export default function RenameInput(props: Props) {
  const { name, onRenameSubmit, isDocument, className } = props;

  const [renameValue, setRenameValue] = useState(name);

  const handleRenameSubmit = () => {
    onRenameSubmit(renameValue);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleRenameSubmit();
      }}
      className={className}
    >
      <div className={styles.inputWrapper}>
        <Input
          className={styles.input}
          autoFocus
          onBlur={handleRenameSubmit}
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
        />
        {isDocument && (
          <Text as="span" variant="S-light">
            .md
          </Text>
        )}
      </div>
    </form>
  );
}
