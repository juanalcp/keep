import { render, screen } from '@testing-library/react-native';

import HomeScreen from '@/app/index';

describe('HomeScreen', () => {
  it('shows the Keep header and an empty notes area', async () => {
    await render(<HomeScreen />);

    expect(screen.getByText('Keep')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.queryByText(/no notes|empty|create|delete/i)).toBeNull();
  });
});
