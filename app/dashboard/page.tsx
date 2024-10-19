import { useSession } from "next-auth/react";

const DashboardPage = () => {
  const { data: session } = useSession();

  if (!session) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome, {session.user.email}</h1>
      <p>Here you can manage your DNS zones</p>

      {/* Render UI for managing DNS zones */}
    </div>
  );
};

export default DashboardPage;
