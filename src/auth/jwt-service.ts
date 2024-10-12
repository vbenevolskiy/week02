import jwt from 'jsonwebtoken'
import {SETTINGS} from "../settings";

type JWTService = {
   createJWTToken: (userId: string) => string;
   getUserIdByJWTToken: (token: string) => {userId: string} | null;
}

export const jwtService: JWTService = {

   createJWTToken: (userId: string) : string => {
      return String(jwt.sign({userId}, SETTINGS.SECURITY.JWT_SECRET_KEY, {expiresIn: SETTINGS.SECURITY.JWT_EXPIRATIONS_TIME}))
   },

   getUserIdByJWTToken: (token: string): {userId: string} | null => {
      try {
         return jwt.verify(token, SETTINGS.SECURITY.JWT_SECRET_KEY) as {userId: string}
      } catch (error) {
         console.log(error, " error")
         return null;
      }
   }
}