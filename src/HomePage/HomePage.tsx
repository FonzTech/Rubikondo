import * as React from 'react'
import {Container, Row, Col} from "react-bootstrap";
import './HomePage.css';
import {useState} from "react";
import Knob from "../Knob/Knob.tsx";
import CanvasGame from "../CanvasPreview/CanvasGame.tsx";
import CubePreview from "../CubePreview/CubePreview.tsx";

const HomePage: React.FC = () => {
  const [gameSize, setGameSize] = useState<number>(2);

  return (
    <Container id="home-page" fluid className="vh-100 text-center d-flex flex-column" data-testid="home-page">
      <Row>
        <Col xs={12}>
          <div className="d-none d-lg-block fs-3 pt-2 pb-2">
            <b>Hi! Welcome to Rubikondo!</b>
            <div>This is a browser game for Rubik's Cube.</div>
          </div>
          <div className="d-block d-lg-none fs-5 pt-2 pb-2">
            <b>Hi! Welcome to Rubikondo!</b>
            <div>This is a browser game for Rubik's Cube.</div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12} lg={4} className="d-flex justify-content-center align-items-center">
          <div className="text-center d-flex flex-column pt-2 pb-2">
            <div className="d-none d-lg-block fs-3 pb-2">
              <b>Choose cube size for your game:</b>
            </div>
            <div className="d-block d-lg-none fs-5 pb-2">
              <b>Choose cube size for your game:</b>
            </div>
            <div>
              <Knob minHeight="128px"/>
            </div>
          </div>
        </Col>
        <Col xs={12} lg={8}>
          <CanvasGame
            addStyle={{width: "100%", flexGrow: "1", minHeight: "256px"}}
            canvasLogic={new CubePreview()}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <div className="pb-4">
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