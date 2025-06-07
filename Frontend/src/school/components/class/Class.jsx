import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import MessageSnackbar from "../../../basicUtilityComponents/snackbar/MassageSnackBar";
import { API } from "../../../environment";
import { Edit, Delete } from "@mui/icons-material";

// Validation Schema
const classSchema = Yup.object({
  class_text: Yup.string().required("Class name is required"),
  class_number: Yup.number()
    .required("Class number is required")
    .min(1, "Minimum 1")
    .max(12, "Maximum 12"),
});

const Class = () => {
  const [classes, setClasses] = useState([]);
  const [editId, setEditId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const token = localStorage.getItem("adminToken");

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${API}/class/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(res.data.data || []);
    } catch (error) {
      console.error("Fetch Classes Error:", error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const formik = useFormik({
    initialValues: {
      class_text: "",
      class_number: "",
    },
    validationSchema: classSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editId) {
          // Update class
          const res = await axios.patch(`${API}/class/update/${editId}`, values, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSnackbar({
            open: true,
            message: res.data.message || "Class updated successfully!",
            severity: "success",
          });
        } else {
          // Create class
          const res = await axios.post(`${API}/class/create`, values, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSnackbar({
            open: true,
            message: res.data.message || "Class created successfully!",
            severity: "success",
          });
        }
        resetForm();
        setEditId(null);
        fetchClasses();
      } catch (error) {
        console.error("Class error:", error);
        setSnackbar({
          open: true,
          message:
            error.response?.data?.message || "Operation failed. Try again.",
          severity: "error",
        });
      }
    },
  });

  const handleEdit = (cls) => {
    formik.setValues({
      class_text: cls.class_text,
      class_number: cls.class_number,
    });
    setEditId(cls._id);
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${API}/class/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbar({
        open: true,
        message: res.data.message || "Class deleted successfully!",
        severity: "success",
      });
      fetchClasses();
    } catch (error) {
      console.error("Delete error:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message || "Unable to delete this class.",
        severity: "error",
      });
    }
  };

  return (
    <>
      <MessageSnackbar
        open={snackbar.open}
        handleClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
      />

      <Box p={3} bgcolor="#f5f7fa" minHeight="100vh">
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" mb={2} fontWeight="bold" color="primary">
            {editId ? "Update Class" : "Create New Class"}
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="class_text"
                  label="Class Name"
                  value={formik.values.class_text}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.class_text &&
                    Boolean(formik.errors.class_text)
                  }
                  helperText={
                    formik.touched.class_text && formik.errors.class_text
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="class_number"
                  label="Class Number"
                  type="number"
                  value={formik.values.class_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.class_number &&
                    Boolean(formik.errors.class_number)
                  }
                  helperText={
                    formik.touched.class_number &&
                    formik.errors.class_number
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ py: 1.2, fontWeight: "bold" }}
                >
                  {editId ? "Update Class" : "Create Class"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2} fontWeight="bold">
            All Classes
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Class Name</TableCell>
                  <TableCell>Class Number</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {classes.map((cls) => (
                  <TableRow key={cls._id}>
                    <TableCell>{cls.class_text}</TableCell>
                    <TableCell>{cls.class_number}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(cls)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(cls._id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {classes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No classes found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </>
  );
};

export default Class;