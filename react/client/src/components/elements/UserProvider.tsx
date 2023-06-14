import React, { createContext, useState, useEffect } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

interface User {
  _id: string | null;
  name: string | null;
  surname: string | null;
  email: string | null;
  role: string | null;
  email_offert: boolean | null;
}

interface UserContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isUserLoggedIn: boolean;
  setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => { },
  isUserLoggedIn: false,
  setIsUserLoggedIn: () => { },
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    axios
      .get('/user', { withCredentials: true } as AxiosRequestConfig)
      .then((response) => {
        const { _id, name, surname, email, role, email_offert } = response.data;
        const userData: User = {
          _id: _id || null,
          name: name || null,
          surname: surname || null,
          email: email || null,
          role: role || null,
          email_offert: email_offert === 'true' ? true : email_offert === 'false' ? false : null,
        };
        setUser(userData);

        // Sprawdź, czy dane użytkownika nie są puste
        if (
          Object.keys(userData).some((key) => userData[key as keyof User] !== null)
        ) {
          setIsUserLoggedIn(true);
        }

      })
      .catch((error) => {
        console.error('Błąd podczas pobierania użytkownika:', error);
      });
  }, []);

  const userContextValue: UserContextProps = {
    user,
    setUser,
    isUserLoggedIn,
    setIsUserLoggedIn,
  };


  return (
    <UserContext.Provider value={userContextValue}>
      {children}
    </UserContext.Provider>
  );
};
