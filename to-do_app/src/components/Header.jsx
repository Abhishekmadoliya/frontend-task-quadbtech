import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/actions/authActions';
import '../styles/Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  return (
    <header className="app-header">
      <div className="header-container">
        <h1 className="app-title">Todo App</h1>
        
        {user && (
          <div className="user-info">
            <span>Welcome, {user.username}</span>
            <button 
              className="btn btn-outline-light btn-sm logout-btn" 
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 