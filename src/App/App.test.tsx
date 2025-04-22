import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App/App';
import {mock_CanvasBase_getRubikCubeImpl} from "../../vitest.setup.ts";
import {CanvasBase} from "../CanvasBase/CanvasBase.tsx";
import { test, describe, expect } from 'vitest';

import { __TEST__ } from './App.tsx';
import Utils from "../Utils/Utils.tsx";

CanvasBase.getRubikCubeImpl = mock_CanvasBase_getRubikCubeImpl;

describe('test app entrypoint', () => {
  test('render main app', () => {
    const renderResult = render(<App />);
    expect(renderResult.getByTestId("home-page")).toBeVisible();
  });

  test('get query string', () => {
    expect(__TEST__.getQueryString("", "")).toBe("");
    expect(__TEST__.getQueryString("#hello", "")).toBe("");
    expect(__TEST__.getQueryString("", "hello")).toBe("hello");
    expect(__TEST__.getQueryString("#hello?var=false", "")).toBe("var=false");
    expect(__TEST__.getQueryString("#hello?var=false", "alt=true")).toBe("var=false");
    expect(__TEST__.getQueryString("#hello", "alt=true")).toBe("alt=true");
  });

  test('test game size', () => {
    expect(__TEST__.getGameSize(__TEST__.getUrlSearchParams("?size=-3"))).toBe(-3);
    expect(__TEST__.getGameSize(__TEST__.getUrlSearchParams("?size=14"))).toBe(14);
    expect(__TEST__.getGameSize(__TEST__.getUrlSearchParams("?size=5"))).toBe(5);
    expect(__TEST__.getGameSize(__TEST__.getUrlSearchParams(""))).toBe(Utils.DEFAULT_GAME_SIZE);
    expect(__TEST__.getGameSize(__TEST__.getUrlSearchParams("?"))).toBe(Utils.DEFAULT_GAME_SIZE);
    expect(__TEST__.getGameSize(__TEST__.getUrlSearchParams("?size="))).toBe(Utils.DEFAULT_GAME_SIZE);
    expect(__TEST__.getGameSize(__TEST__.getUrlSearchParams("?size=bad"))).toBe(Utils.DEFAULT_GAME_SIZE);
  });
});
