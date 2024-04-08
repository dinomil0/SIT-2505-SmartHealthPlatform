import React from "react";
import { Box, Typography, TextField, Button, MenuItem, Select } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../http";

function Signup() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      role: "user",
      name: "",
      NRIC: "",
      email: "",
      phoneNo: "",
      password: "",
      confirmPassword: "",
      DOB: "",
      gender: "",
      address: "",
    },
    validationSchema: yup.object({
      name: yup
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name must be at most 50 characters")
        .required("Name is required")
        .matches(
          /^[a-zA-Z '-,.]+$/,
          "Name only allow letters, spaces and characters"
        ),
      NRIC: yup
        .string()
        .trim()
        .min(9, "NRIC must be at least 9 characters")
        .max(9, "NRIC must be at most 9 characters")
        .required("NRIC is required")
        .matches(
          /^[STMGstmg]\d{7}[A-Za-z]$/,
          "Please enter valid NRIC"
        ),
      email: yup
        .string()
        .trim()
        .email("Enter a valid email")
        .max(50, "Email must be at most 50 characters")
        .required("Email is required"),
      phoneNo: yup
        .string()
        .min(8, "Phone must be at least 8 numbers")
        .max(8, "Phone must be at most 8 numbers")
        .required("Phone is required")
        .matches(
          /^[89]\d{7}$/,
          "Please enter valid phone number"
        ),
      password: yup
        .string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .max(50, "Password must be at most 50 characters")
        .required("Password is required")
        .matches(
          /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
          "Password at least 1 letter and 1 number"
        ),
      confirmPassword: yup
        .string()
        .trim()
        .required("Confirm password is required")
        .oneOf([yup.ref("password")], "Passwords must match"),
      DOB: yup.date().required("Date of Birth is required"),
      gender: yup.string().required("Gender is required"),
      address: yup.string().required("Address is required"),
    }),
    onSubmit: (data) => {
      data.name = data.name.trim();
      data.email = data.email.trim().toLowerCase();
      data.password = data.password.trim();
      data.NRIC = data.NRIC.trim();
      data.phoneNo = data.phoneNo;
      data.DOB = data.DOB;
      data.gender = data.gender;
      data.address = data.address;
      console.log(data)
      http.post("/user/signup", data)
        .then((res) => {
          console.log(res.data);
          navigate("/");
        })
        .catch(function (err) {
          console.log(err.response);
          // toast.error(`${err.response.data.message}`);
        });
    },
  });

  // React.useEffect(() => {
  //   if (formik.values.email && formik.values.email.endsWith("@admin.com")) {
  //     formik.setFieldValue("role", "admin");
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [formik.values.email]);

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
        Signup
      </Typography>
      <Box
        component="form"
        sx={{ maxWidth: "500px" }}
        onSubmit={formik.handleSubmit}
      >
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Name"
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
          label="NRIC"
          name="NRIC"
          value={formik.values.NRIC}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.NRIC && Boolean(formik.errors.NRIC)}
          helperText={formik.touched.NRIC && formik.errors.NRIC}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Phone Number"
          name="phoneNo"
          value={formik.values.phoneNo}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.phoneNo && Boolean(formik.errors.phoneNo)}
          helperText={formik.touched.phoneNo && formik.errors.phoneNo}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Password"
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.confirmPassword &&
            Boolean(formik.errors.confirmPassword)
          }
          helperText={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Date of Birth"
          name="DOB"
          type="date"
          value={formik.values.DOB}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.DOB && Boolean(formik.errors.DOB)}
          helperText={formik.touched.DOB && formik.errors.DOB}
          InputLabelProps={{ shrink: true }}
        />
        <Select
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Gender"
          name="gender"
          value={formik.values.gender}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.gender && Boolean(formik.errors.gender)}
        >
          <MenuItem value="">Select Gender</MenuItem>
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
        </Select>
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Address"
          name="address"
          value={formik.values.address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.address && Boolean(formik.errors.address)}
          helperText={formik.touched.address && formik.errors.address}
        />
        <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
          Signup
        </Button>
      </Box>
      {/* <ToastContainer /> */}
    </Box>);
}

export default Signup;
