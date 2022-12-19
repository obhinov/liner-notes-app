// NOTE: better do import individually rather than {Container, Row, Col}

import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default function LoginPage(props) {
  const spotify_authorize_base = 'https://accounts.spotify.com/authorize?';
  const spotify_id = `${process.env.REACT_APP_SPOTIFY_CLIENT_ID}`;
  const spotify_redirect_uri = 'http://localhost:3000/callback';

  // Link to Spotify authorization page. Sent when Login button is pressed.
  const spotify_authorize_url_full = spotify_authorize_base + new URLSearchParams({
    client_id: spotify_id,
    response_type: 'code',
    redirect_uri: spotify_redirect_uri,
    scope: 'user-read-currently-playing',
    show_dialog: 'true'
  });

  return (
    <Container className='d-flex justify-content-center align-items-center'>
        <Row >
            <Col >
                <h1>Liner Notes</h1>
                <center>Find detailed credits of songs you're currently listening to on Spotify!</center>
                <a className='btn btn-success btn-lg' href={spotify_authorize_url_full}>Login to Spotify</a>
            </Col>
        </Row>
    </Container>
  )
}
