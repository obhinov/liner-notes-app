import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

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
    <Container>
        <Row>
            <Col className='d-flex justify-content-center align-items-center'>
                <h1>Liner Notes</h1>
            </Col>
        </Row>
        <Row>
            <Col className='d-flex justify-content-center align-items-center'>
                <center>Find detailed credits of songs you're currently listening to on Spotify!</center>
            </Col>
        </Row>
        <Row>
            <Col className='d-flex justify-content-center align-items-center'>
                <a className='btn btn-success btn-lg' href={spotify_authorize_url_full}>Login to Spotify</a>
            </Col>
        </Row>
    </Container>
  )
}
