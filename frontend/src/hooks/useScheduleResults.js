import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getScheduleGenerationById } from "../services/scheduleService";
import { getErrorMessage } from "../utils/getErrorMessage";

export function useScheduleResults(id) {
  const [generation, setGeneration] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadGeneration = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getScheduleGenerationById(id);
      setGeneration(data.generation);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setGeneration(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadGeneration();
  }, [loadGeneration]);

  return {
    generation,
    loading,
    loadGeneration,
  };
}