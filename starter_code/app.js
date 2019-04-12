const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

var clientId = "b0a39705f71b408ca9d5890e1a6b8574",
    clientSecret = "7a3d0209af944c39a508b5f07251faec";


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId : clientId,
    clientSecret : clientSecret
  });
  
  // Retrieve an access token
  spotifyApi.clientCredentialsGrant()
    .then( data => {
      spotifyApi.setAccessToken(data.body['access_token']);
    })
    .catch(error => {
      console.log('Something went wrong when retrieving an access token', error);
    })






// the routes go here:
app.get('/', (req, res, next) => {
    res.render('index');
  });


app.get('/artists', (req, res, next) => {
    console.log(req.query)
    spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      console.log("The received data from the API: ", data.body.artists.items);
        let searchedArtists = data.body.artists.items
        res.render('artists', {list: searchedArtists});
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
  });

  app.get('/albums/:artistId', (req, res, next) => {
     spotifyApi.getArtistAlbums(req.params.artistId)
     .then(data => {
         let serachedAlbums = data.body.items
         res.render('albums', {artistsalbums: serachedAlbums})
     }) 
  });


  app.get('/tracks/:tracks', (req, res, next) => {
    console.log("This is the req.query",req.params.tracks)
   spotifyApi.getAlbumTracks(req.params.tracks)
   .then(data => {
       let searchedTracks = data.body.items
       console.log("THIS IS THE DATA FOR GETARTISTtracks", data.body.items)
       console.log("this is the end.")
       res.render('tracks', {artistTrack: searchedTracks})
   }) 
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
