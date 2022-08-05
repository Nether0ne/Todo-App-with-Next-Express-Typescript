import { LoggedInUser, UserRegister } from "@customTypes/User";
import axios, { AxiosError } from "axios";

const register = async (userData: UserRegister): Promise<LoggedInUser> => {
  try {
    const user = (await axios.post("/api/user", { user: userData })).data.user;
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

export default register;
