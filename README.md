# HorarioSmart

Aplicación web full stack para registrar materias y generar horarios académicos mediante teoría de conjuntos, combinatoria y lógica proposicional.

## Descripción

HorarioSmart permite administrar materias, configurar restricciones académicas y evaluar todas las combinaciones posibles para determinar cuáles horarios son válidos y cuáles deben descartarse.

El sistema comprueba:

- Cantidad exacta de materias.
- Materias obligatorias.
- Cruces de horarios.
- Modalidad requerida.
- Límite de materias difíciles.
- Máximo de créditos.
- Cumplimiento de prerrequisitos.

Cada generación se almacena en PostgreSQL junto con sus horarios, materias y motivos de descarte.

## Tecnologías

### Backend

- Node.js
- Express 5
- TypeScript
- Prisma ORM 7
- PostgreSQL
- Swagger / OpenAPI
- Nodemon

### Frontend

- React 19
- Vite 8
- React Router
- Axios
- Bootstrap
- React-Bootstrap
- React Toastify
- React Icons
- ESLint

## Aplicación de matemáticas discretas

### Teoría de conjuntos

Las materias registradas conforman el conjunto universal:

```text
U = {materia1, materia2, ..., materian}
```

Cada horario generado es un subconjunto de U.

Las materias obligatorias deben ser subconjunto del horario:

```text
O ⊆ H
```

Para validar prerrequisitos se utiliza la unión entre las materias del horario y las materias previamente aprobadas:

```text
Disponibles = H ∪ A
```

### Combinatoria

Para n materias disponibles y horarios de r materias:

```text
C(n,r) = n! / (r!(n-r)!)
```

Ejemplo:

```text
C(8,3) = 56 combinaciones
```

### Lógica proposicional

Un horario es válido únicamente cuando todas las proposiciones son verdaderas:

```text
T ∧ O ∧ C ∧ M ∧ D ∧ R ∧ P
```

Donde:

- T: tiene la cantidad correcta de materias.
- O: contiene las materias obligatorias.
- C: no tiene cruces.
- M: cumple la modalidad requerida.
- D: no supera el máximo de materias difíciles.
- R: no supera el máximo de créditos.
- P: cumple los prerrequisitos.

## Estructura del proyecto

```text
MATDIS-ExamenFinal-AnaM/
├── backend/
│   ├── prisma/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   ├── prisma.config.ts
│   └── tsconfig.json
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .env.example
│   └── package.json
├── database/
│   ├── database-schema.sql
│   └── database-complete.sql
├── postman/
├── README.md
└── .gitignore
```

## Requisitos

- Node.js 22 o superior.
- PostgreSQL instalado y ejecutándose.
- npm.
- Git.

## Configuración de PostgreSQL

Crea la base de datos:

```sql
CREATE DATABASE g_horarios;
```

También puedes crearla desde pgAdmin.

## Variables de entorno

### Backend

Copia `backend/.env.example` como `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:CONTRASENA@localhost:5432/g_horarios?schema=public"
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### Frontend

Copia `frontend/.env.example` como `frontend/.env`:

```env
VITE_API_URL=http://localhost:3001
```

No subas los archivos `.env` al repositorio.

## Instalación

### Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Backend:

```text
http://localhost:3001
```

Swagger:

```text
http://localhost:3001/api-docs
```

### Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## API REST

### Materias

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/courses` | Registrar una materia |
| GET | `/courses` | Listar materias |
| GET | `/courses/:id` | Consultar una materia |
| PUT | `/courses/:id` | Actualizar una materia |
| DELETE | `/courses/:id` | Eliminar una materia |

### Horarios

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/schedules/generate` | Generar y guardar horarios |
| GET | `/schedules` | Consultar historial |
| GET | `/schedules/:id` | Consultar una generación |
| DELETE | `/schedules/:id` | Eliminar una generación |

## Ejemplo para registrar una materia

```json
{
  "name": "Programación I",
  "section": "A",
  "day": "LUNES",
  "startTime": "08:00",
  "endTime": "10:00",
  "modality": "PRESENCIAL",
  "difficulty": "ALTA",
  "credits": 4,
  "prerequisiteIds": []
}
```

## Ejemplo para generar horarios

```json
{
  "numberOfCourses": 3,
  "maximumCredits": 12,
  "maximumDifficultCourses": 2,
  "requiredCourseIds": [1],
  "completedCourseIds": [],
  "requiredModality": "CUALQUIERA",
  "avoidTimeConflicts": true,
  "validatePrerequisites": true
}
```

## Respaldo de PostgreSQL

Los scripts de entrega se guardan en `database/`.

Solo estructura:

```powershell
pg_dump -U postgres -h localhost -p 5432 -d g_horarios --schema-only --no-owner --no-privileges -f ".\database\database-schema.sql"
```

Estructura y datos:

```powershell
pg_dump -U postgres -h localhost -p 5432 -d g_horarios --no-owner --no-privileges --inserts -f ".\database\database-complete.sql"
```

## Restauración de la base de datos

```powershell
psql -U postgres -h localhost -p 5432 -d g_horarios -f ".\database\database-complete.sql"
```

## Pruebas finales

```bash
# Backend
npx prisma validate
npx prisma generate
npm run typecheck
npm run build

# Frontend
npm run lint
npm run build
```

## Flujo de uso

1. Registrar materias.
2. Asignar horarios, créditos, dificultad y prerrequisitos.
3. Seleccionar restricciones.
4. Generar combinaciones.
5. Consultar horarios válidos.
6. Revisar motivos de descarte.
7. Consultar el historial.

## Autor

**Ana M.**

Proyecto final de Matemáticas Discretas.

## Video de demostración

```text
LINK DEL VIDEO PRONTO!
```

## Licencia

Proyecto académico desarrollado con fines educativos.
