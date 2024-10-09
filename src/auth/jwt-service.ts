import jwt from 'jsonwebtoken'
import {UserDBModel} from "../users/users-types";
import {ObjectId} from "mongodb";
import {SETTINGS} from "../settings";

type JWTService = {
   createJWTToken: (user: UserDBModel) => string;
   getUserIdByJWTToken: (token: string) => string | null;
}

export const jwtService: JWTService = {

   createJWTToken: (user: UserDBModel) : string => {
      return jwt.sign(user._id, SETTINGS.SECURITY.JWT_SECRET_KEY, {expiresIn: '1h'})
   },

   getUserIdByJWTToken: (token: string): string | null => {
      try {
         const result: any = jwt.verify(token, SETTINGS.SECURITY.JWT_SECRET_KEY);
         return new ObjectId(result.userId).toString()
      } catch (error) {
         return null;
      }
   }
}