const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 5000;

const secretKey = 'laravel'
app.use(bodyParser.json());

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'persero'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database', err);
        return;
    }
    console.log('Connected to the database');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Endpoint to get all mahasiswa data
app.get('/api/mahasiswa', (req, res) => {
    const sql = 'SELECT * FROM mahasiswa';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Endpoint to add a new mahasiswa
app.post('/api/mahasiswa', (req, res) => {
    const { nim, nama, jurusan, angkatan } = req.body;
    const sql = 'INSERT INTO mahasiswa (nim, nama, jurusan, angkatan) VALUES (?, ?, ?, ?)';
    db.query(sql, [nim, nama, jurusan, angkatan], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Data berhasil disimpan', data: results });
    });
});

// Endpoint to update an existing mahasiswa
app.put('/api/mahasiswa/:nim', (req, res) => {
    const { nim } = req.params;
    const { nama, jurusan, angkatan } = req.body;
    const sql = 'UPDATE mahasiswa SET nama = ?, jurusan = ?, angkatan = ? WHERE nim = ?';
    db.query(sql, [nama, jurusan, angkatan, nim], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Data berhasil diperbarui', data: results });
    });
});

// Endpoint to delete a mahasiswa
app.delete('/api/mahasiswa/:nim', (req, res) => {
    const { nim } = req.params;
    const sql = 'DELETE FROM mahasiswa WHERE nim = ?';
    db.query(sql, [nim], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Data berhasil dihapus', data: results });
    });
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    const sql = "SELECT * FROM user WHERE username = ? AND password = ?";
    db.query(sql, [username, password], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      if (results.length > 0) {
        const user = results[0];
        const token = jwt.sign(
          { id: user.id, username: user.username },
          secretKey,
          { expiresIn: "1h" }
        );
        res.json({ success: true, token });
      } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
      }
    });
  });
  //----------------------------------------------------------------------------------
  // Endpoint to get all data_asset_hardware data
