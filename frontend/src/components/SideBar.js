import React, {useState} from 'react';
import { Link } from 'react-router-dom';

function SideBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className={`Sidebar ${isOpen ? 'open' : 'closed'}`}>
        <ul>
          <li><Link to='/'>Image Generator</Link></li>
          <li><Link to='/prompt'>Prompt Generator</Link></li>
          <li><Link to='/describe'>Analyze image with ai</Link></li>
          <li><Link to='/history'>History</Link></li>
          <li><Link to='/profile'>Profile</Link></li>
        </ul>
      </div>

      <button className={`SidebarToggle ${isOpen ? 'open' : 'closed'}`} onClick={toggleSidebar}>
        <span className="menu-icon">☰</span>
      </button>
    </>
  )
}

export default SideBar