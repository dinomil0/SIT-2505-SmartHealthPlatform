import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import moment from 'moment'; // Import moment for date formatting
import http from '../http'; // Assuming you have configured HTTP client
import { da, faker } from '@faker-js/faker'; // Remove if not needed

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const chartOptions =
{
    responsive: true,
    plugins:
    {
        legend:
        {
            position: 'bottom',
        },
        title:
        {
            display: true,
            text: 'Blood Pressure by day',
        },
        tooltips:
        {
            callbacks:
            {
                title: function (tooltipItem, data) {
                    const index = tooltipItem[0].index;
                    const date = moment(data.labels[index], 'YYYY-MM-DD').format('DD MMM');
                    return date;
                },
                label: function (tooltipItem, data) {
                    const dataset = data.datasets[tooltipItem.datasetIndex];
                    const label = dataset.label;
                    const value = dataset.data[tooltipItem.index];
                    const sign = value >= 0 ? '+' : '';

                    if (label === 'Systolic' || label === 'Diastolic') {
                        return `${label}: ${sign}${value.toFixed(2)}`;
                    }
                    return '';
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
    plugins:
    {
        fillRange:
        {
            beforeDraw(chart) {
                const ctx = chart.ctx;
                const xAxis = chart.scales['x'];
                const yAxis = chart.scales['y'];
                const startRange = moment('2024-03-22', 'YYYY-MM-DD');
                const endRange = moment('2024-03-25', 'YYYY-MM-DD');

                const startX = xAxis.getPixelForValue(startRange);
                const endX = xAxis.getPixelForValue(endRange);
                const startY = yAxis.top;
                const endY = yAxis.bottom;

                ctx.save();
                ctx.fillStyle = 'rgba(255, 99, 132, 0.2)';
                ctx.fillRect(startX, startY, endX - startX, endY - startY);
                ctx.restore();
            }
        }
    }
};

const LineGraph = ({ NRIC }) => {
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



    useEffect(() => {
        const fetchBloodPressureData = async () => {
            try {
                const response = await http.get(`user/getBloodPressure/${NRIC}`);
                const bloodPressureData = response.data;

                const labels = bloodPressureData.map((bp) => moment(bp.measureDate).format('DD MMM YYYY'));
                const systolicData = bloodPressureData.map((bp) => bp.systolic);
                const diastolicData = bloodPressureData.map((bp) => bp.diastolic);

                // Update chart data state with fetched data
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
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchBloodPressureData();
    }, [NRIC]); // Empty dependency array to run effect only once on component mount

    return (
        <div>
        <Line data={chartData} options={chartOptions} />
        </div>
        
    );
};

export default LineGraph;
