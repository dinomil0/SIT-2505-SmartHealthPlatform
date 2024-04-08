import React, { useContext, useState, useEffect, useMemo } from "react";
import { Box, Typography, TextField, Button, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, MenuItem } from "@mui/material";

import { useFormik } from "formik";
import * as yup from "yup";
import http from "../http";
import UserContext from "../contexts/UserContext";

function AddReminder() {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const { user } = useContext(UserContext);
  const currentUser = useMemo(() => user ?? storedUser, []);

  const [reminders, setReminders] = useState([]); // State to store list of reminders

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
  }, []); 

  // Function to fetch all reminders
  const fetchreminders = () => {
    http.get("/reminder")
      .then((res) => {
        setReminders(res.data); // Update reminders state with fetched data
      })
      .catch((error) => {
        console.error("Error fetching reminders:", error);
      });
  };

  // UseEffect to fetch reminders on component mount
  useEffect(() => {
    fetchreminders();
  }, []);

  const formik = useFormik({
    initialValues: {
      userId: currentUser.id,
      deviceId: "",
      title: "",
      description: "",
      status: "",
      notifications: "",
      reminderTime: "",
    },
    validationSchema: yup.object({
      deviceId: yup.string().required("Device ID is required"),
      title: yup.string().required("Title is required"),
      description: yup.string().required("Description is required"),
      status: yup.string().required("Status is required"),
      notifications: yup.string().required("Notification settings are required"),
      reminderTime: yup.string().required("Reminder time is required"),
    }),
    onSubmit: (data) => {
      const reminderData = {
        ...data,
        userId: user.id,
        deviceId: parseInt(data.deviceId), // Ensure deviceId is parsed to an integer
      };

      http.post("/reminder", reminderData)
        .then((res) => {
          console.log(res.data);
          // Reset form values
          formik.resetForm();
        })
        .catch((error) => {
          console.error("Error adding reminder:", error);
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
        Add Reminder
      </Typography>
      <Box component="form" sx={{ maxWidth: "500px" }} onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Device ID"
          name="deviceId"
          select
          value={formik.values.deviceId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.deviceId && Boolean(formik.errors.deviceId)}
          helperText={formik.touched.deviceId && formik.errors.deviceId}
        >
          {devices.map((device) => (
            <MenuItem key={device.id} value={device.id}>
              {device.name} ({device.type})
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Title"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
        />
        <TextField
          fullWidth
          multiline
          rows={4}
          margin="dense"
          autoComplete="off"
          label="Description"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.description && Boolean(formik.errors.description)}
          helperText={formik.touched.description && formik.errors.description}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Status"
          name="status"
          value={formik.values.status}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.status && Boolean(formik.errors.status)}
          helperText={formik.touched.status && formik.errors.status}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Notifications"
          name="notifications"
          value={formik.values.notifications}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.notifications && Boolean(formik.errors.notifications)}
          helperText={formik.touched.notifications && formik.errors.notifications}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Reminder Time"
          name="reminderTime"
          type="datetime-local"
          value={formik.values.reminderTime}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.reminderTime && Boolean(formik.errors.reminderTime)}
          helperText={formik.touched.reminderTime && formik.errors.reminderTime}
          InputLabelProps={{ shrink: true }}
        />
        <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
          Add Reminder
        </Button>
      </Box>

      <Box mt={4} sx={{ maxWidth: "800px" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          List of Reminders
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Notifications</TableCell>
                <TableCell>Reminder Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reminders.map((reminder) => (
                <TableRow key={reminder.id}>
                  <TableCell>{reminder.title}</TableCell>
                  <TableCell>{reminder.description}</TableCell>
                  <TableCell>{reminder.status}</TableCell>
                  <TableCell>{reminder.notifications}</TableCell>
                  <TableCell>{reminder.reminderTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default AddReminder;
