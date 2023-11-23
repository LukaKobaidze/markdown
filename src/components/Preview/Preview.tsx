import { useMemo } from 'react';
import MarkdownHeader from '../MarkdownHeader';
import styles from './Preview.module.scss';
import Heading from '../Heading';
import Text from '../Text';
import { HeadingLevel } from '../Heading/Heading';
import Blockquote from '../Blockquote';
import InlineCode from '../InlineCode';
import CodeBlock from '../CodeBlock';
import { IconHidePreview, IconShowPreview } from '@/assets';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  markdownContent: string;
  isMarkdownHidden: boolean;
  onToggleMarkdown: () => void;
}

export default function Preview(props: Props) {
  const {
    markdownContent,
    isMarkdownHidden,
    onToggleMarkdown,
    className,
    ...restProps
  } = props;

  const handleInline = (str: string): React.ReactNode[] => {
    const output: React.ReactNode[] = [''];

    for (let i = 0; i < str.length; i++) {
      if (str[i] === '`') {
        let secondBracketIndex = -1;

        for (let j = i + 1; j < str.length; j++) {
          if (str[j] === '`') {
            secondBracketIndex = j;
            break;
          }
        }

        if (secondBracketIndex === -1) {
          output[output.length - 1] += '`';
        } else {
          const textContent = str.slice(i + 1, secondBracketIndex);

          if (textContent !== '') {
            output.push(
              <InlineCode>{str.slice(i + 1, secondBracketIndex)}</InlineCode>,
              ''
            );
          } else {
            output[output.length - 1] += '``';
          }
          i = secondBracketIndex;
        }
      } else if (str[i] === '[') {
        let embedText = '';
        let embedLink = '';

        let loopEndedAt = -1;

        for (let j = i + 1; j < str.length; j++) {
          if (str[j] === ']' && str[j + 1] === '(') {
            embedText = str.slice(i + 1, j);

            for (let k = j + 2; k < str.length; k++) {
              if (str[k] === ')') {
                embedLink = str.slice(j + 2, k);
                loopEndedAt = k;
                break;
              }
            }

            break;
          }
        }

        if (embedText && embedLink && loopEndedAt !== -1) {
          output.push(<a href={embedLink}>{embedText}</a>, '');
          i = loopEndedAt;
        } else {
          output[output.length - 1] += str[i];
        }
      } else {
        output[output.length - 1] += str[i];
      }
    }

    return output;
  };

  const previewRender = useMemo(() => {
    const output: JSX.Element[] = [];

    const contentLines = markdownContent.split('\n');

    let i = 0;
    while (i < contentLines.length) {
      const line = contentLines[i].trim();

      if (line.length === 0) {
        // Empty line
        output.push(<br key={i} />);
        i++;
      } else if (line.charAt(0) === '#') {
        // Heading

        const firstSpaceIndex = line.indexOf(' ');

        // Invalid heading format
        if (firstSpaceIndex > 6) {
          output.push(
            <Text key={line} as="p" variant="slab-regular">
              {handleInline(line)}
            </Text>
          );
        } else {
          const textContent = line.slice(firstSpaceIndex + 1);

          output.push(
            <Heading
              key={textContent}
              level={String(firstSpaceIndex) as HeadingLevel}
            >
              {handleInline(textContent)}
            </Heading>
          );
        }
        i++;
      } else if (line.charAt(0) === '-') {
        // Bullet points list

        const listItems: JSX.Element[] = [];
        let lineBreaksAtTheEnd: JSX.Element[] = [];

        // Loop through list items
        while (i < contentLines.length) {
          const line = contentLines[i].trim();

          if (line.length === 0) {
            lineBreaksAtTheEnd.push(<br />);
            i++;
            continue;
          }

          if (line.charAt(0) === '-') {
            lineBreaksAtTheEnd = [];
            const content = line.slice(1).trim();

            listItems.push(
              <li key={content}>
                <Text as="span" variant="slab-regular">
                  {handleInline(content)}
                </Text>
              </li>
            );
            i++;
          } else {
            break;
          }
        }

        output.push(<ul>{listItems}</ul>, ...lineBreaksAtTheEnd);
      } else if (
        line.includes('. ') &&
        !isNaN(Number(line.slice(0, line.indexOf('. '))))
      ) {
        const olStartsFrom = Number(line.slice(0, line.indexOf('. ')));
        const listItems: JSX.Element[] = [];
        let lineBreaksAtTheEnd: JSX.Element[] = [];

        while (i < contentLines.length) {
          const line = contentLines[i].trim();

          if (line.length === 0) {
            lineBreaksAtTheEnd.push(<br />);
            i++;
            continue;
          }

          const indexOfDot = line.indexOf('. ');

          if (indexOfDot !== -1 && !Number.isNaN(line.slice(0, indexOfDot))) {
            lineBreaksAtTheEnd = [];
            const content = line.slice(indexOfDot + 1).trim();

            listItems.push(
              <li key={content}>
                <Text as="span" variant="slab-regular">
                  {handleInline(content)}
                </Text>
              </li>
            );
            i++;
          } else {
            break;
          }
        }

        output.push(
          <ol start={olStartsFrom}>{listItems}</ol>,
          ...lineBreaksAtTheEnd
        );
      } else if (line.charAt(0) === '>') {
        output.push(<Blockquote>{handleInline(line.slice(1).trim())}</Blockquote>);

        i++;
      } else if (line === '```') {
        const textLines: string[] = [];

        i++;

        while (i < contentLines.length) {
          const line = contentLines[i];

          if (line.trim() === '```') {
            break;
          } else {
            textLines.push(line);
            i++;
          }
        }

        output.push(<CodeBlock>{textLines.join('\n')}</CodeBlock>);

        i++;
      } else {
        output.push(
          <Text as="p" variant="slab-regular" className={styles.paragraph}>
            {handleInline(line)}
          </Text>
        );

        i++;
      }
    }

    return output;
  }, [markdownContent]);

  return (
    <div className={`${styles.container} ${className}`} {...restProps}>
      <MarkdownHeader className={styles.header}>
        <span>PREVIEW</span>
        <button
          className={styles.focusPreviewButton}
          onClick={() => onToggleMarkdown()}
        >
          {isMarkdownHidden ? <IconHidePreview /> : <IconShowPreview />}
        </button>
      </MarkdownHeader>
      <div className={styles.markdownWrapper} tabIndex={0}>
        <div className={styles.markdown}>{previewRender}</div>
      </div>
    </div>
  );
}
