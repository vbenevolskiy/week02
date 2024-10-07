"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const settings_1 = require("../settings");
const authMiddleware = (req, res, next) => {
    let auth = req.headers['authorisation']; // 'Basic xxxx'
    // console.log(auth)
    if (!auth)
        auth = req.headers['authorization'];
    if (!auth) {
        res
            .status(401)
            .json({});
        return;
    }
    // const buff = Buffer.from(auth.slice(6), 'base64')
    // const decodedAuth = buff.toString('utf8')
    const buff2 = Buffer.from(settings_1.SETTINGS.ADMIN_AUTH, 'utf8');
    const codedAuth = buff2.toString('base64');
    // if (decodedAuth === ADMIN_AUTH || auth.slice(0, 5) !== 'Basic ') {
    if (auth.slice(6) !== codedAuth || auth.slice(0, 6) !== 'Basic ') {
        res
            .status(401)
            .json({});
        return;
    }
    next();
};
exports.authMiddleware = authMiddleware;
