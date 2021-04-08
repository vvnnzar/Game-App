var fetchButton = document.getElementById("fetch-button");
var repoTable = document.getElementById("something");

function getApi() {
    var requestUrl = 'https://api.rawg.io/api/games?dates=2019-01-01,2019-12-31&ordering=-added';

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)

            
        });
}

fetchButton.addEventListener('click', getApi);