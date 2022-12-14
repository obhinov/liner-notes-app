import React from 'react';
import {useEffect, useState} from "react";
import axios from 'axios';
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApiFunction = new SpotifyWebApi();

// Function: Gets an access token from the spotify web api
async function spotify_api_token_caller(code_input, redirect_uri_input, id_input, secret_input) {

  const headers = {
    headers: {
      "Authorization": "Basic " + window.btoa(id_input + ":" + secret_input),
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };
  
  const data = new URLSearchParams({
    grant_type: "authorization_code",
    code: code_input,
    redirect_uri: redirect_uri_input
  });

  const response = axios.post("https://accounts.spotify.com/api/token", data, headers);
  return response;
}

// Function: Gets any data from spotify using an access token (specific case: get current song user is playing)
async function spotify_api_data_caller(access_token_input) {

  spotifyApiFunction.setAccessToken(access_token_input);
  const response = spotifyApiFunction.getMyCurrentPlayingTrack();
  return response;

}

// Function: Gets anything from the genius web api
async function genius_api_caller(url,token) {

  const requestOptions = {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token,
      'User-Agent': 'CompuServe Classic/1.22',
      'Accept': 'application/json',
      'Host': 'api.genius.com'
    }
  };

  const response = await fetch(url, requestOptions);
  return response.json();
}

export default function LoginPage() {

  // From spotify get user's current playing song
  const spotify_authorize_base = 'https://accounts.spotify.com/authorize?';
  const spotify_id = 'a7b4e4c5e03c48f48bc110f715aecfe2';
  const spotify_secret = 'bb908b7a9ee543a9b829da99b9056b0c';
  const spotify_redirect_uri = 'http://localhost:3000/callback';

  const genius_client_access_token = '8AwjO4CNeVD50gaNWeCCeWlKFVKRf_YkNTgYaQaNnu9DGDQZawfaBJ3d7YMlk0mf';

  const spotify_authorize_url_full = spotify_authorize_base + new URLSearchParams({
    client_id: spotify_id,
    response_type: 'code',
    redirect_uri: spotify_redirect_uri,
    scope: 'user-read-currently-playing',
    show_dialog: 'true'
  });

  // Once received the code after redirect, we must save the code to get the token
  const [spotifycode, setSpotifyCode] = useState("");
  useEffect(() => {
    const url_name = window.location.href;
    if (url_name.includes('callback?code=')) {
      const callbackPosition = url_name.search('callback') + 14;
      const lastIndexOfUrl = url_name.length;
      const code_response = url_name.substring(callbackPosition, lastIndexOfUrl);
      setSpotifyCode(code_response);
    }

  }, []);

  if (spotifycode.length>0) {
    console.log('Spotify code is not empty! Code is: ', spotifycode);
    // Now we have the spotify access code, proceed to get the access token!
    spotify_api_token_caller(spotifycode, spotify_redirect_uri, spotify_id, spotify_secret)
    .then(res_token => {
      console.log('Token Received!: ', res_token.data.access_token);
      return spotify_api_data_caller(res_token.data.access_token);
    })

    .then(res_data => {
      console.log('Spotify Data Received!: ', res_data);
      // Now the spotify data is received, get the genius search results!
      const spotify_song_name = res_data.item.name;
      const spotify_song_artist = res_data.item.artists[0].name;
      const genius_api_url = "https://api.genius.com/search?" + new URLSearchParams({
        q: spotify_song_name + ' ' + spotify_song_artist
      });
      return genius_api_caller(genius_api_url, genius_client_access_token)
    })

    .then(res_genius_search => {
      console.log('Genius Search Results Received!: ', res_genius_search);
      // Get the first song result from the search
      const genius_api_path = res_genius_search.response.hits[0].result.api_path;
      const genius_api_for_song = "https://api.genius.com" + genius_api_path;
      return genius_api_caller(genius_api_for_song, genius_client_access_token);
    })

    .then(res_genius_song_data => {
      console.log('Genius Song Data Received!: ', res_genius_song_data);
      // Now, to organize the data for the individual categories
      // 1. Print primary artist
      console.log('Primary artist: ', res_genius_song_data.response.song.primary_artist.name);
      // 2. Print featured artists
      if (res_genius_song_data.response.song.featured_artists.length>0){
        const featured_artists_list = res_genius_song_data.response.song.featured_artists;
        console.log('Featured Artists:');
        for (let i=0; i<featured_artists_list.length; i++){
          console.log(featured_artists_list[i].name);
        }
      }
      // 2. Print writer artists
      if (res_genius_song_data.response.song.writer_artists.length>0){
        const writers_list = res_genius_song_data.response.song.writer_artists;
        console.log('Writers:')
        for (let i=0; i<writers_list.length; i++){
          console.log(writers_list[i].name);
        }
      }
      // 3. Print producer artists
      if (res_genius_song_data.response.song.producer_artists.length>0){
        const producers_list = res_genius_song_data.response.song.producer_artists;
        console.log('Producers:');
        for (let i=0; i<producers_list.length; i++){
          console.log(producers_list[i].name);
        }
      }
      // 4. Custom performances
      if (res_genius_song_data.response.song.custom_performances.length>0){
        const custom_performances_list = res_genius_song_data.response.song.custom_performances;
        console.log('Custom Performances:');
        for (let i=0; i<custom_performances_list.length; i++){
          if (custom_performances_list[i].artists.length>1){
            console.log(custom_performances_list[i].label+':');
            for (let j=0; j<custom_performances_list[i].artists.length; j++){
              console.log(custom_performances_list[i].artists[j].name);
            }
          }
          else {
            console.log(`${custom_performances_list[i].label}: ${custom_performances_list[i].artists[0].name}`);
          }
        }
      }
    })

    .catch(err_spotify => {
      console.log('Oh no, an error occured!: ', err_spotify)
    });

  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Spotify genius react app</h1>
        <a href={spotify_authorize_url_full}>Login to Spotify</a>
      </header>
    </div>
  );
}