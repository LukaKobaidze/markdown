import { create } from 'zustand';

type ExtendedContainerType = 'markdown' | 'preview' | null;

export interface LayoutState {
  extendedContainer: ExtendedContainerType;
  resizerPercentage: number;
  isResizing: boolean;
  isKeyboardResizing: boolean;
  isSidebarExpanded: boolean;
  hideSidebar: () => void;
  showSidebar: () => void;
  toggleSidebar: () => void;
  updateResizerPercentage: (percentage: number) => void;
  resizingStarted: () => void;
  resizingDone: () => void;
  keyboardResizingStarted: () => void;
  keyboardResizingDone: () => void;
  resizerKeyboardArrowLeft: () => void;
  resizerKeyboardArrowRight: () => void;
  togglePreviewExtend: () => void;
  toggleMarkdownExtend: () => void;
  updateExtendedContainer: (container: ExtendedContainerType) => void;
}

const MARKDOWN_MIN_SIZE = 30;
const MARKDOWN_MAX_SIZE = 70;

export const useLayoutStore = create<LayoutState>()((set) => ({
  extendedContainer: null,
  resizerPercentage: 50,
  isResizing: false,
  isKeyboardResizing: false,
  isSidebarExpanded: true,
  hideSidebar: () => set(() => ({ isSidebarExpanded: false })),
  showSidebar: () => set(() => ({ isSidebarExpanded: true })),
  toggleSidebar: () =>
    set((state) => ({ isSidebarExpanded: !state.isSidebarExpanded })),
  resizingStarted: () => set(() => ({ isResizing: true })),
  resizingDone: () => set(() => ({ isResizing: false })),
  keyboardResizingStarted: () => set(() => ({ isKeyboardResizing: true })),
  keyboardResizingDone: () => set(() => ({ isKeyboardResizing: false })),
  updateResizerPercentage: (percentage) =>
    set(() => {
      if (percentage < MARKDOWN_MIN_SIZE / 2) {
        return {
          resizerPercentage: MARKDOWN_MIN_SIZE,
          extendedContainer: 'preview',
        };
      } else if (percentage > MARKDOWN_MAX_SIZE + (100 - MARKDOWN_MAX_SIZE) / 2) {
        return {
          resizerPercentage: MARKDOWN_MAX_SIZE,
          extendedContainer: 'markdown',
        };
      } else {
        return {
          resizerPercentage: Math.min(
            Math.max(percentage, MARKDOWN_MIN_SIZE),
            MARKDOWN_MAX_SIZE
          ),
          extendedContainer: null,
        };
      }
    }),
  resizerKeyboardArrowLeft: () =>
    set((state) => {
      const resizerPercentage = state.resizerPercentage - 5;

      if (resizerPercentage <= MARKDOWN_MIN_SIZE) {
        return {
          resizerPercentage: MARKDOWN_MIN_SIZE,
          extendedContainer: 'preview',
        };
      }

      return { resizerPercentage, extendedContainer: null };
    }),
  resizerKeyboardArrowRight: () =>
    set((state) => {
      const resizerPercentage = state.resizerPercentage + 5;

      if (resizerPercentage >= MARKDOWN_MAX_SIZE) {
        return {
          resizerPercentage: MARKDOWN_MAX_SIZE,
          extendedContainer: 'markdown',
        };
      }

      return { resizerPercentage, extendedContainer: null };
    }),
  togglePreviewExtend: () =>
    set((state) => ({
      extendedContainer: state.extendedContainer === null ? 'preview' : null,
    })),
  toggleMarkdownExtend: () =>
    set((state) => ({
      extendedContainer: state.extendedContainer === null ? 'markdown' : null,
    })),
  updateExtendedContainer: (container) =>
    set(() => ({ extendedContainer: container })),
}));
