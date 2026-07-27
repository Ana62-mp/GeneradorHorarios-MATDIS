import prisma from "../database/prisma.js";

import type { CourseInput } from "../types/course.types.js";

import { HttpError } from "../utils/httpError.js";
import {
  formatTime,
  timeStringToDate,
} from "../utils/time.js";

type CourseRecord = {
  id: number;
  name: string;
  section: string | null;
  day: string;
  startTime: Date;
  endTime: Date;
  modality: string;
  difficulty: string;
  credits: number;
  createdAt: Date;
  updatedAt: Date;

  prerequisiteLinks: Array<{
    prerequisiteCourse: {
      id: number;
      name: string;
      section: string | null;
    };
  }>;
};

const courseRelations = {
  prerequisiteLinks: {
    include: {
      prerequisiteCourse: {
        select: {
          id: true,
          name: true,
          section: true,
        },
      },
    },
  },
};

function formatCourse(course: CourseRecord) {
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

    prerequisites: course.prerequisiteLinks.map(
      (relation) => relation.prerequisiteCourse,
    ),

    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
  };
}

async function validatePrerequisites(
  prerequisiteIds: number[],
  currentCourseId?: number,
) {
  if (currentCourseId && prerequisiteIds.includes(currentCourseId)) {
    throw new HttpError(
      400,
      "Una materia no puede ser prerrequisito de sí misma",
    );
  }

  if (prerequisiteIds.length === 0) {
    return;
  }

  const existingCourses = await prisma.course.findMany({
    where: {
      id: {
        in: prerequisiteIds,
      },
    },
    select: {
      id: true,
    },
  });

  const existingIds = new Set(
    existingCourses.map((course:any) => course.id),
  );

  const missingIds = prerequisiteIds.filter(
    (id) => !existingIds.has(id),
  );

  if (missingIds.length > 0) {
    throw new HttpError(
      400,
      `No existen las materias prerrequisito con ID: ${missingIds.join(", ")}`,
    );
  }
}

export async function getAllCourses() {
  const courses = await prisma.course.findMany({
    include: courseRelations,

    orderBy: [
      {
        name: "asc",
      },
      {
        day: "asc",
      },
      {
        startTime: "asc",
      },
    ],
  });

  return courses.map((course:any) =>
    formatCourse(course as CourseRecord),
  );
}

export async function getCourseById(id: number) {
  const course = await prisma.course.findUnique({
    where: {
      id,
    },
    include: courseRelations,
  });

  if (!course) {
    throw new HttpError(404, "La materia no existe");
  }

  return formatCourse(course as CourseRecord);
}

export async function createCourse(data: CourseInput) {
  const prerequisiteIds = data.prerequisiteIds ?? [];

  await validatePrerequisites(prerequisiteIds);

  const createdCourse = await prisma.$transaction(
    async (transaction:any) => {
      const course = await transaction.course.create({
        data: {
          name: data.name,
          section: data.section,
          day: data.day,
          startTime: timeStringToDate(data.startTime),
          endTime: timeStringToDate(data.endTime),
          modality: data.modality,
          difficulty: data.difficulty,
          credits: data.credits,
        },
      });

      if (prerequisiteIds.length > 0) {
        await transaction.prerequisite.createMany({
          data: prerequisiteIds.map((prerequisiteId) => ({
            courseId: course.id,
            prerequisiteCourseId: prerequisiteId,
          })),
        });
      }

      return transaction.course.findUnique({
        where: {
          id: course.id,
        },
        include: courseRelations,
      });
    },
  );

  if (!createdCourse) {
    throw new HttpError(500, "No fue posible registrar la materia");
  }

  return formatCourse(createdCourse as CourseRecord);
}

export async function updateCourse(
  id: number,
  data: CourseInput,
) {
  const existingCourse = await prisma.course.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!existingCourse) {
    throw new HttpError(404, "La materia no existe");
  }

  const prerequisiteIds = data.prerequisiteIds ?? [];

  await validatePrerequisites(prerequisiteIds, id);

  const updatedCourse = await prisma.$transaction(
    async (transaction:any) => {
      await transaction.prerequisite.deleteMany({
        where: {
          courseId: id,
        },
      });

      await transaction.course.update({
        where: {
          id,
        },
        data: {
          name: data.name,
          section: data.section,
          day: data.day,
          startTime: timeStringToDate(data.startTime),
          endTime: timeStringToDate(data.endTime),
          modality: data.modality,
          difficulty: data.difficulty,
          credits: data.credits,
        },
      });

      if (prerequisiteIds.length > 0) {
        await transaction.prerequisite.createMany({
          data: prerequisiteIds.map((prerequisiteId) => ({
            courseId: id,
            prerequisiteCourseId: prerequisiteId,
          })),
        });
      }

      return transaction.course.findUnique({
        where: {
          id,
        },
        include: courseRelations,
      });
    },
  );

  if (!updatedCourse) {
    throw new HttpError(500, "No fue posible actualizar la materia");
  }

  return formatCourse(updatedCourse as CourseRecord);
}

export async function deleteCourse(id: number) {
  const existingCourse = await prisma.course.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!existingCourse) {
    throw new HttpError(404, "La materia no existe");
  }

  await prisma.course.delete({
    where: {
      id,
    },
  });

  return existingCourse;
}