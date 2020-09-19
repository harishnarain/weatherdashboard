// Globals
const state = {
  preferences: {
    searchHistory: [],
    currentCity: "",
    metric: true,
  },
  tempUnit: function () {
    if (this.preferences.metric) {
      return " \xB0C";
    } else {
      return " \xB0F";
    }
  },
  windUnit: function () {
    if (this.preferences.metric) {
      return " m/s";
    } else {
      return " mph";
    }
  },
  unitValue: function () {
    if (this.preferences.metric) {
      return "metric";
    } else {
      return "imperial";
    }
  },
};
const apiKey = "26dd15df3bedb44125f5223c454e0614";

// Elements
const searchInputEl = document.getElementById("search-input");
const searchButtonEl = document.getElementById("search-button");
const searchHistoryEl = document.getElementById("search-history");
const clearHistoryButtonEl = document.getElementById("clear-button");
const weatherIconEl = document.querySelector(".weather-icon");
const unitButtonGroupEl = document.querySelector(".unit-button-group");

// Functions
const clearError = () => {
  // Used to clear errors before retrying
  if (document.querySelector(".alert-danger")) {
    document.querySelector(".alert-danger").remove();
  }
};

const clearWeatherIcon = () => {
  // Need to clear existing weather icon prior rendering next city
  weatherIconEl.innerHTML = "";
};

const renderSearchHistory = () => {
  while (searchHistoryEl.firstChild) {
    searchHistoryEl.removeChild(searchHistoryEl.firstChild);
  }
  state.preferences.searchHistory.forEach((el) => {
    const liEl = document.createElement("li");
    liEl.setAttribute("class", "nav-item search-item");
    liEl.setAttribute("data-value", el);
    liEl.textContent = el;
    const delEl = document.createElement("i");
    delEl.setAttribute("class", "fas fa-trash");
    delEl.setAttribute("data-action", "delete");
    liEl.appendChild(delEl);
    searchHistoryEl.prepend(liEl);
  });
};

const addToSearchHistory = (city) => {
  if (!state.preferences.searchHistory.includes(city)) {
    state.preferences.searchHistory.push(city);
    saveLocalStorageState();
    renderSearchHistory();
  }
};

const renderCurrentDate = () => {
  const currentDate = moment().format("dddd, MMMM Do YYYY, h:mm a");
  document.querySelector(".current-date").textContent = currentDate;
};

const saveLocalStorageState = () => {
  localStorage.setItem(
    "weatherAppPreferences",
    JSON.stringify(state.preferences)
  );
};

const renderCurrent = (name, temp, humidity, windSpeed, icon) => {
  document.querySelector(".active-city").textContent = name;
  document.querySelector(".temperature-text").textContent =
    temp + state.tempUnit();
  document.querySelector(".humidity-text").textContent = humidity + " %";
  document.querySelector(".wind-text").textContent =
    windSpeed + state.windUnit();

  const weatherIconImageEl = document.createElement("img");
  weatherIconImageEl.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  weatherIconImageEl.alt = "weather-icon";
  weatherIconImageEl.setAttribute("class", "weather-icon-img");
  weatherIconEl.appendChild(weatherIconImageEl);
  renderCurrentDate();
  searchInputEl.value = "";
};

const renderUV = (value) => {
  const uvEl = document.querySelector(".uv-text");
  uvEl.textContent = value;
  valueInt = parseInt(value);

  if (valueInt <= 2) {
    uvEl.setAttribute("data-value", "low");
  } else if (valueInt <= 5 && valueInt >= 3) {
    uvEl.setAttribute("data-value", "moderate");
  } else if (parseInt(valueInt) <= 7 && valueInt >= 6) {
    uvEl.setAttribute("data-value", "high");
  } else if (valueInt <= 10 && valueInt >= 8) {
    uvEl.setAttribute("data-value", "veryhigh");
  } else if (valueInt >= 11) {
    uvEl.setAttribute("data-value", "extreme");
  } else {
    uvEl.setAttribute("data-value", "na");
  }
};

