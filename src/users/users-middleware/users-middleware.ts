import {authMiddleware} from "../../common-middleware/auth";
import {checkValidationResults} from "../../common-middleware/validation-results";
import {
    usersEmailValidator,
    usersLoginValidator,
    usersParamIdValidator,
    usersPasswordValidator,
    usersQueryPageNumber,
    usersQueryPageSize,
    usersQuerySearchEmailTerm,
    usersQuerySearchNameTerm,
    usersQuerySortBy,
    usersQuerySortDirection
} from "./users-validator";

export const usersGetMiddleware = [
    usersQueryPageNumber,
    usersQueryPageSize,
    usersQuerySortBy,
    usersQuerySortDirection,
    usersQuerySearchEmailTerm,
    usersQuerySearchNameTerm
]

export const usersPostMiddleware = [
    authMiddleware,
    usersLoginValidator,
    usersEmailValidator,
    usersPasswordValidator,
    checkValidationResults,
]

export const usersDeleteMiddleware = [
    authMiddleware,
]