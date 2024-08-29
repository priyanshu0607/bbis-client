import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './Sidebar.css'; // Import the CSS file for styling

const Sidebar = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true); // Default to expanded

  useEffect(() => {
    // Set isExpanded to false only on the homepage
    setIsExpanded(location.pathname !== '/');
  }, [location]);

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isExpanded ? '✕' : '☰'}
      </button>
      {isExpanded && (
        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink to="/" exact activeClassName="active">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/create-bill" activeClassName="active">
                Create Bill
              </NavLink>
            </li>
            <li>
              <NavLink to="/booking" activeClassName="active">
                Booking
              </NavLink>
            </li>
            <li>
              <NavLink to="/view-bookings" activeClassName="active">
                View Bookings
              </NavLink>
            </li>
            <li>
              <NavLink to="/view-past-orders" activeClassName="active">
                View Orders
              </NavLink>
            </li>
            <li>
              <NavLink to="/inventory" activeClassName="active">
                Add Inventory
              </NavLink>
            </li>
            <li>
              <NavLink to="/inventoryManagement" activeClassName="active">
                Inventory Management
              </NavLink>
            </li>
            <li>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Sidebar;

