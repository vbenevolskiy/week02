"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDBToUserViewMapper = void 0;
const userDBToUserViewMapper = (user) => {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    };
};
exports.userDBToUserViewMapper = userDBToUserViewMapper;
