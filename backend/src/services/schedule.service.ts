import  prisma from "../database/prisma.js";

import {
  calculateCombinationCount,
  generateCombinations,
} from "../utils/combinatorics.js";

import { formatTime } from "../utils/time.js";
import { HttpError } from "../utils/httpError.js";

import type {
  GeneratorCourse,
  ScheduleConfigurationInput,
  SchedulePropositions,
  ScheduleRejectionReason,
} from "../types/schedule.types.js";

// Verifica si dos materias se cruzan
function haveTimeConflict(
  courseA: GeneratorCourse,
  courseB: GeneratorCourse,
): boolean {
  if (courseA.day !== courseB.day) {
    return false;
  }

  return (
    courseA.startTime.getTime() <
      courseB.endTime.getTime() &&
    courseB.startTime.getTime() <
      courseA.endTime.getTime()
  );
}

// Revisa todas las parejas del horario
function hasScheduleConflicts(
  courses: GeneratorCourse[],
): boolean {
  for (let first = 0; first < courses.length; first++) {
    for (
      let second = first + 1;
      second < courses.length;
      second++
    ) {
      if (
        haveTimeConflict(
          courses[first]!,
          courses[second]!,
        )
      ) {
        return true;
      }
    }
  }

  return false;
}

// Evalúa una combinación
function evaluateSchedule(
  schedule: GeneratorCourse[],
  configuration: ScheduleConfigurationInput,
) {
  const rejectionReasons: ScheduleRejectionReason[] = [];

  // H = conjunto de materias del horario
  const scheduleCourseIds = new Set(
    schedule.map((course) => course.id),
  );

  const correctSize =
    schedule.length === configuration.numberOfCourses;

  // O ⊆ H
  const includesRequiredCourses =
    configuration.requiredCourseIds.every((courseId) =>
      scheduleCourseIds.has(courseId),
    );

  const hasNoTimeConflicts =
    !configuration.avoidTimeConflicts ||
    !hasScheduleConflicts(schedule);

  const meetsModality =
    configuration.requiredModality === "CUALQUIERA" ||
    schedule.some(
      (course) =>
        course.modality ===
        configuration.requiredModality,
    );

  const difficultCoursesCount = schedule.filter(
    (course) => course.difficulty === "ALTA",
  ).length;

  const meetsDifficultyLimit =
    difficultCoursesCount <=
    configuration.maximumDifficultCourses;

  const totalCredits = schedule.reduce(
    (total, course) => total + course.credits,
    0,
  );

  const meetsCreditLimit =
    totalCredits <= configuration.maximumCredits;

  // Materias del horario ∪ materias aprobadas
  const availablePrerequisites = new Set([
    ...scheduleCourseIds,
    ...configuration.completedCourseIds,
  ]);

  const meetsPrerequisites =
    !configuration.validatePrerequisites ||
    schedule.every((course) =>
      course.prerequisiteIds.every((prerequisiteId) =>
        availablePrerequisites.has(prerequisiteId),
      ),
    );

  const propositions: SchedulePropositions = {
    correctSize,
    includesRequiredCourses,
    hasNoTimeConflicts,
    meetsModality,
    meetsDifficultyLimit,
    meetsCreditLimit,
    meetsPrerequisites,
  };

  if (!correctSize) {
    rejectionReasons.push({
      code: "CANTIDAD_INCORRECTA",
      message:
        "La cantidad de materias no coincide con la configuración.",
    });
  }

  if (!includesRequiredCourses) {
    rejectionReasons.push({
      code: "MATERIAS_OBLIGATORIAS_FALTANTES",
      message:
        "No contiene todas las materias obligatorias.",
    });
  }

  if (!hasNoTimeConflicts) {
    rejectionReasons.push({
      code: "CRUCE_HORARIO",
      message: "El horario tiene cruces.",
    });
  }

  if (!meetsModality) {
    rejectionReasons.push({
      code: "MODALIDAD_NO_CUMPLIDA",
      message: `No contiene una materia de modalidad ${configuration.requiredModality}.`,
    });
  }

  if (!meetsDifficultyLimit) {
    rejectionReasons.push({
      code: "MAXIMO_DIFICILES_SUPERADO",
      message:
        "Supera el máximo de materias difíciles.",
    });
  }

  if (!meetsCreditLimit) {
    rejectionReasons.push({
      code: "MAXIMO_CREDITOS_SUPERADO",
      message: "Supera el máximo de créditos.",
    });
  }

  if (!meetsPrerequisites) {
    rejectionReasons.push({
      code: "PRERREQUISITOS_NO_CUMPLIDOS",
      message: "No cumple todos los prerrequisitos.",
    });
  }

  return {
    valid: rejectionReasons.length === 0,
    rejectionReasons,
    totalCredits,
    difficultCoursesCount,
    propositions,
  };
}

