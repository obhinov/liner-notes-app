import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

export default function LoginPage(props) {
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
                <a className='btn btn-success btn-lg' href={props.auth_url}>Login to Spotify</a>
            </Col>
        </Row>
    </Container>
  )
}
