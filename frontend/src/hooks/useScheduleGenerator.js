import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getCourses } from "../services/courseService";
import { generateSchedules } from "../services/scheduleService";
import { getErrorMessage } from "../utils/getErrorMessage";

export function useScheduleGenerator() {
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [generating, setGenerating] = useState(false);

  const loadCourses = useCallback(async () => {
    try {
      setLoadingCourses(true);

      const data = await getCourses();
      setCourses(data.courses ?? []);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoadingCourses(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const generate = async (configuration) => {
    try {
      setGenerating(true);

      const result = await generateSchedules(configuration);

      toast.success(
        `${result.validSchedules} horarios válidos generados`,
      );

      return result;
    } catch (error) {
      toast.error(getErrorMessage(error));
      return null;
    } finally {
      setGenerating(false);
    }
  };

  return {
    courses,
    loadingCourses,
    generating,
    loadCourses,
    generate,
  };
}