import React, {useState, useEffect} from 'react'
import LogoutButton from './LogoutButton';
import LightDarkModeToggle from './LightDarkModeToggle';
import SideBar from './SideBar';

function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      }, []);
  return (
    <div>
        <h1>ImagiCraft</h1>
        {isLoggedIn ? 
        <>
        <SideBar/>
            <LogoutButton/>
        </> : 
        <> 
            <a href="/SignIn">Sign in</a>
            <a href="/SignUp">Sign up</a>
        </>}
        <LightDarkModeToggle/>
    </div>
  )
}

export default Header