"use client";

import { useEffect } from "react";
import useEmployee from "@/hooks/useEmployee";
import LandingPage from "@/containers/LandingPage";
import Loading from "@/components/Loading";
import ErrorComponent from "@/components/Error";
import NotFound from "@/components/NotFound";

interface Props {
  id: string;
}

export default function PageClient({ id }: Props) {
  const { employee, loading, error } = useEmployee(Number(id));

  // ✅ Dynamic title
  useEffect(() => {
    if (employee) {
      document.title = `${employee.name} ${employee.surname}`;
    }
  }, [employee]);

  // ✅ Dynamic favicon
  useEffect(() => {
    if (employee?.pictureUrl) {
      const link: HTMLLinkElement | null = document.querySelector('link[rel="icon"]');
      if (link) {
        link.href = employee.pictureUrl;
      } else {
        const newLink = document.createElement('link');
        newLink.rel = "icon";
        newLink.href = employee.pictureUrl;
        document.head.appendChild(newLink);
      }
    }
  }, [employee]);

  if (loading) return <Loading />;
  if (error) return <ErrorComponent />;
  if (!employee) return <NotFound />;

  return <LandingPage employee={employee} />;
}
