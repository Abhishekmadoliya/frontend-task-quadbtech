// Get weather icon URL from OpenWeatherMap
export const getWeatherIconUrl = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

// Format weather data for display
export const formatWeatherData = (weatherData) => {
  if (!weatherData) return null;
  
  return {
    temperature: `${Math.round(weatherData.temp)}°C`,
    description: weatherData.description.charAt(0).toUpperCase() + weatherData.description.slice(1),
    iconUrl: getWeatherIconUrl(weatherData.icon),
    humidity: weatherData.humidity ? `${weatherData.humidity}%` : null,
    wind: weatherData.wind ? `${weatherData.wind} m/s` : null,
    feelsLike: weatherData.feelsLike ? `${Math.round(weatherData.feelsLike)}°C` : null,
    main: weatherData.main || null,
    cityName: weatherData.cityName || null
  };
};

// Extract city from task description
export const extractLocationFromTask = (taskDescription) => {
  // Common cities to check for in the task description
  const cities = [
    'New York', 'London', 'Tokyo', 'Paris', 'Berlin', 'Rome', 'Madrid',
    'Moscow', 'Beijing', 'Dubai', 'Sydney', 'Mumbai', 'Toronto', 'Chicago',
    'Amsterdam', 'Barcelona', 'Athens', 'Delhi', 'Dubai', 'Hong Kong', 'Istanbul',
    'Las Vegas', 'Los Angeles', 'Miami', 'Milan', 'Munich', 'San Francisco',
    'Seoul', 'Shanghai', 'Singapore', 'Stockholm', 'Venice', 'Vienna', 'Zurich'
  ];
  
  // If no description provided, return null
  if (!taskDescription) return null;
  
  const lowerDesc = taskDescription.toLowerCase();
  
  for (const city of cities) {
    if (lowerDesc.includes(city.toLowerCase())) {
      return city;
    }
  }
  
  return null;
};

// Function to get recommendation based on weather
export const getWeatherRecommendation = (weatherData) => {
  if (!weatherData) return null;
  
  const temp = weatherData.temp;
  const description = weatherData.description.toLowerCase();
  
  // Rain-related conditions
  if (description.includes('rain') || 
      description.includes('drizzle') || 
      description.includes('shower')) {
    return "Don't forget an umbrella!";
  }
  
  // Snow-related conditions
  if (description.includes('snow') || description.includes('sleet')) {
    return "Dress warmly and be careful on slippery surfaces!";
  }
  
  // Wind-related conditions
  if (description.includes('wind') || 
      (weatherData.wind && weatherData.wind > 8)) {
    return "It's quite windy - secure loose items!";
  }
  
  // Temperature-based recommendations
  if (temp < 5) {
    return "It's very cold - wear warm layers!";
  } else if (temp < 15) {
    return "It's cool - a jacket would be good!";
  } else if (temp > 30) {
    return "It's very hot - stay hydrated!";
  } else if (temp > 25) {
    return "It's warm - perfect for outdoor activities!";
  }
  
  // Default pleasant weather
  if (description.includes('clear') || description.includes('sun')) {
    return "The weather looks great for outdoor activities!";
  }
  
  return "Check the weather details before heading out!";
}; 


// const apiKey = 'ee2a4f2b59d2347e4969be292ea40ceb';
// export const getWeatherIconUrl = async (city) => {
//     const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
//     const data = await response.json();
//     const details = data.weather[0].main;
//     return details;
   
// }

