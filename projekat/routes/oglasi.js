const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_'));
  }
});
const upload = multer({ storage, limits: { files: 5 } });

router.get('/', async (req, res) => {
  const db = req.app.locals.db;
  const { grad, vrsta_privrede, tip_posla } = req.query;
  let query = `SELECT o.*, array_agg(s.putanja ORDER BY s.redosled) FILTER (WHERE s.putanja IS NOT NULL) as slike
    FROM oglasi o LEFT JOIN slike_oglasa s ON s.oglas_id = o.id WHERE o.aktivan = true`;
  const params = [];
  let i = 1;
  if (grad) { query += ` AND o.grad ILIKE $${i++}`; params.push(`%${grad}%`); }
  if (vrsta_privrede) { query += ` AND o.vrsta_privrede ILIKE $${i++}`; params.push(`%${vrsta_privrede}%`); }
  if (tip_posla) { query += ` AND o.tip_posla ILIKE $${i++}`; params.push(`%${tip_posla}%`); }
  query += ' GROUP BY o.id ORDER BY o.created_at DESC';
  try {
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greska na serveru' });
  }
});

router.get('/:id', async (req, res) => {
  const db = req.app.locals.db;
  try {
    await db.query('UPDATE oglasi SET broj_poseta = broj_poseta + 1 WHERE id=$1', [req.params.id]);
    const result = await db.query(
      `SELECT o.*, array_agg(s.putanja ORDER BY s.redosled) FILTER (WHERE s.putanja IS NOT NULL) as slike
       FROM oglasi o LEFT JOIN slike_oglasa s ON s.oglas_id = o.id WHERE o.id=$1 GROUP BY o.id`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Oglas nije pronadjen' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Greska na serveru' });
  }
});

router.post('/', authMiddleware, upload.array('slike', 5), async (req, res) => {
  const db = req.app.locals.db;
  if (req.user.tip !== 'oglasivac') return res.status(403).json({ error: 'Samo oglasivaci mogu postavljati oglase' });
  const { naziv, opis, vrsta_privrede, tip_posla, radnja, drzava, okrug, grad, opstina, mesna_zajednica, naselje, adresa, postanski_broj, telefon, email, web_sajt, video_url } = req.body;
  if (!naziv) return res.status(400).json({ error: 'Naziv je obavezan' });
  try {
    const result = await db.query(
      `INSERT INTO oglasi (korisnik_id,naziv,opis,vrsta_privrede,tip_posla,radnja,drzava,okrug,grad,opstina,mesna_zajednica,naselje,adresa,postanski_broj,telefon,email,web_sajt,video_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING *`,
      [req.user.id,naziv,opis,vrsta_privrede,tip_posla,radnja,drzava||'Srbija',okrug,grad,opstina,mesna_zajednica,naselje,adresa,postanski_broj,telefon,email,web_sajt,video_url]
    );
    const oglas = result.rows[0];
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        await db.query('INSERT INTO slike_oglasa (oglas_id,putanja,redosled) VALUES ($1,$2,$3)',
          [oglas.id, '/uploads/' + req.files[i].filename, i+1]);
      }
    }
    res.status(201).json(oglas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greska na serveru' });
  }
});

router.put('/:id', authMiddleware, upload.array('slike', 5), async (req, res) => {
  const db = req.app.locals.db;
  try {
    const oglas = await db.query('SELECT * FROM oglasi WHERE id=$1', [req.params.id]);
    if (oglas.rows.length === 0) return res.status(404).json({ error: 'Oglas nije pronadjen' });
    if (oglas.rows[0].korisnik_id !== req.user.id) return res.status(403).json({ error: 'Nemate dozvolu' });
    const { naziv, opis, vrsta_privrede, tip_posla, radnja, drzava, okrug, grad, opstina, mesna_zajednica, naselje, adresa, postanski_broj, telefon, email, web_sajt, video_url, aktivan } = req.body;
    const result = await db.query(
      `UPDATE oglasi SET naziv=$1,opis=$2,vrsta_privrede=$3,tip_posla=$4,radnja=$5,drzava=$6,okrug=$7,grad=$8,opstina=$9,mesna_zajednica=$10,naselje=$11,adresa=$12,postanski_broj=$13,telefon=$14,email=$15,web_sajt=$16,video_url=$17,aktivan=$18 WHERE id=$19 RETURNING *`,
      [naziv,opis,vrsta_privrede,tip_posla,radnja,drzava,okrug,grad,opstina,mesna_zajednica,naselje,adresa,postanski_broj,telefon,email,web_sajt,video_url,aktivan!==undefined?aktivan:true,req.params.id]
    );
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        await db.query('INSERT INTO slike_oglasa (oglas_id,putanja,redosled) VALUES ($1,$2,$3)',
          [req.params.id, '/uploads/' + req.files[i].filename, i+1]);
      }
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greska na serveru' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const db = req.app.locals.db;
  try {
    const oglas = await db.query('SELECT * FROM oglasi WHERE id=$1', [req.params.id]);
    if (oglas.rows.length === 0) return res.status(404).json({ error: 'Oglas nije pronadjen' });
    if (oglas.rows[0].korisnik_id !== req.user.id) return res.status(403).json({ error: 'Nemate dozvolu' });
    await db.query('DELETE FROM oglasi WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Greska na serveru' });
  }
});

module.exports = router;
