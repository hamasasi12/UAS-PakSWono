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
   nup : '',
   nama : '',
   divisi : '',
   noWA : '',
   kategoriRequest : '',
   penjelasan : '',
   alasan : '',
   docPendukung : ''
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

  const handleDeleteData = (nup) => {
    fetch(`http://localhost:5000/api/requestuser/${nup}`, {
      method: 'DELETE',
      headers: {
        'Authorization' : `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(() => {
        setMahasiswa(mahasiswa.filter(item => item.nup !== nup));
      })
      .catch(error => console.error('Error:', error));
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({
        nup : '',
        nama : '',
        divisi : '',
        noWA : '',
        kategoriRequest : '',
        penjelasan : '',
        alasan : '',
        docPendukung : ''
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
    const url = isEditing ? `http://localhost:5000/api/requestuser/${formData.nup}` : 'http://localhost:5000/api/requestuser';

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
          setMahasiswa(mahasiswa.map(item => (item.nup === formData.nup ? formData : item)));
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

    fetch('http://localhost:5000/api/requestuser', {
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
      <Typography variant="h4" gutterBottom>Data Request User</Typography>
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
            <TableCell>nup</TableCell>
            <TableCell>nama</TableCell>
            <TableCell>divisi</TableCell>
            <TableCell>noWA</TableCell>
            <TableCell>kategoriRequest</TableCell>
            <TableCell>penjelasan</TableCell>
            <TableCell>alasan</TableCell>
            <TableCell>docPendukung</TableCell> {/* Added TableCell for Actions */}
          </TableRow>
        </TableHead>
        <TableBody>
          {mahasiswa.map((row) => (
            <TableRow key={row.nup}>
              <TableCell>{row.nama}</TableCell>
              <TableCell>{row.divisi}</TableCell>
              <TableCell>{row.noWA}</TableCell>
              <TableCell>{row.kategoriRequest}</TableCell>
              <TableCell>{row.penjelasan}</TableCell>
              <TableCell>{row.alasan}</TableCell>
              <TableCell>{row.docPendukung}</TableCell>

              <TableCell>
                <IconButton onClick={() => handleEditData(row)} color='primary'>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteData(row.nup)} color='secondary'>
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
              id="nup"
              label="nup"
              name="nup"
              value={formData.nup}
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
              id="divisi"
              label="divisi"
              name="divisi"
              value={formData.divisi}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="noWA"
              label="noWA"
              name="noWA"
              value={formData.noWA}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="kategoriRequest"
              label="kategoriRequest"
              name="kategoriRequest"
              value={formData.kategoriRequest}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="penjelasan"
              label="penjelasan"
              name="penjelasan"
              value={formData.penjelasan}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="alasan"
              label="alasan"
              name="alasan"
              value={formData.alasan}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="docPendukung"
              label="docPendukung"
              name="docPendukung"
              value={formData.docPendukung}
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
