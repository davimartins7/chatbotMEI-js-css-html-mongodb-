// server/controllers/UsuariosController.js
import Usuario from "../models/Usuario.js";

export const loginUsuario = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await Usuario.findOne({ email, senha });

    if (!user) {
      return res.send({ ok: false, msg: "Email ou senha inválidos" });
    }

    res.send({ ok: true, msg: "Login OK" });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).send("Erro no servidor");
  }
};

export const cadastrarUsuario = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const existe = await Usuario.findOne({ email });

    if (existe) {
      return res.send({ ok: false, msg: "Email já cadastrado" });
    }

    const novo = new Usuario({ email, senha });
    await novo.save();

    res.send({ ok: true, msg: "Usuário criado!" });
  } catch (err) {
    console.error("Erro no cadastro:", err);
    res.status(500).send("Erro ao cadastrar");
  }
};

export const salvarRespostaChat = async (req, res) => {
  const { email, pergunta, resposta } = req.body;

  try {
    const user = await Usuario.findOne({ email });

    if (!user) {
      return res.send({ ok: false, msg: "Usuário não encontrado" });
    }

    user.respostas_chat.push({
      pergunta,
      resposta,
      data: new Date()
    });

    await user.save();

    res.send({ ok: true, msg: "Resposta salva!" });
  } catch (err) {
    console.error("Erro ao salvar resposta:", err);
    res.status(500).send({ ok: false, msg: "Erro ao salvar resposta" });
  }
};
