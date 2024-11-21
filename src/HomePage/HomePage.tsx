import * as React from 'react'
import {Col, Container, Row} from "react-bootstrap";
import './HomePage.css';
import {useState} from "react";

const HomePage: React.FC = () => {
  const [gameSize, setGameSize] = useState<number>(null);

  return (
    <Container id={"home-page"} fluid className="d-flex flex-column vh-100">
      <Row className="justify-content-center align-items-center">
        <Col xs={12} className="text-center">
          <div className="fs-3 pt-2 pb-2">
            <b>Hi! Welcome to my Rubikondo!</b>
          </div>
          <div className="fs-3">This is a browser game for Rubik's Cube.</div>
        </Col>
      </Row>
      <Row className="justify-content-center align-items-center">
        <Col xs={12} className="text-center">
          <div className="fs-3">
            Choose cube size for your game:
          </div>
        </Col>
      </Row>
      <Row className="justify-content-center align-items-center">
        <Col xs={12} className="text-center">
          <div className="fs-3">
            Canvas goes here
          </div>
        </Col>
      </Row>
      <Row className="justify-content-center align-items-center">
        <Col xs={12} className="text-center">
          <div className="pt-4 pb-4">
            <a className="fs-3" href={`/game?size=${gameSize}`}>
              <b>Start Now &gt;</b>
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;