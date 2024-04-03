import './App.css';
import { useState, useEffect } from "react";
import { Container, AppBar, Toolbar, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import SignUp from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/dashboard';
import AddBloodPressure from './pages/addBloodPressure';
import UserContext from "./contexts/UserContext";
import http from "./http";

// import Singpass from './pages/Singpass';
// import SingpassTest from './pages/singpasstest';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get("/user/auth").then((res) => {
        setUser(res.data.user.id);
      });
      setUser({ name: "User" });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <ThemeProvider theme={MyTheme}>
          <AppBar position="static" className='AppBar'>
            <Container>
              <Toolbar disableGutters={true}>
                <Link to="/">
                  <Typography variant="h6" component="div">
                    HealthApp
                  </Typography>
                </Link>
                {/* <Link to="/tutorials" ><Typography>Tutorials</Typography></Link> */}
              </Toolbar>
            </Container>
          </AppBar>
          <Container>
            <Routes>
              <Route path={"/Signup"} element={<SignUp />} />
              <Route path={"/"} element={<Login />} />
              <Route path={"/dashboard"} element={<Dashboard />} />
              <Route path={"/addBloodPressure"} element={ <AddBloodPressure />} />
              {/* <Route path={"/singpass"} element={<Singpass />} />
            <Route path={"/singpasstest"} element={<SingpassTest />} /> */}
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
     </UserContext.Provider>
  );
}
export default App;