import Header from "./components/Header";
import History from "./components/History";
import ImageGenerator from "./components/ImageGenerator";
import Profile from "./components/Profile";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import PromptGenerator from "./components/PromptGenerator";
import Describe from "./components/Descirbe";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
      <div>
        <Header/>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/prompt" element={<PromptGenerator />} />
          <Route path="/describe" element={<Describe />} />
          <Route path="/" element={<ImageGenerator />} />
        </Routes>
      </div>
  );
}

export default App;