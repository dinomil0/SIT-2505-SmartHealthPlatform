import React, { useEffect, useContext, useState, useMemo } from 'react';
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

function Dashboard() {

    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const { user } = useContext(UserContext);
    const currentUser = useMemo(() => user ?? storedUser, []);
    
    console.log({storedUser})
    console.log({ currentUser})
    const batteryPercentage = 85;
    return (
        <Box mt={5} mb={3}>
            <Grid container>
                <Grid container item>
                    < Grid item xs={11} >
                        <Button component={Link} to={"/addBloodPressure"} variant="contained" size="small" startIcon={<AddIcon />}>
                            Add blood pressure record
                        </Button>
                    </Grid>
                    <Grid item xs>
                        <BatteryIcon percentage={batteryPercentage} />
                    </Grid>
                </Grid>
                <Grid item md>
                    <LineGraph NRIC={currentUser.NRIC}></LineGraph>
                </Grid>
            </Grid>
            <Grid container item>
                    < Grid item xs={11} >
                        <Button component={Link} to={"/addWeight"} variant="contained" size="small" startIcon={<AddIcon />}>
                            Add Weight record
                        </Button>
                    </Grid>
                    <Grid item xs>
                        <BatteryIcon percentage={batteryPercentage} />
                    </Grid>
                </Grid>
            <Grid item md>
                <WeightlineGraph NRIC={currentUser.NRIC}></WeightlineGraph>
            </Grid>
        </Box>
    );
};

export default Dashboard;