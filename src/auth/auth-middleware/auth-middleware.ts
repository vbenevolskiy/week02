import {authLoginOrEmailValidator, authPasswordValidator} from "./auth-validator";
import {checkValidationResults} from "../../common-middleware/validation-results";

export const authPostMiddleware = [
   authLoginOrEmailValidator,
   authPasswordValidator,
   checkValidationResults
]