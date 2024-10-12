import {UserDBModel, UserInputModel, UserViewModel} from "./users-types";
import {ObjectId} from "mongodb";
import {usersRepo} from "./users-repositories/users-repo";
import bcrypt from 'bcrypt';
import {SETTINGS} from "../settings";
import {APIErrorResult} from "../common-types/errors-types";


type UsersService = {
   _generateHash: (password: string, salt: string) => Promise<string>;
   isValidUserId: (id: string) => Promise<boolean>;
   getUserById: (id: string) => Promise<string>;
   createUser: (newUser: UserInputModel) => Promise<UserViewModel | APIErrorResult>
   deleteUser: (id: string) => Promise<boolean>
}

export const usersService: UsersService = {

      _generateHash: async (password: string, salt: string): Promise<string> => {
         return await bcrypt.hash(password, salt)
      },

      isValidUserId: (id: string): Promise<boolean> => {
         return usersRepo.isValidUserId(new ObjectId(id));
      },

      getUserById: async (id: string): Promise<string> => {
         const user = await usersRepo.getUserById(new ObjectId(id))
         return user ? user.login : ""
      },

   createUser: async (newUser: UserInputModel): Promise<UserViewModel | APIErrorResult> => {
   const newSalt: string = await bcrypt.genSalt(SETTINGS.SECURITY.SALT_ROUNDS)
   const pwdHash = await usersService._generateHash(newUser.password, newSalt)
   const newId = new ObjectId()
   const user: UserDBModel = {
      _id: newId,
      login: newUser.login,
      email: newUser.email,
      salt: newSalt,
      pwdHash: pwdHash,
      createdAt: new Date().toISOString()
   }
   if (!await usersRepo.isValidUserLogin(user.login)) return {
      errorsMessages: [{
         message: `Login is not unique`,
         field: 'login'
      }]
   }
   if (!await usersRepo.isValidUserEmail(user.email)) return {
      errorsMessages: [{
         message: `Email address is not unique`,
         field: 'email'
      }]
   }
   const userId = await usersRepo.createUser(user)
   // @ts-ignore
   return usersRepo.getUserById(userId)
},

   deleteUser
:
async (id: string): Promise<boolean> => {
   return await usersRepo.deleteUser(new ObjectId(id))
}
}