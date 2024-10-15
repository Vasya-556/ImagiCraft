import { render, screen, fireEvent } from '@testing-library/react';
import ImageGenerator from '../components/ImageGenerator';
import '@testing-library/jest-dom/extend-expect';

global.fetch = jest.fn();

describe("ImageGenerator component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders ImageGenerator component", () => {
    render(<ImageGenerator />);
    
    const inputField = screen.getByPlaceholderText(/enter image prompt/i);
    expect(inputField).toBeInTheDocument();
    const generateButton = screen.getByRole('button', { name: /generate images/i });
    expect(generateButton).toBeInTheDocument();
  });

  test("allows user to input a prompt", () => {
    render(<ImageGenerator />);
    
    const inputField = screen.getByPlaceholderText(/enter image prompt/i);
    fireEvent.change(inputField, { target: { value: 'Test prompt' } });
    
    expect(inputField.value).toBe('Test prompt');
  });

  test("generates images on button click", async () => {
    const mockResponse = {
      status: 'success',
      images: ['image1.png', 'image2.png'],
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    render(<ImageGenerator />);
    
    const inputField = screen.getByPlaceholderText(/enter image prompt/i);
    const generateButton = screen.getByRole('button', { name: /generate images/i });

    fireEvent.change(inputField, { target: { value: 'Test prompt' } });
    fireEvent.click(generateButton);

    expect(generateButton).toHaveTextContent(/generating/i);
    
    expect(await screen.findByText('Test prompt')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /generated 1/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /generated 2/i })).toBeInTheDocument();
  });

  test("displays error message on failed image generation", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValueOnce({ message: 'Error generating images' }),
    });

    render(<ImageGenerator />);
    
    const inputField = screen.getByPlaceholderText(/enter image prompt/i);
    const generateButton = screen.getByRole('button', { name: /generate images/i });

    fireEvent.change(inputField, { target: { value: 'Test prompt' } });
    fireEvent.click(generateButton);

    expect(await screen.findByText(/failed to generate images/i)).toBeInTheDocument();
  });
});
