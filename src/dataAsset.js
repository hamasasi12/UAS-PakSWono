import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress,
  Typography, Button, Modal, Box, TextField, IconButton, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

function Mahasiswa() {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    no: '',
    jenisAsset: '',
    tahun: '',
    merek: '',
    processor: '',
    ram: '',
    hardisk: '',
    pengguna: '',
    divisi: '',
    lokasiAsset: '',
    statusAsset: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleTambahData = () => {
    setIsEditing(false);
    setFormData({
      no: '',
      jenisAsset: '',
      tahun: '',
      merek: '',
      processor: '',
      ram: '',
      hardisk: '',
      pengguna: '',
      divisi: '',
      lokasiAsset: '',
      statusAsset: ''
    });
    setOpenModal(true);
  };

  const handleEditData = (data) => {
    setIsEditing(true);
    setFormData(data);
    setOpenModal(true);
  };

  const handleDeleteData = (no) => {
    fetch(`http://localhost:5000/api/dataAsset/${no}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
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
      no: '',
      jenisAsset: '',
      tahun: '',
      merek: '',
      processor: '',
      ram: '',
      hardisk: '',
      pengguna: '',
      divisi: '',
      lokasiAsset: '',
      statusAsset: ''
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
    const url = isEditing ? `http://localhost:5000/api/dataAsset/${formData.no}` : 'http://localhost:5000/api/dataAsset';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
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
    const fetchedToken = localStorage.getItem('token');
    setToken(fetchedToken);

    fetch('http://localhost:5000/api/dataAsset', {
      headers: {
        'Authorization': `Bearer ${fetchedToken}`
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

  const divisiOptions = [
    'Divisi A',
    'Divisi B',
    'Divisi C',
    'Divisi D'
  ];

  // Generate the list of years dynamically
  const yearOptions = [];
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= 2000; year--) {
    yearOptions.push(year);
  }

  return (
    <TableContainer component={Paper}>
      <Typography variant="h4" gutterBottom>Data Asset</Typography>
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
            <TableCell>No</TableCell>
            <TableCell>Jenis Asset</TableCell>
            <TableCell>Tahun</TableCell>
            <TableCell>Merek</TableCell>
            <TableCell>Processor</TableCell>
            <TableCell>RAM</TableCell>
            <TableCell>Hardisk</TableCell>
            <TableCell>Pengguna</TableCell>
            <TableCell>Divisi</TableCell>
            <TableCell>Lokasi Asset</TableCell>
            <TableCell>Status Asset</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mahasiswa.map((row) => (
            <TableRow key={row.no}>
              <TableCell>{row.no}</TableCell>
              <TableCell>{row.jenisAsset}</TableCell>
              <TableCell>{row.tahun}</TableCell>
              <TableCell>{row.merek}</TableCell>
              <TableCell>{row.processor}</TableCell>
              <TableCell>{row.ram}</TableCell>
              <TableCell>{row.hardisk}</TableCell>
              <TableCell>{row.pengguna}</TableCell>
              <TableCell>{row.divisi}</TableCell>
              <TableCell>{row.lokasiAsset}</TableCell>
              <TableCell>{row.statusAsset}</TableCell>
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
          p: 4,
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          <Typography variant="h6" gutterBottom>
            {isEditing ? 'Edit Data Asset' : 'Tambah Data Asset'}
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
              label="No"
              name="no"
              value={formData.no}
              onChange={handleChange}
              disabled={isEditing}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="jenisAsset"
              label="Jenis Asset"
              name="jenisAsset"
              value={formData.jenisAsset}
              onChange={handleChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="tahun-label">Tahun</InputLabel>
              <Select
                labelId="tahun-label"
                id="tahun"
                name="tahun"
                value={formData.tahun}
                onChange={handleChange}
                label="Tahun"
              >
                {yearOptions.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              required
              fullWidth
              id="merek"
              label="Merek"
              name="merek"
              value={formData.merek}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="processor"
              label="Processor"
              name="processor"
              value={formData.processor}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="ram"
              label="RAM"
              name="ram"
              value={formData.ram}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="hardisk"
              label="Hardisk"
              name="hardisk"
              value={formData.hardisk}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="pengguna"
              label="Pengguna"
              name="pengguna"
              value={formData.pengguna}
              onChange={handleChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="divisi-label">Divisi</InputLabel>
              <Select
                labelId="divisi-label"
                id="divisi"
                name="divisi"
                value={formData.divisi}
                onChange={handleChange}
                label="Divisi"
              >
                {divisiOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              required
              fullWidth
              id="lokasiAsset"
              label="Lokasi Asset"
              name="lokasiAsset"
              value={formData.lokasiAsset}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="statusAsset"
              label="Status Asset"
              name="statusAsset"
              value={formData.statusAsset}
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
