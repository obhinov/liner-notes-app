// NOTE: better do import individually rather than {Container, Row, Col}

import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button';

import Helmet from 'react-helmet';

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
    <div>
      <main>
        <Container>
            <Row >
              <Col sm={3}>
              </Col>
                <Col sm={9} className='roboto-mono-google-font'>
                    <h1>The Liner Notes App</h1>
                    <p>Find detailed credits of songs you're currently listening to on Spotify!</p>
                    <Button variant='outline-success' href={spotify_authorize_url_full}>Login to Spotify</Button>
                </Col>
            </Row>
        </Container>
      </main>
      <footer class="py-3 my-5">
        <Container className='px-4'>
          <Row >
              <Col sm={3}>
              </Col>
                <Col sm={9} className='roboto-mono-google-font'>
                  <p>By Abhinav Subramani, 2022. Made using ReactJS and Bootstrap.</p>
                </Col>
            </Row>
        </Container>
      </footer>
    <Helmet bodyAttributes={{style: 'background-color : #fae7b4'}}/>
    </div>
  )
}
