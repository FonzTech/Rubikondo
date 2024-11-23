import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App/App';

test('render main app', () => {
    render(<App />);
    expect(screen.getByTestId("home-page")).toBeVisible();
});