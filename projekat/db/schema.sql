CREATE TABLE IF NOT EXISTS korisnici (
  id SERIAL PRIMARY KEY,
  ime VARCHAR(100),
  prezime VARCHAR(100),
  email VARCHAR(255) UNIQUE NOT NULL,
  lozinka VARCHAR(255) NOT NULL,
  tip VARCHAR(20) DEFAULT 'posetilac',
  korisnicko_ime VARCHAR(100) UNIQUE,
  telefon VARCHAR(50),
  adresa VARCHAR(255),
  postanski_broj VARCHAR(20),
  drzava VARCHAR(100),
  okrug VARCHAR(100),
  grad VARCHAR(100),
  web_sajt VARCHAR(255),
  datum_rodjenja DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS oglasi (
  id SERIAL PRIMARY KEY,
  korisnik_id INTEGER REFERENCES korisnici(id),
  naziv VARCHAR(255) NOT NULL,
  opis TEXT,
  vrsta_privrede VARCHAR(100),
  tip_posla VARCHAR(100),
  radnja VARCHAR(100),
  drzava VARCHAR(100) DEFAULT 'Srbija',
  okrug VARCHAR(100),
  grad VARCHAR(100),
  opstina VARCHAR(100),
  mesna_zajednica VARCHAR(100),
  naselje VARCHAR(100),
  adresa VARCHAR(255),
  postanski_broj VARCHAR(20),
  telefon VARCHAR(50),
  email VARCHAR(255),
  web_sajt VARCHAR(255),
  video_url VARCHAR(500),
  broj_poseta INTEGER DEFAULT 0,
  aktivan BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS slike_oglasa (
  id SERIAL PRIMARY KEY,
  oglas_id INTEGER REFERENCES oglasi(id) ON DELETE CASCADE,
  putanja VARCHAR(500),
  redosled INTEGER DEFAULT 1
);
