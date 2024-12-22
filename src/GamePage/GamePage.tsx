import * as React from 'react'
import {Container} from "react-bootstrap";
import CanvasGame from "../CanvasGame/CanvasGame.tsx";
import {Utils} from "../Utils/Utils.tsx";
import DebugOverlay from "../DebugOverlay/DebugOverlay.tsx";
import CubeGame from "../CubeGame/CubeGame.tsx";

interface GameSizeInterface {
  gameSize: number;
}

const GamePage: React.FC<GameSizeInterface> = ({
  gameSize = Utils.DEFAULT_GAME_SIZE
}) => {
  if (gameSize == null) {
    throw `Input game size cannot be null`;
  }
  if (gameSize < 2) {
    throw `Input game size ${gameSize} cannot be less than two`;
  }
  if (gameSize > 8) {
    throw `Input game size ${gameSize} cannot be greater than eight`;
  }

  return (
    <DebugOverlay
      childComponent={
        <Container id="game-page" fluid className="vh-100 text-center d-flex flex-column" data-testid="game-page" data-game-size={gameSize}>
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
              canvasLogicInstantiator={() => new CubeGame(gameSize)}
              gameSize={gameSize}
            />
          </div>
        </Container>
      }
    />
  );
};

export default GamePage;