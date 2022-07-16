import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import './Navbar.css';
import {
  Grid,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';
import { fetchCurrentUser, fireAuth, signOut } from '../../service';
import { AccountCircleTwoTone } from '@material-ui/icons';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      fireAuth.onAuthStateChanged(async user => {
        if (user) {
          const fetchedCurrentUser = await fetchCurrentUser();
          console.log('current user:', fetchedCurrentUser);
          setCurrentUser(fetchedCurrentUser);
        }
      })
    }
    fetchData();
  }, [location]);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut();
    history.push('/login');
  }

  const handleRedirectDashboard = async () => {
    history.push('/dashboard');
  }

  const handleRedirectChat = async () => {
    history.push('/chat');
  }

  const renderLoginPrompt = () => {
    const messageAndPrompt = {
      login: {
        message: "Don't have an account yet?",
        prompt: 'Register',
        style: {
          margin: '0 10px'
        },
        redirect: ['/register', '/register']
      },
      register: {
        message: 'Have an account?',
        prompt: 'Login',
        style: {
          margin: '0 10px'
        },
        redirect: ['/login', '/login']
      },
      loggedIn: {
        message: 'Register',
        prompt: 'Login',
        style: {
          margin: '0 10px',
          cursor: 'pointer'
        },
        redirect: ['/register', '/login']
      }
    }

    const renderMenuMessageAndPrompt = () => {
      const { pathname } = location;
      const { login, register, loggedIn } = messageAndPrompt;
      if (pathname === '/login') {
        return login;
      } else if (pathname === '/register') {
        return register;
      } else {
        return loggedIn;
      }
    }

    return (
      <div className='navbar-menu'>
        <div
          style={renderMenuMessageAndPrompt().style}
          onClick={() => history.push(renderMenuMessageAndPrompt().redirect[0])}
        >
          <h5>{renderMenuMessageAndPrompt().message}</h5>
        </div>
        <div className='login-prompt-btn'
          onClick={() => history.push(renderMenuMessageAndPrompt().redirect[1])}
        >
          <h5>{renderMenuMessageAndPrompt().prompt}</h5>
        </div>
      </div>
    )
  }

  const renderLoggedInNavbarMenu = () => {
    return (
      <div className='navbar-menu'>
        <div>
          <div className='item' onClick={handleProfileClick}>
            <PersonOutlineIcon style={{fontSize: '28px'}}/>
          </div>
          <StyledMenu
            id="customized-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <div style={{margin: '0 20px 0 20px'}}>
              <Grid container>
                <Grid item xs={3}>
                  <div style={{margin: '20px 0 0 0'}}>
                    <AccountCircleTwoTone fontSize='large'/>
                  </div>
                </Grid>
                <Grid item xs={2}></Grid>
                <Grid item xs={7}>
                  <div className='text-no-margin'>
                    <h5>{!!currentUser ? currentUser.name : '-'}</h5>
                  </div>
                </Grid>
              </Grid>
            </div>
            <StyledMenuItem onClick={() => handleRedirectDashboard()}>
              <ListItemText primary="Dashboard" />
              <ListItemIcon/>
            </StyledMenuItem>
            <StyledMenuItem onClick={() => handleRedirectChat()}>
              <ListItemText primary="Chat" />
              <ListItemIcon/>
            </StyledMenuItem>
            <StyledMenuItem onClick={() => handleLogout()}>
              <ListItemText primary="Log Out" />
              <ListItemIcon/>
            </StyledMenuItem>
          </StyledMenu>
        </div>
      </div>
    )
  }

  return (
    <>
    <div class="navbar-full-wrapper">
      <div style={{width: '300px', cursor: 'pointer', backgroundColor: 'white', borderBottom: '1px solid rgba(0,0,0,0.1)'}} onClick={() => history.push('/')}/>
      <div class="navbar-wrapper">
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <div
            style={{
              width: `${
                location.pathname==='/login' ||
                location.pathname==='/register' ?
                '50%' : '20%'
              }`,
              marginLeft: '20px'
            }}
          >
            {
              !!currentUser &&
              !(location.pathname==='/login' ||
              location.pathname==='/register') ?
                renderLoggedInNavbarMenu() : renderLoginPrompt()
            }
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Navbar;