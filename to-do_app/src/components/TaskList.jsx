import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import TaskItem from './TaskItem';
import '../styles/TaskList.css';

const TaskList = () => {
  const { tasks } = useSelector(state => state.todo);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Filter tasks based on selected filter
  const getFilteredTasks = () => {
    switch (filter) {
      case 'active':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'high':
        return tasks.filter(task => task.priority === 'high');
      case 'medium':
        return tasks.filter(task => task.priority === 'medium');
      case 'low':
        return tasks.filter(task => task.priority === 'low');
      default:
        return tasks;
    }
  };
  
  // Sort tasks based on selected sort option
  const getSortedTasks = () => {
    const filteredTasks = getFilteredTasks();
    
    return [...filteredTasks].sort((a, b) => {
      let compareResult;
      
      switch (sortBy) {
        case 'title':
          compareResult = a.title.localeCompare(b.title);
          break;
        case 'priority':
          const priorityOrder = { high: 1, medium: 2, low: 3 };
          compareResult = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'createdAt':
        default:
          compareResult = new Date(a.createdAt) - new Date(b.createdAt);
          break;
      }
      
      return sortOrder === 'asc' ? compareResult : -compareResult;
    });
  };
  
  const handleSortOrderToggle = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  
  const sortedTasks = getSortedTasks();
  
  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h2>Your Tasks</h2>
        
        <div className="task-filters">
          <div className="filter-group">
            <label htmlFor="filter">Filter:</label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="form-control"
            >
              <option value="all">All Tasks</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="sortBy">Sort By:</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-control"
            >
              <option value="createdAt">Date Created</option>
              <option value="title">Title</option>
              <option value="priority">Priority</option>
            </select>
            
            <button 
              onClick={handleSortOrderToggle} 
              className="btn btn-sm btn-outline-secondary sort-order-btn"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>
      
      {sortedTasks.length === 0 ? (
        <div className="no-tasks-message">
          <p>No tasks found. Add some tasks to get started!</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {sortedTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList; 