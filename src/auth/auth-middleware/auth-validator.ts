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

export const authCodeValidator = body("code")
   .not().isEmpty()
   .withMessage('Confirmation code is required')
   .isString()
   .withMessage("Confirmation code must be a string")
   .trim()

export const authEmailValidator = body("email")
   .not().isEmpty()
   .withMessage('Email address is required')
   .isString()
   .withMessage("Email must be a string")
   .trim()
   .isEmail()
   .withMessage("Incorrect email address provided")