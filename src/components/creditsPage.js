// ----- Imports -----
import React from 'react';
import {useEffect, useState} from "react";

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'

import Helmet from 'react-helmet';

import axios from 'axios';
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApiFunction = new SpotifyWebApi();

// ----- Side Functions -----
// Function 1: Gets an access token from the spotify web api
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

// Function 2: Gets any data from spotify using an access token (specific case: get current song user is playing)
async function spotify_api_data_caller(access_token_input) {

  spotifyApiFunction.setAccessToken(access_token_input);
  const response = spotifyApiFunction.getMyCurrentPlayingTrack();
  return response;

}

// Function 3: Gets anything from the genius web api
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


// Function 4: Converts the custom_performances object to a string of comma seperated values (ex: "bob, sarah, steve")
function comma_string_maker(customPerformances_ArtistList) {
  const newList = customPerformances_ArtistList.map((item) => (
    item.name
  ));
  const comma_string = newList.join(', ');
  return comma_string;
}


// ----- Main Function -----
export default function CreditsPage(props) {

  // Spotify required info
  const spotify_id = `${process.env.REACT_APP_SPOTIFY_CLIENT_ID}`;
  const spotify_secret = `${process.env.REACT_APP_SPOTIFY_CLIENT_SECRET}`;
  const spotify_redirect_uri = 'http://localhost:3000/callback';
  const spotify_auth_code = props.spotify_auth_code;

  // Genius required info
  const genius_client_access_token = `${process.env.REACT_APP_GENIUS_ACCESS_TOKEN}`;

  // Defining useState hooks
  const [creditsMessage, setCreditsMessage] = useState({full_title: '', album_image:'', featured_artists_names: [], writers_names: [], producers_names: [], custom_performances: []});

  // Once received the code after redirect, we must save the code to get the token
  // NOTE: useEffect hook, with the unnamed dependencies below ("[]"), allows us to only run this code once in the
  //       first render of this function. Without it, the whole function will run re-render infinitely because of 
  //       "setSpotifyCode", causing a re-render. Without "[]", useEffect runs whenever any useState hook changes.
  useEffect(() => {

    // Now we have the code, proceed to get the access token
    console.log('Spotify code is not empty! Code is: ', spotify_auth_code);
    spotify_api_token_caller(spotify_auth_code, spotify_redirect_uri, spotify_id, spotify_secret)
    .then(res_token => {
      console.log('Token Received!: ', res_token.data.access_token);
      return spotify_api_data_caller(res_token.data.access_token);
    })

    .then(res_data => {
      console.log('Spotify Data Received!: ', res_data);
      // Now the spotify data is received, get the genius search results!
      const spotify_song_name = res_data.item.name;
      const spotify_song_name_cleaned = spotify_song_name.replace(/ *\([^)]*\) */g, "");
      const spotify_song_artist = res_data.item.artists[0].name;
      const genius_api_url = "https://api.genius.com/search?" + new URLSearchParams({
        q: spotify_song_name_cleaned + ' ' + spotify_song_artist
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

      // CHANGING CREDITS MESSAGE
      setCreditsMessage({full_title: res_genius_song_data.response.song.full_title, 
        album_image: res_genius_song_data.response.song.song_art_image_url,
        featured_artists_names: res_genius_song_data.response.song.featured_artists, 
        writers_names: res_genius_song_data.response.song.writer_artists, 
        producers_names: res_genius_song_data.response.song.producer_artists,
        custom_performances: res_genius_song_data.response.song.custom_performances});

    })
    .catch(err_spotify => {
      console.log('Oh no, an error occured!: ', err_spotify)
    });
  }, []);

  return (
    <div>
      <Container className='roboto-mono-google-font'>
        <Row className='mt-4'>
          <Col sm={5}>
            {creditsMessage && 
              <div>
                <Image src={creditsMessage.album_image} fluid rounded width='300px' length='auto'></Image>
                <h3 class="mt-3">{creditsMessage.full_title}</h3>
              </div>
            }
          </Col>
          <Col sm={7}>
            {creditsMessage && 
              <div class="ms-4">
                {creditsMessage.featured_artists_names.length!=0 && <div>
                  <h4>Feature Artists</h4>
                  <ul>
                    {creditsMessage.featured_artists_names.map(artist => (
                      <li key={artist.id}>{artist.name}</li>
                    ))}
                  </ul>
                </div>}

                {creditsMessage.writers_names.length!=0 && <div>
                  <h4>Writers</h4>
                  <ul>
                    {creditsMessage.writers_names.map(artist => (
                      <li key={artist.id}>{artist.name}</li>
                    ))}
                  </ul>
                </div>}

                {creditsMessage.producers_names.length!=0 && <div>
                  <h4>Producers</h4>
                  <ul>
                    {creditsMessage.producers_names.map(artist => (
                      <li key={artist.id}>{artist.name}</li>
                    ))}
                  </ul>
                </div>}

                {creditsMessage.custom_performances.length!=0 && <div>
                  <h4>Custom Performances</h4>
                  <ul>
                    {creditsMessage.custom_performances.map(item => (
                        <li key={item.label}>{item.label}: {comma_string_maker(item.artists)}</li>
                    ))}
                  </ul>
                </div>}
              </div>
            }
          </Col>
        </Row>
      </Container>
      <Helmet bodyAttributes={{style: 'background-color : #fae7b4'}}/>
    </div>
  );
}