const argv = require('argv');
const fs = require('fs');
const request = require('request');

const movieInfo = ['Title', 'Year', 'imdbRating', 'Country', 'Language', 'Plot', 'Actors']

const args = argv.run().targets;

console.log(args);

const spotifyThisSong = (song) => {
    console.log(song);
}

const movieThis = (movie) => {
    movie = movie.toString();
    movie.replace(/,/g, '+');
    request('http://www.omdbapi.com/?t=' + movie, function(error, response, data) {
        if (error) {
            console.log('Something went wrong: ' + error);
            console.log('Response: ' + response);
        }
        data = JSON.parse(data);
        // console.log(JSON.stringify(data, null, 2));
        for (var i = 0; i < movieInfo.length; i++) {
        	const prop = movieInfo[i];
            console.log(prop + ' ::: ' + data[prop]);
        }
    });
}


if (args[0] === 'my-tweets' || args[0] === 'spotify-this-song' || args[0] === 'movie-this' || args[0] === 'do-what-it-says') {
    switch (args[0]) {

        case 'my-tweets':
            displayTweets();
            break;

        case 'spotify-this-song':
            const song = args.slice(1);
            spotifyThisSong(song);
            break;

        case 'movie-this':
            const movie = args.slice(1);
            movieThis(movie);
            break;

        case 'do-what-it-says':

            break;
    }

} else {
    console.log('Unexpected or unknown command. Please use "my-tweets" "spotify-this-song" "movie-this" or "do-what-it-says" to see my magic.')
}
