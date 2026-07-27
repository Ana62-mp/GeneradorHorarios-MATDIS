import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  createCourse,
  deleteCourse,
  getCourses,
  updateCourse,
} from "../services/courseService";

import { getErrorMessage } from "../utils/getErrorMessage";

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadCourses = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getCourses();
      setCourses(data.courses ?? []);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const saveCourse = async (courseData, courseId = null) => {
    try {
      setSaving(true);

      if (courseId) {
        await updateCourse(courseId, courseData);
        toast.success("Materia actualizada correctamente");
      } else {
        await createCourse(courseData);
        toast.success("Materia registrada correctamente");
      }

      await loadCourses();
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const removeCourse = async (courseId) => {
    try {
      setDeleting(true);

      await deleteCourse(courseId);
      toast.success("Materia eliminada correctamente");

      await loadCourses();
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error));
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return {
    courses,
    loading,
    saving,
    deleting,
    loadCourses,
    saveCourse,
    removeCourse,
  };
}