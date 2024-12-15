import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App/App';
import {mock_CanvasBase_getRubikCubeImpl} from "../../vitest.setup.ts";
import {CanvasBase} from "../CanvasBase/CanvasBase.tsx";

CanvasBase.getRubikCubeImpl = mock_CanvasBase_getRubikCubeImpl;

test('render main app', () => {
    render(<App />);
    expect(screen.getByTestId("home-page")).toBeVisible();
});