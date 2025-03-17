import LandingPage from "@/containers/LandingPage";
interface Props {
  params: { id: string };
}
export default function Page({ params }: Props) {
  const employeeId = params.id;

  return <LandingPage employeeId={employeeId} />;
}
