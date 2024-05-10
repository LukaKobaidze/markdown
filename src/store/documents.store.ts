import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { initializeDirectory, validateNameUnique } from './documentsStore.helpers';

export type DirectoryState = Record<string, DocumentType | FolderType>;

export type DocumentType = {
  type: 'document';
  createdAt: Date;
  markdown: string;
};
export type FolderType = {
  type: 'folder';
  directory: DirectoryState;
};

export type NodeType = 'document' | 'folder';

export interface DocumentsState {
  directory: DirectoryState;
  activeDocumentPath: string;
  openDocument: (path: string) => void;
  createNode: (path: string, node: NodeType) => void;
  renameNode: (newName: string, path?: string) => void;
  deleteNode: (path?: string) => void;
  saveDocument: (markdown: string) => void;
}

const directory = initializeDirectory();

export const useDocumentsStore = create<DocumentsState>()(
  immer((set) => ({
    directory,
    activeDocumentPath: 'welcome.md',
    activeDocument: directory['welcome.md'] as DocumentType,
    openDocument: (path) =>
      set((state) => {
        state.activeDocumentPath = path;
      }),
    createNode: (path, node) =>
      set((state) => {
        const pathArray = path.split('/');

        let directory = state.directory;

        for (let i = 0; i < pathArray.length - 1; i++) {
          directory = (directory[pathArray[i]] as FolderType).directory;

          if (!directory) return state;
        }

        const nodeName = pathArray[pathArray.length - 1];

        if (node === 'document') {
          directory[nodeName] = {
            type: 'document',
            createdAt: new Date(),
            markdown: '',
          };
        } else {
          directory[nodeName] = {
            type: 'folder',
            directory: {},
          };
        }

        if (node === 'document') {
          state.activeDocumentPath = path;
        }
      }),
    renameNode: (newName, path) =>
      set((state) => {
        const pathArray = (path || state.activeDocumentPath).split('/');

        let directory = state.directory;

        pathArray.slice(0, -1).forEach((folder) => {
          directory = (directory[folder] as FolderType).directory;
        });

        validateNameUnique(newName, directory);
        const oldName = pathArray[pathArray.length - 1];
        const data = directory[oldName];

        delete directory[oldName];
        directory[newName] = data;

        if (data.type === 'document') {
          let pathDirectory = pathArray.slice(0, -1).join('/');

          if (pathDirectory.length !== 0) {
            pathDirectory += '/';
          }

          state.activeDocumentPath = pathDirectory + newName;
        }
      }),
    deleteNode: (argPath) =>
      set((state) => {
        const path = argPath || state.activeDocumentPath;

        const pathArray = path.split('/');

        let directory = state.directory;

        for (let i = 0; i < pathArray.length - 1; i++) {
          directory = (directory[pathArray[i]] as FolderType)?.directory || null;

          if (!directory) return state;
        }

        delete directory[pathArray[pathArray.length - 1]];
      }),
    saveDocument: (markdown) =>
      set((state) => {
        const slashLastIndex = state.activeDocumentPath.lastIndexOf('/');

        if (slashLastIndex === -1) {
          (state.directory[state.activeDocumentPath] as DocumentType).markdown =
            markdown;
        } else {
          const pathArray = state.activeDocumentPath.split('/');

          let directory = state.directory;

          for (let i = 0; i < pathArray.length - 1; i++) {
            directory = (directory[pathArray[i]] as FolderType).directory;

            if (!directory) return state;
          }
          (directory[pathArray[pathArray.length - 1]] as DocumentType).markdown =
            markdown;
        }
      }),
  }))
);
