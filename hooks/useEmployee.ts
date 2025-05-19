"use client";

import { useEffect, useState, useRef } from "react";
import { CancelTokenSource } from "axios";
import { Employee } from "@/types/employee";
import { fetchEmployee } from "@/services/employeeService";
import { useLocale } from "next-intl";

// Modified cache to include locale in the key
const cache = new Map<string, Employee>();

const useEmployee = (employeeId: number) => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);
  const locale = useLocale();
  
  // Create a cache key that includes both employeeId and locale
  const cacheKey = `${employeeId}-${locale}`;

  useEffect(() => {
    if (!employeeId) return;
    
    // Check cache with combined key of employeeId and locale
    if (cache.has(cacheKey)) {
      setEmployee(cache.get(cacheKey)!);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      // Cancel previous request if any
      cancelTokenRef.current?.cancel();

      try {
        const data = await fetchEmployee(employeeId);
        if (data) {
          // Store in cache with the combined key
          cache.set(cacheKey, data);
          setEmployee(data);
        } else {
          setError("No employee data found");
        }
      } catch (err: unknown) {
        if ((err as any)?.__CANCEL__) {
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

    fetchData();

    return () => {
      cancelTokenRef.current?.cancel("Component unmounted or ID changed");
    };
  }, [employeeId, locale, cacheKey]); // Add locale and cacheKey to dependencies

  return { employee, loading, error };
};

export default useEmployee;