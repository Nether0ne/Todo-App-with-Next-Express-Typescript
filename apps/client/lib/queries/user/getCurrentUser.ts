import { User } from "@customTypes/User";
import { Axios, AxiosError } from "axios";

const getCurrentUser = async (client: Axios): Promise<User | null> => {
  try {
    const user = (await client.get("/api/user")).data.user;
    return user as User;
  } catch (e: unknown) {
    return null;
  }
};

export default getCurrentUser;
