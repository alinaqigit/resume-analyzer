import { auth } from "@clerk/nextjs/server";

export default async function Dashboard() {
  const user = await auth();

  

  return <div>Welcome!</div>;
}