function formatGeneratorCourse(course: GeneratorCourse) {
  return {
    id: course.id,
    name: course.name,
    section: course.section,
    day: course.day,
    startTime: formatTime(course.startTime),
    endTime: formatTime(course.endTime),
    modality: course.modality,
    difficulty: course.difficulty,
    credits: course.credits,
    prerequisiteIds: course.prerequisiteIds,
  };
}

function formatStoredCourse(course: {
  id: number;
  name: string;
  section: string | null;
  day: string;
  startTime: Date;
  endTime: Date;
  modality: string;
  difficulty: string;
  credits: number;
}) {
  return {
    id: course.id,
    name: course.name,
    section: course.section,
    day: course.day,
    startTime: formatTime(course.startTime),
    endTime: formatTime(course.endTime),
    modality: course.modality,
    difficulty: course.difficulty,
    credits: course.credits,
  };
}

// Genera y guarda los horarios
export async function generateSchedules(
  configuration: ScheduleConfigurationInput,
) {
  const courseRecords = await prisma.course.findMany({
    include: {
      prerequisiteLinks: {
        select: {
          prerequisiteCourseId: true,
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });

  const courses: GeneratorCourse[] = courseRecords.map(
    (course:any) => ({
      id: course.id,
      name: course.name,
      section: course.section,
      day: course.day,
      startTime: course.startTime,
      endTime: course.endTime,
      modality: course.modality,
      difficulty: course.difficulty,
      credits: course.credits,
      prerequisiteIds: course.prerequisiteLinks.map(
        (relation:any) => relation.prerequisiteCourseId,
      ),
    }),
  );

  if (
    configuration.numberOfCourses >
    courses.length
  ) {
    throw new HttpError(
      400,
      "No existen suficientes materias para generar el horario solicitado",
    );
  }

  const availableCourseIds = new Set(
    courses.map((course) => course.id),
  );

  const requestedIds = [
    ...configuration.requiredCourseIds,
    ...configuration.completedCourseIds,
  ];

  const missingIds = requestedIds.filter(
    (id) => !availableCourseIds.has(id),
  );

  if (missingIds.length > 0) {
    throw new HttpError(
      400,
      `No existen materias con los ID: ${[
        ...new Set(missingIds),
      ].join(", ")}`,
    );
  }

  const totalCombinations =
    calculateCombinationCount(
      courses.length,
      configuration.numberOfCourses,
    );

  const combinations = generateCombinations(
    courses,
    configuration.numberOfCourses,
  );

  const evaluatedSchedules = combinations.map(
    (schedule, index) => ({
      combinationNumber: index + 1,
      courseRecords: schedule,
      ...evaluateSchedule(schedule, configuration),
    }),
  );

  const validSchedulesCount =
    evaluatedSchedules.filter(
      (schedule) => schedule.valid,
    ).length;

  const discardedSchedulesCount =
    evaluatedSchedules.length -
    validSchedulesCount;

  // Guarda configuración, horarios, materias y descartes
  const storedConfiguration =
    await prisma.scheduleConfiguration.create({
      data: {
        numberOfCourses:
          configuration.numberOfCourses,

        maximumCredits:
          configuration.maximumCredits,

        maximumDifficultCourses:
          configuration.maximumDifficultCourses,

        requiredModality:
          configuration.requiredModality,

        avoidTimeConflicts:
          configuration.avoidTimeConflicts,

        validatePrerequisites:
          configuration.validatePrerequisites,

        totalAvailableCourses: courses.length,
        totalCombinations,
        validSchedulesCount,
        discardedSchedulesCount,
        generatedAt: new Date(),

        ...(configuration.requiredCourseIds.length > 0
          ? {
              requiredCourses: {
                create:
                  configuration.requiredCourseIds.map(
                    (courseId) => ({
                      course: {
                        connect: {
                          id: courseId,
                        },
                      },
                    }),
                  ),
              },
            }
          : {}),

        ...(configuration.completedCourseIds.length > 0
          ? {
              completedCourses: {
                create:
                  configuration.completedCourseIds.map(
                    (courseId) => ({
                      course: {
                        connect: {
                          id: courseId,
                        },
                      },
                    }),
                  ),
              },
            }
          : {}),

        schedules: {
          create: evaluatedSchedules.map((schedule) => ({
            combinationNumber:
              schedule.combinationNumber,

            status: schedule.valid
              ? "VALIDO"
              : "DESCARTADO",

            totalCredits: schedule.totalCredits,

            difficultCoursesCount:
              schedule.difficultCoursesCount,

            courses: {
              create: schedule.courseRecords.map(
                (course) => ({
                  course: {
                    connect: {
                      id: course.id,
                    },
                  },
                }),
              ),
            },

            ...(schedule.rejectionReasons.length > 0
              ? {
                  rejectionReasons: {
                    create:
                      schedule.rejectionReasons.map(
                        (reason) => ({
                          code: reason.code,
                          message: reason.message,
                        }),
                      ),
                  },
                }
              : {}),
          })),
        },
      },

      select: {
        id: true,
        generatedAt: true,
      },
    });

  return {
    configurationId: storedConfiguration.id,
    generatedAt: storedConfiguration.generatedAt,

    totalCourses: courses.length,
    selectedAmount:
      configuration.numberOfCourses,
    totalCombinations,
    validSchedules: validSchedulesCount,
    discardedSchedules:
      discardedSchedulesCount,

    mathematicalModel: {
      combination: `C(${courses.length}, ${configuration.numberOfCourses}) = ${totalCombinations}`,
      logicalRule:
        "T ∧ O ∧ C ∧ M ∧ D ∧ R ∧ P",
      subsetRule:
        "Materias obligatorias ⊆ Materias del horario",
    },

    schedules: evaluatedSchedules.map((schedule) => ({
      combinationNumber:
        schedule.combinationNumber,

      courses:
        schedule.courseRecords.map(
          formatGeneratorCourse,
        ),

      valid: schedule.valid,

      reasons: schedule.rejectionReasons.map(
        (reason) => reason.message,
      ),

      reasonDetails: schedule.rejectionReasons,
      totalCredits: schedule.totalCredits,

      difficultCoursesCount:
        schedule.difficultCoursesCount,

      propositions: schedule.propositions,
    })),
  };
}

// Lista el historial
export async function getScheduleGenerations() {
  return prisma.scheduleConfiguration.findMany({
    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,
      numberOfCourses: true,
      maximumCredits: true,
      maximumDifficultCourses: true,
      requiredModality: true,
      avoidTimeConflicts: true,
      validatePrerequisites: true,
      totalAvailableCourses: true,
      totalCombinations: true,
      validSchedulesCount: true,
      discardedSchedulesCount: true,
      createdAt: true,
      generatedAt: true,
    },
  });
}

// Obtiene el detalle de una generación
export async function getScheduleGenerationById(
  id: number,
) {
  const generation =
    await prisma.scheduleConfiguration.findUnique({
      where: {
        id,
      },

      include: {
        requiredCourses: {
          include: {
            course: true,
          },
        },

        completedCourses: {
          include: {
            course: true,
          },
        },

        schedules: {
          orderBy: {
            combinationNumber: "asc",
          },

          include: {
            courses: {
              include: {
                course: true,
              },
            },

            rejectionReasons: {
              orderBy: {
                id: "asc",
              },
            },
          },
        },
      },
    });

  if (!generation) {
    throw new HttpError(
      404,
      "La generación de horarios no existe",
    );
  }

  return {
    id: generation.id,

    configuration: {
      numberOfCourses:
        generation.numberOfCourses,

      maximumCredits:
        generation.maximumCredits,

      maximumDifficultCourses:
        generation.maximumDifficultCourses,

      requiredModality:
        generation.requiredModality,

      avoidTimeConflicts:
        generation.avoidTimeConflicts,

      validatePrerequisites:
        generation.validatePrerequisites,
    },

    statistics: {
      totalCourses:
        generation.totalAvailableCourses,

      totalCombinations:
        generation.totalCombinations,

      validSchedules:
        generation.validSchedulesCount,

      discardedSchedules:
        generation.discardedSchedulesCount,
    },

    requiredCourses:
      generation.requiredCourses.map(
        (item:any) =>
          formatStoredCourse(item.course),
      ),

    completedCourses:
      generation.completedCourses.map(
        (item:any) =>
          formatStoredCourse(item.course),
      ),

    schedules: generation.schedules.map(
      (schedule:any) => ({
        id: schedule.id,

        combinationNumber:
          schedule.combinationNumber,

        valid: schedule.status === "VALIDO",

        status: schedule.status,
        totalCredits: schedule.totalCredits,

        difficultCoursesCount:
          schedule.difficultCoursesCount,

        courses: schedule.courses.map(
          (item:any) =>
            formatStoredCourse(item.course),
        ),

        reasons:
          schedule.rejectionReasons.map(
            (reason:any) => reason.message,
          ),

        reasonDetails:
          schedule.rejectionReasons,
      }),
    ),

    createdAt: generation.createdAt,
    generatedAt: generation.generatedAt,
  };
}

// Elimina una generación completa
export async function deleteScheduleGeneration(
  id: number,
) {
  const existing =
    await prisma.scheduleConfiguration.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

  if (!existing) {
    throw new HttpError(
      404,
      "La generación de horarios no existe",
    );
  }

  await prisma.scheduleConfiguration.delete({
    where: {
      id,
    },
  });
}