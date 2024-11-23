import { render} from '@testing-library/react';
import App from '../App/App';

test('renders main app', () => {
    render(<App />);
    expect(true).toBeTruthy();
});