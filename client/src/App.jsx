import React, { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Menu, MenuItem, IconButton, Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import SignUp from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/dashboard';
import AddBloodPressure from './pages/addBloodPressure';
import AddWeight from './pages/addWeight';
import UserContext from "./contexts/UserContext";
import http from "./http";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home'; // Import the Home component
import AddDevice from './pages/AddDevice';
import { useNavigate } from "react-router-dom";
import AddMeasurement from './pages/AddMeasurement';
import AddReminder from './pages/AddReminder';
import Report from './pages/Report';
import DeviceConfig from './pages/DeviceConfig';

function App() {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get("/user/auth", {headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}` // Set Authorization header with access token
      }}).then((res) => {
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
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>

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
                  <Box >
                    <IconButton
                      edge="end"
                      color="inherit"
                      aria-label="menu"
                      aria-controls="profile-menu"
                      aria-haspopup="true"
                      onClick={handleMenuOpen}
                    >
                      <Typography variant="body1" style={{ marginRight: '8px' }}>
                        Welcome back, {user.name}
                      </Typography>
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
                      <MenuItem onClick={() => { navigate('/addDevice')}}>Device integration</MenuItem>
                      <MenuItem onClick={() => { navigate('/generateReport')}}>Health Report</MenuItem>
                      <MenuItem onClick={() => { navigate('/addMeasurement')}}>Log measurement</MenuItem>
                      <MenuItem onClick={() => { navigate('/configDevice')}}>Device config</MenuItem>
                      <MenuItem onClick={() => { navigate('/addReminder')}}>Reminder scheduler</MenuItem>
                    </Menu>
                  </Box>
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
              <Route path="/addDevice" element={<AddDevice />} />
              <Route path="/addMeasurement" element={<AddMeasurement />} />
              <Route path="/addReminder" element={<AddReminder />} />
              <Route path="/configDevice" element={<DeviceConfig />} />
              <Route path="/generateReport" element={<Report NRIC={user?.NRIC} />} />
            </Routes>
          </Container>
        </ThemeProvider>
     
    </UserContext.Provider>
  );
}

export default App;
