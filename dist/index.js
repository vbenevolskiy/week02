"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const settings_1 = require("./settings");
app_1.app.listen(5000, () => {
    console.log(`Listening on port ${settings_1.SETTINGS.PORT}. Press Ctrl+C to stop.`);
});
