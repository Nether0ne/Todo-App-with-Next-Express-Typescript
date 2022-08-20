import { LoggedInUser, UserRegister } from "@customTypes/User";
import axios, { AxiosError } from "axios";

const register = async (userData: UserRegister): Promise<LoggedInUser> => {
  try {
    const user = (await axios.post("/api/user", { user: userData })).data.user;
    return user as LoggedInUser;
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      const { error } = e.response?.data;

      if (error) {
        if (error === "USER_ALREADY_EXISTS") {
          throw new Error(
            "User with provided email or username already exists",
          );
        } else {
          throw new Error(error);
        }
      } else {
        throw new Error("Unknown error has appeared");
      }
    } else {
      throw new Error("Internal Server Error");
    }
  }
};

export default register;
