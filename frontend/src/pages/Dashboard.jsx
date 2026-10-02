import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>NoteSphere</h1>

        {user ? (
          <p>Welcome, {user.name} 👋</p>
        ) : (
          <p>Notes Dashboard</p>
        )}
      </header>

      <main>
        <h2>What would you like to do?</h2>

        <div className="dashboard-menu">
          <Link to="/create-note">
            Create Note
          </Link>

          <Link to="/notes">
            View Notes
          </Link>

          <Link to="/archived-notes">
            Archived Notes
          </Link>

          <Link to="/profile">
            Profile
          </Link>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;