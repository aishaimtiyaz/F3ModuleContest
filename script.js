
 const apiKey = 'a0fad67e4cee7047d2062eba62991016';
 const baseUrl = "https://api.openweathermap.org/data/2.5";
 const weatherScreen = document.getElementById('weather-screen');
 const weatherDataDiv = document.getElementById('weather-data');
 const LandingScreenDiv = document.getElementById('landing-screen');
 const ele1 = document.getElementById('lon-lat');

// finding wind direction according to given wind direction
function windDirection(degree){
    if(degree == 0){
        return "North";
    }
    if(degree == 90){
        return "East";
    }
    if(degree == 180){
        return "South";
    }
    if(degree == 270){
        return "West";
    }
    if(degree > 0 && degree < 90){
        return "North-East";
    }
    if(degree > 90 && degree < 180){
        return "South-East";
    }
    if(degree > 180 && degree < 270){
        return "South-West";
    }
    if(degree > 180 && degree < 360){
        return "North-West";
    }
}

 // converting kelvin into celcius
function toCelcius(temp){
    return temp - 273.15;
}

//converting time zone
function timeZoneCoverter(timeInsec){
    // Assuming weatherData.timezone is the timezone offset in min
    const timezoneOffsetInMinutes = timeInsec / 60;

    // Create a Date object with the current time and apply the offset
    const currentDateTime = new Date();
    return new Date(currentDateTime.getTime() + timezoneOffsetInMinutes * 60 * 1000);
}
  // Function to fetch weather data
 async function fetchWeatherData(latitude,longitude) {
   try {
     
     // Display map
     displayMap(latitude, longitude);

     // Fetch weather data
     const weatherData = await getWeatherData(latitude,longitude);

     // Display weather data
     displayWeatherData(weatherData);
   } catch (error) {
     console.error('Error fetching data:', error);
   }
 }

 // Function to get current location using Geolocation API
 function getCurrentLocation() {
           navigator.geolocation.getCurrentPosition((success) => {
          let { latitude, longitude } = success.coords;
        //   console.log(latitude +" and "+longitude);
          fetchWeatherData( latitude , longitude);
        

        });
 }


 // Function to display Google Map
 function displayMap(latitude, longitude) {
   const mapDiv = document.getElementById('map');

   // Use Google Maps API to display map at the specified location
   // You can customize the map options as needed
   const map = new google.maps.Map(mapDiv, {
     center: { lat: latitude, lng: longitude },
   });
   // Add a marker to the map
   new google.maps.Marker({
     position: { lat: latitude, lng: longitude },
     map: map
   });

   // Embed Google Map iframe with a marker
   mapDiv.innerHTML = `
     <iframe src="https://maps.google.com/maps?q=${latitude},${longitude}&output=embed" width="100%" height="350" frameborder="0" style="border:0"></iframe>
   `;
 }

 // Function to fetch weather data from OpenWeatherMap API
 async function getWeatherData(latitude, longitude) {
   const apiUrl =`${baseUrl}/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

   const response = await fetch(apiUrl);
   const data = await response.json();
   return data;
 }

 // Function to display weather data on the page
 function displayWeatherData(weatherData) {
   LandingScreenDiv.style.display='none';  
    
//    Update  upper UI with longitude details
    ele1.innerHTML = `
    <h4>Lat : ${weatherData.coord.lat}</h4>
    <h4>Long : ${weatherData.coord.lon}</h4>`;

   // Update UI with weather details

   weatherDataDiv.innerHTML = `
     <div>Location: ${weatherData.name}</div>
     <div>Wind Speed: ${weatherData.wind.speed} kmph</div>
     <div>Humidity: ${weatherData.main.humidity} %</div>
     <div>Time Zone: ${timeZoneCoverter(weatherData.timezone)}</div>
     <div>Pressure: ${weatherData.main.pressure} atm</div>
     <div>Wind Direction: ${windDirection(weatherData.wind.deg)}</div>
     <div>UV Index: 1</div>
     <div>Feels like: ${Math.floor(toCelcius(weatherData.main.feels_like))}°</div>
   `;

   // Show the weather screen
   weatherScreen.style.display = 'block';
 }