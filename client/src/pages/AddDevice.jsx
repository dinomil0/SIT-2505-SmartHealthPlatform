import React, { useContext, useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Table, TableContainer, TableHead, TableBody, TableRow, TableCell } from "@mui/material";

import { useFormik } from "formik";
import * as yup from "yup";
import http from "../http";
import UserContext from "../contexts/UserContext";

function AddDevice() {
  const { user } = useContext(UserContext);
  const [devices, setDevices] = useState([]); // State to store list of devices

  // Function to fetch all devices
  const fetchDevices = () => {
    http.get("/device")
      .then((res) => {
        setDevices(res.data); // Update devices state with fetched data
      })
      .catch((error) => {
        console.error("Error fetching devices:", error);
      });
  };

  useEffect(() => {
    // Fetch devices when component mounts
    fetchDevices();
  }, []); // Run this effect only once on component mount

  const formik = useFormik({
    initialValues: {
      name: "",
      type: "",
    },
    validationSchema: yup.object({
      name: yup.string().required("Device name is required"),
      type: yup.string().required("Device type is required"),
    }),
    onSubmit: (data) => {
      const deviceData = {
        ...data,
        userId: user.id, // Set the userId to the current user's id
      };

      http.post("/device", deviceData)
        .then((res) => {
          console.log(res.data);
          // Fetch devices again to update the list after adding a new device
          fetchDevices();
          // Reset form values
          formik.resetForm();
        })
        .catch((error) => {
          console.error("Error adding device:", error);
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
        Add Device
      </Typography>
      <Box component="form" sx={{ maxWidth: "500px" }} onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Device Name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Device Type"
          name="type"
          value={formik.values.type}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.type && Boolean(formik.errors.type)}
          helperText={formik.touched.type && formik.errors.type}
        />
        <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
          Add Device
        </Button>
      </Box>

      {/* Display list of devices */}
      <Box mt={4} sx={{ maxWidth: "800px" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          List of Devices
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {devices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell>{device.name}</TableCell>
                  <TableCell>{device.type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default AddDevice;
