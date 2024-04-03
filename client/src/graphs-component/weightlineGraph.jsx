import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import moment from 'moment';
import http from '../http'; // Assuming you have configured HTTP client
import { faker } from '@faker-js/faker'; // Import faker-js/faker for generating random data

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineGraph = ({ NRIC }) => {
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
                position: 'right',
            },
            title: {
                display: true,
                text: 'Weight for past 20 days',
            },
            tooltips: {
                callbacks: {
                    title: function (tooltipItem, data) {
                        const index = tooltipItem[0].index;
                        const date = moment(data.labels[index], 'YYYY-MM-DD').format('DD MMM');
                        return date;
                    },
                    label: function (tooltipItem, data) {
                        const dataset = data.datasets[tooltipItem.datasetIndex];
                        const label = dataset.label;
                        const value = dataset.data[tooltipItem.index];

                        return `${label}: ${value}`;
                    },
                },
                backgroundColor: "#FAFAFA",
                borderColor: "lightgreen",
                borderWidth: 1,
                titleFontColor: "black",
                titleFontStyle: "bold",
                displayColors: false,
                bodyFontColor: "black"
            }
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await http.get(`user/getWeight/${NRIC}`);
                const weightData = response.data;
        
                console.log('Weight Data:', weightData); // Log the weight data for debugging
        
                const labels = [];
                const values = [];
        
                for (let i = 20; i >= 0; i--) {
                    const date = moment().subtract(i, 'days').format('DD MMM');
                    labels.push(date);
        
                    // Use real data if available, otherwise generate mock data
                    const dataPoint = weightData.find((record) => moment(record.measureDate).format('DD MMM') === date);
                    const weightValue = dataPoint ? dataPoint.weightValue : faker.number.int({ min: 80, max: 89 });
                    values.push(weightValue);
                }
        
                console.log('Labels:', labels); // Log the labels for debugging
                console.log('Values:', values); // Log the values for debugging
        
                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Weight',
                            data: values,
                            borderColor: 'rgb(75, 192, 192)',
                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        },
                    ],
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        

        fetchData();
    }, [NRIC]);

    return (
        <div>
            <Line data={chartData} options={chartOptions} />
        </div>
    );
};

export default LineGraph;
