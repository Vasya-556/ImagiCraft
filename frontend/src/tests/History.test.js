import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import History from '../components/History';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

const mockJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjM0NTY3ODkwLCJleGFtcGxlX2ZpZWxkIjoiZXhhbXBsZSJ9.WjYDDVw_hDs7E6zAKWxxAeyH-GE9MlLiA2gwnZx6i2A';

describe('History Component', () => {
    beforeEach(() => {
        fetch.resetMocks(); 
        localStorage.clear(); 
    });

    test('renders loading state', () => {
        render(<History />);
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    test('renders error message on fetch failure', async () => {
        localStorage.setItem('access_token', mockJwtToken); 

        fetch.mockRejectOnce(new Error('Failed to fetch history'));

        render(<History />);

        await waitFor(() => {
            expect(screen.getByText(/failed to fetch history/i)).toBeInTheDocument();
        });
    });

    test('renders no history found message', async () => {
        localStorage.setItem('access_token', mockJwtToken); 

        fetch.mockResponseOnce(
            JSON.stringify({ status: 'success', history: {} }),
            { status: 200 }
        );

        render(<History />);

        await waitFor(() => {
            expect(screen.getByText(/no history found/i)).toBeInTheDocument();
        });
    });

    test('renders history data correctly', async () => {
        localStorage.setItem('access_token', mockJwtToken); 
    
        const mockHistory = {
            'Sample Prompt': [
                { id: 1, image_url: 'http://example.com/image1.jpg' },
                { id: 2, image_url: 'http://example.com/image2.jpg' },
            ],
        };
    
        fetch.mockResponseOnce(
            JSON.stringify({ status: 'success', history: mockHistory }),
            { status: 200 }
        );
    
        render(<History />);
    
        await waitFor(() => {
            expect(screen.getByText(/Sample Prompt/i)).toBeInTheDocument();
            expect(screen.getAllByAltText('')).toHaveLength(2); 
            expect(screen.getAllByRole('button', { name: /download/i })).toHaveLength(2);
        });
    });
});
