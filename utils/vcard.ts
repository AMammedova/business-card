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

import { CompanyResponseDto, Employee } from "@/types/employee";
import { toast } from "react-toastify";

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
export const generateVCard = (
  employee: Employee,
  company: CompanyResponseDto,
  pictureUrl?: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    let photoField = "";
    
    if (pictureUrl) {
      // Şəkli yüklə və Base64 formatına çevir
      fetch(pictureUrl)
        .then(response => response.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onloadend = () => {
            // Base64 formatını al və başlığı təmizlə
            const base64data = (reader.result as string).split(',')[1];
            
            // vCard formatına uyğun şəkil sahəsini əlavə et
            photoField = `PHOTO;ENCODING=b;TYPE=JPEG:${base64data}\r\n`;
            
            // Bütün vCard məlumatlarını topla və qaytar
            const vcard = constructVCard(employee, company, photoField);
            resolve(vcard);
          };
          reader.onerror = () => reject(new Error("Şəkil oxuma xətası"));
          reader.readAsDataURL(blob);
        })
        .catch(error => {
          console.error("Şəkil yükləmə xətası:", error);
          // Şəkil olmadan vCard yaradılır
          const vcard = constructVCard(employee, company, "");
          resolve(vcard);
        });
    } else {
      // Şəkil olmadan vCard yaradılır
      const vcard = constructVCard(employee, company, "");
      resolve(vcard);
    }
  });
};

// vCard yaratma köməkçi funksiyası
const constructVCard = (
  employee: Employee,
  company: CompanyResponseDto,
  photoField: string
): string => {
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

export const downloadVCard = async (
  employee: Employee,
  company: CompanyResponseDto
) => {
  try {
    // Şəkil URL-ni yoxlayın və təmizləyin
    let imageBase64 = "";
    
    if (employee.pictureUrl) {
      try {
        // Şəkli ilk öncə HTML img elementi ilə yükləyərək CORS problemini həll edə bilərik
        imageBase64 = await new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous"; // Bu xüsusiyyətlə CORS məhdudiyyətlərini aşa bilərik
          
          img.onload = () => {
            // Şəkli canvas-a çəkib base64 formatına çeviririk
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(img, 0, 0);
            
            // Base64 formatına çeviririk
            try {
              const dataUrl = canvas.toDataURL("image/jpeg");
              resolve(dataUrl.split(",")[1]); // "data:image/jpeg;base64," prefiksini silir
            } catch (err) {
              console.error("Canvas to data URL error:", err);
              resolve(""); // Xəta halında boş string qaytar
            }
          };
          
          img.onerror = () => {
            console.error("Şəkil yüklənə bilmədi");
            resolve(""); // Xəta halında boş string qaytar
          };
          
          img.src = employee.pictureUrl || "";
        });
      } catch (error) {
        console.error("Şəkil çevirmə xətası:", error);
      }
    }
    
    // Şəkli əlavə edərək vCard yaradırıq
    let photoField = "";
    if (imageBase64) {
      photoField = `PHOTO;ENCODING=b;TYPE=JPEG:${imageBase64}\r\n`;
    }
    
    const vCardData = 
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
      "END:VCARD\r\n";
    
    // vCard faylını yükləyirik
    const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    
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