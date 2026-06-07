const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const db = req.app.locals.db;
  const { q, ime, drzava, grad, naselje, delatnost, tip } = req.query;
  let query = `SELECT o.*, array_agg(s.putanja ORDER BY s.redosled) FILTER (WHERE s.putanja IS NOT NULL) as slike
    FROM oglasi o LEFT JOIN slike_oglasa s ON s.oglas_id = o.id WHERE o.aktivan = true`;
  const params = [];
  let i = 1;
  if (q) { query += ` AND (o.naziv ILIKE $${i} OR o.opis ILIKE $${i} OR o.grad ILIKE $${i})`; params.push(`%${q}%`); i++; }
  if (ime) { query += ` AND o.naziv ILIKE $${i++}`; params.push(`%${ime}%`); }
  if (drzava) { query += ` AND o.drzava ILIKE $${i++}`; params.push(`%${drzava}%`); }
  if (grad) { query += ` AND o.grad ILIKE $${i++}`; params.push(`%${grad}%`); }
  if (naselje) { query += ` AND o.naselje ILIKE $${i++}`; params.push(`%${naselje}%`); }
  if (delatnost) { query += ` AND o.vrsta_privrede ILIKE $${i++}`; params.push(`%${delatnost}%`); }
  if (tip) { query += ` AND o.tip_posla ILIKE $${i++}`; params.push(`%${tip}%`); }
  query += ' GROUP BY o.id ORDER BY o.broj_poseta DESC, o.created_at DESC LIMIT 100';
  try {
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greska na serveru' });
  }
});

module.exports = router;
