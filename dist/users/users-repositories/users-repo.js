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
exports.usersRepo = void 0;
const db_1 = require("../../db");
const settings_1 = require("../../settings");
const users_mappers_1 = require("../users-mappers");
exports.usersRepo = {
    users: db_1.dbClient.db(db_1.dbName).collection(settings_1.SETTINGS.COLLECTIONS.USERS),
    isValidUserId: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const dbResult = yield exports.usersRepo.users.findOne({ _id: id });
        return !!dbResult;
    }),
    isValidUserLogin: (login) => __awaiter(void 0, void 0, void 0, function* () {
        const dbResult = yield exports.usersRepo.users.findOne({ login: login.toLowerCase() });
        return !dbResult;
    }),
    isValidUserEmail: (email) => __awaiter(void 0, void 0, void 0, function* () {
        const dbResult = yield exports.usersRepo.users.findOne({ email: email.toLowerCase() });
        return !dbResult;
    }),
    getUserById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield exports.usersRepo.users.findOne({ _id: id });
        return user ? (0, users_mappers_1.userDBToUserViewMapper)(user) : null;
    }),
    createUser: (user) => __awaiter(void 0, void 0, void 0, function* () {
        const dbResult = yield exports.usersRepo.users.insertOne(user);
        return dbResult.insertedId;
    }),
    deleteUser: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const dbResult = yield exports.usersRepo.users.deleteOne({ _id: id });
        return dbResult.deletedCount === 1;
    })
};
