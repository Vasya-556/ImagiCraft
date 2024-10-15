import { render, screen } from "@testing-library/react";
import App from "../App";
import '@testing-library/jest-dom/extend-expect'; 

const createMockJWT = (userId) => {
  const header = { alg: "none", typ: "JWT" };
  const payload = { user_id: userId };
  
  const base64UrlHeader = btoa(JSON.stringify(header));
  const base64UrlPayload = btoa(JSON.stringify(payload));

  return `${base64UrlHeader}.${base64UrlPayload}.`;
};

describe("App component", () => {
  beforeEach(() => {
    const mockToken = createMockJWT(123); 
    localStorage.setItem('access_token', mockToken);
  });

  afterEach(() => {
    localStorage.clear();
  });

  test("renders SignUp component on /signup route", () => {
    window.history.pushState({}, '', '/signup');
    render(<App />);
    expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument(); 
  });

  test("renders SignIn component on /signin route", () => {
    window.history.pushState({}, '', '/signin');
    render(<App />);
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument(); 
  });

  test("renders Profile component on /profile route", async () => {
    window.history.pushState({}, '', '/profile');
    render(<App />);
    expect(await screen.findByText(/username/i)).toBeInTheDocument();
    expect(screen.getByText(/email/i)).toBeInTheDocument(); 
    expect(screen.getByText(/first name/i)).toBeInTheDocument(); 
    expect(screen.getByText(/last name/i)).toBeInTheDocument(); 
  });

  test("renders History component on /history route", () => {
    window.history.pushState({}, '', '/history');
    render(<App />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument(); 
  });
});
