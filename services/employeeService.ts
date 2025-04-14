// import { cookies } from "next/headers";
// import axios from "axios";

// const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

// export async function fetchEmployee(employeeId: number) {
//   try {
//     const locale = cookies().get("NEXT_LOCALE")?.value || "en";

//     const response = await axios.post(
//       `${API_URL}/get-by-employee-id`,
//       {},
//       {
//         params: { employeeId },
//         headers: {
//           accept: "*/*",
//           "Accept-Language": locale,
//         },
//         timeout: 5000,
//       }
//     );

//     if (!response.data.data) {
//       return null; 
//     }

//     return response.data.data;
//   } catch (error) {
//     console.error("Error fetching employee:", error);
//     throw new Error("Failed to fetch employee");
//   }
// }
// /app/services/employeeService.ts

// app/services/employeeService.ts


// import { cache } from 'react';

// const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

// export const fetchEmployee = cache(async (employeeId: number) => {
//   try {
//     console.log("Fetching employee data for ID:", employeeId);
    
//     // Use fetch API instead of axios for server components
//     const response = await fetch(`${API_URL}/get-by-employee-id?employeeId=${employeeId}`, {
//       method: 'POST',
//       headers: {
//         'Accept': '*/*',
//         'Accept-Language': 'en', // Default to English if no cookie is available server-side
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({}), // Empty POST body if needed
//       cache: 'no-store', // Don't cache the result
//     });
    
//     if (!response.ok) {
//       console.error(`Failed to fetch employee: ${response.status}`);
//       return null;
//     }
    
//     const data = await response.json();
//     console.log("Received employee data:", data);
    
//     if (!data.data) {
//       console.log("No data found in response");
//       return null;
//     }
    
//     return data.data;
//   } catch (error) {
//     console.error("Error fetching employee:", error);
//     return null;
//   }
// });
// services/employeeService.ts
import axios from "axios";
import { Employee } from "@/types/employee";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function fetchEmployee(id: number): Promise<Employee | null> {
  try {
    const response = await axios.post(
      `${API_URL}/get-by-employee-id`,
      {},
      {
        params: { employeeId: id },
        headers: {
          accept: "*/*",
          "Accept-Language": "en", // burada "document.cookie" yoxdur serverdə
        },
        timeout: 5000,
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("fetchEmployee error:", error);
    return null;
  }
}
