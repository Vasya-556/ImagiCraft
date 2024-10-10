import Header from "./components/Header";
import History from "./components/History";
import ImageGenerator from "./components/ImageGenerator";
import Profile from "./components/Profile";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<ImageGenerator />} />
        </Routes>
        <Header/>
      </div>
    </Router>
  );
}

export default App;