import mongoose from "mongoose";

const Schema = mongoose.Schema;

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

const db = mongoose.model("db", dbSchema);

export default db;
