import { toast } from "react-toastify";
import axios from "axios";

export const downloadVCardFromAPI = async (employeeId: number) => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const cookieStr = document.cookie;
    const tokenMatch = cookieStr.match(/token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : "";

    if (!token) {
      toast.error("Authentication token not found!");
      return;
    }

    const response = await axios.get(`${API_URL}/qrcodes/get-vcard/${employeeId}`, {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
      timeout: 5000,
    });

    const vCardText = response.data?.data?.vCardText;
    if (!vCardText) {
      toast.error("vCard məlumatı tapılmadı.");
      return;
    }

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      const dataUrl = 'data:text/vcard;charset=utf-8,' + encodeURIComponent(vCardText);
      window.open(dataUrl, "_blank");
    } else {
      const blob = new Blob([vCardText], { type: "text/vcard" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `contact.vcf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
    }

    toast.success("Əlaqə məlumatları uğurla hazırlandı!");

  } catch (error: any) {
    console.error("Error downloading vCard:", error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        toast.error(`Server Error: ${error.response.status}`);
      } else if (error.request) {
        toast.error("Server cavab vermədi. Yenidən yoxlayın.");
      } else {
        toast.error(`Xəta baş verdi: ${error.message}`);
      }
    } else {
      toast.error("Naməlum xəta baş verdi.");
    }
  }
};
