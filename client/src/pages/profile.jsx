import React, { useEffect, useState, useContext } from 'react'
import { Link, useNavigate } from "react-router-dom";
import Divider from "@mui/material/Divider";
import EditIcon from '@mui/icons-material/Edit';
import { Box, Typography, Grid, Card, Button, Avatar, Stack, CircularProgress, Paper, } from '@mui/material';
import TextField from '@mui/material/TextField';
import http from "../http";
import UserContext from "../contexts/UserContext";
import { useFormik } from 'formik';
import * as yup from 'yup';

function Profile() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    console.log(user)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const authRes = await http.get("/user/auth");
                setUser(authRes.data.user);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [setUser]);

    const formik = useFormik({
        initialValues: user,
        enableReinitialize: true,
        validationSchema: yup.object({
            name: yup.string().trim()
                .min(3, 'Name must be at least 3 characters')
                .max(100, 'Name must be at most 50 characters')
                .required("Name is required")
                .matches(
                    /^[a-zA-Z '-,.]+$/,
                    "Name only allow letters, spaces and characters: ' - , ."
                ),
            email: yup.string().trim()
                .email("Enter a valid email")
                .max(50, "Email must be at most 50 characters")
                .required("Email is required"),
            phone: yup.string().trim()
                .min(8, 'Phone must be at least 8 characters')
                .max(8, 'Phone must be at most 8 characters')
                .required("Phone is required"),
            address: yup.string().trim().required("Address is required")
        }),
        onSubmit: async (data) => {
            console.log("submited")
            data.name = data.name.trim();
            data.email = data.email.trim();
            data.phone = data.phone.trim();
            data.address = data.address.trim();
            http.put(`user/updateProfile/${user.NRIC}`, data)
                .then((res) => {
                    console.log(res.data);
                });
        }
    });

    if (loading) {
        return (
            <Box
                sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", }} >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Paper mt={5} mb={3} sx={{ padding: 2, marginTop: 2 }} >
            <Grid container justifyContent="space-between" mt={1} alignItems="center">
                <Typography variant="h6" fontWeight="medium">
                    Update Profile
                </Typography>
                <Button component={Link} to={"/changepassword"} variant="contained" size="small" startIcon={<EditIcon />}>
                    Change Password
                </Button>
            </Grid>

            <Divider mt={3} mb={3} sx={{ marginY: 2 }} />

            <Grid container mt={5} direction="column" alignItems="center" onSubmit={formik.handleSubmit}>
                <Grid item>
                    <TextField
                        id="NRIC"
                        label="NRIC"
                        margin="normal"
                        autoComplete="off"
                        value={formik.values.NRIC}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.NRIC && Boolean(formik.errors.NRIC)}
                        helperText={formik.touched.NRIC && formik.errors.NRIC}
                        sx={{ width: 300 }} // Set the width here
                        disabled // Add the disabled prop here
                    />
                </Grid>
                <Grid item>
                    <TextField
                        id="name"
                        label="Name"
                        margin="normal"
                        autoComplete="off"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                        sx={{ width: 300 }} // Set the width here
                    />
                </Grid>
                <Grid item>
                    <TextField
                        id="email"
                        label="Email"
                        margin="normal"
                        autoComplete="off"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        sx={{ width: 300 }} // Set the width here
                    />
                </Grid>
                <Grid item>
                    <TextField
                        id="phone"
                        label="Mobile Number"
                        margin="normal"
                        autoComplete="off"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.phone && Boolean(formik.errors.phone)}
                        helperText={formik.touched.phone && formik.errors.phone}
                        sx={{ width: 300 }} // Set the width here
                    />
                </Grid>
                <Grid item>
                    <TextField
                        id="dob"
                        label="Date of Birth"
                        type="date" // Set the type to date for date input
                        margin="normal"
                        autoComplete="off"
                        value={formik.values.dob}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.dob && Boolean(formik.errors.dob)}
                        helperText={formik.touched.dob && formik.errors.dob}
                        sx={{ width: 300 }} // Set the width here
                        disabled // Add the disabled prop here
                    />
                </Grid>
                <Grid item sx={{ marginTop: 2 }}>
                    <TextField
                        id="address"
                        label="Address"
                        multiline
                        minRows={2}
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.address && Boolean(formik.errors.address)}
                        helperText={formik.touched.address && formik.errors.address}
                        sx={{ width: 300 }} // Set the width here
                    />
                </Grid>
                <Button variant="contained" type="submit" disabled={!formik.dirty} sx={{ marginTop: 2 }}>
                    Save
                </Button>
            </Grid>
        </Paper>
    );
}

export default Profile;
