import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import { loginSchema } from "../../../yapSchema/loginSchema";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { useState, useContext } from "react";
import MessageSnackbar from "../../../basicUtilityComponents/snackbar/MassageSnackBar";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const initialValues = {
    email: "",
    password: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await axios.post(
          "http://localhost:4000/api/school/login",
          values
        );

        const token =
          res.headers["authorization"] || res.data.token || res.data.authToken;

        const user = res.data.user;

        if (token && user) {
          // Use consistent key with AuthContext
          localStorage.setItem("adminToken", token);
          localStorage.setItem("user", JSON.stringify(user));

          // Call context login
          login({ token, user });

          setSnackbar({
            open: true,
            message: "Login successful!",
            severity: "success",
          });

          resetForm();
          navigate("/school"); // Redirect if desired
        } else {
          throw new Error("Invalid login response.");
        }
      } catch (error) {
        console.error("Login error:", error);
        setSnackbar({
          open: true,
          message:
            error.response?.data?.message || "Login failed. Please try again.",
          severity: "error",
        });
      }
    },
  });

  return (
    <>
      <MessageSnackbar
        open={snackbar.open}
        handleClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
      />

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="#f0f4f8"
        px={2}
      >
        <Paper
          elevation={4}
          sx={{
            p: 5,
            maxWidth: 600,
            width: "100%",
            borderRadius: 3,
            backgroundColor: "#ffffff",
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            color="primary.main"
            textAlign="center"
          >
            Login to Your School Dashboard
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            mb={4}
          >
            Enter your credentials to continue.
          </Typography>

          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  type="email"
                  autoComplete="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={
                    formik.touched.password && formik.errors.password
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    mt: 1,
                    py: 1.5,
                    fontWeight: "bold",
                    textTransform: "none",
                    backgroundColor: "#2563eb",
                    "&:hover": {
                      backgroundColor: "#1e40af",
                    },
                  }}
                >
                  Login
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </>
  );
}
