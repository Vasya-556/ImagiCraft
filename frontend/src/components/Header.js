import React, {useState, useEffect} from 'react'
import LogoutButton from './LogoutButton';
import LightDarkModeToggle from './LightDarkModeToggle';
import SideBar from './SideBar';
import logo from '../assets/logo.svg';

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
    <header className='Header'>
        <div className='left'>
          {isLoggedIn && <SideBar />}
        </div>
        <div className='middle'>
          <a href='/'><h1> 
            ImagiCraft 
            </h1>
            <img src={logo} alt=''/>
          </a>
        </div>
        <div className='right'>
          {isLoggedIn ? 
          <>
              <LogoutButton/>
          </> : 
          <> 
              <a className='AuthButton' href="/SignIn">Sign in</a>
              <a className='AuthButton' href="/SignUp">Sign up</a>
          </>}
          <LightDarkModeToggle/>
        </div>
    </header>
  )
}

export default Header;