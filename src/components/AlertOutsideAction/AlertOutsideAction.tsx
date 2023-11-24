/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef } from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  event: 'click' | 'mousedown';
  onOutsideAction: () => void;
  handleWhen?: boolean;
  ignore?: React.RefObject<Element>[];
}

export default function AlertOutsideAction(props: Props) {
  const {
    event,
    ignore,
    handleWhen = true,
    onOutsideAction,
    children,
    ...restProps
  } = props;

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEvent = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;

      if (
        !ref.current?.contains(target) &&
        (!ignore || ignore.every((ref) => !ref.current?.contains(target)))
      ) {
        onOutsideAction();
      }
    };

    if (handleWhen) {
      document.addEventListener(event, handleEvent);
    } else {
      document.removeEventListener(event, handleEvent);
    }

    return () => document.removeEventListener(event, handleEvent);
  }, [handleWhen, onOutsideAction, ignore, event]);

  return (
    <div ref={ref} {...restProps}>
      {children}
    </div>
  );
}
