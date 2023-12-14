import { ThemeType } from '@/types';
import { useEffect, useState } from 'react';

export default function useTheme() {
  const [theme, setTheme] = useState<ThemeType>('dark');

  useEffect(() => {
    document.body.classList.add(theme);
    document.body.classList.remove(theme === 'dark' ? 'light' : 'dark');
  }, [theme]);

  return { theme, setTheme };
}
