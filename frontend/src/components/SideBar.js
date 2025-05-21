import React, {useState} from 'react';

function SideBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className={`Sidebar ${isOpen ? 'open' : 'closed'}`}>
        <ul>
          <li><a href='/'>Image Generator</a></li>
          <li><a href='/prompt'>Prompt Generator</a></li>
          <li><a href='/describe'>Analyze image with ai</a></li>
          <li><a href='/history'>History</a></li>
          <li><a href='/profile'>Profile</a></li>
        </ul>
      </div>

      <button className={`SidebarToggle ${isOpen ? 'open' : 'closed'}`} onClick={toggleSidebar}>
        <span className="menu-icon">☰</span>
      </button>
    </>
  )
}

export default SideBar