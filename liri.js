let argv = require('argv');
let fs = require('fs');
let request = require('request');
let Twitter = require('twitter');
let spotify = require('spotify');

// caching wanted movie properties
let movieInfo = ['Title', 'Year', 'imdbRating', 'Country', 'Language', 'Plot', 'Actors']

// easier argument storage
let args = argv.run().targets;

let displayTweets = () => {
    // builds needed elements for Tweet getting
    let keys = require('./keys.js');
    let client = new Twitter(keys.twitterKeys);
    let params = { screen_name: 'DGabel', count: 20 };

    // Twitter API call with error checking
    client.get('statuses/user_timeline', params, (error, tweets, response) => {

        if (error) {
            console.log('Something went wrong: ' + error);
            return;
        }

        // posting tweets with date to the console
        for (var i = 0; i < tweets.length; i++) {
            console.log(tweets[i].created_at);
            console.log(tweets[i].text);
            console.log('');
        }
    });
}


let spotifyThisSong = (song) => {
    song = song.toString();

    // sets default search if no song name was passed
    if (!song) {
        song = 'The Sign'
    }

    // cleaning up the commas from the argv parsing
    song = song.replace(/,/g, ' ');
    // console.log(song);

    // Spotify API call
    spotify.search({ type: 'track', query: song }, (error, data) => {
        if (error) {
            console.log('Something went wrong: ' + error);
            return;
        }
        // console.log(data);
        console.log('Track: ' + data.tracks.items[0].name);
        console.log('Artist: ' + data.tracks.items[0].album.artists[0].name);
        console.log('Album: ' + data.tracks.items[0].album.name);
        console.log('30 Sec Preview: ' + data.tracks.items[0].preview_url);


        // Do something with 'data' 
    });
}


let movieThis = (movie) => {
    movie = movie.toString();

    // sets default movie if no movie was passed 
    if (!movie) {
        movie = 'Mr. Nobody';
    }
    // cleaning the input of periods and commas, replacing them appropriately for the OMDB API
    movie = movie.replace(/,/g, '+');
    movie = movie.replace(/\./g, '');
    // console.log(movie);

    // omdb api call using Request
    request('http://www.omdbapi.com/?t=' + movie, (error, response, data) => {
        if (error) {
            console.log('Something went wrong: ' + error);
            return;
        }
        if (response.body !== '{"Response":"False","Error":"Movie not found!"}') {
            data = JSON.parse(data);
            // console.log(JSON.stringify(data, null, 2));

            // loops through predetermined properties (movieInfo) and displays those properties for the movie, given a correct response from OMDB
            for (var i = 0; i < movieInfo.length; i++) {
                let prop = movieInfo[i];
                console.log(prop + ' :::: ' + data[prop]);
            }
        } else {
            console.log("Movie not found. Please check your input.");
        }
    });
}


// checks if the user is running do-what-it-says
if (args[0] === 'do-what-it-says') {

    // load the new command into the arguements
    fs.readFile('random.txt', 'utf8', (error, data) => {
        if (error) {
            console.log('Something went wrong: ' + error);
        }
        args = data.split(',');
        if (args[0] === 'my-tweets' || args[0] === 'spotify-this-song' || args[0] === 'movie-this') {

            // sends the input down the chain, then parsing the remaining arguments and firing the correct function
            switch (args[0]) {

                case 'my-tweets':
                    displayTweets();
                    break;

                case 'spotify-this-song':
                    let song = args.slice(1);
                    spotifyThisSong(song);
                    break;

                case 'movie-this':
                    let movie = args.slice(1);
                    movieThis(movie);
                    break;
            }

        }
    });
}

// checks the first argument for the key functions
if (args[0] === 'my-tweets' || args[0] === 'spotify-this-song' || args[0] === 'movie-this' || args[0] === 'do-what-it-says') {

    // sends the input down the chain, then parsing the remaining arguments and firing the correct function
    switch (args[0]) {

        case 'my-tweets':
            displayTweets();
            break;

        case 'spotify-this-song':
            let song = args.slice(1);
            spotifyThisSong(song);
            break;

        case 'movie-this':
            let movie = args.slice(1);
            movieThis(movie);
            break;
    }

} else {
    console.log('Unexpected or unknown command. Please use "my-tweets" "spotify-this-song" "movie-this" or "do-what-it-says" to see my magic.')
}