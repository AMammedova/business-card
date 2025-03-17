import { redirect } from "next/navigation";

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Home({ searchParams }: Props) {
  const employeeId = searchParams.employeeId;

  if (employeeId && typeof employeeId === "string") {
    redirect(`/profile/${employeeId}`);
  } else {
    redirect("/profile/9");
  }
}
