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

// export const downloadVCard = (
//   employee: Employee,
//   company: CompanyResponseDto
// ) => {
//   const vCardData = generateVCard(employee, company);
//   const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8" });
//   const url = URL.createObjectURL(blob);

//   const link = document.createElement('a');
//   link.href = url;

//   // Fayl adını dinamik təyin edirik
//   link.download = `${employee.name}_${employee.surname}.vcf`;

//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);

//   setTimeout(() => {
//     URL.revokeObjectURL(url);
//   }, 1000);
// };
import { CompanyResponseDto, Employee } from "@/types/employee";
import { toast } from "react-toastify";

/**
 * vCard textini yaradan funksya (Şəkil URL olaraq əlavə edilir)
 */
export const generateVCard = (
  employee: Employee,
  company: CompanyResponseDto,
  pictureUrl?: string
): string => {
  let photoField = "";

  if (pictureUrl) {
    photoField = `PHOTO;VALUE=URI:${pictureUrl}\r\n`;
  }

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
    photoField +
    "END:VCARD\r\n"
  );
};

/**
 * vCard faylını yükləyən funksya
 */
export const downloadVCard = (
  employee: Employee,
  company: CompanyResponseDto
) => {
  try {
    const vCardData = generateVCard(employee, company, employee.pictureUrl);
    const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;

    // Fayl adını təmizləyirik (boşluqları _ edir, təhlükəli simvolları silir)
    const sanitize = (text: string) => text.replace(/\s+/g, "_").replace(/[^\w\-]/g, "");
    const fileName = `${sanitize(employee.name)}_${sanitize(employee.surname)}.vcf`;

    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);

    toast.success("Əlaqə kartı uğurla yükləndi!", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  } catch (error) {
    console.error("vCard yükləmə xətası:", error);
    toast.error("Əlaqə kartı yüklənə bilmədi!", {
      position: "top-center",
      autoClose: 3000,
    });
  }
};
