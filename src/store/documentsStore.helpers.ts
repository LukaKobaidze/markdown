import { DirectoryState, DocumentType, FolderType } from './documents.store';

export function initializeDirectory(): DirectoryState {
  return {
    'untitled-document.md': {
      type: 'document',
      createdAt: new Date(),
      markdown: '',
    },
    'welcome.md': {
      type: 'document',
      createdAt: new Date(),
      markdown:
        "# Welcome to Markdown\n\nMarkdown is a lightweight markup language that you can use to add formatting elements to plaintext text directory.\n\n## How to use this?\n\n1. Write markdown in the markdown editor window\n2. See the rendered markdown in the preview window\n\n### Features\n\n- Create headings, paragraphs, links, blockquotes, inline-code, code blocks, and lists\n- Name and save the document to access again later\n- Choose between Light or Dark mode depending on your preference\n\n> This is an example of a blockquote. If you would like to learn more about markdown syntax, you can visit this [markdown cheatsheet](https://www.markdownguide.org/cheat-sheet/).\n\n#### Headings\n\nTo create a heading, add the hash sign (#) before the heading. The number of number signs you use should correspond to the heading level. You'll see in this guide that we've used all six heading levels (not necessarily in the correct way you should use headings!) to illustrate how they should look.\n\n##### Lists\n\nYou can see examples of ordered and unordered lists above.\n\n###### Code Blocks\n\nThis markdown editor allows for inline-code snippets, like this: `<p>I'm inline</p>`. It also allows for larger code blocks like this:\n\n```\n<main>\n  <h1>This is a larger code block</h1>\n</main>\n```",
    },
  };
}

export function validateNameUnique(name: string, directory: DirectoryState) {
  if (Object.keys(directory).some((documentName) => documentName === name)) {
    throw new Error();
  }
}

export function findFolderDirectoryByPath(
  path: string,
  directory: DirectoryState
): DirectoryState | null {
  const pathArray = path.split('/');

  if (path.endsWith('.md')) {
    pathArray.pop();
  }

  let output = directory;

  for (let i = 0; i < pathArray.length; i++) {
    if (!output) return null;

    output = (output[pathArray[i]] as FolderType)?.directory || null;
  }

  return output;
}

export function findDocumentByPath(path: string, directory: DirectoryState) {
  if (!path.endsWith('.md')) return null;

  const slashLastIndex = path.lastIndexOf('/');

  if (slashLastIndex === -1) {
    return directory[path] as DocumentType | null;
  }

  const folderDirectory = findFolderDirectoryByPath(path, directory);

  if (!folderDirectory) return null;

  return folderDirectory[path.slice(slashLastIndex + 1)] as DocumentType;
}
