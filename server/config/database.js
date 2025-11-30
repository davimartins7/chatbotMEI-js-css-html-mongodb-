import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🌎 Conectado ao MongoDB com Mongoose!");
  } catch (error) {
    console.error("❌ Erro ao conectar:", error);
  }
}

export default connectDB;
