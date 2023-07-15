import React, { createContext, useState, useEffect } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

interface User {
  _id: string | null;
  name: string | null;
  surname: string | null;
  email: string | null;
  role: string | null;
  newsletter: boolean
  email_offert: boolean
}

interface UserContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isUserLoggedIn: boolean;
  setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  isUserDataLoaded: boolean; // Dodatkowy stan śledzący, czy dane użytkownika zostały pobrane
}

export const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => { },
  isUserLoggedIn: false,
  setIsUserLoggedIn: () => { },
  isUserDataLoaded: false,
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false); // Dodatkowy stan

  useEffect(() => {
    axios
      .get('/user', { withCredentials: true } as AxiosRequestConfig)
      .then((response) => {
        const { _id, name, surname, email, role, newsletter, email_offert, } = response.data;
        if (_id && name && email && role) {
          const userData: User = {
            _id: _id,
            name: name,
            surname: surname,
            email: email,
            role: role,
            newsletter: newsletter || false,
            email_offert: email_offert || false,
          };
          setUser(userData);
          setIsUserLoggedIn(true);
        } else {
          setUser(null)
        }
      })
      .catch((error) => {
        console.error('Błąd podczas pobierania użytkownika:', error);
      })
      .finally(() => {
        setIsUserDataLoaded(true); // Ustawienie stanu isUserDataLoaded na true, niezależnie od wyniku żądania
      });
  }, []);

  const userContextValue: UserContextProps = {
    user,
    setUser,
    isUserLoggedIn,
    setIsUserLoggedIn,
    isUserDataLoaded, // Dodanie isUserDataLoaded do kontekstu
  };

  if (!isUserDataLoaded) {
    return null; // Lub wyrenderuj komunikat oczekiwania
  }

  return (
    <UserContext.Provider value={userContextValue}>
      {children}
    </UserContext.Provider>
  );
};
