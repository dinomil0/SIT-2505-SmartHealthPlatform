import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import moment from 'moment';
import http from '../http'; // Assuming you have configured HTTP client
import { faker } from '@faker-js/faker'; // Import faker-js/faker for generating random data

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BloodPressureGraph = ({ NRIC }) => {
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
                position: 'right',
            },
            title: {
                display: true,
                text: 'Blood Pressure by day',
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
                const response = await http.get(`user/getBloodPressure/${NRIC}`);
                const bloodPressureData = response.data;

                console.log('Blood Pressure Data:', bloodPressureData);

                const labels = [];
                const systolicData = [];
                const diastolicData = [];

                for (let i = 20; i >= 0; i--) {
                    const date = moment().subtract(i, 'days').format('DD MMM');
                    labels.push(date);

                    // Check if real data exists for the date
                    const dataPoint = bloodPressureData.find((record) => moment(record.measureDate).format('DD MMM') === date);
                    if (dataPoint) {
                        systolicData.push(dataPoint.systolic);
                        diastolicData.push(dataPoint.diastolic);
                    } else {
                        // Generate random data within specified ranges for mock data
                        const systolicValue = faker.datatype.number({ min: 100, max: 120 });
                        const diastolicValue = faker.datatype.number({ min: 70, max: 80 });
                        systolicData.push(systolicValue);
                        diastolicData.push(diastolicValue);
                    }
                }

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

    return (
        <div>
            <Line data={chartData} options={chartOptions} />
        </div>
    );
};

export default BloodPressureGraph;
