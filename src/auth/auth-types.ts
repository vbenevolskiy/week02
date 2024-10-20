export type AuthInputModel = {
   loginOrEmail: string;
   password: string;
}

export type LoginSuccessViewModel = {
   accessToken: string;
}

export type ConfirmationCodeInputModel = {
   code: string;
}

export type ResendEmailInputModel = {
   email: string;
}

export type RefreshTokenDBModel = {
   refreshToken: string;
}