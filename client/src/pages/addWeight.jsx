import React, { useContext, useState, useEffect } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../http";
import UserContext from "../contexts/UserContext";

function AddWeight() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [latestHeight, setLatestHeight] = useState(""); // State to store latest height

    const today = new Date().toISOString().split("T")[0]; // Get today's date in yyyy-mm-dd format

    const calculateBMI = (weight, height) => {
        const heightMeters = height / 100; // Convert height from cm to meters
        const bmi = weight / (heightMeters * heightMeters);
        return isNaN(bmi) ? 0 : bmi.toFixed(1); // Display 0 if BMI is NaN, otherwise round to 1 decimal place
    };

    useEffect(() => {
        const fetchLatestHeight = async () => {
            try {
                const response = await http.get(`user/getUserHeight/${user.NRIC}`);

                const { heightValue } = response.data; // Assuming heightValue is directly in response.data
                console.log("Latest height from API:", heightValue);
                setLatestHeight(heightValue || ""); // Set the latest height in state if available

                // Update formik initialValues with latestHeight
                formik.setValues({
                    ...formik.values,
                    heightValue: heightValue || "",
                });
            } catch (error) {
                console.error('Error fetching latest height:', error);
            }
        };

        fetchLatestHeight();
    }, [user.NRIC]); // Fetch latest height when user.NRIC changes

    console.log("Latest height state:", latestHeight); // Log the latestHeight state

    const formik = useFormik({
        initialValues: {
            NRIC: user.NRIC,
            weightValue: "",
            heightValue: "", // Initialize height with empty string
            BMI: "", // BMI will be calculated dynamically
            measureDate: today, // Set today's date as the default date
        },
        validationSchema: yup.object({
            weightValue: yup.number().required("Weight is required"),
            heightValue: yup.number().required("Height is required"), // Height is always required
            measureDate: yup.date().required("Date is required"), // Add validation for date field
        }),
        onSubmit: (data) => {
            const BMI = calculateBMI(data.weightValue, data.heightValue); // Calculate BMI before submitting data
            data.BMI = BMI; // Set the calculated BMI in the form data

            http.post("/user/addWeight", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/Dashboard"); // Redirect to dashboard after successful addition
                })
                .catch(function (err) {
                    console.log(err.response);
                });
        },
    });

    return (
        <Box
            sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Typography variant="h5" sx={{ my: 2 }}>
                Add Weight
            </Typography>
            <Box component="form" sx={{ maxWidth: "500px" }} onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    margin="dense"
                    autoComplete="off"
                    label="Weight (kg)"
                    name="weightValue"
                    type="number"
                    value={formik.values.weightValue}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.weightValue && Boolean(formik.errors.weightValue)}
                    helperText={formik.touched.weightValue && formik.errors.weightValue}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    autoComplete="off"
                    label="Height (cm)"
                    name="heightValue"
                    type="number"
                    value={formik.values.heightValue}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.heightValue && Boolean(formik.errors.heightValue)}
                    helperText={formik.touched.heightValue && formik.errors.heightValue}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    autoComplete="off"
                    label="BMI"
                    name="BMI"
                    type="text"
                    value={calculateBMI(formik.values.weightValue, formik.values.heightValue)} // Calculate BMI dynamically
                    InputProps={{ readOnly: true }} // Make the BMI field read-only
                />
                <TextField
                    fullWidth
                    margin="dense"
                    autoComplete="off"
                    label="Date"
                    name="measureDate"
                    type="date"
                    value={formik.values.measureDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.measureDate && Boolean(formik.errors.measureDate)}
                    helperText={formik.touched.measureDate && formik.errors.measureDate}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ max: today }} // Set the max attribute to today's date
                />
                <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
                    Add Weight
                </Button>
            </Box>
        </Box>
    );
}

export default AddWeight;
