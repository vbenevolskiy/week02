"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("./auth-middleware/auth-middleware");
const users_query_repo_1 = require("../users/users-repositories/users-query-repo");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/", auth_middleware_1.authPostMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistingUser = yield users_query_repo_1.usersQueryRepo.validateUserLoginOrEmail(req.body.loginOrEmail);
    if (!isExistingUser)
        return res.sendStatus(401);
    const isValidPassword = yield users_query_repo_1.usersQueryRepo.validateUserPassword(isExistingUser, req.body.password);
    if (isValidPassword)
        return res.sendStatus(204);
    return res.sendStatus(401);
}));
