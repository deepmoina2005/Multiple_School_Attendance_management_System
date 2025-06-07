import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import { API } from "../../../environment";
import * as Yup from "yup";

// Validation schema
const validationSchema = Yup.object({
  school_name: Yup.string().required("School name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone is required"),
  admin_name: Yup.string().required("Admin name is required"),
});

const UpdateSchool = () => {
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  const fetchSchoolData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${API}/school/get-single`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInitialValues(response.data.school);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchoolData();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues || {
      school_name: "",
      email: "",
      phone: "",
      admin_name: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setUpdating(true);
      setMessage("");
      try {
        const token = localStorage.getItem("adminToken");
        const response = await axios.patch(`${API}/school/update`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMessage(response.data.message || "School updated successfully!");
      } catch (error) {
        console.error("Update Error:", error);
        setMessage(
          error.response?.data?.message || "Failed to update school data."
        );
      } finally {
        setUpdating(false);
      }
    },
  });

  if (loading) return <CircularProgress />;

  return (
    <Paper elevation={4} sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 5 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Update School Details
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          label="School Name"
          name="school_name"
          value={formik.values.school_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.school_name && Boolean(formik.errors.school_name)}
          helperText={formik.touched.school_name && formik.errors.school_name}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Admin Name"
          name="admin_name"
          value={formik.values.admin_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.admin_name && Boolean(formik.errors.admin_name)}
          helperText={formik.touched.admin_name && formik.errors.admin_name}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Phone"
          name="phone"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.phone && Boolean(formik.errors.phone)}
          helperText={formik.touched.phone && formik.errors.phone}
          margin="normal"
        />

        <Box mt={3}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={updating}
          >
            {updating ? "Updating..." : "Update School"}
          </Button>
        </Box>

        {message && (
          <Typography color="secondary" mt={2}>
            {message}
          </Typography>
        )}
      </form>
    </Paper>
  );
};

export default UpdateSchool;