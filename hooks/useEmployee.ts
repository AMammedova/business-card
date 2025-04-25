"use client";

import { useEffect, useState, useRef } from "react";
import axios, { CancelTokenSource } from "axios";
import { Employee } from "@/types/employee";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;


const cache = new Map<number, Employee>();

const useEmployee = (employeeId: number) => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);

  useEffect(() => {
    if (!employeeId) return;
    if (cache.has(employeeId)) {
      setEmployee(cache.get(employeeId)!);
      setLoading(false);
      return;
    }

    const fetchEmployee = async () => {
      setLoading(true);
      setError(null);

      cancelTokenRef.current?.cancel();
      cancelTokenRef.current = axios.CancelToken.source();

      try {
        const locale =
          typeof document !== "undefined"
            ? document.cookie
                .split("; ")
                .find((row) => row.startsWith("NEXT_LOCALE"))
                ?.split("=")[1] || "en"
            : "en";

        const response = await axios.post(
          `${API_URL}/get-by-employee-id`,
          {},
          {
            params: { employeeId },
            headers: {
              accept: "*/*",
              "Accept-Language": locale,
            },
            cancelToken: cancelTokenRef.current.token,
            timeout: 5000,
          }
        );

        const data = response.data.data;
        cache.set(employeeId, data);
        setEmployee(data);
      } catch (err: unknown) {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", (err as Error).message);
        } else if (err instanceof Error) {
          console.error("Error fetching employee:", err.message);
          setError("Failed to fetch employee");
        } else {
          console.error("Unexpected error:", err);
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();

    return () => {
      cancelTokenRef.current?.cancel("Component unmounted or ID changed");
    };
  }, [employeeId]);

  return { employee, loading, error };
};

export default useEmployee;
