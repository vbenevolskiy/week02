import {Collection, ObjectId} from "mongodb";
import {UserDBModel, UserViewModel} from "../users-types";
import {dbClient, dbName} from "../../db";
import {SETTINGS} from "../../settings";
import {userDBToUserViewMapper} from "../users-mappers";


type UsersRepo = {
   users: Collection<UserDBModel>
   isValidUserId: (id: ObjectId) => Promise<boolean>
   isUniqueUserLogin (login: string): Promise<boolean>
   isUniqueUserEmail (email: string): Promise<boolean>
   getUserById: (id: ObjectId) => Promise<UserViewModel | null>
   getDBUserByEmail: (email: string) => Promise<UserDBModel | null>
   getDBUserByConfirmationCode (confirmationCode: string): Promise<UserDBModel | null>
   updateConfirmationStatus (email: string): Promise<boolean>
   updateConfirmationCode (email: string, newCode: string): Promise<boolean>
   createUser: (user: UserDBModel) => Promise<ObjectId>
   deleteUser: (id: ObjectId) => Promise<boolean>
}

export const usersRepo: UsersRepo = {

   users: dbClient.db(dbName).collection<UserDBModel>(SETTINGS.COLLECTIONS.USERS),

   isValidUserId: async (id: ObjectId):Promise<boolean> => {
      const dbResult: UserDBModel | null = await usersRepo.users.findOne({_id:id});
      return !!dbResult
   },

   isUniqueUserLogin: async (login: string): Promise<boolean> => {
      const dbResult: UserDBModel | null = await usersRepo.users.findOne({login: login.toLowerCase()});
      return !dbResult
   },

   isUniqueUserEmail: async (email: string): Promise<boolean> => {
      const dbResult: UserDBModel | null = await usersRepo.users.findOne({email: email.toLowerCase()});
      return !dbResult
   },

   getUserById: async (id: ObjectId): Promise<UserViewModel | null> => {
      const user = await usersRepo.users.findOne({_id: id})
      return user ? userDBToUserViewMapper(user!) : null
   },

   getDBUserByEmail: async (email: string): Promise<UserDBModel | null> => {
      const user = await usersRepo.users.findOne({email: email})
      return user ? user : null
   },

   getDBUserByConfirmationCode: async (confirmationCode): Promise<UserDBModel | null> => {
      const user = await usersRepo.users.findOne({emailConfirmationCode: confirmationCode})
      return user ? user : null
   },

   updateConfirmationCode: async (email: string, newCode: string): Promise<boolean> => {
      const result = await usersRepo.users.updateOne({email: email}, {$set: {emailConfirmationCode: newCode}})
      return result.modifiedCount === 1
   },

   updateConfirmationStatus: async (email: string): Promise<boolean> => {
      const result = await usersRepo.users.updateOne({email: email}, {$set: {emailIsConfirmed: true, emailConfirmationCode: ""}})
      return result.modifiedCount === 1
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