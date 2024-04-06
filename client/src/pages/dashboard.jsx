import React, { useEffect, useContext } from 'react';
import { Line } from "react-chartjs-2";
import { Link, useNavigate } from "react-router-dom";
import { Box, Typography, Grid, Card, Button, Avatar, Stack, CircularProgress, } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
// import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, } from 'chart.js';
// import { faker } from '@faker-js/faker';
import UserContext from "../contexts/UserContext";
import LineGraph from '../graphs-component/lineGraph';
import WeightlineGraph from '../graphs-component/weightlineGraph';
import BatteryIcon from '../graphs-component/batteryIcon';
import BatteryGauge from 'react-battery-gauge'
import "../App.css";

function dashboard() {

    const { user } = useContext(UserContext);
    const batteryPercentage = 85;
    return (
        <Box mt={2} color="grey">
            <Grid m={2}>
                <WeightlineGraph NRIC={user.NRIC}></WeightlineGraph>
            </Grid>
            <Grid m={2}>
                <LineGraph NRIC={user.NRIC}></LineGraph>
            </Grid>
            
        </Box>
    );
};

export default dashboard;