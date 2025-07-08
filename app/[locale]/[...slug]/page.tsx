import { PageClientBySlug } from "@/containers/PageClient";
import type { Metadata } from "next";
import { fetchEmployeeBySlugServer } from "@/services/employeeService";
import { notFound } from "next/navigation";

async function getEmployeeData(companySlug: string, employeeSlug: string, locale: string) {
  try {
    console.log(`Fetching employee data for: ${companySlug}/${employeeSlug} with locale: ${locale}`);
    const employee = await fetchEmployeeBySlugServer(`${companySlug}/${employeeSlug}`, locale);
    
    if (!employee) {
      console.log("Employee is null/undefined:", employee);
      // Only trigger not-found if we're sure it's a 404 case
      notFound();
    }
    
    console.log("Employee found:", employee);
    return {
      fullName: `${employee.name} ${employee.surname}`,
      imageUrl: employee.pictureUrl,
      description: `${employee.position} at ${employee.businessCardCompanyResponseDto[0]?.name || ''}`
    };
  } catch (error: unknown) {
    console.error("Error fetching employee data:", error);
    
    // Only call notFound() for specific 404 errors
    if (error instanceof Error && error.message === "EMPLOYEE_NOT_FOUND_404") {
      console.log("404 error detected, redirecting to not-found");
      notFound();
    }
    
    // For other errors, return default data instead of calling notFound()
    console.log("Non-404 error, returning default data");
    return {
      fullName: "Business Card",
      imageUrl: "/defaultman2.png",
      description: "Digital Business Card"
    };
  }
}

interface Props {
  params: { slug: string[]; locale: string };
}

export async function generateMetadata({ params }: { params: { slug: string[]; locale: string } }): Promise<Metadata> {
  const [companySlug, employeeSlug] = params.slug;
  console.log("generateMetadata - locale:", params.locale, "slug:", params.slug);
  const employee = await getEmployeeData(companySlug, employeeSlug, params.locale);

  return {
    title: employee.fullName,
    description: employee.description,
    openGraph: {
      title: employee.fullName,
      description: employee.description,
      images: [employee.imageUrl],
      url: `https://mcard.az/${companySlug}/${employeeSlug}`,
      type: "profile"
    },
    twitter: {
      card: "summary_large_image",
      title: employee.fullName,
      description: employee.description,
      images: [employee.imageUrl]
    }
  };
}

export default function SlugPage({ params }: Props) {
  // Handle different slug patterns
  // Expected format: [companySlug, employeeSlug] -> ["grandmart", "babek-aghamuradli"]
  const fullSlug = params.slug.join('/');
  
  // console.log("Slug params:", params.slug);
  // console.log("Full slug1:", fullSlug);
  
  return <PageClientBySlug slug={fullSlug} />;
} 