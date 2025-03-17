import { redirect } from "next/navigation";

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Home({ searchParams }: Props) {
  const id = searchParams.id;
  if (id) {
    redirect(`/profile/${id}`);
  } else {
    redirect("/profile/1018");
  }
}
