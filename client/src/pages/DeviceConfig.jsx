import React, { useContext } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import UserContext from '../contexts/UserContext';

const DeviceConfig = () => {
  const { user } = useContext(UserContext);

  // Form validation schema using yup
  const validationSchema = yup.object().shape({
    deviceId: yup.string().required('Device ID is required'),
    configuration: yup.string().required('Device configuration is required'),
  });

  // Formik hook for handling form state and submission
  const formik = useFormik({
    initialValues: {
      deviceId: '',
      configuration: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const { deviceId, configuration } = values;
      const configData = {
        userId: user.id,
        deviceId,
        configuration,
      };

      // Example HTTP POST request to save device configuration
      http.post('/device/configure', configData)
        .then((res) => {
          console.log('Device configuration saved:', res.data);
          // Add any additional logic upon successful configuration
        })
        .catch((error) => {
          console.error('Error configuring device:', error);
        });
    },
  });

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h5" sx={{ my: 2 }}>
        Device Configuration
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ maxWidth: '500px' }}>
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Device ID"
          name="deviceId"
          value={formik.values.deviceId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.deviceId && Boolean(formik.errors.deviceId)}
          helperText={formik.touched.deviceId && formik.errors.deviceId}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Configuration"
          name="configuration"
          multiline
          rows={4}
          value={formik.values.configuration}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.configuration && Boolean(formik.errors.configuration)}
          helperText={formik.touched.configuration && formik.errors.configuration}
        />
        <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
          Save Configuration
        </Button>
      </Box>
    </Box>
  );
};

export default DeviceConfig;
