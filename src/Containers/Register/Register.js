import React, { useState } from 'react';
import './Register.css';
import { Grid, TextField } from '@material-ui/core';
import { signUp } from '../../service';
import { useHistory } from 'react-router-dom';
import { fetchCurrentUser } from '../../service';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');

  const history = useHistory();

  const handleRegister = async () => {
    const userData = {
      name: username,
      phone: phone
    }
    await signUp(email, password, userData);

    setTimeout(handleAuthentication, 2000);
  }

  const handleAuthentication = async () => {
    const currentUser = await fetchCurrentUser();
    if (currentUser) {
      history.push('/home');
    } else {
      window.alert('Wrong email/password. Please try again');
    }
  }

  return (
    <div className='login-page'>
      <div className='login-card'>
        <h3>Register</h3>
        <div className="form-item">
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                id="user-name"
                label="Username"
                variant="outlined"
                fullWidth="true"
                value={username}
                onChange={(e) => {setUsername(e.target.value)}}
              />
            </Grid>
          </Grid>
        </div>
        <div className="form-item">
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            fullWidth="true"
            value={email}
            onChange={(e) => {setEmail(e.target.value)}}
          />
        </div>
        <div className="form-item">
          <TextField
            id="phone"
            label="Phone Number"
            variant="outlined"
            fullWidth="true"
            value={phone}
            onChange={(e) => {setPhone(e.target.value)}}
          />
        </div>
        <div className="form-item">
          <TextField
            id="password"
            label="Password"
            variant="outlined"
            type="password"
            fullWidth="true"
            value={password}
            onChange={(e) => {setPassword(e.target.value)}}
          />
        </div>
        <p>
          Have an account? <a href="/login" style={{"color": "#FF9900"}}>Login now!</a>
        </p>
        <div
          className="form-item"
          onClick={() => handleRegister()}
        >
          <div className="login-btn">
            Register
          </div>
        </div>
      </div>
    </div>
  )
};

export default Register;