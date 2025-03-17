import { cookies } from "next/headers";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function fetchEmployee(employeeId: number) {
  try {
    const locale = cookies().get("NEXT_LOCALE")?.value || "en";

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

    if (!response.data.data) {
      return null; 
    }

    return response.data.data;
  } catch (error) {
    console.error("Error fetching employee:", error);
    throw new Error("Failed to fetch employee");
  }
}
