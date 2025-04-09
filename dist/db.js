"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const dbSchema = new Schema({
    userName: String,
    senha: String,
    listaDeTarefas: [
        {
            nomeGrupoTarefa: String,
            tasks: [
                {
                    color: String,
                    colorText: Boolean,
                    completed: Boolean,
                    id: Number,
                    nomeTarefa: String,
                },
            ],
        },
    ],
});
const db = mongoose_1.default.model("db", dbSchema);
exports.default = db;
