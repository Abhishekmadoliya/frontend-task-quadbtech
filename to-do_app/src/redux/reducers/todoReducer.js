import { 
  ADD_TASK, 
  DELETE_TASK, 
  TOGGLE_COMPLETE, 
  SET_PRIORITY,
  FETCH_WEATHER_START,
  FETCH_WEATHER_SUCCESS,
  FETCH_WEATHER_FAILURE
} from '../actions/todoActions';

// Load tasks from localStorage if available
const loadTasksFromStorage = () => {
  try {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error('Error loading tasks from localStorage:', error);
    return [];
  }
};

const initialState = {
  tasks: loadTasksFromStorage(),
  loading: false,
  weatherData: null,
  error: null
};

// Helper function to save tasks to localStorage
const saveTasksToStorage = (tasks) => {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
  }
};

const todoReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TASK: {
      const updatedTasks = [...state.tasks, action.payload];
      saveTasksToStorage(updatedTasks);
      return {
        ...state,
        tasks: updatedTasks
      };
    }
    
    case DELETE_TASK: {
      const updatedTasks = state.tasks.filter(task => task.id !== action.payload);
      saveTasksToStorage(updatedTasks);
      return {
        ...state,
        tasks: updatedTasks
      };
    }
    
    case TOGGLE_COMPLETE: {
      const updatedTasks = state.tasks.map(task => 
        task.id === action.payload 
          ? { ...task, completed: !task.completed } 
          : task
      );
      saveTasksToStorage(updatedTasks);
      return {
        ...state,
        tasks: updatedTasks
      };
    }
    
    case SET_PRIORITY: {
      const { id, priority } = action.payload;
      const updatedTasks = state.tasks.map(task => 
        task.id === id 
          ? { ...task, priority } 
          : task
      );
      saveTasksToStorage(updatedTasks);
      return {
        ...state,
        tasks: updatedTasks
      };
    }
    
    case FETCH_WEATHER_START:
      return {
        ...state,
        loading: true,
        error: null
      };
      
    case FETCH_WEATHER_SUCCESS:
      return {
        ...state,
        loading: false,
        weatherData: action.payload,
        error: null
      };
      
    case FETCH_WEATHER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      
    default:
      return state;
  }
};

export default todoReducer; 