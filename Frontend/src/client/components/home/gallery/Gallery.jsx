import { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

export default function Gallery() {
  const [open, setOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [schools, setSchools] = useState([]);

  const handleOpen = (school) => {
    setSelectedSchool(school);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSchool(null);
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/school/get-all');
        setSchools(response.data.data);
      } catch (error) {
        console.error('Error fetching schools:', error);
      }
    };

    fetchSchools();
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>
        Registered Schools
      </Typography>

      <Grid container spacing={3}>
        {schools.map((school) => (
          <Grid item xs={12} sm={6} md={4} key={school._id}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: 6,
                },
              }}
              onClick={() => handleOpen(school)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56 }}>
                  {school.school_name?.[0]?.toUpperCase() || '?'}
                </Avatar>
                <Box>
                  <Typography variant="h6">{school.school_name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Admin: {school.admin_name}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Modal for School Details */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="school-details-title"
        aria-describedby="school-details-description"
      >
        <Box sx={style}>
          {selectedSchool && (
            <>
              <Typography id="school-details-title" variant="h6" gutterBottom>
                {selectedSchool.school_name}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Admin: {selectedSchool.admin_name}
              </Typography>
              <Typography variant="body2">Email: {selectedSchool.email}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Phone: {selectedSchool.phone || 'N/A'}
              </Typography>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
