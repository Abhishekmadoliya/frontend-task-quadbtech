import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Header from '../components/Header';
import TaskInput from '../components/TaskInput';
import TaskList from '../components/TaskList';
import { checkAuthState } from '../redux/actions/authActions';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Check authentication state on component mount
    dispatch(checkAuthState());
  }, [dispatch]);
  
  return (
    <div className="dashboard-container">
      <Header />
      
      <div className="dashboard-content">
        <TaskInput />
        <TaskList />
      </div>
    </div>
  );
};

export default Dashboard; 