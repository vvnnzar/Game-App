//Declare and intialize variables.
var fetchButton = document.querySelector(".submit");
var popularGamesList = [];
var defaultStartDate = "2019-01-01"; //both dates to be generated dynamically
var defaultEndDate = "2019-12-31";
var gamesStore = [];
var gameCardEls = document.querySelectorAll(".game-card");
var gameCardIndex = 0;
var UserStartDate = document.getElementById('.startDate');
var userEndDate = document.getElementById('.endDate');
var gameTitle = document.querySelectorAll(".game-title");
var gameImage = document.querySelectorAll(".card-image");
var gameDeal = document.querySelectorAll("p")

/**
 * Need to decide on the expected date range inputs, from html inputs.
 * Could be button click or form entry
 * Default can be set to this month at the BE., leveraging moment.js
 * Based on that JS will convert them to actual date format expected by Rawg API.
 * */



/**
 * Function to render each game on to the HTML layout
 */
//  function displayGame(finalGameData) {
//    console.log(finalGameData)
//   for(var i = 0; i < prepareGamesList().game.length; i++) {
//     var gameCardElem = document.createElement('div');
//     gameCardElem.innerHTML = "";
//     document.getElementsByTagName("div")[0].setAttribute("class", "game-card");
//     var gameCardTitle = document.createAttribute("h5");
//     document.getElementsByTagName("h5")[0].setAttribute("class", "game-title");
//     gameCardTitle.textContent = prepareGamesList().game.name;
//     var gameCardEleImg = document.createElement("img");
//     gameCardEleImg.innerHTML = "";
//     document.getElementsByTagName("img")[0].setAttribute("src", prepareGamesList().game.image);
//   }

// }

function displayGame(finalGame, gameCardIndex) {
  console.log("Final Game", finalGame)
  gameTitle[gameCardIndex].textContent = finalGame.name;
  gameImage[gameCardIndex].setAttribute("src", finalGame.image);
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
      displayGame(finalGameData, gameCardIndex);
      // gameCardIndex++;
      //   var gameCardTitleEl = document.createElement("p");
      //   gameCardTitleEl.innerHTML = "Title: " + finalGameData.name;
      //   gameCardEls[gameCardIndex].append(gameCardTitleEl);
        // var dealLinkEl = document.createElement("a")
        // dealLinkEl.innerHTML = "best deal" + gameInfo.dealID;
        // dealLinkEls[gameCardIndex].append(dealLinkEl);

    })
}

/**
 * Function to extract steamId for a given game title
 * @param {} popularGames
 */

function getSteamIDs(gamesList) {
  var gameCardIndex = 0;
  gamesList.forEach(function (game, index) {
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
        // console.log(game);
        return game;
        
      })
      .then(function (updatedGame) {
        getBestDeal(updatedGame, index);
        gameCardIndex++;
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
    // console.log(game);
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