const getUVIndex = (latitude, longitude) => {
  const queryUrl = `http://api.openweathermap.org/data/2.5/uvi?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
  fetch(queryUrl)
    .then((res) => res.json())
    .then((data) => {
      renderUV(data.value);
    });
};

const searchHandler = (city, includeInHistory = true) => {
  //addToSearchHistory(searchInputEl.value);
  // fetch api
  // then process request
  // add to search history
  // add to current city in localstorage
  // render display
  // or catch error
  clearError();
  clearWeatherIcon();
  const queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${state.unitValue()}&appid=${apiKey}`;
  fetch(queryUrl)
    .then((res) => res.json())
    .then((data) => {
      if (data.cod === 200) {
        state.preferences.currentCity = data.name;
        saveLocalStorageState();
        getUVIndex(data.coord.lat, data.coord.lon);
        renderCurrent(
          data.name,
          data.main.temp,
          data.main.humidity,
          data.wind.speed,
          data.weather[0].icon
        );
      } else {
        throw data.cod;
      }
      if (includeInHistory) {
        addToSearchHistory(data.name);
        saveLocalStorageState();
      }
    })
    .catch((err) => {
      const mainEl = document.querySelector("main");
      const alertEl = document.createElement("div");
      alertEl.setAttribute("class", "alert alert-danger");
      alertEl.setAttribute("role", "alert");
      err == 404
        ? (alertEl.textContent = `Cannot find city with name: ${city}`)
        : (alertEl.textContent = `An error has occured with code: ${err}`);
      mainEl.prepend(alertEl);
    });
};

const getItemHandler = (item) => {
  searchHandler(item, false);
};

const deleteItemHandler = (item) => {
  state.preferences.searchHistory.splice(
    state.preferences.searchHistory.indexOf(item),
    1
  );
  saveLocalStorageState();
  renderSearchHistory();
};

const initUnitButton = () => {
  state.preferences.metric
    ? document.getElementById("metric-button").setAttribute("checked", "")
    : document.getElementById("imperial-button").setAttribute("checked", "");
};

// Event listeners
clearHistoryButtonEl.addEventListener("click", () => {
  state.preferences.searchHistory = [];
  saveLocalStorageState();
  renderSearchHistory();
});

document.getElementById("search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  searchHandler(searchInputEl.value);
});

searchHistoryEl.addEventListener("click", (event) => {
  event.target.getAttribute("data-action")
    ? deleteItemHandler(event.target.parentElement.getAttribute("data-value"))
    : getItemHandler(event.target.getAttribute("data-value"));
});

searchInputEl.addEventListener("keyup", () => {
  searchInputEl.value
    ? (searchButtonEl.disabled = false)
    : (searchButtonEl.disabled = true);
});

unitButtonGroupEl.addEventListener("click", (event) => {
  const unitButtonVal = event.target.getAttribute("data-value");
  if (
    (unitButtonVal === "metric" && state.preferences.metric) ||
    (unitButtonVal === "imperial" && !state.preferences.metric)
  ) {
    return;
  } else {
    switch (event.target.getAttribute("data-value")) {
      case "imperial":
        state.preferences.metric = false;
        searchHandler(state.preferences.currentCity, false);
        break;
      default:
        state.preferences.metric = true;
        searchHandler(state.preferences.currentCity, false);
        break;
    }
  }
});

// Main program
// Pull search history array from localStorage
// Pull last city from localStorage
if (localStorage.getItem("weatherAppPreferences")) {
  state.preferences = JSON.parse(localStorage.getItem("weatherAppPreferences"));
  searchHandler(state.preferences.currentCity, false);
  initUnitButton();
  renderSearchHistory();
} else {
  state.preferences.currentCity = "Vancouver";
  state.preferences.metric = true;
  initUnitButton();
  searchHandler(state.preferences.currentCity, false);
}
