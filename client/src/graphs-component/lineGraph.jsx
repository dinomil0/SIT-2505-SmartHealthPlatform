import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Grid, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Link } from "react-router-dom";
import SyncIcon from '@mui/icons-material/Sync';
import Paper from '@mui/material/Paper';
import BatteryIcon from '../graphs-component/batteryIcon';
import moment from 'moment';
import http from '../http'; // Assuming you have configured HTTP client
import { faker } from '@faker-js/faker'; // Import faker-js/faker for generating random data

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BloodPressureGraph = ({ NRIC }) => {
    const batteryPercentage = faker.number.int({ min: 20, max: 80 }); //mock battery percentage
    // const [timeRange, setTimeRange] = useState('week'); // State variable for time range selection

    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Systolic',
                data: [],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Diastolic',
                data: [],
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
        ],
    });

    const [chartOptions, setChartOptions] = useState({
        responsive: true,
        scales: {
            y: {
                suggestedMin: 60,
                suggestedMax: 140,
            },
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Past 7 days Blood Pressure',
            },
            tooltips: {
                intersect: false,
            },
            annotation: {
                annotations: [],
            },
        },
    });

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             // Modify your data fetching logic based on the selected time range
    //             let startDate = moment().subtract(7, 'days'); // Default to last 7 days
    //             if (timeRange === 'month') {
    //                 startDate = moment().subtract(1, 'month'); // Change to last 1 month
    //             }

    //             // Fetch data using startDate
    //             const response = await http.get(`user/getBloodPressure/${NRIC}?startDate=${startDate}`);
    //             const bloodPressureData = response.data;

    //             // Other data processing logic remains unchanged
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };

    //     fetchData();
    // }, [NRIC, timeRange]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await http.get(`user/getBloodPressure/${NRIC}`);
                const bloodPressureData = response.data;

                console.log('Blood Pressure Data:', bloodPressureData);

                const labels = [];
                const systolicData = [];
                const diastolicData = [];

                for (let i = 6; i >= 0; i--) {
                    const date = moment().subtract(i, 'days').format('DD MMM');
                    labels.push(date);

                    // Use real data if available, otherwise generate mock data
                    const dataPoint = bloodPressureData.find((record) => moment(record.measureDate).format('DD MMM') === date);
                    if (dataPoint) {
                        systolicData.push(dataPoint.systolic);
                        diastolicData.push(dataPoint.diastolic);
                    } else {
                        const systolicValue = faker.number.int({ min: 100, max: 120 });
                        const diastolicValue = faker.number.int({ min: 70, max: 80 });
                        systolicData.push(systolicValue);
                        diastolicData.push(diastolicValue);
                    }
                }

                console.log('Labels:', labels);
                console.log('Systolic Data:', systolicData);
                console.log('Diastolic Data:', diastolicData);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Systolic',
                            data: systolicData,
                            borderColor: 'rgb(255, 99, 132)',
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        },
                        {
                            label: 'Diastolic',
                            data: diastolicData,
                            borderColor: 'rgb(54, 162, 235)',
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        },
                    ],
                });

                // Add annotation for threshold line
                const annotations = [
                    {
                        type: 'line',
                        mode: 'horizontal',
                        scaleID: 'y',
                        value: 120, // Threshold value for prehypertension
                        borderColor: 'rgba(255, 206, 86, 0.7)',
                        borderWidth: 2,
                        label: {
                            enabled: true,
                            content: 'Prehypertension',
                            position: 'center',
                        },
                    },
                ];

                console.log('Annotations:', annotations);

                setChartOptions({
                    ...chartOptions,
                    plugins: {
                        ...chartOptions.plugins,
                        annotation: {
                            ...chartOptions.plugins.annotation,
                            annotations,
                        },
                    },
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [NRIC]); // Dependency array with NRIC as a dependency for useEffect
    // Dependency array with NRIC as a dependency for useEffect

    const categorizeBloodPressure = (systolic, diastolic) => {
        let category = '';
        let color = '';
        // BP range https://www.healthhub.sg/a-z/diseases-and-conditions/understanding-blood-pressure-readings
        // low BP range https://www.healthhub.sg/a-z/diseases-and-conditions/postural-hypotension
        if (systolic >= 140 || diastolic >= 90) {
            category = 'High Blood Pressure (Hypertension)';
            color = 'rgba(224,102,102,255)'; // Red color
        } else if (systolic >= 120 || diastolic >= 80) {
            category = 'At Risk (Prehypertension)';
            color = 'rgba(224,102,102,255)'; // Yellow color
        } else if (systolic < 100 || diastolic < 60) {
            category = 'Low Blood Pressure (Hypotension)';
            color = 'rgba(255,229,153,255)'; // Slight yellow closer to green
        } else {
            category = 'Normal';
            color = 'rgba(147,196,125,255)'; // Green color
        }

        const range = `Systolic: ${systolic} mmHg \n Diastolic: ${diastolic} mmHg`; // Include newline (\n) for new line

        return { category: `${category} \n (${range})`, color };
    };


    // Calculate blood pressure category based on the last data point
    console.log('chartData.datasets:', chartData.datasets);
    const lastRecordSystolic = chartData.datasets[0].data[chartData.datasets[0].data.length - 1];
    const lastRecordDiastolic = chartData.datasets[1].data[chartData.datasets[1].data.length - 1];
    console.log('Last Record Systolic:', lastRecordSystolic);
    console.log('Last Record Diastolic:', lastRecordDiastolic);

    const lastSystolic = lastRecordSystolic || 0;
    const lastDiastolic = lastRecordDiastolic || 0;
    console.log("bp check", lastSystolic, lastDiastolic);
    const { category: bloodPressureCategory, color: categoryColor } = categorizeBloodPressure(lastSystolic, lastDiastolic);

    console.log('Blood Pressure Category:', bloodPressureCategory);
    console.log('Category Color:', categoryColor);

    return (
        <Paper>
            <Box p={3}>


                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Button component={Link} to={"/addBloodPressure"} variant="contained" fontSize="small" startIcon={<SyncIcon />}>
                            Sync
                        </Button>
                    </Grid>
                    <Grid item>
                        <BatteryIcon percentage={batteryPercentage} />
                    </Grid>
                </Grid>
                <Grid container justifyContent="center" alignItems="center">
                    <Grid item lg={9}>
                        {/* <Grid> */}
                        {/* Add a dropdown to select time range */}
                        {/* <FormControl variant="outlined" sx={{ m: 2 }}>
                                <InputLabel id="time-range-label">Time Range</InputLabel>
                                <Select
                                    labelId="time-range-label"
                                    id="time-range-select"
                                    value={timeRange}
                                    onChange={(e) => setTimeRange(e.target.value)}
                                    label="Time Range"
                                >
                                    <MenuItem value="week">Last 7 days</MenuItem>
                                    <MenuItem value="month">Last 1 month</MenuItem>
                                </Select>
                            </FormControl> */}
                        {/* </Grid> */}
                        <Grid>
                            <Line data={chartData} options={chartOptions} />
                        </Grid>
                    </Grid>
                    <Grid item lg={3} justifyContent="center" alignItems="center">
                        <Typography variant="subtitle1" align="center">
                            Blood Pressure Rating
                        </Typography>
                        <Grid item style={{ color: categoryColor, whiteSpace: 'pre-line' }} align="center">
                            {bloodPressureCategory}
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Paper>

    );
};

export default BloodPressureGraph;
