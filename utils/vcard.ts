// import { CompanyResponseDto, Employee } from "@/types/employee";
// export const generateVCard = (
//   employee: Employee,
//   company: CompanyResponseDto
// ): string => {
//   return (
//     "BEGIN:VCARD\r\n" +
//     "VERSION:3.0\r\n" +
//     `N:${employee.surname};${employee.name};;;\r\n` +
//     `FN:${employee.name} ${employee.surname}\r\n` +
//     `ORG:${company.name}\r\n` +
//     `TITLE:${employee.position}\r\n` +
//     `ADR;TYPE=WORK:;;${company.location};;;\r\n` +
//     `TEL;TYPE=WORK,VOICE:${employee.phoneNumber.replace(/\D/g, "")}\r\n` +
//     `EMAIL:${employee.mail}\r\n` +
//     "END:VCARD\r\n"
//   );
// };

import { toast } from "react-toastify";

/**
 * Cookie-dən dili oxuyan funksiya
 */
const getLocaleFromCookie = (): string | null => {
  const match = document.cookie.match(new RegExp('(^| )NEXT_LOCALE=([^;]+)'));
  return match ? match[2] : null;
};

/**
 * Backenddən vCard yükləyən funksiya
 * @param employeeId İşçinin ID-si
 * @param successMessage Uğur mesajı (tərcümə edilmiş)
 * @param errorMessage Xəta mesajı (tərcümə edilmiş)
 */
export const downloadVCardFromBackend = async (
  employeeId: number,
  successMessage: string,
  errorMessage: string
) => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const locale = getLocaleFromCookie() || "en";

    const response = await fetch(`${API_URL}/qrcodes/get-vcard/${employeeId}`, {
      method: "GET",
      headers: {
        "Accept-Language": locale,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const vCardString = data.data.vCardText;

    const blob = new Blob([vCardString], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "contact.vcf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);

    toast.success(successMessage, {
      position: "top-center",
      autoClose: 3000,
    });
  } catch (error) {
    console.error("vCard yükləmə xətası:", error);
    toast.error(errorMessage, {
      position: "top-center",
      autoClose: 3000,
    });
  }
};
