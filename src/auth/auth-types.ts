export type AuthInputModel = {
   loginOrEmail: string;
   password: string;
}

export type LoginSuccessViewModel = {
   accessToken: string;
}