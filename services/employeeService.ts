"use client";

import axios from "axios";
import { axiosInstance } from "@/lib/axiosInstance";
import { Employee } from "@/types/employee";
import { useLocale } from "next-intl";
import { useEffect } from "react";

// Create an axios instance with interceptor to include locale
const setupAxiosWithLocale = (locale: string) => {
  // Add locale to the headers
  axiosInstance.interceptors.request.use(
    (config) => {
      config.headers["Accept-Language"] = locale;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export async function fetchEmployee(id: number): Promise<Employee | null> {
  try {
    const response = await axiosInstance.post(
      `/get-by-employee-id`,
      {},
      {
        params: { employeeId: id },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("fetchEmployee error:", error);
    return null;
  }
}

// Server-side function for fetching employee data
export async function fetchEmployeeServer(id: number, locale: string = 'en'): Promise<Employee | null> {
  try {
    const response = await axiosInstance.post(
      `/get-by-employee-id`,
      {},
      {
        params: { employeeId: id },
        headers: {
          "Accept-Language": locale
        }
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("fetchEmployeeServer error:", error);
    return null;
  }
}

// Export a hook to setup axios with the current locale
export const useAxiosLocale = () => {
  const locale = useLocale();
  
  useEffect(() => {
    setupAxiosWithLocale(locale);
  }, [locale]);
  
  return { locale };
};