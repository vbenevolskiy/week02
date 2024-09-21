"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const port = process.env.PORT || 5000;
index_1.app.listen(port, () => { console.log(`Listening on port ${port}. Press Ctrl+C to stop.`); });
