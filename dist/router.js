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
const express_1 = require("express");
const routes = (0, express_1.Router)();
routes.use((0, cors_1.default)({ origin: "*" }));
const findUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield db_1.default.findById(userId, "-senha");
    return userExists;
});
//prettier-ignore
routes.get("/carregar-backup/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield findUserById(req.params.userId);
    if (userExists) {
        return res.status(200).json({
            message: "Tarefas recuperadas com sucesso",
            tasks: userExists.listaDeTarefas,
        });
    }
    if (!userExists) {
        return res.status(400).json({ message: "Usuário não encontrado" });
    }
}));
//prettier-ignore
routes.post("/backup/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //prettier-ignore
    const userExists = yield db_1.default.findById(req.params.userId, "-senha");
    if (!userExists) {
        return res.status(400).json({ message: "Usuário não encontrado" });
    }
    if (req.body.tasks.length === 0) {
        return res.status(400).json({ message: "Precisa ter no mínimo uma tarefa salva para fazer backup" });
    }
    const task = req.body.tasks.map((item) => item);
    if (userExists) {
        const validation = userExists.listaDeTarefas.filter(item => item.id === req.body.id);
        if (validation) {
            validation.map(item => {
                item.id = req.body.id;
                item.nomeGrupoTarefa = req.body.nomeGrupoTarefa;
                item.tasks = task;
            });
            if (validation.length === 0) {
                userExists.listaDeTarefas.push({
                    nomeGrupoTarefa: req.body.nomeGrupoTarefa,
                    id: req.body.id,
                    tasks: task,
                });
            }
        }
        yield userExists.save();
        return res.status(200).json({ message: "Backup realizado com sucesso" });
    }
}));
routes.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName } = req.body;
    if (!userName) {
        return res
            .status(400)
            .json({ error: "O nome do seu usuário é obrigatório" });
    }
    const nomeFormatado = formatarNome(userName);
    const userExists = yield db_1.default.findOne({ userName: nomeFormatado });
    if (!userExists) {
        return res
            .status(400)
            .json({ error: "Este usuário  não existe, crie um usuário" });
    }
    if (userExists) {
        return res.status(200).json({
            message: "Login realizado com sucesso",
            id: userExists._id,
        });
    }
}));
//prettier-ignore
const formatarNome = (nome) => { return nome.trim().toLowerCase().replace(/\s+/g, ""); };
//prettier-ignore
routes.post("/createUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName } = req.body;
    const nomeFormatado = formatarNome(userName);
    if (!userName) {
        return res.status(400).json({ error: "O nome do seu usuário é obrigatório" });
    }
    const userExists = yield db_1.default.findOne({ userName: nomeFormatado });
    // const passwordRegex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (userExists) {
        return res.status(400).json({ error: "Este usuário já existe" });
    }
    // const passwordHash = await bcrypt.hash(user.senha, 10);
    //prettier-ignore
    // db.create({userName: nomeFormatado});
    return res.status(200).json();
}));
exports.default = routes;
