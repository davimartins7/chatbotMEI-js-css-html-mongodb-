import express from "express";
import Usuario from "../models/Usuario.js";

const router = express.Router();

// Verifica se é admin antes de qualquer operação
async function checkAdmin(email) {
  const user = await Usuario.findOne({ email });
  return user && user.role === "admin";
}

// Listar usuários
router.get("/usuarios", async (req, res) => {
  const { email } = req.query;

  if (!(await checkAdmin(email))) {
    return res.status(403).send("Acesso negado. Apenas admin.");
  }

  const usuarios = await Usuario.find();
  res.json(usuarios);
});

// Deletar usuário
router.delete("/usuarios/:id", async (req, res) => {
  const { adminEmail } = req.query;
  const { id } = req.params;

  if (!(await checkAdmin(adminEmail))) {
    return res.status(403).send("Acesso negado. Apenas admin.");
  }

  try {
    await Usuario.findByIdAndDelete(id);
    res.send({ ok: true, msg: "Usuário deletado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ ok: false, msg: "Erro ao deletar usuário" });
  }
});

// Alterar usuário
router.put("/usuarios/:id", async (req, res) => {
  const { adminEmail } = req.query;
  const { id } = req.params;
  const { email, senha, role } = req.body;

  if (!(await checkAdmin(adminEmail))) {
    return res.status(403).send("Acesso negado. Apenas admin.");
  }

  try {
    await Usuario.findByIdAndUpdate(id, { email, senha, role });
    res.send({ ok: true, msg: "Usuário atualizado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ ok: false, msg: "Erro ao atualizar usuário" });
  }
});

export default router;
