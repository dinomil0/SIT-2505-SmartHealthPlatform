import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Grid, Button, Typography, Box, Paper } from '@mui/material';
import Tooltips from '@mui/material/Tooltip';
import { Link } from "react-router-dom";
import SyncIcon from '@mui/icons-material/Sync';
import BatteryIcon from '../graphs-component/batteryIcon';
import moment from 'moment';
import http from '../http'; // Assuming you have configured HTTP client
import { faker } from '@faker-js/faker'; // Import faker-js/faker for generating random data
import bmiImg from "../assets/bmi.png";
import InfoIcon from '@mui/icons-material/Info';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WeightGraph = ({ NRIC }) => {
    const batteryPercentage = faker.number.int({ min: 20, max: 80 }); //mock battery percentage
    const [height, setHeight] = useState(null); // State to store height

    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Weight',
                data: [],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
        ],
    });

    const [chartOptions, setChartOptions] = useState({
        responsive: true,
        scales: {
            y: {
                suggestedMin: 60,
                suggestedMax: 100,
            },
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Weight for past 7 days',
            },
            tooltips: {
                intersect: false,
            },
            annotation: {
                annotations: [],
            },
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dataresponse] = await Promise.all([
                    http.get(`user/getWeight/${NRIC}`),
                ]);

                const weightData = dataresponse.data;
                const latestHeight = weightData[0]?.heightValue || null; // Assuming the height is included in weight data
                setHeight(latestHeight)

                console.log('Weight Data:', weightData);
                console.log('Latest Height:', latestHeight);

                const labels = [];
                const weights = [];

                for (let i = 6; i >= 0; i--) {
                    const date = moment().subtract(i, 'days').format('DD MMM');
                    labels.push(date);

                    const dataPoint = weightData.find((record) => moment(record.measureDate).format('DD MMM') === date);
                    const weightValue = dataPoint ? dataPoint.weightValue : faker.number.int({ min: 80, max: 89 });
                    weights.push(weightValue);
                }

                console.log('Labels:', labels);
                console.log('Weights:', weights);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Weight',
                            data: weights,
                            borderColor: 'rgb(75, 192, 192)',
                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        },
                    ],
                });

                setHeight(latestHeight); // Update the height state
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [NRIC]);

    const categorizeBMI = (weight, height) => {
        const currentHeight = height; // Assuming a default height for BMI calculation (in cm)
        const bmi = (weight / ((currentHeight / 100) ** 2)).toFixed(1); // Calculate BMI and round to 1 decimal place
        console.log(currentHeight, bmi)
        let category = '';
        let color = '';
        let optimalRange = '';

        //BMI chart https://www.myheart.org.sg/tools-resources/bmi-calculator/

        if (bmi < 18.5) {
            category = `Underweight, BMI: ` + bmi;
            color = 'rgba(255,229,153,255)'; // Yellow color
            optimalRange = 'Optimal BMI Range: 18.5 - 24.9';
        } else if (bmi >= 18.5 && bmi < 22.9) {
            category = 'Normal Weight, BMI: ' + bmi;
            color = 'rgba(147,196,125,255)'; // Green color
        } else if (bmi >= 23 && bmi < 29.9) {
            category = 'Overweight, BMI: ' + bmi;
            color = 'rgba(255,229,153,255)'; // Yellow color
            optimalRange = 'Optimal BMI Range: 18.5 - 24.9';
        } else {
            category = 'Obese, BMI: ' + bmi;
            color = 'rgba(224,102,102,255)'; // Red color
            optimalRange = 'Optimal BMI Range: 18.5 - 24.9';
        }


        return { category, color, optimalRange };
    };

    const lastWeight = chartData.datasets[0].data[chartData.datasets[0].data.length - 1];
    const { category: bmiCategory, color: categoryColor, optimalRange } = categorizeBMI(lastWeight, height);

    return (
        <Box>
            <Grid container alignItems="center" justifyContent="space-between" mb={2} mt={3}>
                <Paper item lg={4}>
                    <Typography variant="subtitle1" align="center">
                        Weight
                    </Typography>
                </Paper>
                <Paper item lg={4}>
                    <Typography variant="subtitle1" align="center">
                        Muscle Mass
                    </Typography>
                </Paper>
                <Paper item lg={4}>
                    <Typography variant="subtitle1" align="center">
                        Body Fat %
                    </Typography>
                </Paper>
            </Grid>
            <Paper>
                <Box p={3}>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                            <Button component={Link} to={"/addWeight"} variant="contained" fontSize="small" startIcon={<SyncIcon />}>
                                Sync
                            </Button>
                        </Grid>
                        <Grid item>
                            <BatteryIcon percentage={batteryPercentage} />
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="center" alignItems="center">
                        <Grid item lg={9}>
                            <Line data={chartData} options={chartOptions} />
                        </Grid>
                        <Grid item lg={3} justifyContent="center" alignItems="center">
                            <Typography variant="subtitle1" align="center">
                                BMI Category
                                <Tooltips title={<img src={bmiImg} alt="BMI Chart" />} placement="left">
                                    <InfoIcon fontSize="10px"></InfoIcon>
                                </Tooltips>
                            </Typography>
                            <Grid item align="center">
                                <Typography style={{ color: categoryColor }}>
                                    {bmiCategory}
                                </Typography>
                            </Grid>
                            <Typography variant="body2" align="center">
                                {optimalRange}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
};

export default WeightGraph;
