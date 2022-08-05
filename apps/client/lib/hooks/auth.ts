import { AuthContext } from "@lib/providers/Auth.provider";
import { useContext } from "react";

export const useAuth = () => {
  const auth = useContext(AuthContext);
  return { user: auth?.user, setUser: auth?.setUser };
};
