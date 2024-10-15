import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUp from '../components/SignUp'; 
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('SignUp Component', () => {
    beforeEach(() => {
        fetch.resetMocks(); 
    });

    test('renders SignUp component', () => {
        render(<SignUp />);
        expect(screen.getByText(/Sign up/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Signup/i })).toBeInTheDocument();
    });

    test('successful signup', async () => {
        fetch.mockResponseOnce(
            JSON.stringify({ status: 'success', message: 'Signup successful! You can now login.' }),
            { status: 200 } 
        );

        render(<SignUp />);

        fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'testpassword' } });

        fireEvent.click(screen.getByRole('button', { name: /Signup/i }));

        await waitFor(() => {
            expect(screen.getByText(/Signup successful! You can now login./i)).toBeInTheDocument();
        });
    });

    test('failed signup', async () => {
        fetch.mockResponseOnce(
            JSON.stringify({ status: 'error', message: 'Username already exists.' }),
            { status: 400 } 
        );

        render(<SignUp />);

        fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'existinguser' } });
        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'existing@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'testpassword' } });

        fireEvent.click(screen.getByRole('button', { name: /Signup/i }));

        await waitFor(() => {
            expect(screen.getByText(/Username already exists./i)).toBeInTheDocument();
        });
    });
});