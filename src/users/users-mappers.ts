import {UserDBModel, UserViewModel} from "./users-types";

export const userDBToUserViewMapper = (user: UserDBModel):UserViewModel => {
   return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt
   }
}