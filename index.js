


async function getCurrentWeather(lat,lon){
    try{
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=c07e7eae7996d38d54da1108205034b5&units=imperial`,{mode:"cors"});
    const weatherData = await response.json();
    return weatherData
    }catch{}

}

async function getCoordinates(name){
    try{
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=1&appid=c07e7eae7996d38d54da1108205034b5`,{mode:"cors"});
        const data = await response.json();
        const latlon = {
        lat: await data[0].lat,
        lon: await data[0].lon,
        };
        return latlon;
    }catch{}

}

async function weather(name){
    try{
    const cooridnates = getCoordinates(name);
    const data = await getCurrentWeather((await cooridnates).lat, (await cooridnates).lon);
    const locationName = data.name;
    const countryCode = data.sys.country;
    const description = data.weather[0].description;
    const temperature = data.main.temp;
    const feelsLike = data.main.feels_like;
    const windSpeed = data.wind.speed;
    const humidity = data.main.humidity;
    return {
        locationName,
        countryCode,
        description,
        temperature,
        feelsLike,
        windSpeed,
        humidity,
      };
    }catch(err){
        return "error";
    }
}

const renderWeatherComponent = (weatherObj) =>{

    const main = document.createElement("main");
    document.querySelector("body").appendChild(main);

    const locationName = document.createElement("h1");
    locationName.id = 'location';
    locationName.textContent = `${weatherObj.locationName},${weatherObj.countryCode}`;
    main.appendChild(locationName);

    const description = document.createElement("h2");
    description.id = "description";
    description.textContent = `${weatherObj.description}`;
    main.appendChild(description);

    const bottomContainer = document.createElement("div");
    bottomContainer.id = "bottomContainer";
    main.appendChild(bottomContainer);

    const leftSide = document.createElement('div');
    leftSide.id = "leftSide";
    bottomContainer.appendChild(leftSide);

    const temperature = document.createElement("h2");
    temperature.id = "temperature";
    temperature.textContent = `${weatherObj.temperature}`;
    leftSide.appendChild(temperature);

    const units = document.createElement("h4");
    units.id = "units";
    units.textContent = "F";
    leftSide.appendChild(units);

    const rightSide = document.createElement("div");
    rightSide.id = "rightSide";
    bottomContainer.appendChild(rightSide);

    const feelsLike = document.createElement("p");
    feelsLike.id = "feelsLike";
    feelsLike.textContent = `Feels like: ${weatherObj.feelsLike} F`;
    rightSide.appendChild(feelsLike);

    const windSpeed = document.createElement("p");
    windSpeed.id = "wind";
    windSpeed.textContent = `Wind: ${weatherObj.windSpeed} mph`;
    rightSide.appendChild(windSpeed);

    const humidity = document.createElement("p");
    humidity.id = "humidity";
    humidity.textContent = `Humidity: ${weatherObj.humidity}%`;
    rightSide.appendChild(humidity);
}

const renderErrorComponent = () => {
    const text = document.createElement("p");
    text.textContent = "No matching location found!";
    text.id = "errorMessage";
    document.querySelector("form").appendChild(text);
  };

async function renderer(weatherObject,first = false){
    const weatherData = await weatherObject;

    try {
        document.getElementById("errorMessage").remove();
      } catch {}
    
    if (weatherData == "error") {
        console.log("error");
        renderErrorComponent();
    }
    else if (first == true){
        renderWeatherComponent(weatherData);
    }
    else {
        document.querySelector("main").remove();
        document.querySelector("input").value = "";
        renderWeatherComponent(weatherData);

    }
}

document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    renderer(weather(document.querySelector("input").value));
  });
  
  // Initial display
  renderer(weather("tampa"), true);

