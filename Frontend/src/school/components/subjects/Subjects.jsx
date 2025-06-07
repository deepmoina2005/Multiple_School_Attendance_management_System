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
const subjectSchema = Yup.object({
  subject_name: Yup.string().required("Subject name is required"),
  subject_codename: Yup.string()
    .required("Codename is required")
    .min(2, "Minimum 2 characters"),
});

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [editId, setEditId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const token = localStorage.getItem("adminToken");

  const fetchSubjects = async () => {
    try {
      const res = await axios.get(`${API}/subject/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubjects(res.data.data || []);
    } catch (error) {
      console.error("Fetch Subjects Error:", error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const formik = useFormik({
    initialValues: {
      subject_name: "",
      subject_codename: "",
    },
    validationSchema: subjectSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editId) {
          // Update Subject
          const res = await axios.patch(`${API}/subject/update/${editId}`, values, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSnackbar({
            open: true,
            message: res.data.message || "Subject updated successfully!",
            severity: "success",
          });
        } else {
          // Create Subject
          const res = await axios.post(`${API}/subject/create`, values, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSnackbar({
            open: true,
            message: res.data.message || "Subject created successfully!",
            severity: "success",
          });
        }
        resetForm();
        setEditId(null);
        fetchSubjects();
      } catch (error) {
        console.error("Subject error:", error);
        setSnackbar({
          open: true,
          message:
            error.response?.data?.message || "Operation failed. Try again.",
          severity: "error",
        });
      }
    },
  });

  const handleEdit = (subject) => {
    formik.setValues({
      subject_name: subject.subject_name,
      subject_codename: subject.subject_codename,
    });
    setEditId(subject._id);
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${API}/subject/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbar({
        open: true,
        message: res.data.message || "Subject deleted successfully!",
        severity: "success",
      });
      fetchSubjects();
    } catch (error) {
      console.error("Delete error:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message || "Unable to delete this subject.",
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
            {editId ? "Update Subject" : "Create New Subject"}
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="subject_name"
                  label="Subject Name"
                  value={formik.values.subject_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.subject_name &&
                    Boolean(formik.errors.subject_name)
                  }
                  helperText={
                    formik.touched.subject_name && formik.errors.subject_name
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="subject_codename"
                  label="Subject Codename"
                  value={formik.values.subject_codename}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.subject_codename &&
                    Boolean(formik.errors.subject_codename)
                  }
                  helperText={
                    formik.touched.subject_codename &&
                    formik.errors.subject_codename
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
                  {editId ? "Update Subject" : "Create Subject"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2} fontWeight="bold">
            All Subjects
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Subject Name</TableCell>
                  <TableCell>Codename</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subjects.map((subject) => (
                  <TableRow key={subject._id}>
                    <TableCell>{subject.subject_name}</TableCell>
                    <TableCell>{subject.subject_codename}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(subject)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(subject._id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {subjects.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No subjects found.
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

export default Subjects;