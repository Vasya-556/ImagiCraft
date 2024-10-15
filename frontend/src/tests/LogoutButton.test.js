import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LogoutButton from '../components/LogoutButton';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('LogoutButton Component', () => {
    beforeEach(() => {
        fetch.resetMocks(); 
        localStorage.clear(); 
    });

    test('renders Logout button', () => {
        render(<LogoutButton />);
        expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
    });

    test('successful logout', async () => {
        fetch.mockResponseOnce(
            JSON.stringify({ status: 'success' }), 
            { status: 200 } 
        );

        const removeItemMock = jest.spyOn(Storage.prototype, 'removeItem');

        render(<LogoutButton />);

        fireEvent.click(screen.getByRole('button', { name: /Logout/i }));

        await waitFor(() => {
            expect(removeItemMock).toHaveBeenCalledWith('access_token');
            expect(removeItemMock).toHaveBeenCalledWith('refresh_token');
        });

        removeItemMock.mockRestore();
    });

    test('handles logout error gracefully', async () => {
        fetch.mockRejectOnce(new Error('Logout failed'));

        const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

        render(<LogoutButton />);

        fireEvent.click(screen.getByRole('button', { name: /Logout/i }));

        await waitFor(() => {
            expect(consoleErrorMock).toHaveBeenCalledWith('Logout error:', expect.any(Error));
        });

        consoleErrorMock.mockRestore();
    });
});