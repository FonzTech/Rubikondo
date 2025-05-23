import * as React from 'react'
import {Button, Container, Modal} from "react-bootstrap";
import CanvasGame from "../CanvasGame/CanvasGame.tsx";
import Utils from "../Utils/Utils.tsx";
import CubeGame from "../CubeGame/CubeGame.tsx";
import {useEffect, useState} from "react";
import {useInputKeys} from "../Hooks/useInputKeys.ts";
import Utils_Hotfix from "../Utils/Utils_Hotfix.ts";

interface GameSizeInterface {
  gameSize: number;
  startNewGame: boolean;
}


const GamePage: React.FC<GameSizeInterface> = ({
  gameSize = Utils.DEFAULT_GAME_SIZE,
  startNewGame = true
}) => {
  if (Utils_Hotfix.GAME_SIZE) {
    gameSize = Utils_Hotfix.GAME_SIZE!;
  }

  if (gameSize < 2) {
    throw `Input game size ${gameSize} cannot be less than two`;
  }
  if (gameSize > 8) {
    throw `Input game size ${gameSize} cannot be greater than eight`;
  }

  const [showTutorial, setShowTutorial] = useState<boolean>(startNewGame);
  const [showGameOver, setShowGameOver] = useState<boolean>(false);

  const handleCloseTutorial = () => setShowTutorial(false);

  const handleResetGame = () => { window.location.href = "/"; };
  const handleNewGame = () => { window.location.reload(); };

  const [isKeyPressed, setupFunc, cleanUpFunc] = useInputKeys(document.body);

  useEffect(() => {
    setupFunc();

    return () => {
      cleanUpFunc();
    };
  }, []);

  return (
    <>
      <Container id="game-page" fluid className="vh-100 text-center d-flex flex-column" data-testid="game-page"
                 data-game-size={gameSize}>
        <div>
          <div className="d-none d-lg-block fs-3 pt-2 pb-2">
            <b>Hi! Welcome to Rubikondo!</b>
            <div>You are playing a {gameSize}x{gameSize} Rubik's Cube.</div>
          </div>
          <div className="d-block d-lg-none fs-5 pt-2 pb-2">
            <b>Hi! Welcome to Rubikondo!</b>
            <div>{gameSize}x{gameSize} Rubik's Cube</div>
          </div>
        </div>
        <div className={"flex-grow-1"}>
          <CanvasGame
            addStyle={{
              width: "100%",
              flexGrow: "1",
              minHeight: "256px",
              height: "100%"
            }}
            canvasLogicInstantiator={() => new CubeGame(gameSize, isKeyPressed, () => { setShowGameOver(true); })}
            gameSize={gameSize}
          />
        </div>
      </Container>
      <Modal show={showTutorial} data-testid={"modal-tutorial"}>
        <Modal.Header>
          <Modal.Title>Game Tutorial</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>Welcome to my Rubik's Cube web game!</h6>
          Here's the controls:
          <ul>
            <li>You can rotate the view with mouse or touch device.</li>
            <li>You can select the column or row to rotate by clicking it.</li>
            <li>
              Once you enter <b>selection mode</b>, you can:
              <ul>
                <li>
                  swipe to up/down or left/right to rotate the selected
                  column or row, if you have touch controls;
                </li>
                <li>
                  press up, down, left or right keys on your keyboard to
                  rotate the selected column or row accordingly, if available.
                </li>
              </ul>
            </li>
            <li>To exit selection mode, just click anywhere without swiping.</li>
            <li>
              To win the game, you know, you must match all the faces
              with the same color, you know&hellip;
            </li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseTutorial}>Start Game</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showGameOver} data-testid={"modal-tutorial"}>
        <Modal.Header>
          <Modal.Title>Game Over</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>Congratulation, game is over!</h6>
          <div>
            You’ve cracked the cube and completed the challenge!<br/>
            Your skills, patience, and persistence paid off.<br/>
            <br/>
            Feel proud, 'cause not everyone makes it this far.<br/>
            Ready to change cube size or go for another round?
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleResetGame}>Change Cube Size</Button>
          <Button variant="primary" onClick={handleNewGame}>Start New Game</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default GamePage;