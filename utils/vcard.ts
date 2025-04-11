import { CompanyResponseDto, Employee } from "@/types/employee";

export const generateVCard = (
  employee: Employee,
  company: CompanyResponseDto
): string => {
  console.log("employee", employee);
  return (
    "BEGIN:VCARD\r\n" +
    "VERSION:3.0\r\n" +
    `N:${employee.surname};${employee.name};;;\r\n` +
    `FN:${employee.name} ${employee.surname}\r\n` +
    `ORG:${company.name}\r\n` +
    `TITLE:${employee.position}\r\n` +
    `ADR;TYPE=WORK:;;${company.location};;;\r\n` +
    `TEL;TYPE=WORK,VOICE:${employee.phoneNumber.replace(/\D/g, "")}\r\n` +
    `EMAIL:${employee.mail}\r\n` +
    "END:VCARD\r\n"
  );
};

export const downloadVCard = (
  employee: Employee,
  company: CompanyResponseDto
) => {
  const vCardData = generateVCard(employee, company);

  // iOS Devices
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    // Attempt to use a custom URL scheme (may not work on all devices/browsers)
    const contactInfo = `contact-add://${employee.name}_${
      employee.surname
    }?name=${encodeURIComponent(
      employee.name + " " + employee.surname
    )}&phone=${encodeURIComponent(
      employee.phoneNumber
    )}&email=${encodeURIComponent(employee.mail)}`;
    window.location.href = contactInfo;

    // Fallback to vCard download
    setTimeout(() => {
      const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      window.location.href = url;

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
    }, 500);

    return;
  }

  // Android Devices
  if (/Android/i.test(navigator.userAgent)) {
    const intent = `intent:#Intent;action=android.intent.action.INSERT_OR_EDIT;type=vnd.android.cursor.item/contact;S.name=${encodeURIComponent(
      employee.name + " " + employee.surname
    )};S.phone=${encodeURIComponent(
      employee.phoneNumber
    )};S.email=${encodeURIComponent(
      employee.mail
    )};S.company=${encodeURIComponent(
      company.name
    )};S.postal=${encodeURIComponent(company.location)};end;`;
    window.location.href = intent;
    return;
  }

  // Fallback for Desktop or Unsupported Devices
  const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${employee.name}_${employee.surname}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
};
