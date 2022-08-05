import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { User } from "@customTypes/User";

interface AuthContextProps {
  user: User;
}

export interface AuthContextValue {
  user?: User;
  setUser: Dispatch<SetStateAction<User | undefined>>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export const AuthProvider = ({
  children,
  user: userProp,
}: PropsWithChildren<AuthContextProps>): JSX.Element => {
  const [user, setUser] = useState<User | undefined>(userProp);

  useEffect(() => {
    if (userProp) {
      setUser(userProp);
    }
  }, [userProp]);

  const value = { user, setUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
