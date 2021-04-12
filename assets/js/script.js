//Declare and intialize variables.
var fetchButton = document.getElementById("fetch-button");
var repoTable = document.getElementById("something");
var popularGamesList = [];
var defaultStartDate = "2019-01-01"; //both dates to be generated dynamically
var defaultEndDate = "2019-12-31";
var gamesStore = [];
var gameCardEls = document.querySelectorAll(".game-card");
var gameCardIndex = 0;

/**
 * Need to decide on the expected date range inputs, from html inputs.
 * Could be button click or form entry
 * Default can be set to this month at the BE., leveraging moment.js
 * Based on that JS will convert them to actual date format expected by Rawg API.
 * */



/**
 * Function to render each game on to the HTML layout
 */
function displayGame(finalGame, gameCardIndex) {



}

/**
 * Function for fetching the cheapest deal and enriching the exisitng game data object.
 * @param {} steamGameData 
 */

function getBestDeal(steamGameData, gameCardIndex) {
  var cheapestDealRequest = "https://www.cheapshark.com/api/1.0/deals?id=" + steamGameData['cheapestDealId'];
  fetch(cheapestDealRequest)
    .then(function (data) {
      return data.json();
    })
    .then(function (jsonResp) {
      steamGameData["cheapestPrice"] = jsonResp.cheapestPrice.price;
      steamGameData["salePrice"] = jsonResp.gameInfo.salePrice;
      steamGameData["retailPrice"] = jsonResp.gameInfo.retailPrice;
      return steamGameData;
    })
    .then(function (finalGameData) {
      //displayGame(finalGameData, gameCardIndex);
      gameCardIndex++;
      var gameCardTitleEl = document.createElement("p");
      gameCardTitleEl.innerHTML = "Title: " + finalGameData.name;
      gameCardEls[gameCardIndex].append(gameCardTitleEl);

    })
}

/**
 * Function to extract steamId for a given game title
 * @param {} popularGames
 */

function getSteamIDs(gamesList) {
  var gameCardIndex = 0;
  gamesList.forEach(function (game) {
    var steamRequest =
      "https://www.cheapshark.com/api/1.0/games?title=" + game.name;
    fetch(steamRequest)
      .then(function (steamResponse) {
        return steamResponse.json();
      })
      .then(function (steamData) {
        game["cheapestDealId"] = steamData[0].cheapestDealID;
        game["thumb"] = steamData[0].thumb;
        game["gameID"] = steamData[0].gameID;
        return game;
      })
      .then(function (updatedGame) {
        getBestDeal(updatedGame);
        gameCardIndex++
      })
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
    .then(function (gamesList) {
      getSteamIDs(gamesList);
    })
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
