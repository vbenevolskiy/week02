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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersQueryRepo = void 0;
const db_1 = require("../../db");
const settings_1 = require("../../settings");
const users_mappers_1 = require("../users-mappers");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.usersQueryRepo = {
    users: db_1.dbClient.db(db_1.dbName).collection(settings_1.SETTINGS.COLLECTIONS.USERS),
    searchFilterFactory: (qOptions) => {
        if (!qOptions.searchEmailTerm && !qOptions.searchLoginTerm)
            return {};
        if (qOptions.searchLoginTerm && qOptions.searchEmailTerm)
            return { $or: [
                    { login: { $regex: qOptions.searchLoginTerm, $options: 'i' } },
                    { email: { $regex: qOptions.searchEmailTerm, $options: 'i' } }
                ] };
        if (qOptions.searchLoginTerm)
            return {
                login: { '$regex': qOptions.searchLoginTerm, '$options': 'i' }
            };
        return {
            email: { '$regex': qOptions.searchEmailTerm, '$options': 'i' }
        };
    },
    sortFilterFactory: (qOptions) => {
        return qOptions.sortDirection === 'desc' ? { [qOptions.sortBy]: -1 } : { [qOptions.sortBy]: 1 };
    },
    validateUserLoginOrEmail: (loginOrEmail) => __awaiter(void 0, void 0, void 0, function* () {
        const searchTerm = loginOrEmail.toLowerCase();
        const filter = { $or: [
                { email: searchTerm },
                { login: searchTerm }
            ] };
        const dbResult = yield exports.usersQueryRepo.users.findOne(filter);
        if (dbResult)
            return dbResult._id;
        return null;
    }),
    validateUserPassword: (userId, password) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield exports.usersQueryRepo.users.findOne({ _id: userId });
        const passedHash = yield bcrypt_1.default.hash(password, user.salt);
        return passedHash === user.pwdHash;
    }),
    getTotalCount: (qOptions) => __awaiter(void 0, void 0, void 0, function* () {
        return yield exports.usersQueryRepo
            .users
            .countDocuments(exports.usersQueryRepo.searchFilterFactory(qOptions));
    }),
    getAllUsers: (qOptions) => __awaiter(void 0, void 0, void 0, function* () {
        const dbResult = yield exports.usersQueryRepo
            .users
            .find(exports.usersQueryRepo.searchFilterFactory(qOptions))
            .sort(exports.usersQueryRepo.sortFilterFactory(qOptions))
            .skip((qOptions.pageNumber - 1) * qOptions.pageSize)
            .limit(qOptions.pageSize)
            .toArray();
        return dbResult.map(value => (0, users_mappers_1.userDBToUserViewMapper)(value));
    })
};
