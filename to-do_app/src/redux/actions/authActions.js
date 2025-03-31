// Auth actions
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

// User credentials for mock authentication
const validCredentials = {
  username: 'user',
  password: 'password'
};

// Action creators
export const login = (username, password) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      // Simulate API call delay
      setTimeout(() => {
        if (username === validCredentials.username && password === validCredentials.password) {
          const user = { username, isAuthenticated: true };
          // Save to local storage
          localStorage.setItem('user', JSON.stringify(user));
          
          dispatch({
            type: LOGIN,
            payload: user
          });
          resolve(user);
        } else {
          const error = { message: 'Invalid username or password' };
          reject(error);
        }
      }, 1000);
    });
  };
};

export const logout = () => {
  // Remove from local storage
  localStorage.removeItem('user');
  
  return {
    type: LOGOUT
  };
};

// Check if user is already logged in from localStorage
export const checkAuthState = () => {
  return (dispatch) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.isAuthenticated) {
      dispatch({
        type: LOGIN,
        payload: user
      });
    }
  };
}; 