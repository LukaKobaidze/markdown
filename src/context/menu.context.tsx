import { createContext, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Menu, { MenuProps } from '@/components/Menu';

interface Context {
  renderMenu: (props: MenuProps) => void;
  removeMenu: () => void;
}

const initial: Context = {
  renderMenu: () => {},
  removeMenu: () => {},
};

export const MenuContext = createContext(initial);

export function MenuContextProvider({ children }: { children: React.ReactNode }) {
  const [menuPropsState, setMenuPropsState] = useState<MenuProps | null>(null);

  const renderMenu: Context['renderMenu'] = useCallback((props: MenuProps) => {
    setMenuPropsState(props);
  }, []);
  const removeMenu: Context['removeMenu'] = useCallback(() => {
    setMenuPropsState(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = () => {};

    if (menuPropsState) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuPropsState]);

  return (
    <MenuContext.Provider value={{ renderMenu, removeMenu }}>
      {children}
      {menuPropsState &&
        createPortal(
          <Menu onClose={removeMenu} {...menuPropsState} />,
          document.body
        )}
    </MenuContext.Provider>
  );
}
