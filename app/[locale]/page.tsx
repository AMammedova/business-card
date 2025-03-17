import { redirect } from "next/navigation";

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Home({ searchParams }: Props) {
  const employeeId = searchParams.employeeId;
  console.log(employeeId, "employeeId");
  if (employeeId) {
    redirect(`/profile/${employeeId}`);
  } else {
    redirect("/profile/9");
  }
}
