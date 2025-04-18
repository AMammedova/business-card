
import PageClient from "@/containers/PageClient";
import { fetchEmployee } from "@/services/employeeService";
import type { Metadata } from "next";


interface Props {
  params: { id: string };
}

// 🔥 1. Server Side Metadata
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const employee = await fetchEmployee(Number(params.id));

  if (!employee) {
    return {
      title: "Digital Business Card",
      description: "Create and Share Your Digital Business Card",
      openGraph: {
        title: "Digital Business Card",
        description: "Create and Share Your Digital Business Card",
        images: ["/favicon.ico"], // default image
      },
    };
  }

  const pictureUrl = employee.pictureUrl?.startsWith('https')
    ? `${employee.pictureUrl}`
    : "/favicon.ico";

  return {
    title: `${employee.name} ${employee.surname}`,
    description: `Contact ${employee.name} ${employee.surname} via Digital Business Card`,
    openGraph: {
      title: `${employee.name} ${employee.surname}`,
      description: `Contact ${employee.name} ${employee.surname} via Digital Business Card`,
      images: [
        {
          url: pictureUrl,
          width: 800,
          height: 600,
          alt: `${employee.name} ${employee.surname}`,
        },
      ],
    },
    icons: [
      {
        rel: "icon",
        url: pictureUrl,
        type: "image/png",
      },
    ],
  };
}


// 🔥 2. Server Component (just call Client Component inside)
export default function Page({ params }: Props) {
  return <PageClient id={params.id} />;
}
