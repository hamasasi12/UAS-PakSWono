import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress,
  Typography, Button, Modal, Box, TextField, IconButton
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

function Mahasiswa() {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    no : '',
    noPermintaan : '',
    deskPermintaan : '',
    departemen : '',
    picPermintaan : '',
    tglPermintaan : ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleTambahData = () => {
    setIsEditing(false);
    setOpenModal(true);
  };

  const handleEditData = (data) => {
    setIsEditing(true);
    setFormData(data);
    setOpenModal(true);
  };

  const handleDeleteData = (no) => {
    fetch(`http://localhost:5000/api/permintaanPerbaikan/${no}`, {
      method: 'DELETE',
      headers: {
        'Authorization' : `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(() => {
        setMahasiswa(mahasiswa.filter(item => item.no !== no));
      })
      .catch(error => console.error('Error:', error));
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({
        no : '',
        noPermintaan : '',
        deskPermintaan : '',
        departemen : '',
        picPermintaan : '',
        tglPermintaan : ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `http://localhost:5000/api/permintaanPerbaikan/${formData.no}` : 'http://localhost:5000/api/permintaanPerbaikan';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        if (isEditing) {
          setMahasiswa(mahasiswa.map(item => (item.no === formData.no ? formData : item)));
        } else {
          setMahasiswa([...mahasiswa, formData]);
        }
        handleCloseModal();
      })
      .catch(error => console.error('Error:', error));
  };

  useEffect(() => {
    // Fetch token logic or wherever you get the token
    const fetchedToken = localStorage.getItem('token');
    setToken(fetchedToken);

    fetch('http://localhost:5000/api/permintaanPerbaikan', {
      headers : {
        'Authorization' : `Bearer ${fetchedToken}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setMahasiswa(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Typography variant="h4" gutterBottom>Data Mahasiswa</Typography>
      <Button
        variant='contained'
        color='primary'
        startIcon={<AddIcon />}
        style={{ marginBottom: '20px' }}
        onClick={handleTambahData}
      >
        Tambah Data
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>no</TableCell>
            <TableCell>noPermintaan</TableCell>
            <TableCell>deskPermintaan</TableCell>
            <TableCell>departemen</TableCell>
            <TableCell>picPermintaan</TableCell>
            <TableCell>tglPermintaan</TableCell> {/* Added TableCell for Actions */}
          </TableRow>
        </TableHead>
        <TableBody>
          {mahasiswa.map((row) => (
            <TableRow key={row.no}>
              <TableCell>{row.no}</TableCell>
              <TableCell>{row.noPermintaan}</TableCell>
              <TableCell>{row.deskPermintaan}</TableCell>
              <TableCell>{row.departemen}</TableCell>
              <TableCell>{row.picPermintaan}</TableCell>
              <TableCell>{row.tglPermintaan}</TableCell>

              <TableCell>
                <IconButton onClick={() => handleEditData(row)} color='primary'>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteData(row.no)} color='secondary'>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4
        }}>
          <Typography variant="h6" gutterBottom>
            {isEditing ? 'Edit Data Mahasiswa' : 'Tambah Data Mahasiswa'}
            <IconButton
              aria-label="close"
              onClick={handleCloseModal}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="no"
              label="no"
              name="no"
              value={formData.no}
              onChange={handleChange}
              disabled={isEditing} // NIM should not be editable when editing
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="noPermintaan"
              label="noPermintaan"
              name="noPermintaan"
              value={formData.noPermintaan}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="deskPermintaan"
              label="deskPermintaan"
              name="deskPermintaan"
              value={formData.deskPermintaan}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="departemen"
              label="departemen"
              name="departemen"
              value={formData.departemen}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="picPermintaan"
              label="picPermintaan"
              name="picPermintaan"
              value={formData.picPermintaan}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="tglPermintaan"
              label="tglPermintaan"
              name="tglPermintaan"
              value={formData.tglPermintaan}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Simpan
            </Button>
          </form>
        </Box>
      </Modal>
    </TableContainer>
  );
}

export default Mahasiswa;
