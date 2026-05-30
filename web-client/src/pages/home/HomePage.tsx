import { useNavigate } from "react-router-dom";
import { config } from "../../config/config";

function HomePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div>
      <h1>HomePage</h1>
      <button onClick={handleLogout}>Quay về Login</button>
    </div>
  );
}

export default HomePage;
