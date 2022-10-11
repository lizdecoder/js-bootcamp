## Movie Fight app

User searches for a movie on the left side and then searches for another movie on the right side.

User types in a movie title, then once user searches, information is fetched from an API (http://www.omdbapi.com/) and movie specific information is presented as a summary. Movie information displayed is an image, title, overview, and movie-specific statistics. The process is then repeated on the right hand side for a different movie.

For every different statistic that is fetched for every movie searched, it is compared between the two. The movie with the higher statistic value, the statistic is highlighted in green. The movie with the lower statistic value, the statistic is highlighted in yellow.

# Features
1. Inputs are autocomplete inputs: when a user searches in the input field, all movies that contain the keywords searched will be displayed as options. Autocomplete widget is built from scratch and reuseable for other projects.
2. Delayed search input: when users makes keypresses, value of keypresses are obtain but data is not fetched until user pauses keypresses for 500 milliseconds. Making application performant.
3. Obtaining real movie data: fetches data from an API through a network request using two requests - 1) search and 2) show data.
4. Bulma CSS framework for styling


