import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-orange-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wider">🍔 FoodExpress</Link>
        <div className="space-x-4">
          {token ? (
            <>
              <Link to="/dashboard" className="hover:text-orange-200">Dashboard</Link>
              <button onClick={handleLogout} className="bg-orange-700 px-4 py-2 rounded hover:bg-orange-800">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-orange-200">Login</Link>
              <Link to="/register" className="bg-white text-orange-600 px-4 py-2 rounded font-bold hover:bg-gray-100">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
