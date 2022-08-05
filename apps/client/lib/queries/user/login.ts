import { LoggedInUser, UserLogin } from "@customTypes/User";
import axios, { AxiosError } from "axios";

const login = async (userData: UserLogin): Promise<LoggedInUser> => {
  try {
    const user = (await axios.post("/api/user/login", { user: userData })).data
      .user;
    return user as LoggedInUser;
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      const { error } = e.response?.data;

      throw new Error(error);
    } else {
      throw new Error("Internal Server Error");
    }
  }
};

export default login;
