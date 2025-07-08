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

// New function to fetch employee data by slug
export async function fetchEmployeeBySlug(slug: string): Promise<Employee | null> {
  try {
    const response = await axiosInstance.post(
      `/get-by-employee-id`,
      {},
      {
        params: { slug: slug },
      }
    );
    return response.data.data;
  } catch (error: unknown) {
    console.error("fetchEmployeeBySlug error:", error);
    
    // Check if it's a 404 error specifically
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 404) {
        throw new Error("EMPLOYEE_NOT_FOUND_404");
      }
    }
    
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

// Server-side function for fetching employee data by slug
export async function fetchEmployeeBySlugServer(slug: string, locale: string = 'en'): Promise<Employee | null> {
  try {
    const response = await axiosInstance.post(
      `/business-card/get-by-employee-id`,
      {},
      {
        params: { slug: slug },
        headers: {
          "Accept-Language": locale
        }
      }
    );
    return response.data.data;
  } catch (error: unknown) {
    console.error("fetchEmployeeBySlugServer error:", error);
    
    // Check if it's a 404 error specifically
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 404) {
        throw new Error("EMPLOYEE_NOT_FOUND_404");
      }
    }
    
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