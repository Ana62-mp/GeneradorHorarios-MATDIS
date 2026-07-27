import "dotenv/config";
import express from "express";
import cors from "cors";
import prisma from "./database/prisma.js";
import courseRoutes from "./routes/course.routes.js";
import scheduleRoutes from "./routes/schedule.routes.js";
import { errorHandler, notFoundHandler,} from "./middlewares/error.middleware.js";
import { setupSwagger } from "./swagger.js";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// Middlewares generales
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  }),
);

app.use(express.json());
setupSwagger(app);

// Ruta principal
app.get("/", (_request, response) => {
  response.status(200).json({
    message: "API del generador de horarios funcionando",
  });
});

// Rutas de materias
app.use("/courses", courseRoutes);

// Rutas de horarios
app.use("/courses", courseRoutes);
app.use("/schedules", scheduleRoutes);

// Siempre deben ir al final para que reciba error
app.use(notFoundHandler);
app.use(errorHandler);

async function iniciarServidor() {
  try {
    await prisma.$connect();

    console.log("Conexión con PostgreSQL exitosa");

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
}

iniciarServidor();