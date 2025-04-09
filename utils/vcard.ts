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

export const addToContacts = async (
  employee: Employee,
  company: CompanyResponseDto
) => {
  // Try using the native Contacts API first
  if ('contacts' in navigator && 'ContactsManager' in window) {
    try {
      const newContact = {
        name: [`${employee.name} ${employee.surname}`],
        email: [employee.mail],
        tel: [`+${employee.phoneNumber}`],
        organization: [company.name],
        title: [employee.position],
        address: [company.location]
      };

      await (navigator.contacts as any).save(newContact);
      return true;
    } catch (error) {
      console.error('Error saving contact:', error);
      return false;
    }
  }

  // Try using deep linking for iOS
  if (/iPhone|iPad/i.test(navigator.userAgent)) {
    try {
      const url = `contacts://add?name=${encodeURIComponent(`${employee.name} ${employee.surname}`)}&phone=${encodeURIComponent(`+${employee.phoneNumber}`)}&email=${encodeURIComponent(employee.mail)}`;
      window.location.href = url;
      return true;
    } catch (error) {
      console.error('Error with iOS deep linking:', error);
      return false;
    }
  }

  // Try using Android intent
  if (/Android/i.test(navigator.userAgent)) {
    try {
      const intent = `intent://contacts/people/#Intent;scheme=content;action=android.intent.action.INSERT;S.name=${encodeURIComponent(`${employee.name} ${employee.surname}`)};S.phone=${encodeURIComponent(`+${employee.phoneNumber}`)};S.email=${encodeURIComponent(employee.mail)};end`;
      window.location.href = intent;
      return true;
    } catch (error) {
      console.error('Error with Android intent:', error);
      return false;
    }
  }

  return false;
};

export const downloadVCard = async (
  employee: Employee,
  company: CompanyResponseDto
) => {
  // Try to add contact directly first
  const added = await addToContacts(employee, company);
  if (added) return;

  // Fall back to vCard download if direct adding fails
  const vCardData = generateVCard(employee, company);
  const blob = new Blob([vCardData], { type: "text/x-vcard" });
  const url = URL.createObjectURL(blob);

  // For mobile devices, try opening directly
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
