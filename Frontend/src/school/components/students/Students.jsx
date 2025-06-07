import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import MessageSnackbar from "../../../basicUtilityComponents/snackbar/MassageSnackBar";
import { studentsSchema } from "../../../yapSchema/studentsSchema";
import { API } from "../../../environment";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function Students() {
  const token = localStorage.getItem("adminToken");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const initialValues = {
    name: "",
    email: "",
    age: "",
    gender: "",
    student_class: "",
    gurdian: "",
    gurdian_phone: "",
    password: "",
    confirm_password: "",
  };

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

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API}/student/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data.students || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/student/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStudents();
    } catch (err) {
      console.error("Error deleting student:", err);
    }
  };

  const handleEdit = (stu) => {
    formik.setValues({
      name: stu.name,
      email: stu.email,
      age: stu.age,
      gender: stu.gender,
      student_class: stu.student_class,
      gurdian: stu.gurdian,
      gurdian_phone: stu.gurdian_phone,
      password: "",
      confirm_password: "",
    });
    setEditMode(true);
    setEditId(stu._id);
  };

  useEffect(() => {
    fetchClasses();
    fetchStudents();
  }, []);

  const formik = useFormik({
    initialValues,
    validationSchema: studentsSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editMode) {
          await axios.patch(`${API}/student/update`, { ...values, _id: editId }, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setSnackbar({
            open: true,
            message: "Student updated successfully!",
            severity: "success",
          });

          setEditMode(false);
          setEditId(null);
        } else {
          await axios.post(`${API}/student/register`, values, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setSnackbar({
            open: true,
            message: "Student registered successfully!",
            severity: "success",
          });
        }

        resetForm();
        fetchStudents();
      } catch (error) {
        console.error("Submit error:", error);
        setSnackbar({
          open: true,
          message:
            error.response?.data?.message ||
            "Operation failed. Please try again.",
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
        flexDirection="column"
        px={2}
      >
        {/* Registration / Update Form */}
        <Paper
          elevation={4}
          sx={{
            p: 5,
            maxWidth: 800,
            width: "100%",
            borderRadius: 3,
            backgroundColor: "#ffffff",
            mb: 6,
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            color="primary.main"
            textAlign="center"
          >
            {editMode ? "Update Student" : "Register Student"}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            mb={4}
          >
            {editMode
              ? "Update the selected student's details."
              : "Fill in the details to enroll the student."}
          </Typography>

          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="name"
                  label="Full Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="age"
                  label="Age"
                  type="number"
                  value={formik.values.age}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.age && Boolean(formik.errors.age)}
                  helperText={formik.touched.age && formik.errors.age}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  name="gender"
                  label="Gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.gender && Boolean(formik.errors.gender)}
                  helperText={formik.touched.gender && formik.errors.gender}
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  name="student_class"
                  label="Class"
                  value={formik.values.student_class}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.student_class &&
                    Boolean(formik.errors.student_class)
                  }
                  helperText={
                    formik.touched.student_class && formik.errors.student_class
                  }
                >
                  <MenuItem value="">Select</MenuItem>
                  {classes.map((cls) => (
                    <MenuItem key={cls._id} value={cls.class_text}>
                      {cls.class_text}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="gurdian"
                  label="Guardian Name"
                  value={formik.values.gurdian}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.gurdian && Boolean(formik.errors.gurdian)
                  }
                  helperText={formik.touched.gurdian && formik.errors.gurdian}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="gurdian_phone"
                  label="Guardian Phone"
                  value={formik.values.gurdian_phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.gurdian_phone &&
                    Boolean(formik.errors.gurdian_phone)
                  }
                  helperText={
                    formik.touched.gurdian_phone &&
                    formik.errors.gurdian_phone
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="confirm_password"
                  label="Confirm Password"
                  type="password"
                  value={formik.values.confirm_password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.confirm_password &&
                    Boolean(formik.errors.confirm_password)
                  }
                  helperText={
                    formik.touched.confirm_password &&
                    formik.errors.confirm_password
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
                  {editMode ? "Update Student" : "Register Student"}
                </Button>
              </Grid>

              {editMode && (
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => {
                      setEditMode(false);
                      setEditId(null);
                      formik.resetForm();
                    }}
                  >
                    Cancel Update
                  </Button>
                </Grid>
              )}
            </Grid>
          </Box>
        </Paper>

        {/* All Students Table */}
        <Paper sx={{ p: 4, width: "100%", maxWidth: 1000 }}>
          <Typography variant="h5" mb={2}>
            All Registered Students
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((stu) => (
                <TableRow key={stu._id}>
                  <TableCell>{stu.name}</TableCell>
                  <TableCell>{stu.student_class}</TableCell>
                  <TableCell>{stu.email}</TableCell>
                  <TableCell>{stu.age}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDelete(stu._id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                    <IconButton onClick={() => handleEdit(stu)}>
                      <EditIcon color="primary" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </>
  );
}
