import { useEffect, useState } from 'react';

export type ThemeType = 'light' | 'dark';

export default function useTheme() {
  const [theme, setTheme] = useState<ThemeType>('dark');

  const toggleTheme = () => {
    setTheme((state) => (state === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    document.body.classList.add(theme);
    document.body.classList.remove(theme === 'dark' ? 'light' : 'dark');
  }, [theme]);

  return { theme, setTheme, toggleTheme };
}
