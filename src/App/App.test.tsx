import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App/App';
import CubePreview from "../CubePreview/CubePreview.tsx";
import {mock_CanvasGame_getRubikCubeImpl} from "../../vitest.setup.ts";

CubePreview.getRubikCubeImpl = mock_CanvasGame_getRubikCubeImpl;

test('render main app', () => {
    render(<App />);
    expect(screen.getByTestId("home-page")).toBeVisible();
});