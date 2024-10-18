import React, {useState, useEffect} from 'react'
import LogoutButton from './LogoutButton';
import LightDarkModeToggle from './LightDarkModeToggle';
import SideBar from './SideBar';
import logo from '../assets/logo.svg';
import { Link } from 'react-router-dom';

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
          <Link to='/'><h1> 
            ImagiCraft 
            </h1>
            <img src={logo} alt=''/>
          </Link>
        </div>
        <div className='right'>
          {isLoggedIn ? 
          <>
              <LogoutButton/>
          </> : 
          <> 
              <Link className='AuthButton' to="/SignIn">Sign in</Link>
              <Link className='AuthButton' to="/SignUp">Sign up</Link>
          </>}
          <LightDarkModeToggle/>
        </div>
    </header>
  )
}

export default Header;