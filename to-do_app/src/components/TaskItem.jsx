import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteTask, toggleComplete, setPriority } from '../redux/actions/todoActions';
import { formatWeatherData, getWeatherRecommendation } from '../utils/weatherUtils';
import '../styles/TaskItem.css';

// Weather condition mapping with icons
const weatherIcons = {
  'Clear': '☀️',
  'Clouds': '☁️',
  'Rain': '🌧️',
  'Drizzle': '🌦️',
  'Thunderstorm': '⛈️',
  'Snow': '❄️',
  'Mist': '🌫️',
  'Fog': '🌫️',
  'Haze': '🌫️',
  'Smoke': '🌫️',
  'Dust': '🌫️',
  'Sand': '🌫️',
  'Ash': '🌫️',
  'Squall': '💨',
  'Tornado': '🌪️'
};

const TaskItem = ({ task }) => {
  const dispatch = useDispatch();
  
  const handleDelete = () => {
    dispatch(deleteTask(task.id));
  };
  
  const handleToggleComplete = () => {
    dispatch(toggleComplete(task.id));
  };
  
  const handlePriorityChange = (e) => {
    dispatch(setPriority(task.id, e.target.value));
  };
  
  // Format the created date
  const formattedDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Format weather data if available
  const weatherData = task.weather ? formatWeatherData(task.weather) : null;
  
  // Get weather recommendation if this is an outdoor task
  const weatherRecommendation = task.isOutdoor && task.weather ? 
    getWeatherRecommendation(task.weather) : null;
  
  // Set class based on priority
  const priorityClass = `priority-${task.priority}`;
  
  // Direct weather message from API for outdoor tasks
  const getOutdoorWeatherMessage = () => {
    if (!task.isOutdoor || !task.weather) return null;
    
    const { main, temp, cityName } = task.weather;
    const icon = weatherIcons[main] || '🌡️';
    const location = cityName || task.location;
    
    return (
      <div className={`weather-message weather-condition-${main.toLowerCase()}`}>
        <span className="weather-icon-large" role="img" aria-label={main}>
          {icon}
        </span>
        <div className="weather-message-text">
          <p className="weather-message-title">
            Current Weather {location ? `in ${location}` : ''}:
          </p>
          <p className="weather-message-info">
            It's {main.toLowerCase()} with {Math.round(temp)}°C outside
          </p>
        </div>
      </div>
    );
  };
  
  return (
    <div className={`task-item ${priorityClass} ${task.completed ? 'completed' : ''} ${task.isOutdoor ? 'outdoor-task' : ''}`}>
      {task.isOutdoor && (
        <div className="outdoor-badge">
          <span role="img" aria-label="Outdoor">🌳</span> Outdoor
        </div>
      )}
      
      <div className="task-header">
        <div className="task-title-section">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggleComplete}
            className="task-checkbox"
          />
          <h3 className={`task-title ${task.completed ? 'completed-text' : ''}`}>
            {task.title}
          </h3>
        </div>
        
        <div className="task-actions">
          <select
            value={task.priority}
            onChange={handlePriorityChange}
            className={`priority-select priority-${task.priority}`}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          
          <button 
            onClick={handleDelete} 
            className="btn btn-danger btn-sm delete-btn"
          >
            Delete
          </button>
        </div>
      </div>
      
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      
      {/* Display simple weather message for outdoor tasks */}
      {task.isOutdoor && getOutdoorWeatherMessage()}
      
      <div className="task-footer">
        <span className="task-date">Created: {formattedDate}</span>
        
        {task.location && (
          <span className="task-location">Location: {task.location}</span>
        )}
      </div>
      
      {weatherData && (
        <div className={`weather-info ${task.isOutdoor ? 'weather-info-outdoor' : ''}`}>
          <div className="weather-header">
            <img 
              src={weatherData.iconUrl} 
              alt={weatherData.description} 
              className="weather-icon" 
            />
            <div className="weather-main">
              <span className="weather-temp">{weatherData.temperature}</span>
              <span className="weather-desc">{weatherData.description}</span>
            </div>
          </div>
          
          {(weatherData.feelsLike || weatherData.humidity || weatherData.wind) && (
            <div className="weather-details-grid">
              {weatherData.feelsLike && (
                <div className="weather-detail-item">
                  <span className="weather-detail-label">Feels like:</span>
                  <span className="weather-detail-value">{weatherData.feelsLike}</span>
                </div>
              )}
              
              {weatherData.humidity && (
                <div className="weather-detail-item">
                  <span className="weather-detail-label">Humidity:</span>
                  <span className="weather-detail-value">{weatherData.humidity}</span>
                </div>
              )}
              
              {weatherData.wind && (
                <div className="weather-detail-item">
                  <span className="weather-detail-label">Wind:</span>
                  <span className="weather-detail-value">{weatherData.wind}</span>
                </div>
              )}
            </div>
          )}
          
          {weatherRecommendation && (
            <div className="weather-recommendation">
              <span role="img" aria-label="Tip">💡</span> {weatherRecommendation}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskItem; 