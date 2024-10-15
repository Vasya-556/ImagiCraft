import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignIn from '../components/SignIn';
import { useNavigate } from 'react-router-dom';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));

let originalLocalStorage;

beforeAll(() => {
    originalLocalStorage = global.localStorage;

    const mockSetItem = jest.fn();
    const mockGetItem = jest.fn();
    const mockClear = jest.fn();

    Object.defineProperty(global, 'localStorage', {
        value: {
            setItem: mockSetItem,
            getItem: mockGetItem,
            clear: mockClear,
        },
        writable: true,
    });
});

afterAll(() => {
    global.localStorage = originalLocalStorage;
});

describe('SignIn Component', () => {
    const mockNavigate = useNavigate;

    beforeEach(() => {
        fetch.resetMocks();
        mockNavigate.mockClear();
    });

    test('renders SignIn component', () => {
        render(<SignIn />);
        expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Signin/i })).toBeInTheDocument();
    });

    test('successful sign-in', async () => {
        fetch.mockResponseOnce(
            JSON.stringify({ access: 'fake_access_token', refresh: 'fake_refresh_token' }),
            { status: 200 } 
        );
    
        render(<SignIn />);
    
        fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'testpassword' } });
    
        fireEvent.click(screen.getByRole('button', { name: /Signin/i }));
    
        await waitFor(() => {
            expect(localStorage.setItem).toHaveBeenCalledWith('access_token', 'fake_access_token');
            expect(localStorage.setItem).toHaveBeenCalledWith('refresh_token', 'fake_refresh_token');
            
        });
    });    

    test('failed sign-in', async () => {
        fetch.mockRejectOnce(new Error('Failed to sign in'));

        render(<SignIn />);

        fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'testpassword' } });

        fireEvent.click(screen.getByRole('button', { name: /Signin/i }));

        await waitFor(() => {
            expect(screen.getByText(/Failed to fetch. Please try again./i)).toBeInTheDocument();
        });
    });
});
