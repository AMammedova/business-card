// import { Suspense } from "react";
// import LandingPage from "@/containers/LandingPage";
// import { fetchEmployee } from "@/services/employeeService";
// import Loading from "@/components/Loading";
// import ErrorComponent from "@/components/Error";
// import NotFound from "@/components/NotFound";

// interface Props {
//   params: { id: string };
// }

// export default async function Page({ params }: Props) {
//   let employee = null;

//   try {
//     employee = await fetchEmployee(Number(params.id));
//   } catch (error) {
//     console.error("Error fetching employee:", error);
//     return <ErrorComponent />;
//   }

//   if (!employee) {
//     return <NotFound />;
//   }

//   return (
//     <Suspense fallback={<Loading />}>
//       <LandingPage employee={employee} />
//     </Suspense>
//   );
// }

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
