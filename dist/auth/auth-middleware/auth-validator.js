"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authPasswordValidator = exports.authLoginOrEmailValidator = void 0;
const express_validator_1 = require("express-validator");
exports.authLoginOrEmailValidator = (0, express_validator_1.body)("loginOrEmail")
    .not().isEmpty()
    .withMessage('Login or email is required')
    .isString()
    .withMessage("Login or email must be a string")
    .trim();
exports.authPasswordValidator = (0, express_validator_1.body)("password")
    .not().isEmpty()
    .withMessage('Password is required')
    .isString()
    .withMessage("Password must be a string")
    .trim();
