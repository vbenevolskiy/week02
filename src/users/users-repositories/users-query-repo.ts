import {Collection, Sort} from "mongodb";
import {UserDBModel, UsersQueryInputModel, UserViewModel} from "../users-types";
import {dbClient, dbName} from "../../db";
import {SETTINGS} from "../../settings";
import {userDBToUserViewMapper} from "../users-mappers";

type UsersQueryRepo = {
   users: Collection<UserDBModel>
   searchFilterFactory: (usersQueryOptions: UsersQueryInputModel) => Object
   sortFilterFactory: (usersQueryOptions: UsersQueryInputModel) => Sort
   getTotalCount: (usersQueryOptions: UsersQueryInputModel) => Promise<number>
   getAllUsers: (usersQueryOptions: UsersQueryInputModel) => Promise<UserViewModel[]>
}

export const usersQueryRepo:UsersQueryRepo = {

   users: dbClient.db(dbName).collection<UserDBModel>(SETTINGS.COLLECTIONS.USERS),

   searchFilterFactory: (qOptions: UsersQueryInputModel): Object => {
      if (!qOptions.searchEmailTerm && !qOptions.searchLoginTerm) return {}
      if (qOptions.searchLoginTerm && qOptions.searchEmailTerm) return {
         login: {'$regex': qOptions.searchLoginTerm, '$options': 'i'},
         email: {'$regex': qOptions.searchEmailTerm, '$options': 'i'}
      }
      if (qOptions.searchLoginTerm) return {
         login: {'$regex': qOptions.searchLoginTerm, '$options': 'i'}
      }
      return {
         email: {'$regex': qOptions.searchEmailTerm, '$options': 'i'}
      }
   },

   sortFilterFactory: (qOptions: UsersQueryInputModel): Sort => {
      return qOptions.sortDirection === 'desc' ? {[qOptions.sortBy]: -1} : {[qOptions.sortBy]: 1}
   },

   getTotalCount: async (qOptions: UsersQueryInputModel): Promise<number> => {
      return await usersQueryRepo
         .users
         .countDocuments(usersQueryRepo.searchFilterFactory(qOptions))
   },

   getAllUsers: async (qOptions: UsersQueryInputModel):Promise<UserViewModel[]>  => {
      const dbResult = await usersQueryRepo
         .users
         .find(usersQueryRepo.searchFilterFactory(qOptions))
         .sort(usersQueryRepo.sortFilterFactory(qOptions))
         .skip((qOptions.pageNumber-1) * qOptions.pageSize)
         .limit(qOptions.pageSize)
         .toArray()
      return dbResult.map(value => userDBToUserViewMapper(value))
   }
}