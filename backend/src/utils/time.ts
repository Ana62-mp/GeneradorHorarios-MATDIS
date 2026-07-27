import { HttpError } from "./httpError.js";

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function timeStringToDate(time: string): Date {
  if (!TIME_REGEX.test(time)) {
    throw new HttpError(
      400,
      "La hora debe tener el formato HH:mm, por ejemplo 08:00",
    );
  }

  return new Date(`1970-01-01T${time}:00.000Z`);
}

export function formatTime(time: Date): string {
  return time.toISOString().slice(11, 16);
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);

  if (hours === undefined || minutes === undefined) {
    throw new HttpError(
      400,
      "La hora debe tener el formato HH:mm, por ejemplo 08:00",
    );
  }

  return hours * 60 + minutes;
}