import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import usuariosRoutes from "./routes/usuariosRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"; // rota exclusiva do admin

const app = express();

app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect(
    "senha"
).then(() => {
    console.log("🌎 Mongoose conectado ao MongoDB!");
}).catch(err => {
    console.error("❌ Erro ao conectar:", err);
});

// Rotas de usuários (login, cadastro, salvar resposta)
app.use("/usuarios", usuariosRoutes);

// Rotas exclusivas do admin
app.use("/admin", adminRoutes);

// Iniciar servidor
app.listen(3000, () => {
    console.log("🚀 Servidor rodando na porta 3000");
});
