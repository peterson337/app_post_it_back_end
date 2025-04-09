import express from "express";
import cors from "cors";
import db from "./db";
import bcrypt from "bcrypt";
import { Router, Request, Response } from "express";

const routes = Router();

routes.use(cors({ origin: "*" }));

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
