import {UserDBModel, UserInputModel, UserViewModel} from "./users-types";
import {ObjectId} from "mongodb";
import {usersRepo} from "./users-repositories/users-repo";
import bcrypt from 'bcrypt';
import {SETTINGS} from "../settings";
import {APIErrorResult} from "../common-types/errors-types";
import {v4 as uuidv4} from 'uuid'
import {sendRegistrationMail} from "../adapters/gmail";
// import {id} from "date-fns/locale";


type UsersService = {
   _generateHash: (password: string, salt: string) => Promise<string>;
   isValidUserId: (id: string) => Promise<boolean>;
   getUserLoginById: (id: string) => Promise<string>;
   createAdministrativeUser: (newUser: UserInputModel) => Promise<UserViewModel | APIErrorResult>
   createNonAdministrativeUser: (newUser: UserInputModel) => Promise<UserViewModel | APIErrorResult>
   deleteUser: (id: string) => Promise<boolean>
   checkConfirmationCode: (code: string) => Promise<boolean | APIErrorResult>
   resendConfirmationCode: (code: string) => Promise<boolean | APIErrorResult>
}

export const usersService: UsersService = {

   _generateHash: async (password: string, salt: string): Promise<string> => {
      return await bcrypt.hash(password, salt)
   },

   isValidUserId: (id: string): Promise<boolean> => {
      return usersRepo.isValidUserId(new ObjectId(id));
   },

   getUserLoginById: async (id: string): Promise<string> => {
      const user = await usersRepo.getUserById(new ObjectId(id))
      return user ? user.login : ""
   },

   createAdministrativeUser: async (newUser: UserInputModel): Promise<UserViewModel | APIErrorResult> => {
      const newSalt: string = await bcrypt.genSalt(SETTINGS.SECURITY.SALT_ROUNDS)
      const pwdHash = await usersService._generateHash(newUser.password, newSalt)
      const newId = new ObjectId()
      const user: UserDBModel = {
         _id: newId,
         login: newUser.login,
         email: newUser.email,
         salt: newSalt,
         pwdHash: pwdHash,
         createdAt: new Date().toISOString(),
         emailIsConfirmed: true,
         emailConfirmationCode: ""
      }
      if (!await usersRepo.isUniqueUserLogin(user.login)) return {
         errorsMessages: [{
            message: `Login is not unique`,
            field: 'login'
         }]
      }
      if (!await usersRepo.isUniqueUserEmail(user.email)) return {
         errorsMessages: [{
            message: `Email address is not unique`,
            field: 'email'
         }]
      }
      const userId = await usersRepo.createUser(user)
      // @ts-ignore
      return usersRepo.getUserById(userId)
   },

   createNonAdministrativeUser: async (newUser: UserInputModel): Promise<UserViewModel | APIErrorResult> => {
      const newSalt: string = await bcrypt.genSalt(SETTINGS.SECURITY.SALT_ROUNDS)
      const pwdHash = await usersService._generateHash(newUser.password, newSalt)
      const newUUID: string = uuidv4()
      const newId = new ObjectId()
      const user: UserDBModel = {
         _id: newId,
         login: newUser.login,
         email: newUser.email,
         salt: newSalt,
         pwdHash: pwdHash,
         createdAt: new Date().toISOString(),
         emailIsConfirmed: false,
         emailConfirmationCode: newUUID
      }
      if (!await usersRepo.isUniqueUserLogin(user.login)) return {
         errorsMessages: [{
            message: `Login is not unique`,
            field: 'login'
         }]
      }
      if (!await usersRepo.isUniqueUserEmail(user.email)) return {
         errorsMessages: [{
            message: `Email address is not unique`,
            field: 'email'
         }]
      }
      const userId = await usersRepo.createUser(user)
      const messageBody = `
         <h1>Thanks for your registration</h1>
         <p>To finish registration please follow the link below:
         <a href='https://somesite.com/confirm-email?code=${user.emailConfirmationCode}'>complete registration</a>
         </p>
      `
      try {
         await sendRegistrationMail({
            sendTo: user.email,
            subject: "Thank you for registration!",
            body: messageBody
         })
      } catch(error) {
         console.log(error)
      }
      //@ts-ignore
      return await usersRepo.getUserById(userId)
   },

   deleteUser: async (id: string): Promise<boolean> => {
      return await usersRepo.deleteUser(new ObjectId(id))
   },

   checkConfirmationCode: async (code: string): Promise<boolean | APIErrorResult> => {
      const user = await usersRepo.getDBUserByConfirmationCode(code)
      if (!user || user.emailConfirmationCode !== code) return {
         errorsMessages: [{
            message: `Invalid confirmation code`,
            field: 'code'
         }]
      }
      if (user.emailIsConfirmed) return {
         errorsMessages: [{
            message: `Confirmation is not required for the email`,
            field: 'code'
         }]
      }
      return await usersRepo.updateConfirmationStatus(user.email)
   },

   resendConfirmationCode: async (email: string): Promise<boolean | APIErrorResult> => {
      const user = await usersRepo.getDBUserByEmail(email)
      if (!user) return {
         errorsMessages: [{
            message: `Invalid email provided`,
            field: 'email'
         }]
      }
      if (user.emailIsConfirmed) return {
         errorsMessages: [{
            message: `Email confirmation is not needed for this email`,
            field: 'email'
         }]
      }
      //@ts-ignore
      const confCode = uuidv4()
      await usersRepo.updateConfirmationCode(user.email, confCode)
      const messageBody = `
      <h1>Thanks for your registration</h1>
      <p>To finish registration please follow the link below:
      <a href='https://somesite.com/confirm-email?code=${confCode}'> to complete registration</a>
      </p>
      `
      try {
         await sendRegistrationMail({
            sendTo: email,
            subject: "Thank you for registration!",
            body: messageBody
         })
      } catch(error) {
         console.log(error)
      }
      return true
   }
}