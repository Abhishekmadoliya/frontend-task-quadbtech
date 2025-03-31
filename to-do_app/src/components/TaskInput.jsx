import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addTask, fetchWeather } from '../redux/actions/todoActions';
import { extractLocationFromTask } from '../utils/weatherUtils';
import '../styles/TaskInput.css';

// Default location for weather if none is provided
const DEFAULT_LOCATION = 'London';

const TaskInput = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOutdoorTask, setIsOutdoorTask] = useState(false);
  
  const dispatch = useDispatch();
  
  // Check if the task appears to be an outdoor activity
  useEffect(() => {
    const outdoorKeywords = [
      'outdoor', 'outside', 'park', 'hike', 'hiking', 'walk', 'walking', 
      'run', 'running', 'jog', 'jogging', 'bike', 'biking', 'cycling', 
      'garden', 'gardening', 'picnic', 'beach', 'swim', 'swimming'
    ];
    
    const combinedText = `${title} ${description}`.toLowerCase();
    const outdoor = outdoorKeywords.some(keyword => combinedText.includes(keyword));
    setIsOutdoorTask(outdoor);
  }, [title, description]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    setLoading(true);
    
    // Create the task object
    const task = {
      title: title.trim(),
      description: description.trim(),
      priority,
      location: location.trim(),
      createdAt: new Date().toISOString(),
      isOutdoor: isOutdoorTask
    };
    
    try {
      // Determine location for weather data
      let weatherLocation = location.trim();
      
      // If no location is provided but the task is outdoor
      if (!weatherLocation && isOutdoorTask) {
        // First try to extract location from description
        weatherLocation = extractLocationFromTask(description);
        
        // If still no location found, use default
        if (!weatherLocation) {
          weatherLocation = DEFAULT_LOCATION;
        }
        
        task.location = weatherLocation;
      }
      
      // If we have a location (either provided or extracted), fetch weather
      if (weatherLocation) {
        try {
          const weatherData = await dispatch(fetchWeather(weatherLocation));
          task.weather = weatherData;
        } catch (error) {
          console.error('Failed to fetch weather:', error);
          // Continue with task creation even if weather fetch fails
        }
      }
      
      // Add the task to the store
      dispatch(addTask(task));
      
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
      setLocation('');
      
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="task-input-container">
      <h2>Add New Task</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            rows="3"
          />
          {isOutdoorTask && (
            <small className="form-text text-success">
              <strong>Outdoor activity detected!</strong> Weather information will be added when available.
            </small>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            className="form-control"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="location">Location (for weather)</label>
          <input
            type="text"
            id="location"
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={isOutdoorTask ? "Enter city name (recommended for outdoor tasks)" : "Enter city name (optional)"}
          />
          <small className="form-text text-muted">
            {isOutdoorTask 
              ? "Providing a location is recommended for outdoor activities to get accurate weather data." 
              : "If not provided, we'll try to detect a location from your task description"}
          </small>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary add-task-btn" 
          disabled={loading || !title.trim()}
        >
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskInput; 