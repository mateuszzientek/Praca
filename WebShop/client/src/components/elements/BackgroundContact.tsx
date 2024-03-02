import React, { ReactNode } from 'react';

interface BackgroundContactProps {
  children: ReactNode;
}

function BackgroundContact({ children }: BackgroundContactProps) {
  return (
    <div className="main-background">
      {children}
    </div>
  );
}

export default BackgroundContact;