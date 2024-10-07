import {Collection, Sort, ObjectId} from "mongodb";
import {UserDBModel, UsersQueryInputModel, UserViewModel} from "../users-types";
import {dbClient, dbName} from "../../db";
import {SETTINGS} from "../../settings";
import {userDBToUserViewMapper} from "../users-mappers";
import bcrypt from 'bcrypt'

type UsersQueryRepo = {
   users: Collection<UserDBModel>
   searchFilterFactory: (usersQueryOptions: UsersQueryInputModel) => Object
   sortFilterFactory: (usersQueryOptions: UsersQueryInputModel) => Sort
   validateUserLoginOrEmail: (loginOrEmail: string) => Promise<ObjectId | null>
   validateUserPassword: (userId: ObjectId, password: string) => Promise<boolean>
   getTotalCount: (usersQueryOptions: UsersQueryInputModel) => Promise<number>
   getAllUsers: (usersQueryOptions: UsersQueryInputModel) => Promise<UserViewModel[]>
}

export const usersQueryRepo:UsersQueryRepo = {

   users: dbClient.db(dbName).collection<UserDBModel>(SETTINGS.COLLECTIONS.USERS),

   searchFilterFactory: (qOptions: UsersQueryInputModel): Object => {
      if (!qOptions.searchEmailTerm && !qOptions.searchLoginTerm) return {}
      if (qOptions.searchLoginTerm && qOptions.searchEmailTerm)
         return {$or:[
            {login: {$regex: qOptions.searchLoginTerm, $options: 'i'}},
            {email: {$regex: qOptions.searchEmailTerm, $options: 'i'}}
         ]}
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

   validateUserLoginOrEmail: async (loginOrEmail: string): Promise<ObjectId | null> => {
      const searchTerm = loginOrEmail.toLowerCase();
      const filter: Object = {$or:[
            {email: searchTerm},
            {login: searchTerm}
         ]}
      const dbResult = await usersQueryRepo.users.findOne(filter)
      if (dbResult) return dbResult._id
      return null
   },

   validateUserPassword: async (userId: ObjectId, password:string): Promise<boolean> => {
      const user: UserDBModel = <UserDBModel>await usersQueryRepo.users.findOne({_id: userId})
      const passedHash = await bcrypt.hash(password, user.salt)
      return passedHash === user.pwdHash
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