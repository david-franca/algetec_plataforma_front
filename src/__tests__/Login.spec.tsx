import { describe, expect, test } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../helpers/tests.helper';
import { LoginPage } from '../pages/Login';

// The two tests marked with concurrent will be run in parallel
describe('Login page', () => {
  const { findByAltText, findByText } = renderWithProviders(<LoginPage />);
  test.concurrent('Find logo', async () => {
    const logo = await findByAltText('Logo Branca');
    expect(logo).toBeTruthy();
  });

  test.concurrent('Find email input', async () => {
    const user = userEvent.setup();
    const emailInput = await findByText('Email');
    user.type(emailInput, 'dfranca@algetec.com.br');
    expect(emailInput).toBeTruthy();
  });
});
