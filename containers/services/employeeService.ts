import axios from "axios";

const API_URL =process.env.NEXT_PUBLIC_BASE_URL;

export const getEmployeeById = async (employeeId:number) => {
  try {
    const response = await axios.post(
      `${API_URL}/get-by-employee-id`,
      {},
      {
        params: { employeeId },
        headers: { accept: "*/*" },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch employee data:", error);
    return null;
  }
};
