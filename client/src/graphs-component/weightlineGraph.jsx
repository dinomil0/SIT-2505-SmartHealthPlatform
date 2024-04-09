import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Grid, Button, Typography, Box, Paper, Dialog, DialogTitle, DialogContent, Checkbox, Switch, Divider } from '@mui/material';
import Tooltips from '@mui/material/Tooltip';
import { Link } from "react-router-dom";
import SyncIcon from '@mui/icons-material/Sync';
import BatteryIcon from '../graphs-component/batteryIcon';
import moment from 'moment';
import http from '../http'; // Assuming you have configured HTTP client
import { faker } from '@faker-js/faker'; // Import faker-js/faker for generating random data
import bmiImg from "../assets/bmi.png";
import InfoIcon from '@mui/icons-material/Info';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SettingsIcon from '@mui/icons-material/Settings';
import { saveAs } from 'file-saver';
import reportPDF from '../assets/reportPDF.pdf';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WeightGraph = ({ NRIC }) => {
    const batteryPercentage = faker.number.int({ min: 20, max: 80 }); //mock battery percentage
    const [height, setHeight] = useState(null); // State to store height
    const [weight, setWeight] = useState(null); // State to store Weight
    const [previousWeight, setPreviousWeight] = useState(null); // State for mock muscle mass data
    const [weightDifference, setWeightDifference] = useState(0);//state to store weight difference
    const [muscleMass, setMuscleMass] = useState(null); // State for mock muscle mass data
    const [bodyFatPercentage, setBodyFatPercentage] = useState(null); // State for mock body fat percentage data
    const [previousMuscleMass, setPreviousMuscleMass] = useState(null); // State for mock muscle mass data
    const [previousBodyFatPercentage, setPreviousBodyFatPercentage] = useState(null); // State for mock body fat percentage data
    const [muscleMassDifference, setMuscleMassDifference] = useState(0);
    const [bodyFatDifference, setBodyFatDifference] = useState(0);

    const [showWeight, setShowWeight] = useState(true);
    const [showMuscleMass, setShowMuscleMass] = useState(true);
    const [showBodyFat, setShowBodyFat] = useState(true);

    const today = new Date().toISOString().split("T")[0];
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleDownloadFile = () => {
        saveAs(reportPDF, 'BMIREPORT' + today + '.pdf'); // Download the PDF file with the specified name
    };

    const [dashboardSettings, setDashboardSettings] = useState({
        weightChange: true,
        muscleMassChange: true,
        bodyFatChange: true,
    });

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
        // Fetch dashboard settings from the API when the component mounts
        const fetchData = async () => {
            try {
                console.log("find setting")
                const response = await http.get(`user/getDashboardSetting/${NRIC}`);

                if (response.data.dashboardSetting) {
                    console.log(response.data.dashboardSetting)
                    setDashboardSettings(response.data.dashboardSetting);
                } else {
                    console.log('Dashboard settings not found. Setting all to true.');
                    setDashboardSettings({
                        weightChange: true,
                        muscleMassChange: true,
                        bodyFatChange: true,
                    });
                }
            } catch (error) {
                console.error('Error fetching dashboard settings:', error);
            }
        };

        fetchData();
    }, []);

    const handleSwitchChange = async (settingName, value) => {
        try {
            console.log('Switch changed:', { [settingName]: value });

            // Update the setting on the server
            const response = await http.put(`user/updateDashboardSetting/${NRIC}`, { [settingName]: value });
            console.log('Server response:', response);

            // Update the local state with the new setting
            console.log('Previous dashboard settings:', dashboardSettings);
            setDashboardSettings({ ...dashboardSettings, [settingName]: value });
            console.log('Updated dashboard settings:', dashboardSettings);
        } catch (error) {
            console.error('Error updating dashboard setting:', error);
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dataresponse] = await Promise.all([
                    http.get(`user/getWeight/${NRIC}`),
                ]);

                const weightData = dataresponse.data;
                const latestHeight = weightData[0]?.heightValue || null; // Assuming the height is included in weight data
                setHeight(latestHeight)

                const labels = [];
                const weights = [];

                for (let i = 6; i >= 0; i--) {
                    const date = moment().subtract(i, 'days').format('DD MMM');
                    labels.push(date);

                    const dataPoint = weightData.find((record) => moment(record.measureDate).format('DD MMM') === date);
                    const weightValue = dataPoint ? dataPoint.weightValue : faker.number.int({ min: 80, max: 89 });
                    weights.push(weightValue);
                }
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
                // Calculate weight difference
                setPreviousWeight(weights[weights.length - 2]);
                setWeight(weights[weights.length - 1]);
                // const difference = lastWeightValue ? currentWeight - lastWeightValue : 0;
                // setWeightDifference(difference);


                //set muscle mass and body fat with mock data
                setMuscleMass(faker.number.int({ min: 40, max: 60 })); // Mock muscle mass between 40-60 kg
                setBodyFatPercentage(faker.number.float({ min: 10, max: 30, multipleOf: 1 })); // Mock body fat percentage between 10-30%

                setPreviousMuscleMass(faker.number.int({ min: 40, max: 60 })); // Mock muscle mass between 40-60 kg
                setPreviousBodyFatPercentage(faker.number.float({ min: 10, max: 30, multipleOf: 1 })); // Mock body fat percentage between 10-30%

                // Calculate muscle mass difference
                const muscleMassDiff = muscleMass - previousMuscleMass
                setMuscleMassDifference(muscleMassDiff);


                // Calculate body fat percentage difference
                const bodyFatDiff = bodyFatPercentage - previousBodyFatPercentage;
                setBodyFatDifference(bodyFatDiff);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [NRIC]);


    useEffect(() => {
        //calculate weight diff
        const difference = weight - previousWeight;
        setWeightDifference(difference);


        // Calculate muscle mass difference based on mock data
        const muscleMassDiff = muscleMass - previousMuscleMass;
        setMuscleMassDifference(muscleMassDiff);

        // Calculate body fat percentage difference based on mock data
        const bodyFatDiff = bodyFatPercentage - previousBodyFatPercentage;
        setBodyFatDifference(bodyFatDiff);


    }, [weight, previousWeight, muscleMass, previousMuscleMass, bodyFatPercentage, previousBodyFatPercentage]);


    const categorizeBMI = (weight, height) => {
        const currentHeight = height; // Assuming a default height for BMI calculation (in cm)
        const bmi = (weight / ((currentHeight / 100) ** 2)).toFixed(1); // Calculate BMI and round to 1 decimal place
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
            <Grid container spacing={2} alignItems="center" justifyContent="space-between" mb={2} mt={3}>
                {dashboardSettings.weightChange && showWeight && (
                    <Grid item xs={12} sm={showMuscleMass && showBodyFat ? 4 : showMuscleMass || showBodyFat ? 6 : 12}>
                        <Paper>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                                <Typography variant="subtitle2" align="center" style={{ color: '#a2a1a1' }}>
                                    Weight
                                </Typography>
                                <Typography variant="subtitle1" align="center">
                                    {weight} KG
                                </Typography>
                                <Typography style={{ color: weightDifference === 0 ? '#a2a1a1' : weightDifference < 0 ? 'green' : 'red' }} variant="subtitle5" align="center">
                                    {weightDifference !== 0 && (
                                        <span>
                                            {weightDifference > 0 ? <ArrowDropUpIcon style={{ fontSize: 16, verticalAlign: 'middle' }} /> : <ArrowDropDownIcon style={{ fontSize: 16, verticalAlign: 'middle' }} />}
                                            {Math.abs(weightDifference)} KG {/* Display the absolute value of the weight difference */}
                                        </span>
                                    )}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                )}
                {dashboardSettings.muscleMassChange && showMuscleMass && (
                    <Grid item xs={12} sm={showWeight && showBodyFat ? 4 : showWeight || showBodyFat ? 6 : 12}>
                        <Paper>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                                <Typography variant="subtitle2" align="center" style={{ color: '#a2a1a1' }}>
                                    Muscle Mass
                                </Typography>
                                <Typography variant="subtitle1" align="center">
                                    {muscleMass} KG
                                </Typography>
                                <Typography style={{ color: muscleMassDifference === 0 ? '#a2a1a1' : muscleMassDifference > 0 ? 'green' : 'red' }} variant="subtitle5" align="center">
                                    {muscleMassDifference !== 0 && (
                                        <span>
                                            {muscleMassDifference > 0 ? <ArrowDropUpIcon style={{ fontSize: 16, verticalAlign: 'middle' }} /> : <ArrowDropDownIcon style={{ fontSize: 16, verticalAlign: 'middle' }} />}
                                            {Math.abs(muscleMassDifference)} KG
                                        </span>
                                    )}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                )}
                {dashboardSettings.bodyFatChange && showBodyFat && (
                    <Grid item xs={12} sm={showWeight && showMuscleMass ? 4 : showWeight || showMuscleMass ? 6 : 12}>
                        <Paper>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                                <Typography variant="subtitle2" align="center" style={{ color: '#a2a1a1' }}>
                                    Body Fat (%)
                                </Typography>
                                <Typography variant="subtitle1" align="center">
                                    {bodyFatPercentage} %
                                </Typography>
                                <Typography style={{ color: bodyFatDifference === 0 ? '#a2a1a1' : bodyFatDifference > 0 ? 'red' : 'green' }} variant="subtitle5" align="center">
                                    {bodyFatDifference !== 0 && (
                                        <span>
                                            {bodyFatDifference > 0 ? <ArrowDropUpIcon style={{ fontSize: 16, verticalAlign: 'middle' }} />
                                                : <ArrowDropDownIcon style={{ fontSize: 16, verticalAlign: 'middle' }} />}
                                            {Math.abs(bodyFatDifference)} %
                                        </span>
                                    )}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                )}
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
                    <Grid container justifyContent="center" alignItems="center" mb={2}>
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
                    <Divider />

                    <Grid container justifyContent="space-between" mt={1}>
                        <Grid item>
                            <Button style={{ color: 'grey' }} onClick={handleOpenDialog}>
                                <SettingsIcon /> Customize BMI Graph
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button style={{ color: 'blue' }} onClick={handleDownloadFile}>
                                <FileDownloadIcon /> Download report
                            </Button>
                        </Grid>
                    </Grid>


                </Box>
            </Paper>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Customize Dashboard</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Grid>
                                <Switch
                                    checked={dashboardSettings.weightChange}
                                    onChange={(e) => { setShowWeight(e.target.checked); handleSwitchChange('weightChange', e.target.checked) }}
                                    color="primary"
                                    inputProps={{ 'aria-label': 'Show Weight' }}
                                /> {dashboardSettings.weightChange ? 'Show' : 'Hide'} Weight
                            </Grid>

                        </Grid>
                        <Grid item xs={12}>
                            <Switch
                                checked={dashboardSettings.muscleMassChange}
                                onChange={(e) => { setShowMuscleMass(e.target.checked); handleSwitchChange('muscleMassChange', e.target.checked) }}
                                color="primary"
                                inputProps={{ 'aria-label': 'Show Muscle Mass' }}
                            /> {dashboardSettings.muscleMassChange ? 'Show' : 'Hide'} Muscle Mass
                        </Grid>
                        <Grid item xs={12}>
                            <Switch
                                checked={dashboardSettings.bodyFatChange}
                                onChange={(e) => { setShowBodyFat(e.target.checked); handleSwitchChange('bodyFatChange', e.target.checked) }}
                                color="primary"
                                inputProps={{ 'aria-label': 'Show Body Fat' }}
                            /> {dashboardSettings.bodyFatChange ? 'Show' : 'Hide'} Body Fat
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default WeightGraph;
