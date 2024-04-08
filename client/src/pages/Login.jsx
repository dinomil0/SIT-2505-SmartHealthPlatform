import { useContext } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../http";
import { Link } from "react-router-dom";
import UserContext from "../contexts/UserContext";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const formik = useFormik({
    initialValues: {
      loginId: "",
      password: "",
    },
    validationSchema: yup.object({
      loginId: yup
        .string()
        .trim()
        .test(
          "loginId",
          "Please enter a valid email or NRIC",
          (value) =>
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,7})+$/.test(value) ||
            /^[STMGstmg]\d{7}[A-Za-z]$/.test(value)
        )
        .required("Email or NRIC is required"),
      password: yup
        .string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .max(50, "Password must be at most 50 characters")
        .required("Password is required")
        .matches(
          /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
          "Password must contain at least 1 letter and 1 number"
        ),
    }),
    onSubmit: (data) => {
      data.loginId = data.loginId.trim().toLowerCase();
      data.password = data.password.trim();
      console.log(data)
      http.post("/user/login", data)
        .then((res) => {
          localStorage.setItem("accessToken", res.data.accessToken);
          setUser(res.data.user);
          console.log(res.data);
          localStorage.setItem('user', JSON.stringify(res.data.user))
          navigate("/Dashboard");
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
        HealthApp
      </Typography>
      <Box
        component="form"
        sx={{ maxWidth: "500px" }}
        onSubmit={formik.handleSubmit}
      >
        {/* Email or NRIC input */}
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Email or NRIC"
          name="loginId"
          value={formik.values.loginId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.loginId && Boolean(formik.errors.loginId)}
          helperText={formik.touched.loginId && formik.errors.loginId}
        />
        {/* Password input */}
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
        {/* Login button */}
        <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
          Login
        </Button>
        {/* Forgot Password link */}
        <Link
          component={Link}
          to="/forgot-password"
          variant="body2"
          sx={{ mt: 1, color: "#007bff", fontWeight: "bold", textDecoration: "underline" }}>
          Forgot Password?
        </Link>
        {/* Link to Signup page */}
        <Link to="/signup" style={{ textDecoration: "none" }}>
          <Typography variant="body2" sx={{ mt: 1, color: "#007bff", fontWeight: "bold", textDecoration: "underline" }}>
          Don't have an account? Sign Up
          </Typography>
        </Link>
      </Box>
    </Box>
  );
}

export default Login;
