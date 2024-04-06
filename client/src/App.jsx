import React, { useState, useEffect, } from 'react';
import { Container, AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Grid } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import SignUp from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/dashboard';
import AddBloodPressure from './pages/addBloodPressure';
import AddWeight from './pages/addWeight';
import UserContext from "./contexts/UserContext";
import http from "./http";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home'; // Import the Home component
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'; // Import the ArrowDropDownIcon

function App() {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  // const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get("/user/auth").then((res) => {
        setUser(res.data.user);
      });
    }
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Perform logout logic here
    setUser(null);
    setAnchorEl(null);
    // navigate('/'); // Use navigate within the Router context
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router> {/* Ensure Router is set up properly */}
        <ThemeProvider theme={MyTheme}>
          <AppBar position="static" className='AppBar'>
            <Container>
              <Toolbar disableGutters={true}>
                <Link to="/">
                  <Typography variant="h6" component="div">
                    HealthApp
                  </Typography>
                </Link>
                {user && (
                  // <Container>
                    <Grid container alignItems="center" justifyContent='flex-end' >
                      <Grid item >
                        <Typography variant="body1" style={{ marginRight: '3px' }}>
                         Welcome, {user.name}
                        </Typography>
                      </Grid>
                      <Grid item >
                        <IconButton
                          edge="end"
                          color="inherit"
                          aria-label="menu"
                          aria-controls="profile-menu"
                          aria-haspopup="true"
                          onClick={handleMenuOpen}
                        >
                          <ArrowDropDownIcon />
                        </IconButton>
                        <Menu
                          id="profile-menu"
                          anchorEl={anchorEl}
                          keepMounted
                          open={Boolean(anchorEl)}
                          onClose={handleMenuClose}
                        >
                          <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                          <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                      </Grid>
                    </Grid>
                  // </Container>
                )}
              </Toolbar>
            </Container>
          </AppBar>
          <Container>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/addBloodPressure" element={<AddBloodPressure />} />
              <Route path="/addWeight" element={<AddWeight />} />
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
