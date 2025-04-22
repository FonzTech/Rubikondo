import * as React from 'react'
import {Container, Row, Col} from "react-bootstrap";
import './HomePage.css';
import {useEffect, useRef, useState} from "react";
import Knob from "../Knob/Knob.tsx";
import CanvasGame from "../CanvasGame/CanvasGame.tsx";
import CubePreview from "../CubePreview/CubePreview.tsx";
import Utils from "../Utils/Utils.tsx";
import {Link} from "react-router-dom";
import Utils_Hotfix from "../Utils/Utils_Hotfix.ts";
import * as THREE from "three";

const STARTING_ROTATION_IN_DEGREES: Readonly<number> = 180;
const STARTING_GAME_SIZE: Readonly<number> = Utils.DEFAULT_GAME_SIZE;

const HomePage: React.FC = () => {
  const [gameSize, setGameSize] = useState<number>(Utils_Hotfix.GAME_SIZE || STARTING_GAME_SIZE);
  const rotationInDegrees = useRef<number>(Utils_Hotfix.ROTATION_DEGREES || STARTING_ROTATION_IN_DEGREES);

  useEffect(() => {
    Utils_Hotfix.GAME_SIZE = gameSize;
    Utils_Hotfix.ROTATION_DEGREES = THREE.MathUtils.radToDeg(rotationInDegrees.current);
  }, [gameSize]);

  const customText = Utils.isTouchAvailable() ? "finger" : "mouse";

  return (
    <Container id="home-page" fluid className="vh-100 text-center d-flex flex-column" data-testid="home-page" data-game-size={`${gameSize}`}>
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
            <div className="d-none d-lg-block fs-3">
              <b>Choose cube size for your game:</b>
            </div>
            <div className="d-none d-lg-block fs-4 pb-2">
              Rotate this knob with your {customText} &#128540;
            </div>
            <div className="d-block d-lg-none fs-5">
              <b>Choose cube size<br/>for your game:</b>
            </div>
            <div className="d-block d-lg-none fs-6 pb-2">
              Rotate this knob with your {customText} &#128540;
            </div>
            <div>
              <Knob
                minHeight="128px"
                startingRotation={rotationInDegrees.current}
                rotateCallback={(value, angle) => {
                  rotationInDegrees.current = angle;
                  setGameSize(value);
                }}
              />
            </div>
          </div>
        </Col>
        <Col xs={12} lg={8}>
          <CanvasGame
            addStyle={{
              width: "100%",
              flexGrow: "1",
              minHeight: "256px",
              height: "100%"
            }}
            canvasLogicInstantiator={() => new CubePreview()}
            gameSize={gameSize}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <div className="pb-4">

            {
              Utils.HASH_ROUTER ?
                (<Link className="fs-3" to={`/game?size=${gameSize}`}>
                  <b>Start Now &gt;</b>
                </Link>) :
                (<a className="fs-3" href={`/game?size=${gameSize}`}>
                  <b>Start Now &gt;</b>
                </a>)
            }
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;