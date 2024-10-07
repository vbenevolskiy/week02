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
exports.usersService = void 0;
const mongodb_1 = require("mongodb");
const users_repo_1 = require("./users-repositories/users-repo");
const bcrypt_1 = __importDefault(require("bcrypt"));
const settings_1 = require("../settings");
exports.usersService = {
    _generateHash: (password, salt) => __awaiter(void 0, void 0, void 0, function* () {
        return yield bcrypt_1.default.hash(password, salt);
    }),
    isValidUserId: (id) => {
        return users_repo_1.usersRepo.isValidUserId(new mongodb_1.ObjectId(id));
    },
    createUser: (newUser) => __awaiter(void 0, void 0, void 0, function* () {
        const newSalt = yield bcrypt_1.default.genSalt(settings_1.SETTINGS.SECURITY.SALT_ROUNDS);
        const pwdHash = yield exports.usersService._generateHash(newUser.password, newSalt);
        const newId = new mongodb_1.ObjectId();
        const user = {
            _id: newId,
            login: newUser.login,
            email: newUser.email,
            salt: newSalt,
            pwdHash: pwdHash,
            createdAt: new Date().toISOString()
        };
        if (!(yield users_repo_1.usersRepo.isValidUserLogin(user.login)))
            return {
                errorsMessages: [{
                        message: `Login is not unique`,
                        field: 'login'
                    }]
            };
        if (!(yield users_repo_1.usersRepo.isValidUserEmail(user.email)))
            return {
                errorsMessages: [{
                        message: `Email address is not unique`,
                        field: 'email'
                    }]
            };
        const userId = yield users_repo_1.usersRepo.createUser(user);
        // @ts-ignore
        return users_repo_1.usersRepo.getUserById(userId);
    }),
    deleteUser: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield users_repo_1.usersRepo.deleteUser(new mongodb_1.ObjectId(id));
    })
};
