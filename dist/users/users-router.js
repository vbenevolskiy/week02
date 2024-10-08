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
exports.usersRouter = void 0;
const express_1 = require("express");
const users_middleware_1 = require("./users-middleware/users-middleware");
const users_query_repo_1 = require("./users-repositories/users-query-repo");
const users_service_1 = require("./users-service");
exports.usersRouter = (0, express_1.Router)();
exports.usersRouter.get("/", users_middleware_1.usersGetMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const qOptions = {
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
        pageSize: req.query.pageSize,
        pageNumber: req.query.pageNumber,
        searchEmailTerm: req.query.searchEmailTerm,
        searchLoginTerm: req.query.searchLoginTerm
    };
    const totalCount = yield users_query_repo_1.usersQueryRepo.getTotalCount(qOptions);
    const paginator = {
        pagesCount: Math.ceil(totalCount / qOptions.pageSize),
        page: qOptions.pageNumber,
        pageSize: qOptions.pageSize,
        totalCount: totalCount,
        items: yield users_query_repo_1.usersQueryRepo.getAllUsers(qOptions)
    };
    res.status(200).json(paginator);
}));
exports.usersRouter.post("/", users_middleware_1.usersPostMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = {
        login: req.body.login.toLowerCase(),
        password: req.body.password,
        email: req.body.email.toLowerCase(),
    };
    const user = yield users_service_1.usersService.createUser(newUser);
    //@ts-ignore
    if (user.login)
        return res.status(201).json(user);
    return res.status(400).json(user);
}));
exports.usersRouter.delete("/:id", users_middleware_1.usersDeleteMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteResult = yield users_service_1.usersService.deleteUser(req.params.id);
    if (deleteResult)
        res.sendStatus(204);
    else
        res.sendStatus(404);
}));
