import { render } from '@testing-library/react';
import App from '../App/App';

test('renders the app', () => {
    render(<App />);
    expect(true).toBeTruthy();
});