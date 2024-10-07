"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authPostMiddleware = void 0;
const auth_validator_1 = require("./auth-validator");
const validation_results_1 = require("../../common-middleware/validation-results");
exports.authPostMiddleware = [
    auth_validator_1.authLoginOrEmailValidator,
    auth_validator_1.authPasswordValidator,
    validation_results_1.checkValidationResults
];
