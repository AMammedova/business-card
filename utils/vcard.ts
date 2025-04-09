import { CompanyResponseDto, Employee } from "@/types/employee";

export const generateVCard = (
  employee: Employee,
  company: CompanyResponseDto
): string => {
  console.log("employee", employee);
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

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    // Mobile: open vCard as data URL to trigger "Add Contact" flow
    const dataUrl = 'data:text/vcard;charset=utf-8,' + encodeURIComponent(vCardData);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${employee.name}_${employee.surname}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    // Desktop: download vCard file normally
    const blob = new Blob([vCardData], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${employee.name}_${employee.surname}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  }
};
