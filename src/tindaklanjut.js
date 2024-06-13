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
    tanggal : '',
    pic : '',
    kodeAsset: '',
    keterangan: '',
    status: ''

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
    fetch(`http://localhost:5000/api/tindaklanjut/${no}`, {
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
        tanggal : '',
        pic : '',
        kodeAsset: '',
        keterangan: '',
        status: ''
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
    const url = isEditing ? `http://localhost:5000/api/tindaklanjut/${formData.no}` : 'http://localhost:5000/api/tindaklanjut';

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

    fetch('http://localhost:5000/api/tindaklanjut', {
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
      <Typography variant="h4" gutterBottom>Data Tindak Lanjut</Typography>
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
            <TableCell>tanggal</TableCell>
            <TableCell>pic</TableCell>
            <TableCell>kodeAsset</TableCell>
            <TableCell>keterangan</TableCell>
            <TableCell>status</TableCell> {/* Added TableCell for Actions */}
          </TableRow>
        </TableHead>
        <TableBody>
          {mahasiswa.map((row) => (
            <TableRow key={row.no}>
              <TableCell>{row.no}</TableCell>
              <TableCell>{row.tanggal}</TableCell>
              <TableCell>{row.pic}</TableCell>
              <TableCell>{row.kodeAsset}</TableCell>
              <TableCell>{row.keterangan}</TableCell>
              <TableCell>{row.status}</TableCell>
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
            {isEditing ? 'Edit Data Tindak Lanjut' : 'Tambah Data Tindak Lanjut'}
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
              id="tanggal"
              label="tanggal"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="pic"
              label="pic"
              name="pic"
              value={formData.pic}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="kodeAsset"
              label="kodeAsset"
              name="kodeAsset"
              value={formData.kodeAsset}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="keterangan"
              label="keterangan"
              name="keterangan"
              value={formData.keterangan}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="status"
              label="status"
              name="status"
              value={formData.status}
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
