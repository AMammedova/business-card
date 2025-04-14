// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Employee } from "@/types/employee";


// const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

// const useEmployee = (employeeId: number) => {
//   const [employee, setEmployee] = useState<Employee | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchEmployee = async () => {
//       try {
//         const locale = document.cookie
//           .split("; ")
//           .find((row) => row.startsWith("NEXT_LOCALE"))
//           ?.split("=")[1] || "en";

//         const response = await axios.post(
//           `${API_URL}/get-by-employee-id`,
//           {},
//           {
//             params: { employeeId },
//             headers: {
//               accept: "*/*",
//               "Accept-Language": locale,
//             },
//             timeout: 5000,
//           }
//         );

//         if (!response.data.data) {
//           setEmployee(null);
//         } else {
//           setEmployee(response.data.data);
//         }
//       } catch (err) {
//         console.error("Error fetching employee:", err);
//         setError("Failed to fetch employee");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEmployee();
//   }, [employeeId]);

//   return { employee, loading, error };
// };

// export default useEmployee;
// hooks/useEmployee.ts
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Employee } from "@/types/employee";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

const useEmployee = (employeeId: number) => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const locale = document.cookie
          .split("; ")
          .find((row) => row.startsWith("NEXT_LOCALE"))
          ?.split("=")[1] || "en";

        const response = await axios.post(
          `${API_URL}/get-by-employee-id`,
          {},
          {
            params: { employeeId },
            headers: {
              accept: "*/*",
              "Accept-Language": locale,
            },
            timeout: 5000,
          }
        );
        setEmployee(response.data.data);
      } catch (err) {
        console.error("Error fetching employee:", err);
        setError("Failed to fetch employee");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  return { employee, loading, error };
};

export default useEmployee;
