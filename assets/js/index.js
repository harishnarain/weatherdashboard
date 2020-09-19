// Globals
const state = {
  searchHistory: [],
  currentCity: "",
  unit: "metric",
  tempUnit: function() {
    if (this.unit === "metric") {
      return " \xB0C";
    } else {
      return " \xB0F";
    }
  },
  windUnit: function () {
    if (this.unit === "metric") {
      return " m/s";
    } else {
      return " mph";
    }
  },
};

// Elements
const searchInputEl = document.getElementById("search-input");
const searchButtonEl = document.getElementById("search-button");
const searchHistoryEl = document.getElementById("search-history");
const clearHistoryButtonEl = document.getElementById("clear-button");

// Functions
const clearError = () => {
  if (document.querySelector(".alert-danger")) {
    document.querySelector(".alert-danger").remove();
  }
};

const renderSearchHistory = () => {
  while (searchHistoryEl.firstChild) {
    searchHistoryEl.removeChild(searchHistoryEl.firstChild);
  }
  state.searchHistory.forEach((el) => {
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
  state.searchHistory.push(city);
  renderSearchHistory();
};

const renderCurrent = (name, temp, humidity, windSpeed) => {
  state.currentCity = name;

  document.querySelector(".active-city").textContent = name;
  document.querySelector(".temperature-text").textContent = temp + state.tempUnit();
  document.querySelector(".humidity-text").textContent = humidity + " %";
  document.querySelector(".wind-text").textContent = windSpeed + state.windUnit();
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
  const apiKey = "26dd15df3bedb44125f5223c454e0614";
  const queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${state.unit}&appid=${apiKey}`;
  fetch(queryUrl)
    .then((res) => res.json())
    .then((data) => {
      if (data.cod === 200) {
        renderCurrent(
          data.name,
          data.main.temp,
          data.main.humidity,
          data.wind.speed
        );
      } else {
        throw data.cod;
      }
      if (!state.searchHistory.includes("data.name") && includeInHistory === true) {
        addToSearchHistory(data.name);
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
  state.searchHistory.splice(state.searchHistory.indexOf(item), 1);
  renderSearchHistory();
};

// Event listeners
clearHistoryButtonEl.addEventListener("click", () => {
  console.log("clearing history...");
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

// Main program
// Pull search history array from localStorage
// Pull last city from localStorage
if (localStorage.getItem("weatherAppPreferences")) {
  state = JSON.parse(localStorage.getItem("weatherAppPreferences"));
} else {
  state.currentCity = "Vancouver";
  state.unit = "metric";
  searchHandler(state.currentCity, false);
}
