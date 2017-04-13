const argv = require('argv');
const fs = require('fs');
const request = require('request');
const Twitter = require('twitter');
const spotify = require('spotify');



// console.log(keys.twitterKeys.consumer_key);   

const movieInfo = ['Title', 'Year', 'imdbRating', 'Country', 'Language', 'Plot', 'Actors']

const args = argv.run().targets;

const displayTweets = () => {
    const keys = require('./keys.js');

    const client = new Twitter(keys.twitterKeys);

    const params = { screen_name: 'DGabel', count: 1 };
    
    client.get('statuses/user_timeline', params, (error, tweets, response) => {
        
        if (error) {
            console.log('Something went wrong: ' + error);
            return;
        }

        for (var i = 0; i < tweets.length; i++) {
            console.log(tweets[i].created_at);
            console.log(tweets[i].text);
            console.log('');
        }
    });
}


const spotifyThisSong = (song) => {
    song = song.toString();

    if (!song) {
        song = "The Sign"
    }

    song.replace(/,/g, ' ');
    // console.log(song);

    spotify.search({ type: 'track', query: song }, (error, data) => {
        if (error) {
            console.log('Something went wrong: ' + error);
            return;
        }
        console.log(data);
        // Do something with 'data' 
    });
}


const movieThis = (movie) => {
    movie = movie.toString();
    
    if (!movie) {
        movie = 'Mr. Nobody'
    }

    movie = movie.replace(/,/g, '+');
    movie = movie.replace(/\./g, '');
    // console.log(movie);

    request('http://www.omdbapi.com/?t=' + movie, (error, response, data) => {
        if (error) {
            console.log('Something went wrong: ' + error);
            return;
        }
        if (response.body !== '{"Response":"False","Error":"Movie not found!"}') {
            data = JSON.parse(data);
            // console.log(JSON.stringify(data, null, 2));
            for (var i = 0; i < movieInfo.length; i++) {
                const prop = movieInfo[i];
                console.log(prop + ' :::: ' + data[prop]);
            }
        } else {
            console.log("Movie not found. Please check your input.");
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
