// Carga las variables del archivo .env
import "dotenv/config";

import express from "express";
import cors from "cors";

// Crea la aplicación de Express
const app = express();

// Obtiene el puerto desde .env.
// Si no existe, utiliza el puerto 3001.
const PORT = Number(process.env.PORT) || 3001;

// Permite que el frontend se comunique con el backend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  }),
);

// Permite recibir información en formato JSON
app.use(express.json());

// Ruta de prueba
app.get("/", (_request, response) => {
  response.status(200).json({
    mensaje: "Backend funcionando correctamente",
  });
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});