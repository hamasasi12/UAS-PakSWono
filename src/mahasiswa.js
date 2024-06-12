import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress,
  Typography, Button, Modal, Box, TextField, IconButton
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

function Mahasiswa() {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    nim: '',
    nama: '',
    jurusan: '',
    angkatan: ''
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

  const handleDeleteData = (nim) => {
    fetch(`http://localhost:5000/api/mahasiswa/${nim}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(() => {
        setMahasiswa(mahasiswa.filter(item => item.nim !== nim));
      })
      .catch(error => console.error('Error:', error));
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({
      nim: '',
      nama: '',
      jurusan: '',
      angkatan: ''
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
    const url = isEditing ? `http://localhost:5000/api/mahasiswa/${formData.nim}` : 'http://localhost:5000/api/mahasiswa';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        if (isEditing) {
          setMahasiswa(mahasiswa.map(item => (item.nim === formData.nim ? formData : item)));
        } else {
          setMahasiswa([...mahasiswa, formData]);
        }
        handleCloseModal();
      })
      .catch(error => console.error('Error:', error));
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/mahasiswa')
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
            <TableCell>NIM</TableCell>
            <TableCell>Nama</TableCell>
            <TableCell>Jurusan</TableCell>
            <TableCell>Angkatan</TableCell>
            <TableCell>Actions</TableCell> {/* Added TableCell for Actions */}
          </TableRow>
        </TableHead>
        <TableBody>
          {mahasiswa.map((row) => (
            <TableRow key={row.nim}>
              <TableCell>{row.nim}</TableCell>
              <TableCell>{row.nama}</TableCell>
              <TableCell>{row.jurusan}</TableCell>
              <TableCell>{row.angkatan}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEditData(row)} color='primary'>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteData(row.nim)} color='secondary'>
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
              id="nim"
              label="NIM"
              name="nim"
              value={formData.nim}
              onChange={handleChange}
              disabled={isEditing} // NIM should not be editable when editing
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="nama"
              label="Nama"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="jurusan"
              label="Jurusan"
              name="jurusan"
              value={formData.jurusan}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="angkatan"
              label="Angkatan"
              name="angkatan"
              value={formData.angkatan}
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
