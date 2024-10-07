"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersDeleteMiddleware = exports.usersPostMiddleware = exports.usersGetMiddleware = void 0;
const auth_1 = require("../../common-middleware/auth");
const validation_results_1 = require("../../common-middleware/validation-results");
const users_validator_1 = require("./users-validator");
exports.usersGetMiddleware = [
    users_validator_1.usersQueryPageNumber,
    users_validator_1.usersQueryPageSize,
    users_validator_1.usersQuerySortBy,
    users_validator_1.usersQuerySortDirection,
    users_validator_1.usersQuerySearchEmailTerm,
    users_validator_1.usersQuerySearchNameTerm
];
exports.usersPostMiddleware = [
    auth_1.authMiddleware,
    users_validator_1.usersLoginValidator,
    users_validator_1.usersEmailValidator,
    users_validator_1.usersPasswordValidator,
    validation_results_1.checkValidationResults,
];
exports.usersDeleteMiddleware = [
    auth_1.authMiddleware,
];
