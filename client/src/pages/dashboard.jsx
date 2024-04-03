import React, { useEffect, useContext } from 'react';
import { Line } from "react-chartjs-2";
import { Link, useNavigate } from "react-router-dom";
import { Box, Typography, Grid, Card, Button, Avatar, Stack, CircularProgress, } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
// import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, } from 'chart.js';
// import { faker } from '@faker-js/faker';
import UserContext from "../contexts/UserContext";
import LineGraph from '../graphs-component/lineGraph';

function dashboard() {

    const { user } = useContext(UserContext);

    return (

        <Box mt={5} mb={3}>
            <Grid>
                <Button component={Link} to={"/addBloodPressure"} variant="contained" size="small" startIcon={<AddIcon />}>
                    Add blood pressure
                </Button>
                {/* <Line data={data} options={options}></Line> */}
                <LineGraph NRIC={user.NRIC}></LineGraph>
            </Grid>
        </Box>
    );
};

export default dashboard;