"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const connection_1 = require("./connection");
const UserController_1 = require("./users/controllers/UserController");
// Import your controllers here
const app = (0, express_1.default)();
// Create the database connection
(0, connection_1.createDatabaseConnection)();
// Set up routing-controllers
(0, routing_controllers_1.useContainer)(typedi_1.Container);
(0, routing_controllers_1.useExpressServer)(app, {
    controllers: [UserController_1.UserController], // Add your controllers here
});
// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
