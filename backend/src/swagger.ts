import type { Express } from "express";
import swaggerJSDoc, { type Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  failOnErrors: true,
  definition: {
    openapi: "3.0.3",
    info: {
      title: "HorarioSmart API",
      version: "1.0.0",
      description:
        "API REST para administrar materias y generar horarios mediante combinatoria, conjuntos y lógica proposicional.",
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Servidor local",
      },
    ],
    tags: [
      {
        name: "Materias",
        description: "CRUD de materias y prerrequisitos",
      },
      {
        name: "Horarios",
        description: "Generación e historial de horarios",
      },
    ],
    components: {
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Ocurrió un error",
            },
          },
        },
        CourseInput: {
          type: "object",
          required: [
            "name",
            "day",
            "startTime",
            "endTime",
            "modality",
            "difficulty",
            "credits",
          ],
          properties: {
            name: {
              type: "string",
              minLength: 2,
              maxLength: 100,
              example: "Programación II",
            },
            section: {
              type: "string",
              nullable: true,
              maxLength: 20,
              example: "A",
            },
            day: {
              type: "string",
              enum: [
                "LUNES",
                "MARTES",
                "MIERCOLES",
                "JUEVES",
                "VIERNES",
                "SABADO",
                "DOMINGO",
              ],
              example: "LUNES",
            },
            startTime: {
              type: "string",
              example: "08:00",
            },
            endTime: {
              type: "string",
              example: "10:00",
            },
            modality: {
              type: "string",
              enum: ["PRESENCIAL", "VIRTUAL"],
              example: "PRESENCIAL",
            },
            difficulty: {
              type: "string",
              enum: ["BAJA", "MEDIA", "ALTA"],
              example: "ALTA",
            },
            credits: {
              type: "integer",
              minimum: 1,
              example: 4,
            },
            prerequisiteIds: {
              type: "array",
              uniqueItems: true,
              items: {
                type: "integer",
              },
              example: [1],
            },
          },
        },
        ScheduleConfigurationInput: {
          type: "object",
          required: [
            "numberOfCourses",
            "maximumCredits",
            "maximumDifficultCourses",
          ],
          properties: {
            numberOfCourses: {
              type: "integer",
              minimum: 1,
              example: 3,
            },
            maximumCredits: {
              type: "integer",
              minimum: 1,
              example: 12,
            },
            maximumDifficultCourses: {
              type: "integer",
              minimum: 0,
              example: 2,
            },
            requiredCourseIds: {
              type: "array",
              items: {
                type: "integer",
              },
              example: [1],
            },
            completedCourseIds: {
              type: "array",
              items: {
                type: "integer",
              },
              example: [],
            },
            requiredModality: {
              type: "string",
              enum: ["CUALQUIERA", "PRESENCIAL", "VIRTUAL"],
              default: "CUALQUIERA",
            },
            avoidTimeConflicts: {
              type: "boolean",
              default: true,
            },
            validatePrerequisites: {
              type: "boolean",
              default: true,
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);

export function setupSwagger(app: Express): void {
  app.get("/api-docs.json", (_request, response) => {
    response.status(200).json(swaggerSpec);
  });

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: "HorarioSmart API",
      customCss:
        ".swagger-ui .topbar { display: none; } .swagger-ui .info .title { color: #183A37; }",
    }),
  );

  console.log(
    `Documentación disponible en http://localhost:3001/api-docs`
  );

}
