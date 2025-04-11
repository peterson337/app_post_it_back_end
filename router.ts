import express from "express";
import cors from "cors";
import db from "./db";
import bcrypt from "bcrypt";
import { Router, Request, Response } from "express";

type Tasks = {
  color: string;
  colorText: boolean;
  completed: boolean;
  id: number;
  nomeTarefa: string;
};

const routes = Router();

routes.use(cors({ origin: "*" }));

const findUserById = async (userId: String) => {
  const userExists = await db.findById(userId, "-senha");
  return userExists;
};

//prettier-ignore
routes.get("/carregar-backup/:userId", async (req: Request, res: Response): Promise<any> => {
  const userExists = await findUserById(req.params.userId);
  
  if (userExists) {
    return res.status(200).json({
      message: "Tarefas recuperadas com sucesso",
      tasks: userExists.listaDeTarefas,
    });
  }

  if (!userExists) {
    return res.status(400).json({ message: "Usuário não encontrado" });
    
  }
});

//prettier-ignore
routes.post("/backup/:userId", async (req: Request, res: Response): Promise<any> => {
    //prettier-ignore
    const userExists = await db.findById(req.params.userId, "-senha");

    if (!userExists) {
      return res.status(400).json({ message: "Usuário não encontrado" });
      
    }

    if (req.body.tasks.length === 0) {
      return res.status(400).json({ message: "Precisa ter no mínimo uma tarefa salva para fazer backup" });
    }

    const task = req.body.tasks.map((item: Tasks) => item );

    if (userExists) {

      const validation = userExists.listaDeTarefas.filter(item => item.id === req.body.id);

      if (validation) {
        validation.map(item => {
          item.id = req.body.id;
          item.nomeGrupoTarefa = req.body.nomeGrupoTarefa;
          item.tasks = task;
        })

      if (validation.length === 0) {
        userExists.listaDeTarefas.push({
          nomeGrupoTarefa: req.body.nomeGrupoTarefa,
          id: req.body.id,
          tasks: task,
        });
      } 
      }

      await userExists.save();

      return res.status(200).json({ message: "Backup realizado com sucesso" });
    }
  }
);

routes.post("/login", async (req: Request, res: Response): Promise<any> => {
  const { userName, senha } = req.body;

  const user = {
    userName: userName,
    senha: senha,
  };

  const userExists = await db.findOne({ userName: user.userName });

  if (!userExists) {
    return res.status(400).json({ error: "Usuário não encontrado" });
  }
  const senhaCriptografada = userExists.senha;

  const validation =
    user.senha &&
    senhaCriptografada &&
    (await bcrypt.compare(user.senha, senhaCriptografada));

  if (validation) {
    return res.status(200).json({
      message: "Login realizado com sucesso",
      id: userExists._id,
    });
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
});

//prettier-ignore
routes.post("/createUser", async (req: Request, res: Response): Promise<any>  => {
  const { userName, senha } = req.body;

    if (!userName || !senha) {
        return res.status(400).json({ error: "O nome do seu usuário e a senha são obrigatórios" });
    }

    const userExists = await db.findOne({ userName: userName });

    const passwordRegex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

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

  const passwordHash = await bcrypt.hash(user.senha, 10);

  db.create({
    userName: user.userName,
    senha: passwordHash,
  });

  return res.status(200).json();
});

export default routes;
