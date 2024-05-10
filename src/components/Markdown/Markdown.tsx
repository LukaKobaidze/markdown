import MainContainerHeader from '../MainContainerHeader';
import styles from './Markdown.module.scss';
import { useLayoutStore } from '@/store/layout.store';
import MarkdownTextarea from './MarkdownTextarea';

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export default function Markdown(props: Props) {
  const { className, ...restProps } = props;

  const extendedContainer = useLayoutStore((state) => state.extendedContainer);
  const toggleMarkdownExtend = useLayoutStore((state) => state.toggleMarkdownExtend);
  const resizerPercentage = useLayoutStore((state) => state.resizerPercentage);
  const isResizing = useLayoutStore((state) => state.isResizing);

  return (
    <>
      <div
        className={`${styles.container} ${className}`}
        style={{
          width:
            extendedContainer === 'markdown'
              ? '100%'
              : extendedContainer === 'preview'
              ? 0
              : resizerPercentage + '%',
          transition: isResizing ? undefined : 'width 200ms',
        }}
        {...restProps}
      >
        <MainContainerHeader
          title="Markdown"
          isExtended={extendedContainer === 'markdown'}
          onToggleExtend={toggleMarkdownExtend}
        />
        <MarkdownTextarea />
      </div>
    </>
  );
}
