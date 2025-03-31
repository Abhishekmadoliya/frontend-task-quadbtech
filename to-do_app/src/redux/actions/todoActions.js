// import { getWeatherIconUrl } from "../../utils/weatherUtils";

// Action Types
export const ADD_TASK = 'ADD_TASK';
export const DELETE_TASK = 'DELETE_TASK';
export const TOGGLE_COMPLETE = 'TOGGLE_COMPLETE';
export const SET_PRIORITY = 'SET_PRIORITY';
export const FETCH_WEATHER_START = 'FETCH_WEATHER_START';
export const FETCH_WEATHER_SUCCESS = 'FETCH_WEATHER_SUCCESS';
export const FETCH_WEATHER_FAILURE = 'FETCH_WEATHER_FAILURE';


// Outdoor-related keywords to check in task descriptions
const outdoorKeywords = [
  'outdoor', 'outside', 'park', 'hike', 'hiking', 'walk', 'walking', 'run', 'running', 
  'jog', 'jogging', 'bike', 'biking', 'cycling', 'garden', 'gardening', 'picnic', 
  'beach', 'swim', 'swimming', 'trail', 'camping', 'bbq', 'barbecue'
];

// Action Creators
export const addTask = (task) => {
  return {
    type: ADD_TASK,
    payload: {
      ...task,
      id: Date.now(), // Simple way to generate a unique ID
      completed: false,
      weather: null,
      isOutdoor: checkIfOutdoorTask(task.title, task.description)
    }
  };
};

export const deleteTask = (id) => {
  return {
    type: DELETE_TASK,
    payload: id
  };
};

export const toggleComplete = (id) => {
  return {
    type: TOGGLE_COMPLETE,
    payload: id
  };
};

export const setPriority = (id, priority) => {
  return {
    type: SET_PRIORITY,
    payload: { id, priority }
  };
};

// Helper function to check if a task is related to outdoor activities
const checkIfOutdoorTask = (title = '', description = '') => {
  const combinedText = `${title} ${description}`.toLowerCase();
  return outdoorKeywords.some(keyword => combinedText.includes(keyword));
};

// Async action to fetch weather data
export const fetchWeather = (city) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_WEATHER_START });
    
    try {
      // Using OpenWeatherMap API with the provided API key
      const apiKey = 'ee2a4f2b59d2347e4969be292ea40ceb';
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
      
      if (!response.ok) {
        throw new Error('Weather data not available');
      }
      
      const data = await response.json();
      console.log('Weather API response:', data); // Log the API response for debugging
      
      const weatherData = {
        temp: data.main.temp,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        wind: data.wind.speed,
        feelsLike: data.main.feels_like,
        main: data.weather[0].main, // Add the main weather condition
        cityName: data.name // Add the city name from the API response
      };
      
      dispatch({
        type: FETCH_WEATHER_SUCCESS,
        payload: weatherData
      });
      
      return weatherData;
    } catch (error) {
      dispatch({
        type: FETCH_WEATHER_FAILURE,
        payload: error.message
      });
      
      throw error;
    }
  };
}; 