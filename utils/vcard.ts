import { CompanyResponseDto, Employee } from "@/types/employee";

export const generateVCard = (
  employee: Employee,
  company: CompanyResponseDto
): string => {
  return `BEGIN:VCARD\r\n` +
         `VERSION:3.0\r\n` +
         `N:${employee.surname};${employee.name};;;\r\n` +
         `FN:${employee.name} ${employee.surname}\r\n` +
         `ORG:${company.name}\r\n` +
         `TITLE:${employee.position}\r\n` +
         `ADR;TYPE=WORK:;;${company.location};;;\r\n` +
         `TEL;TYPE=WORK,VOICE:${employee.phoneNumber.replace(/\D/g, "")}\r\n` +
         `EMAIL:${employee.mail}\r\n` +
         `END:VCARD\r\n`;
};

export const downloadVCard = (
  employee: Employee,
  company: CompanyResponseDto
) => {
  const vCardData = generateVCard(employee, company);
  const blob = new Blob([vCardData], { type: "text/x-vcard" });
  const url = URL.createObjectURL(blob);

  // Mobil cihazlarda birbaşa açmaq üçün:
  if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
    window.location.href = url;
  } else {
    const a = document.createElement("a");
    a.href = url;
    a.download = `${employee.name}_${employee.surname}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
