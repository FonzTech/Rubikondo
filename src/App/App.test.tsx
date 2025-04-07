import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App/App';
import {mock_CanvasBase_getRubikCubeImpl} from "../../vitest.setup.ts";
import {CanvasBase} from "../CanvasBase/CanvasBase.tsx";

import { __TEST__ } from './App.tsx';
import Utils from "../Utils/Utils.tsx";

CanvasBase.getRubikCubeImpl = mock_CanvasBase_getRubikCubeImpl;

describe('test app entrypoint', () => {
  test('render main app', () => {
    const renderResult = render(<App />);
    expect(renderResult.getByTestId("home-page")).toBeVisible();
  });

  test('test game size', () => {
    expect(__TEST__.getGameSize("?size=-3")).toBe(-3);
    expect(__TEST__.getGameSize("?size=14")).toBe(14);
    expect(__TEST__.getGameSize("?size=5")).toBe(5);
    expect(__TEST__.getGameSize(null)).toBe(Utils.DEFAULT_GAME_SIZE);
    expect(__TEST__.getGameSize("")).toBe(Utils.DEFAULT_GAME_SIZE);
    expect(__TEST__.getGameSize("?")).toBe(Utils.DEFAULT_GAME_SIZE);
    expect(__TEST__.getGameSize("?size=")).toBe(Utils.DEFAULT_GAME_SIZE);
    expect(__TEST__.getGameSize("?size=bad")).toBe(Utils.DEFAULT_GAME_SIZE);
  });
});
