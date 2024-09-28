"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkValidationResults = void 0;
const express_validator_1 = require("express-validator");
const checkValidationResults = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400)
            .send({
            errorsMessages: errors
                .array({ onlyFirstError: true })
                .map((err) => {
                return { message: err.msg, field: err.path };
            }),
        });
        return;
    }
    else {
        next();
    }
};
exports.checkValidationResults = checkValidationResults;
