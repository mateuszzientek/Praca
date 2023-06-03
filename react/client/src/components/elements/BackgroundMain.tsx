import React, { ReactNode, useContext } from 'react';
import { ThemeContext } from './ThemeContext';

interface BackgroundMainProps {
  children: ReactNode;
}

function BackgroundMain({ children }: BackgroundMainProps) {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div className={theme === 'dark' ? 'main-background-black' : 'main-background'}>
      {children}
    </div>
  );
}

export default BackgroundMain;