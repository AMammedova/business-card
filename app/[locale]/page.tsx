import { redirect } from "next/navigation";

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Home({ searchParams }: Props) {
  const rawId = searchParams?.id;

  const extractedId =
    typeof rawId === "string" ? rawId.split("-").pop() : "1018";

  redirect(`/${extractedId}`);
}
