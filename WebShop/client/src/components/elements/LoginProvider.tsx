import React, { createContext, useState, Dispatch, SetStateAction, ReactNode } from 'react';

interface LoginContextProps {
  isLoginSelected: boolean,
  setLoginSelected: Dispatch<SetStateAction<boolean>>;
}

interface ThemeContextProviderChildren {
  children: ReactNode;
}

const LoginContext = createContext<LoginContextProps>({} as LoginContextProps);

const LoginProvider: React.FC<ThemeContextProviderChildren> = ({ children }) => {
  const [isLoginSelected, setLoginSelected] = useState(true);

  return (
    <LoginContext.Provider
      value={{ isLoginSelected, setLoginSelected }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export { LoginProvider, LoginContext };

