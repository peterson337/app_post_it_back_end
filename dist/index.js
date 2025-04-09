"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const router_1 = __importDefault(require("./router"));
dotenv_1.default.config();
//prettier-ignore
mongoose_1.default.connect(`${process.env.MONGODB_URL}`).then(() => console.log("MongoDB connected"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(router_1.default);
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
