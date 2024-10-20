import jwt from 'jsonwebtoken'
import {SETTINGS} from "../settings";
import {tokensRepo} from "./tokens-repo";

type TokensService = {
   createATToken: (userId: string) => string;
   createRTToken: (userId: string) => Promise<string>;
   revokeRTToken: (token: string) => Promise<boolean>;
   validateRTToken: (token: string) => Promise<boolean>;
   getUserIdByToken: (token: string) => { userId: string } | null;
}

export const tokensService: TokensService = {

   createATToken: (userId: string): string => {
      return String(jwt.sign({userId}, SETTINGS.SECURITY.JWT_SECRET_KEY, {expiresIn: SETTINGS.SECURITY.JWT_AT_EXPIRATION_TIME}))
   },

   createRTToken: async (userId: string): Promise<string> => {
      const rToken = String(jwt.sign({userId}, SETTINGS.SECURITY.JWT_SECRET_KEY, {expiresIn: SETTINGS.SECURITY.JWT_RT_EXPIRATION_TIME}))
      const result = await tokensRepo.addRefreshToken(rToken)
      return rToken
   },

   revokeRTToken: async (token: string): Promise<boolean> => {
      return await tokensRepo.revokeRefreshToken(token)
   },

   validateRTToken: async (token: string): Promise<boolean> => {
      return tokensRepo.validateRefreshToken(token)
   },

   getUserIdByToken: (token: string): { userId: string } | null => {
      try {
         return jwt.verify(token, SETTINGS.SECURITY.JWT_SECRET_KEY) as { userId: string }
      } catch (error) {
         console.log(error, " error")
         return null;
      }
   }
}