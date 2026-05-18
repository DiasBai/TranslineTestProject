import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getToken, removeToken, saveToken } from '../storage/auth.ts';

const AuthContext = createContext<{
  isAuth: boolean;
  isLoading: boolean;
  setToken: (token: string) => void;
  deleteToken: () => void;
}>({
  isLoading: true,
  isAuth: false,
  setToken: () => {},
  deleteToken: () => {},
});

export function AuthProvider(props: PropsWithChildren) {
  const { children } = props;

  const [token, _setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getToken()
      .then(_setToken)
      .finally(() => setIsLoading(false));
  }, []);

  const setToken = useCallback((_token: string) => {
    saveToken(_token);
    _setToken(_token);
  }, []);
  const deleteToken = useCallback(() => {
    removeToken();
    _setToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoading, isAuth: Boolean(token), setToken, deleteToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
