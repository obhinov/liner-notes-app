import React from 'react'

export default function CreditsPage(props) {

  console.log('Input in credits page:', props.credits_input.data);

  /*
  // 1. Get primary artist
  const primary_artist_name = props.credits_input.data.primary_artist.name;

  // 2. Get featured artists
  const featured_artists_data = props.credits_input.data.featured_artists;
  let featured_artists_names = [];
  for (let i=0; i<featured_artists_data.length; i++){
    featured_artists_names.push(featured_artists_data[i].name);
  }
  const featured_artists_bulletList = featured_artists_names.map((item) => 
    <li>{item}</li>
  );

  // 3. Get producer artists
  const producer_artists_data = props.credits_input.data.producer_artists;
  let producer_artists_names = [];
  for (let i=0; i<producer_artists_data.length; i++){
    producer_artists_names.push(producer_artists_data[i].name);
  }
  const producer_artists_bulletList = producer_artists_names.map((item) => 
    <li>{item}</li>
  );
  */

  return (
    <div>
      <>Credits Page</>
    </div>
  )
}

// CORRECT: props.credits_input.data.artist_names
// INCORRECT: props.credits_input.data.artistnames

/*
      <h1>Primary Artist</h1>
      <>{primary_artist_name}</>
      <h1>Featured Artists</h1>
      <ul>{featured_artists_bulletList}</ul>
      <h1>Producers</h1>
      <ul>{producer_artists_bulletList}</ul>
*/