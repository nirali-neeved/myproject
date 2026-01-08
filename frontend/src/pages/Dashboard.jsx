import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow p-4 flex justify-between items-center ">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          Loggout
        </Button>
      </header>

      <div className="flex flex-1 outline">
        <aside className="w-64 bg-white border-r p-4">
          <nav className="flex flex-col space-y-2">
            <Button variant="ghost" className="justify-start w-full">
              Home
            </Button>
            <Button variant="ghost" className="justify-start w-full">
              Settings
            </Button>
          </nav>
        </aside>

        <main className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardTitle>Welcome to Dashboard</CardTitle>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;