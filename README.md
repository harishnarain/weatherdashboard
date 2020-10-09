# Weather Dashboard - Homework Assigment 6

This application is a weather dashboard which offers dynamically updated HTML and CSS with data provided by the OpenWeather API. This apps runs in a browser and provides users with the current and 5 day weather forecasts.  Users may choose to search for new cities, select them from their search history or based on their geo coordinates.

## Objective
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly

## Acceptance criteria
* GIVEN a weather dashboard with form inputs
* WHEN I search for a city
* THEN I am presented with current and future conditions for that city and that city is added to the search history
* WHEN I view current weather conditions for that city
* THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
* WHEN I view the UV index
* THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
* WHEN I view future weather conditions for that city
* THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
* WHEN I click on a city in the search history
* THEN I am again presented with current and future conditions for that city
* WHEN I open the weather dashboard
* THEN I am presented with the last searched city forecast

## Additional features
* Find Me functionality provided by browser geo coordinates
* Ability to change from metric to imperial measurement that is saved in the localStorage preferences
* Ability to clear all search history
* Ability to delete individual search history items

## Files included
|File|Relative Path|Description|
|---|---|---|
|index.html|index.html|Home page|
|style.css|assets/css/style.css|Main stylesheet|
|index.js|assets/js/index.js|All JavaScript logic|

## Accessing the site
Please visit the [site](https://www.harishnarain.com/weatherdashboard/) hosted on GitHub Pages.

## Screenshots
![Screenshot 1](https://github.com/harishnarain/weatherdashboard/blob/master/Screenshot1.png)


## License
MIT License

## 3rd party libraries and APIs used
* [OpenWeather](https://openweathermap.org/) - OpenWeather API
* [Bootstrap](https://getbootstrap.com/) - Bootstrap CSS framework
* [Google Fonts](https://fonts.google.com/) - The Roboto font
* [Moment](https://momentjs.com/) - Moment.js and Moment Time Zone
* [Font Awesome](https://fontawesome.com/) - Font Awesome 5 icons

## Tools used
* [GitHub](https://github.com/) - Code repository and page hosting via GitHub Pages
* [Visual Studio Code](https://code.visualstudio.com/) - For editing and authoring code
* [Prettier](https://prettier.io/) - For opinionated code formatting
* [Chrome Devtools](https://developers.google.com/web/tools/chrome-devtools) - For editing pages on the fly and diagnosing problems
* [iTerm2](https://www.iterm2.com/) - For all my terminal needs on macOS
* [MacDown](https://github.com/MacDownApp/macdown) - For creating the README.md and all things Markdown related