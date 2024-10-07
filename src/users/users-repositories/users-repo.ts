import {Collection, ObjectId} from "mongodb";
import {UserDBModel, UserViewModel} from "../users-types";
import {dbClient, dbName} from "../../db";
import {SETTINGS} from "../../settings";
import {userDBToUserViewMapper} from "../users-mappers";

type UsersRepo = {
   users: Collection<UserDBModel>
   isValidUserId: (id: ObjectId) => Promise<boolean>
   isValidUserLogin (login: string): Promise<boolean>
   isValidUserEmail (email: string): Promise<boolean>
   getUserById: (id: ObjectId) => Promise<UserViewModel | null>
   createUser: (user: UserDBModel) => Promise<ObjectId>
   deleteUser: (id: ObjectId) => Promise<boolean>
}

export const usersRepo: UsersRepo = {

   users: dbClient.db(dbName).collection<UserDBModel>(SETTINGS.COLLECTIONS.USERS),

   isValidUserId: async (id: ObjectId):Promise<boolean> => {
      const dbResult: UserDBModel | null = await usersRepo.users.findOne({_id:id});
      return !!dbResult
   },

   isValidUserLogin: async (login: string): Promise<boolean> => {
      const dbResult: UserDBModel | null = await usersRepo.users.findOne({login: login.toLowerCase()});
      return !dbResult
   },

   isValidUserEmail: async (email: string): Promise<boolean> => {
      const dbResult: UserDBModel | null = await usersRepo.users.findOne({email: email.toLowerCase()});
      return !dbResult
   },

   getUserById: async (id: ObjectId): Promise<UserViewModel | null> => {
      const user = await usersRepo.users.findOne({_id: id})
      return user ? userDBToUserViewMapper(user!) : null
   },

   createUser: async (user: UserDBModel):Promise<ObjectId> => {
      const dbResult = await usersRepo.users.insertOne(user)
      return dbResult.insertedId;
   },

   deleteUser: async (id: ObjectId):Promise<boolean> => {
      const dbResult = await usersRepo.users.deleteOne({_id: id})
      return dbResult.deletedCount === 1
   }
}