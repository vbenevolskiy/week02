import {authCodeValidator, authLoginOrEmailValidator, authPasswordValidator, authEmailValidator} from "./auth-validator";
import {checkValidationResults} from "../../common-middleware/validation-results";
import {authMiddleware} from "../../common-middleware/auth";
import {
   usersEmailValidator,
   usersLoginValidator,
   usersPasswordValidator
} from "../../users/users-middleware/users-validator";

export const authPostMiddleware = [
   authLoginOrEmailValidator,
   authPasswordValidator,
   checkValidationResults
]

export const authRegistrationMiddleware = [
   usersLoginValidator,
   usersEmailValidator,
   usersPasswordValidator,
   checkValidationResults,
]

export const authPostConfirmationCodeMiddleware = [
   authCodeValidator,
   checkValidationResults,
]

export const authResendEmailMiddleware = [
   authEmailValidator,
   checkValidationResults,
]