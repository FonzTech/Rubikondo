import * as React from 'react'
import {Container} from "react-bootstrap";
import './HomePage.css';
import {useState} from "react";
import Knob from "../Knob/Knob.tsx";

const HomePage: React.FC = () => {
  const [gameSize, setGameSize] = useState<number>(2);

  return (
    <Container id="home-page" fluid className="d-flex flex-column vh-100 text-center" data-testid="home-page">
      <div className="fs-3 pt-2 pb-2">
        <b>Hi! Welcome to my Rubikondo!</b>
        <div className="fs-3">This is a browser game for Rubik's Cube.</div>
      </div>
      <div className="text-center d-flex flex-column pt-2 pb-2">
        <div className="fs-3 pb-2">
          <b>Choose cube size for your game:</b>
        </div>
        <div>
          <Knob minHeight="256px" />
        </div>
      </div>
      <div className="fs-3">
        Canvas goes here
      </div>
      <div className="pt-4 pb-4">
        <a className="fs-3" href={`/game?size=${gameSize}`}>
          <b>Start Now &gt;</b>
        </a>
      </div>
    </Container>
  );
};

export default HomePage;