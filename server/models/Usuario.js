import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema({
  email: String,
  senha: String,
  respostas_chat: [
    {
      pergunta: String,
      resposta: String,
      data: Date
    }
  ],
  role: { type: String, default: "user" } // "user" ou "admin"
});

export default mongoose.model("Usuario", UsuarioSchema);
