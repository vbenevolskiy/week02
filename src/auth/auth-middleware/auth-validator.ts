import {body} from "express-validator";

export const authLoginOrEmailValidator = body("loginOrEmail")
   .not().isEmpty()
   .withMessage('Login or email is required')
   .isString()
   .withMessage("Login or email must be a string")
   .trim()


export const authPasswordValidator = body("password")
   .not().isEmpty()
   .withMessage('Password is required')
   .isString()
   .withMessage("Password must be a string")
   .trim()