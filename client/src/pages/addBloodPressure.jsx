import React, { useContext } from "react";
import { Box, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../http";
import UserContext from "../contexts/UserContext";

function AddBloodPressure() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const today = new Date().toISOString().split("T")[0]; // Get today's date in yyyy-mm-dd format

  const [openDialog, setOpenDialog] = React.useState(false); // State variable for dialog visibility

  const formik = useFormik({
    initialValues: {
      NRIC: user.NRIC,
      systolic: "",
      diastolic: "",
      measureDate: today, // Set today's date as the default date
    },
    validationSchema: yup.object({
      systolic: yup.number().required("Systolic pressure is required"),
      diastolic: yup.number().required("Diastolic pressure is required"),
      measureDate: yup.date().required("Date is required"), // Add validation for date field
    }),
    onSubmit: (data) => {
      http.post("/user/addBloodPressure", data)
        .then((res) => {
          console.log(res.data, "AA");
          navigate("/Dashboard"); // Redirect to dashboard after successful addition
        })
        .catch(function (err) {
          console.log(err.response);
        });
    },
  });

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFormSubmit = () => {
    setOpenDialog(false); // Close the dialog before submitting the form
    formik.handleSubmit(); // Submit the form
  };

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
        Add Blood Pressure
      </Typography>
      <Box component="form" sx={{ maxWidth: "500px" }} onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Systolic Pressure"
          name="systolic"
          type="number"
          value={formik.values.systolic}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.systolic && Boolean(formik.errors.systolic)}
          helperText={formik.touched.systolic && formik.errors.systolic}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Diastolic Pressure"
          name="diastolic"
          type="number"
          value={formik.values.diastolic}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.diastolic && Boolean(formik.errors.diastolic)}
          helperText={formik.touched.diastolic && formik.errors.diastolic}
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
        />
        <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleOpenDialog}>
          Add Blood Pressure
        </Button>
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <Typography>
            Please confirm that the information are correct?
          </Typography>
          <Typography>
            Systolic Pressure: {formik.values.systolic}
          </Typography>
          <Typography>
            Diastolic Pressure: {formik.values.diastolic}
          </Typography>
          <Typography>
            Date: {new Date(formik.values.measureDate).toLocaleDateString("en-GB")}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleFormSubmit}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AddBloodPressure;
