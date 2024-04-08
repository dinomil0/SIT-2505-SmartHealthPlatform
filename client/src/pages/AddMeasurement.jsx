import React, { useContext, useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Table, TableContainer, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../http";
import UserContext from "../contexts/UserContext";

function AddMeasurement() {
  const { user } = useContext(UserContext);
  const [measurements, setMeasurements] = useState([]); // State to store list of measurements

  // Function to fetch all measurements
  const fetchMeasurements = () => {
    http.get("/measurement")
      .then((res) => {
        setMeasurements(res.data); // Update measurements state with fetched data
      })
      .catch((error) => {
        console.error("Error fetching measurements:", error);
      });
  };

  // UseEffect to fetch measurements on component mount
  useEffect(() => {
    fetchMeasurements();
  }, []);

  const formik = useFormik({
    initialValues: {
      attributeId: "",
      measurementValue: "",
      dateTime: "",
      userDeviceId: "",
    },
    validationSchema: yup.object({
      attributeId: yup.string().required("Attribute ID is required"),
      measurementValue: yup.string().required("Measurement value is required"),
      dateTime: yup.string().required("Date and time of measurement is required"),
      userDeviceId: yup.string().required("User Device ID is required"),
    }),
    onSubmit: (data) => {
      const measurementData = {
        ...data,
        userDeviceId: parseInt(data.userDeviceId), // Ensure userDeviceId is parsed to an integer
      };

      http.post("/measurement", measurementData)
        .then((res) => {
          console.log(res.data);
          // Fetch measurements again to update the list after adding a new measurement
          fetchMeasurements();
          // Reset form values
          formik.resetForm();
        })
        .catch((error) => {
          console.error("Error adding measurement:", error);
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
        Add Measurement
      </Typography>
      <Box component="form" sx={{ maxWidth: "500px" }} onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Attribute ID"
          name="attributeId"
          value={formik.values.attributeId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.attributeId && Boolean(formik.errors.attributeId)}
          helperText={formik.touched.attributeId && formik.errors.attributeId}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Measurement Value"
          name="measurementValue"
          value={formik.values.measurementValue}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.measurementValue && Boolean(formik.errors.measurementValue)}
          helperText={formik.touched.measurementValue && formik.errors.measurementValue}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Date and Time of Measurement"
          name="dateTime"
          type="datetime-local"
          value={formik.values.dateTime}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.dateTime && Boolean(formik.errors.dateTime)}
          helperText={formik.touched.dateTime && formik.errors.dateTime}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="User Device ID"
          name="userDeviceId"
          value={formik.values.userDeviceId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.userDeviceId && Boolean(formik.errors.userDeviceId)}
          helperText={formik.touched.userDeviceId && formik.errors.userDeviceId}
        >
          
        </TextField>
        <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
          Add Measurement
        </Button>
      </Box>

      <Box mt={4} sx={{ maxWidth: "800px" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          List of Measurements
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Attribute ID</TableCell>
                <TableCell>Measurement Value</TableCell>
                <TableCell>Date and Time</TableCell>
                <TableCell>User Device ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {measurements.map((measurement) => (
                <TableRow key={measurement.id}>
                  <TableCell>{measurement.attributeId}</TableCell>
                  <TableCell>{measurement.measurementValue}</TableCell>
                  <TableCell>{measurement.dateTime}</TableCell>
                  <TableCell>{measurement.userDeviceId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default AddMeasurement;
