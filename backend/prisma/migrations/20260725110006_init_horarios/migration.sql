-- CreateEnum
CREATE TYPE "Day" AS ENUM ('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO');

-- CreateEnum
CREATE TYPE "Modality" AS ENUM ('PRESENCIAL', 'VIRTUAL');

-- CreateEnum
CREATE TYPE "RequiredModality" AS ENUM ('CUALQUIERA', 'PRESENCIAL', 'VIRTUAL');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('BAJA', 'MEDIA', 'ALTA');

-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('VALIDO', 'DESCARTADO');

-- CreateEnum
CREATE TYPE "RejectionCode" AS ENUM ('CANTIDAD_INCORRECTA', 'MATERIAS_OBLIGATORIAS_FALTANTES', 'CRUCE_HORARIO', 'MODALIDAD_NO_CUMPLIDA', 'MAXIMO_DIFICILES_SUPERADO', 'MAXIMO_CREDITOS_SUPERADO', 'PRERREQUISITOS_NO_CUMPLIDOS', 'MATERIA_NO_DISPONIBLE');

-- CreateTable
CREATE TABLE "courses" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "section" VARCHAR(20),
    "day" "Day" NOT NULL,
    "start_time" TIME(0) NOT NULL,
    "end_time" TIME(0) NOT NULL,
    "modality" "Modality" NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "credits" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prerequisites" (
    "course_id" INTEGER NOT NULL,
    "prerequisite_course_id" INTEGER NOT NULL,

    CONSTRAINT "prerequisites_pkey" PRIMARY KEY ("course_id","prerequisite_course_id")
);

-- CreateTable
CREATE TABLE "schedule_configurations" (
    "id" SERIAL NOT NULL,
    "number_of_courses" INTEGER NOT NULL,
    "maximum_credits" INTEGER NOT NULL,
    "maximum_difficult_courses" INTEGER NOT NULL,
    "required_modality" "RequiredModality" NOT NULL DEFAULT 'CUALQUIERA',
    "avoid_time_conflicts" BOOLEAN NOT NULL DEFAULT true,
    "validate_prerequisites" BOOLEAN NOT NULL DEFAULT true,
    "total_available_courses" INTEGER NOT NULL DEFAULT 0,
    "total_combinations" INTEGER NOT NULL DEFAULT 0,
    "valid_schedules_count" INTEGER NOT NULL DEFAULT 0,
    "discarded_schedules_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "generated_at" TIMESTAMP(3),

    CONSTRAINT "schedule_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuration_required_courses" (
    "configuration_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,

    CONSTRAINT "configuration_required_courses_pkey" PRIMARY KEY ("configuration_id","course_id")
);

-- CreateTable
CREATE TABLE "configuration_completed_courses" (
    "configuration_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,

    CONSTRAINT "configuration_completed_courses_pkey" PRIMARY KEY ("configuration_id","course_id")
);

-- CreateTable
CREATE TABLE "generated_schedules" (
    "id" SERIAL NOT NULL,
    "configuration_id" INTEGER NOT NULL,
    "combination_number" INTEGER NOT NULL,
    "status" "ScheduleStatus" NOT NULL,
    "total_credits" INTEGER NOT NULL,
    "difficult_courses_count" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "generated_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule_courses" (
    "schedule_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,

    CONSTRAINT "schedule_courses_pkey" PRIMARY KEY ("schedule_id","course_id")
);

-- CreateTable
CREATE TABLE "rejection_reasons" (
    "id" SERIAL NOT NULL,
    "schedule_id" INTEGER NOT NULL,
    "code" "RejectionCode" NOT NULL,
    "message" VARCHAR(255) NOT NULL,

    CONSTRAINT "rejection_reasons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "courses_name_idx" ON "courses"("name");

-- CreateIndex
CREATE INDEX "courses_day_start_time_end_time_idx" ON "courses"("day", "start_time", "end_time");

-- CreateIndex
CREATE INDEX "prerequisites_prerequisite_course_id_idx" ON "prerequisites"("prerequisite_course_id");

-- CreateIndex
CREATE INDEX "configuration_required_courses_course_id_idx" ON "configuration_required_courses"("course_id");

-- CreateIndex
CREATE INDEX "configuration_completed_courses_course_id_idx" ON "configuration_completed_courses"("course_id");

-- CreateIndex
CREATE INDEX "generated_schedules_configuration_id_status_idx" ON "generated_schedules"("configuration_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "generated_schedules_configuration_id_combination_number_key" ON "generated_schedules"("configuration_id", "combination_number");

-- CreateIndex
CREATE INDEX "schedule_courses_course_id_idx" ON "schedule_courses"("course_id");

-- CreateIndex
CREATE INDEX "rejection_reasons_schedule_id_idx" ON "rejection_reasons"("schedule_id");

-- AddForeignKey
ALTER TABLE "prerequisites" ADD CONSTRAINT "prerequisites_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prerequisites" ADD CONSTRAINT "prerequisites_prerequisite_course_id_fkey" FOREIGN KEY ("prerequisite_course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration_required_courses" ADD CONSTRAINT "configuration_required_courses_configuration_id_fkey" FOREIGN KEY ("configuration_id") REFERENCES "schedule_configurations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration_required_courses" ADD CONSTRAINT "configuration_required_courses_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration_completed_courses" ADD CONSTRAINT "configuration_completed_courses_configuration_id_fkey" FOREIGN KEY ("configuration_id") REFERENCES "schedule_configurations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration_completed_courses" ADD CONSTRAINT "configuration_completed_courses_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_schedules" ADD CONSTRAINT "generated_schedules_configuration_id_fkey" FOREIGN KEY ("configuration_id") REFERENCES "schedule_configurations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_courses" ADD CONSTRAINT "schedule_courses_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "generated_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_courses" ADD CONSTRAINT "schedule_courses_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rejection_reasons" ADD CONSTRAINT "rejection_reasons_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "generated_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