app.get('/api/dataAsset', (req, res) => {
    const sql = 'SELECT * FROM data_asset_hardware';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Endpoint to add a new data_asset_hardware
app.post('/api/dataAsset', (req, res) => {
    const {
        no, 
        jenisAsset, 
        tahun, 
        merek, 
        processor, 
        ram, 
        hardisk, 
        pengguna, 
        divisi, 
        lokasiAsset, 
        statusAsset
    } = req.body;

    const sql = `
        INSERT INTO data_asset_hardware (
            no, jenisAsset, tahun, merek, processor, ram, hardisk, pengguna, divisi, lokasiAsset, statusAsset
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        no, jenisAsset, tahun, merek, processor, ram, hardisk, pengguna, divisi, lokasiAsset, statusAsset
    ], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Data berhasil disimpan', data: results });
    });
});

// Endpoint to update an existing data_asset
app.put('/api/dataAsset/:no', (req, res) => {
    const { no } = req.params;
    const { 
        jenisAsset, 
        tahun, 
        merek, 
        processor, 
        ram, 
        hardisk, 
        pengguna, 
        divisi, 
        lokasiAsset, 
        statusAsset} = req.body;
    const sql = 'UPDATE data_asset_hardware SET jenisAsset = ?, tahun = ?, merek = ?, processor = ?, ram = ?, hardisk = ?, pengguna = ?, divisi = ?, lokasiAsset = ?, statusAsset = ? WHERE no = ?';
    db.query(sql, [no, jenisAsset, tahun, merek, processor, ram, hardisk, pengguna, divisi, lokasiAsset, statusAsset], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Data berhasil diperbarui', data: results });
    });
});

// Endpoint to delete a data_asset
app.delete('/api/dataAsset/:no', (req, res) => {
    const { no } = req.params;
    const sql = 'DELETE FROM data_asset_hardware WHERE no = ?';
    db.query(sql, [no], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Data berhasil dihapus', data: results });
    });
});

//-------------------------------------------------------------------------------------------
// Endpoint to get all tindak lanjut data
app.get('/api/tindaklanjut', (req, res) => {
    const sql = 'SELECT * FROM tindakLanjut';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Endpoint to add a new tindak lanjut
app.post('/api/tindaklanjut', (req, res) => {
    const { no, tanggal, pic, kodeAsset, keterangan, status } = req.body;
    const sql = 'INSERT INTO tindaklanjut (no, tanggal, pic, kodeAsset, keterangan, status) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [no, tanggal, pic, kodeAsset, keterangan, status], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Data berhasil disimpan', data: results });
    });
});

// Endpoint to update an existing tindaklanjut
app.put('/api/tindaklanjut/:no', (req, res) => {
    const { no } = req.params;
    const { tanggal, pic, kodeAsset, keterangan,status } = req.body;
    const sql = 'UPDATE tindaklanjut SET tanggal = ?, pic = ?, kodeAsset = ?, keterangan = ?, status = ? WHERE nim = ?';
    db.query(sql, [tanggal, pic, kodeAsset, keterangan, status], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Data berhasil diperbarui', data: results });
    });
});

// Endpoint to delete a tindaklanjut
app.delete('/api/tindaklanjut/:no', (req, res) => {
    const { no } = req.params;
    const sql = 'DELETE FROM tindaklanjut WHERE no = ?';
    db.query(sql, [no], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Data berhasil dihapus', data: results });
    });
});

//-------------------------------------------------------------------------------
// Endpoint to get all requst user
app.get('/api/requestuser', (req, res) => {
    const sql = 'SELECT * FROM requestuser';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Endpoint to add a new requst user
app.post('/api/requestuser', (req, res) => {
    const { nup, nama, divisi, noWA, kategoriRequest, penjelasan, alasan, docPendukung } = req.body;
    const sql = 'INSERT INTO requestuser (nup, nama, divisi, noWA, kategoriRequest, penjelasan, alasan, docPendukung) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [nup, nama, divisi, noWA, kategoriRequest, penjelasan, alasan, docPendukung], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Data berhasil disimpan', data: results });
    });
});

// Endpoint to update an existing mahasiswa
app.put('/api/requestuser/:nup', (req, res) => {
    const { nup } = req.params;
    const { nama, divisi, noWA, kategoriRequest, penjelasan, alasan, docPendukung } = req.body;
    const sql = 'UPDATE requestuser SET nama = ?, divisi = ?, noWA = ?, kategoriRequest = ?, penjelasan = ?, alasan = ?, docPendukung = ? WHERE nup = ?';
    db.query(sql, [nama, divisi, noWA, kategoriRequest, penjelasan, alasan, docPendukung], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Data berhasil diperbarui', data: results });
    });
});

// Endpoint to delete a mahasiswa
app.delete('/api/requestuser/:nup', (req, res) => {
    const { nup } = req.params;
    const sql = 'DELETE FROM requestuser WHERE nup = ?';
    db.query(sql, [nup], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Data berhasil dihapus', data: results });
    });
});
//------------------------------------------------------------------
// Endpoint to get all permintaanperbaikan
app.get('/api/permintaanperbaikan', (req, res) => {
    const sql = 'SELECT * FROM permintaanperbaikan';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Endpoint to add a new permintaanPerbaikan
app.post('/api/permintaanperbaikan', (req, res) => {
    const { no, noPermintaan, deskPermintaan, departemen, picPermintaan, tglPermintaan } = req.body;
    const sql = 'INSERT INTO permintaanperbaikan (no, noPermintaan, deskPermintaan, departemen, picPermintaan, tglPermintaan) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [no, noPermintaan, deskPermintaan, departemen, picPermintaan, tglPermintaan], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Data berhasil disimpan', data: results });
    });
});


// Endpoint to update an existing mahasiswa
app.put('/api/permintaanperbaikan/:no', (req, res) => {
    const { no } = req.params;
    const { noPermintaan, deskPermintaan, departemen, picPermintaan, tglPermintaan } = req.body;
    const sql = 'UPDATE permintaanperbaikan SET noPermintaan = ?, deskPermintaan = ?, departemen = ?, picPermintaan = ?, tglPermintaan = ? WHERE no = ?';
    db.query(sql, [noPermintaan, deskPermintaan, departemen, picPermintaan, tglPermintaan], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Data berhasil diperbarui', data: results });
    });
});

// Endpoint to delete a permintaanperbaikan
app.delete('/api/permintaanperbaikan/:no', (req, res) => {
    const { no } = req.params;
    const sql = 'DELETE FROM permintaanperbaikan WHERE no = ?';
    db.query(sql, [no], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Data berhasil dihapus', data: results });
    });
});

//---------------------------------------------------------------------------------------
// Endpoint to get all permintaan masuk data
app.get('/api/permintaanmasuk', (req, res) => {
    const sql = 'SELECT * FROM permintaanmasuk';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Endpoint to add a new mahasiswa
app.post('/api/permintaanmasuk', (req, res) => {
    const { no, kodeAsset, keterangan, status, pic, tglPermintaan } = req.body;
    const sql = 'INSERT INTO permintaanmasuk (no, kodeAsset, keterangan, status, pic, tglPermintaan ) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [no, kodeAsset, keterangan, status, pic, tglPermintaan], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Data berhasil disimpan', data: results });
    });
});

// Endpoint to update an existing permintaanMasuk
app.put('/api/permintaanmasuk/:no', (req, res) => {
    const { no } = req.params;
    const { kodeAsset, keterangan, status, pic, tglPermintaan } = req.body;
    const sql = 'UPDATE permintaanmasuk SET kodeAsset = ?, keterangan = ?, status = ?, pic = ?, tglPermintaan = ? WHERE nim = ?';
    db.query(sql, [no, kodeAsset, keterangan, status, pic, tglPermintaan], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Data berhasil diperbarui', data: results });
    });
});

// Endpoint to delete a mahasiswa
app.delete('/api/permintaanmasuk/:no', (req, res) => {
    const { no } = req.params;
    const sql = 'DELETE FROM permintaanmasuk WHERE no = ?';
    db.query(sql, [no], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Data berhasil dihapus', data: results });
    });
});















