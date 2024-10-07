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
exports.ConnectDB = exports.dbClient = exports.dbName = void 0;
const mongodb_1 = require("mongodb");
const settings_1 = require("./settings");
const mongoURI = process.env.MONGO_URI || settings_1.SETTINGS.MONGO_URI;
exports.dbName = process.env.DB_NAME || settings_1.SETTINGS.DB_NAME;
exports.dbClient = new mongodb_1.MongoClient(mongoURI);
const ConnectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.dbClient.connect();
        yield exports.dbClient.db(exports.dbName).command({ ping: 1 });
        console.log(`Connected to DB ${exports.dbName}!`);
    }
    catch (_a) {
        yield exports.dbClient.close();
    }
});
exports.ConnectDB = ConnectDB;
