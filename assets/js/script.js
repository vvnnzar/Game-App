//Declare and intialize variables.
var fetchButton = document.getElementById("fetch-button");
var repoTable = document.getElementById("something");
var popularGamesList = [];
var defaultStartDate = "2019-01-01"; //both dates to be generated dynamically
var defaultEndDate = "2019-12-31";
var gamesStore = [];

/**
 * Need to decide on the expected date range inputs, from html inputs.
 * Could be button click or form entry
 * Default can be set to this month at the BE., leveraging moment.js
 * Based on that JS will convert them to actual date format expected by Rawg API.
 * */

/**
 * Function to extract steamId for a given game title
 * @param {} popularGames
 */

function getSteamIDs(games) {
  games.forEach(function (game) {
    var steamRequest =
      "https://www.cheapshark.com/api/1.0/games?title=" + game.name;
    fetch(steamRequest)
      .then(function (steamResponse) {
        return steamResponse.json();
      })
      .then(function (data) {
        console.log(data)
        // var steamId = data.findBestGameDeal(data);
      });
  })



}

/**
 * Function to extract the iterated game names and find best deal
 */
function prepareGamesList(popularGames) {
  popularGames.results.forEach(function (popularGame) {
    game = {
      name: popularGame.name,
      image: popularGame.background_image,
      rating: popularGame.rating,
    };
    gamesStore.push(game);
  });
  console.log(JSON.stringify(gamesStore));
  return gamesStore;
}

/**
 * Function call to get the results from rawg api.
 */
function getPopularGames(
  startDate = defaultStartDate,
  endDate = defaultEndDate
) {
  var rawgRequest =
    "https://api.rawg.io/api/games?dates=" +
    startDate +
    "," +
    endDate +
    "&ordering=-added";

  fetch(rawgRequest)
    .then(function (rawgResponse) {
      return rawgResponse.json();
    })
    .then(function (data) {
      return prepareGamesList(data);
    })
    .then(function (games) {
      getSteamIDs(games);
    });
}

getPopularGames(); //to be removed after frontend is fully functional.

/**
 * Event handler for search button
 * */

var searchHandler = function (event) {
  event.preventDefault();
  var startDate = dateFormEl.value.trim();
  var endDate = dateFormEl.value.trim();
  if (startDate && endDate) {
    getPopularGames(startDate, endDate);
    dateFormEl.value = "";
  } else {
    alert("Please enter a valid date");
  }
};

fetchButton.addEventListener("submit", searchHandler());
