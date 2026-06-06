const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');
const JWT_SECRET = authMiddleware.JWT_SECRET;

router.post('/register', async (req, res) => {
  const db = req.app.locals.db;
  const { ime, prezime, email, lozinka, tip, korisnicko_ime, telefon, adresa, postanski_broj, drzava, okrug, grad, web_sajt, datum_rodjenja } = req.body;
  if (!email || !lozinka) return res.status(400).json({ error: 'Email i lozinka su obavezni' });
  try {
    const existing = await db.query('SELECT id FROM korisnici WHERE email=$1', [email]);
    if (existing.rows.length > 0) return res.status(400).json({ error: 'Email vec postoji' });
    if (korisnicko_ime) {
      const exUN = await db.query('SELECT id FROM korisnici WHERE korisnicko_ime=$1', [korisnicko_ime]);
      if (exUN.rows.length > 0) return res.status(400).json({ error: 'Korisnicko ime vec postoji' });
    }
    const hash = await bcrypt.hash(lozinka, 10);
    const result = await db.query(
      `INSERT INTO korisnici (ime,prezime,email,lozinka,tip,korisnicko_ime,telefon,adresa,postanski_broj,drzava,okrug,grad,web_sajt,datum_rodjenja)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id,email,ime,prezime,tip,korisnicko_ime`,
      [ime,prezime,email,hash,tip||'posetilac',korisnicko_ime||null,telefon,adresa,postanski_broj,drzava,okrug,grad,web_sajt,datum_rodjenja||null]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, tip: user.tip }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greska na serveru' });
  }
});

router.post('/login', async (req, res) => {
  const db = req.app.locals.db;
  const { email, lozinka } = req.body;
  if (!email || !lozinka) return res.status(400).json({ error: 'Email i lozinka su obavezni' });
  try {
    const result = await db.query('SELECT * FROM korisnici WHERE email=$1', [email]);
    if (result.rows.length === 0) return res.status(400).json({ error: 'Pogresni podaci' });
    const user = result.rows[0];
    const valid = await bcrypt.compare(lozinka, user.lozinka);
    if (!valid) return res.status(400).json({ error: 'Pogresni podaci' });
    const token = jwt.sign({ id: user.id, email: user.email, tip: user.tip }, JWT_SECRET, { expiresIn: '7d' });
    const { lozinka: _, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greska na serveru' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  const db = req.app.locals.db;
  try {
    const result = await db.query(
      'SELECT id,ime,prezime,email,tip,korisnicko_ime,telefon,adresa,postanski_broj,drzava,okrug,grad,web_sajt,datum_rodjenja,created_at FROM korisnici WHERE id=$1',
      [req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Korisnik nije pronadjen' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Greska na serveru' });
  }
});

router.put('/nalog', authMiddleware, async (req, res) => {
  const db = req.app.locals.db;
  const { ime, prezime, telefon, adresa, postanski_broj, drzava, okrug, grad, web_sajt, datum_rodjenja, nova_lozinka, stara_lozinka, novi_email } = req.body;
  try {
    if (nova_lozinka) {
      const userRes = await db.query('SELECT lozinka FROM korisnici WHERE id=$1', [req.user.id]);
      const valid = await bcrypt.compare(stara_lozinka, userRes.rows[0].lozinka);
      if (!valid) return res.status(400).json({ error: 'Stara lozinka nije tacna' });
      const hash = await bcrypt.hash(nova_lozinka, 10);
      await db.query('UPDATE korisnici SET lozinka=$1 WHERE id=$2', [hash, req.user.id]);
    }
    const fields = [ime,prezime,telefon,adresa,postanski_broj,drzava,okrug,grad,web_sajt,datum_rodjenja||null];
    let q = `UPDATE korisnici SET ime=$1,prezime=$2,telefon=$3,adresa=$4,postanski_broj=$5,drzava=$6,okrug=$7,grad=$8,web_sajt=$9,datum_rodjenja=$10`;
    if (novi_email) { q += `,email=$11`; fields.push(novi_email); fields.push(req.user.id); q += ` WHERE id=$12`; }
    else { fields.push(req.user.id); q += ` WHERE id=$11`; }
    q += ' RETURNING id,ime,prezime,email,tip,korisnicko_ime,telefon,adresa';
    const result = await db.query(q, fields);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greska na serveru' });
  }
});

module.exports = router;
