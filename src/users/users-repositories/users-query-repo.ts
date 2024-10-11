import {Collection, Sort, ObjectId} from "mongodb";
import {MeViewModel, UserDBModel, UsersQueryInputModel, UserViewModel} from "../users-types";
import {dbClient, dbName} from "../../db";
import {SETTINGS} from "../../settings";
import {userDBToUserViewMapper} from "../users-mappers";
import bcrypt from 'bcrypt'
import {AuthInputModel} from "../../auth/auth-types";

type UsersQueryRepo = {
   users: Collection<UserDBModel>
   searchFilterFactory: (usersQueryOptions: UsersQueryInputModel) => Object
   sortFilterFactory: (usersQueryOptions: UsersQueryInputModel) => Sort
   checkUserCredentials: (credentials: AuthInputModel) => Promise<UserDBModel | null>
   getUserData: (userId: ObjectId) => Promise<MeViewModel>
   getTotalCount: (usersQueryOptions: UsersQueryInputModel) => Promise<number>
   getAllUsers: (usersQueryOptions: UsersQueryInputModel) => Promise<UserViewModel[]>
}

export const usersQueryRepo: UsersQueryRepo = {

   users: dbClient.db(dbName).collection<UserDBModel>(SETTINGS.COLLECTIONS.USERS),

   searchFilterFactory: (qOptions: UsersQueryInputModel): Object => {
      if (!qOptions.searchEmailTerm && !qOptions.searchLoginTerm) return {}
      if (qOptions.searchLoginTerm && qOptions.searchEmailTerm)
         return {
            $or: [
               {login: {$regex: qOptions.searchLoginTerm, $options: 'i'}},
               {email: {$regex: qOptions.searchEmailTerm, $options: 'i'}}
            ]
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

   checkUserCredentials: async (credentials: AuthInputModel): Promise<UserDBModel | null> => {
      const searchTerm = credentials.loginOrEmail.toLowerCase();
      const filter: Object = {
         $or: [
            {email: searchTerm},
            {login: searchTerm}
         ]
      }
      const user = await usersQueryRepo.users.findOne(filter)
      if (!user) return null
      const passedHash = await bcrypt.hash(credentials.password, user.salt)
      return passedHash === user.pwdHash ? user : null
   },

   getUserData: async (userId: ObjectId): Promise<MeViewModel> => {

      const dbResult: UserDBModel =( await usersQueryRepo.users.findOne({_id: new ObjectId(userId)})) as UserDBModel
      return {
         userId: dbResult._id!.toString(),
         login: dbResult.login,
         email: dbResult.email
      }
   },

   getTotalCount: async (qOptions: UsersQueryInputModel): Promise<number> => {
      return await usersQueryRepo
         .users
         .countDocuments(usersQueryRepo.searchFilterFactory(qOptions))
   },

   getAllUsers: async (qOptions: UsersQueryInputModel): Promise<UserViewModel[]> => {
      const dbResult = await usersQueryRepo
         .users
         .find(usersQueryRepo.searchFilterFactory(qOptions))
         .sort(usersQueryRepo.sortFilterFactory(qOptions))
         .skip((qOptions.pageNumber - 1) * qOptions.pageSize)
         .limit(qOptions.pageSize)
         .toArray()
      return dbResult.map(value => userDBToUserViewMapper(value))
   }
}