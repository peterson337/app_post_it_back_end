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
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_1 = require("express");
const routes = (0, express_1.Router)();
routes.use((0, cors_1.default)({ origin: "*" }));
routes.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, senha } = req.body;
    const user = {
        userName: userName,
        senha: senha,
    };
    const userExists = yield db_1.default.findOne({ userName: user.userName });
    if (!userExists) {
        return res.status(400).json({ error: "Usuário não encontrado" });
    }
    const senhaCriptografada = userExists.senha;
    const validation = user.senha &&
        senhaCriptografada &&
        (yield bcrypt_1.default.compare(user.senha, senhaCriptografada));
    if (validation) {
        return res.status(200).json({ message: "Login realizado com sucesso" });
    }
    if (!validation) {
        return res.status(400).json({ error: "Senha incorreta" });
    }
    if (!userName || !senha) {
        return res
            .status(400)
            .json({ error: "O nome do seu usuário e a senha são obrigatórios" });
    }
    if (!userExists) {
        return res
            .status(400)
            .json({ error: "Esta conta não existe, crie a sua conta." });
    }
}));
//prettier-ignore
routes.post("/createUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, senha } = req.body;
    if (!userName || !senha) {
        return res.status(400).json({ error: "O nome do seu usuário e a senha são obrigatórios" });
    }
    const userExists = yield db_1.default.findOne({ userName: userName });
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    ;
    if (!passwordRegex.test(senha)) {
        return res.status(400).json({ error: "A senha deve ter no mínimo 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula, um número e um caractere especial" });
    }
    if (userExists) {
        return res.status(400).json({ error: "Este usuário já existe" });
    }
    const user = {
        userName: userName,
        senha: senha,
    };
    const passwordHash = yield bcrypt_1.default.hash(user.senha, 10);
    db_1.default.create({
        userName: user.userName,
        senha: passwordHash,
    });
    return res.status(200).json();
}));
exports.default = routes;
