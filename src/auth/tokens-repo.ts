import {Collection} from "mongodb";
import {RefreshTokenDBModel} from "./auth-types";
import {dbClient, dbName} from "../db";
import {SETTINGS} from "../settings";

export type TokensRepo = {
   refreshTokens: Collection<RefreshTokenDBModel>
   addRefreshToken: (token: string) => Promise<boolean>
   validateRefreshToken: (token: string) => Promise<boolean>
   revokeRefreshToken: (token: string) => Promise<boolean>
}

export const tokensRepo: TokensRepo = {

   refreshTokens: dbClient.db(dbName).collection<RefreshTokenDBModel>(SETTINGS.COLLECTIONS.REFRESH_TOKENS),

   addRefreshToken: async (token: string) : Promise<boolean> => {
      const result = await tokensRepo.refreshTokens.insertOne({refreshToken:token});
      return !!result.insertedId
   },

   validateRefreshToken: async (token: string): Promise<boolean> => {
      const result = await tokensRepo.refreshTokens.countDocuments({refreshToken: token});
      return result === 1
   },

   revokeRefreshToken: async (token: string): Promise<boolean> => {
      const result = await tokensRepo.refreshTokens.deleteOne({refreshToken:token});
      return result.deletedCount === 1
   }
}