import React, { useState, useEffect } from 'react';
import { Pie, Line, Bar } from 'react-chartjs-2';
import http from '../http'; // Assuming you have configured HTTP client

const Report = ({ NRIC }) => {
    const [chartType, setChartType] = useState('line'); // Default chart type
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await http.get(`/user/getWeight/${NRIC}`); // Adjust endpoint based on your API
                const data = response.data;

                // Format data based on the selected chart type
                const formattedData = formatData(data, chartType);
                setChartData(formattedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [NRIC, chartType]); // Fetch data when NRIC or chartType changes

    const formatData = (data, type) => {
        // Format data based on the selected chart type
        switch (type) {
            case 'line':
                return {
                    labels: data.labels,
                    datasets: [
                        {
                            label: 'Value',
                            data: data.values,
                            borderColor: 'rgb(75, 192, 192)',
                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        },
                    ],
                };
            case 'pie':
                return {
                    labels: data.labels,
                    datasets: [
                        {
                            label: 'Value',
                            data: data.values,
                            backgroundColor: [
                                'rgb(255, 99, 132)',
                                'rgb(54, 162, 235)',
                                'rgb(255, 205, 86)',
                                'rgb(75, 192, 192)',
                                'rgb(153, 102, 255)',
                            ],
                            hoverOffset: 4,
                        },
                    ],
                };
            case 'bar':
                return {
                    labels: data.labels,
                    datasets: [
                        {
                            label: 'Value',
                            data: data.values,
                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                            borderColor: 'rgb(75, 192, 192)',
                            borderWidth: 1,
                        },
                    ],
                };
            default:
                return null;
        }
    };

    const handleChangeChartType = (type) => {
        setChartType(type);
    };

    const renderChart = () => {
        if (!chartData) return null;

        switch (chartType) {
            case 'line':
                return <Line data={chartData} />;
            case 'pie':
                return <Pie data={chartData} />;
            case 'bar':
                return <Bar data={chartData} />;
            default:
                return null;
        }
    };

    return (
        <div>
            <h1>Report Page</h1>
            <div>
                <button onClick={() => handleChangeChartType('line')}>Line Chart</button>
                <button onClick={() => handleChangeChartType('pie')}>Pie Chart</button>
                <button onClick={() => handleChangeChartType('bar')}>Bar Chart</button>
            </div>
            <div style={{ marginTop: '20px' }}>{renderChart()}</div>
        </div>
    );
};

export default Report;
