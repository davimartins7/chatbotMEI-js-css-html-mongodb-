import express from "express";
import Usuario from "../models/Usuario.js";

const router = express.Router();

// LOGIN
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await Usuario.findOne({ email, senha });

    if (!user) {
      return res.send({ ok: false, msg: "Email ou senha inválidos" });
    }

    // Retorna admin true se a role for "admin"
    res.send({ 
      ok: true, 
      msg: "Login OK", 
      admin: user.role === "admin" // <<< ALTERAÇÃO PRINCIPAL
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no servidor");
  }
});

// CADASTRO
router.post("/cadastro", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const existe = await Usuario.findOne({ email });

    if (existe) {
      return res.send({ ok: false, msg: "Email já cadastrado" });
    }

    await Usuario.create({ email, senha, respostas_chat: [], role: "user" }); // ROLE 

    res.send({ ok: true, msg: "Usuário criado!" });

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao cadastrar");
  }
});

// SALVAR RESPOSTA
router.post("/salvar-resposta", async (req, res) => {
  const { email, pergunta, resposta } = req.body;

  try {
    await Usuario.updateOne(
      { email },
      {
        $push: {
          respostas_chat: {
            pergunta,
            resposta,
            data: new Date()
          }
        }
      }
    );

    res.send({ ok: true, msg: "Resposta salva!" });

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao salvar");
  }
});

export default router;
