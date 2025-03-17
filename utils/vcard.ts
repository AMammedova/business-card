import { CompanyResponseDto, Employee } from "@/types/employee";

export const generateVCard = (employee: Employee, company: CompanyResponseDto): string => {
    return `BEGIN:VCARD
  VERSION:3.0
  N:${employee.surname};${employee.name};;;
  FN:${employee.name} ${employee.surname}
  ORG:${company.name}
  TITLE:${employee.position}
  ADR;TYPE=WORK:${company.location}
  TEL;TYPE=WORK,VOICE:${employee.phoneNumber}
  EMAIL:${employee.mail}
  ${company.siteResponseDto.map(site => `URL:${site.url}`).join("\n")}
  END:VCARD`;
  };
  
  export const downloadVCard = (employee: Employee, company: CompanyResponseDto) => {
    const vCardData = generateVCard(employee, company);
    const blob = new Blob([vCardData], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = `${employee.name}_${employee.surname}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };