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

export const downloadVCard = (
  employee: Employee,
  company: CompanyResponseDto
) => {
  // For iOS devices
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    // Use the contact-add URL scheme for iOS
    const contactInfo = `contact-add://${employee.name}_${employee.surname}?name=${encodeURIComponent(employee.name + ' ' + employee.surname)}&phone=${encodeURIComponent(employee.phoneNumber)}&email=${encodeURIComponent(employee.mail)}`;
    window.location.href = contactInfo;
    
    // Fallback in case the contact-add scheme doesn't work
    setTimeout(() => {
      const vCardData = generateVCard(employee, company);
      const blob = new Blob([vCardData], { type: "text/x-vcard" });
      const url = URL.createObjectURL(blob);
      window.location.href = url;
      
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
    }, 500);
    
    return;
  }

  // For Android devices
  if (/Android/i.test(navigator.userAgent)) {
    const intent = `intent:#Intent;action=android.intent.action.INSERT_OR_EDIT;type=vnd.android.cursor.item/contact;S.name=${encodeURIComponent(employee.name + ' ' + employee.surname)};S.phone=${encodeURIComponent(employee.phoneNumber)};S.email=${encodeURIComponent(employee.mail)};S.company=${encodeURIComponent(company.name)};S.postal=${encodeURIComponent(company.location)};end`;
    window.location.href = intent;
    return;
  }

  // Fallback for desktop or unsupported devices
  const vCardData = generateVCard(employee, company);
  const blob = new Blob([vCardData], { type: "text/x-vcard" });
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
};
