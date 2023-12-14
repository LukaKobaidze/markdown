import { createContext, useCallback } from 'react';
import { DocumentType } from '@/types';
import { createNewDocument, initializeDocuments } from '@/helpers';
import useLocalStorageState from '@/hooks/useLocalStorageState';

interface Context {
  documents: DocumentType[];
  currentDocument: number;
  onMarkdownEdit: (content: string) => void;
  onCreateDocument: (name: string) => void;
  onRenameDocument: (newName: string, argDocumentIndex?: number) => void;
  onDeleteDocument: (documentIndex?: number) => void;
  setCurrentDocument: React.Dispatch<React.SetStateAction<number>>;
}

const initial: Context = {
  documents: initializeDocuments(),
  currentDocument: 1,
  onMarkdownEdit: () => {},
  onCreateDocument: () => {},
  onRenameDocument: () => {},
  onDeleteDocument: () => {},
  setCurrentDocument: () => {},
};

export const DocumentsContext = createContext<Context>(initial);

interface Props {
  children: React.ReactNode;
}

export function DocumentsContextProvider({ children }: Props) {
  const [documents, setDocuments] = useLocalStorageState(
    'documents-data',
    initial.documents
  );
  const [currentDocument, setCurrentDocument] = useLocalStorageState(
    'current-document',
    initial.currentDocument
  );

  const onMarkdownEdit: Context['onMarkdownEdit'] = useCallback(
    (content) => {
      setDocuments((state) => {
        return [
          ...state.slice(0, currentDocument),
          { ...state[currentDocument], content },
          ...state.slice(currentDocument + 1),
        ];
      });
    },
    [currentDocument, setDocuments]
  );

  const onCreateDocument: Context['onCreateDocument'] = useCallback(
    (name) => {
      setDocuments((state) => {
        return [createNewDocument(name), ...state];
      });
      setCurrentDocument(0);
    },
    [setDocuments, setCurrentDocument]
  );

  const onRenameDocument: Context['onRenameDocument'] = useCallback(
    (argNewName, argDocumentIndex) => {
      const newName = (argNewName + '.md').trim();

      if (
        newName === '.md' ||
        documents.some((document) => document.name === newName)
      ) {
        return;
      }

      const documentIndex =
        argDocumentIndex === undefined ? currentDocument : argDocumentIndex;

      setDocuments((state) => [
        ...state.slice(0, documentIndex),
        { ...state[documentIndex], name: newName },
        ...state.slice(documentIndex + 1),
      ]);
    },
    [documents, currentDocument, setDocuments]
  );

  const onDeleteDocument: Context['onDeleteDocument'] = useCallback(
    (documentIndex) => {
      if (documentIndex !== undefined) {
        setDocuments((documentsState) => {
          setCurrentDocument((currentDocumentState) =>
            documentIndex <= currentDocumentState
              ? Math.max(currentDocumentState - 1, 0)
              : currentDocumentState
          );

          return [
            ...documentsState.slice(0, documentIndex),
            ...documentsState.slice(documentIndex + 1),
          ];
        });
      } else {
        setCurrentDocument((currentDocumentState) => {
          setDocuments((documentsState) => {
            return [
              ...documentsState.slice(0, currentDocumentState),
              ...documentsState.slice(currentDocumentState + 1),
            ];
          });

          return Math.max(currentDocumentState - 1, 0);
        });
      }
    },
    [setCurrentDocument, setDocuments]
  );

  return (
    <DocumentsContext.Provider
      value={{
        documents,
        currentDocument,
        onMarkdownEdit,
        onCreateDocument,
        onRenameDocument,
        onDeleteDocument,
        setCurrentDocument,
      }}
    >
      {children}
    </DocumentsContext.Provider>
  );
}
