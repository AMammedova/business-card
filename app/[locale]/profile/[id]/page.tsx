
"use client";

import React from "react";
import LandingPage from "@/containers/LandingPage";
import Loading from "@/components/Loading";
import ErrorComponent from "@/components/Error";
import NotFound from "@/components/NotFound";
import useEmployee from "@/hooks/useEmployee";

interface Props {
  params: { id: string };
}

export default function Page({ params }: Props) {
  const { employee, loading, error } = useEmployee(Number(params.id));

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorComponent />;
  }

  if (!employee) {
    return <NotFound />;
  }

  return <LandingPage employee={employee} />;
}
