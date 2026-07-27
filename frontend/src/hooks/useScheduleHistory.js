import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  deleteScheduleGeneration,
  getScheduleGenerations,
} from "../services/scheduleService";

import { getErrorMessage } from "../utils/getErrorMessage";

export function useScheduleHistory() {
  const [generations, setGenerations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getScheduleGenerations();
      setGenerations(data.generations ?? []);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const removeGeneration = async (id) => {
    try {
      setDeleting(true);

      await deleteScheduleGeneration(id);
      toast.success("Generación eliminada correctamente");

      await loadHistory();
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error));
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return {
    generations,
    loading,
    deleting,
    loadHistory,
    removeGeneration,
  };
}