SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE DATABASE IF NOT EXISTS edutrack
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE edutrack;

CREATE TABLE IF NOT EXISTS migrations (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  migration VARCHAR(191) NOT NULL,
  batch INT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY migrations_migration_unique (migration)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS eleves (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nom VARCHAR(255) NOT NULL,
  classe VARCHAR(60) NOT NULL,
  parent_phone VARCHAR(30) NOT NULL,
  parent_email VARCHAR(150) NOT NULL,
  created_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS presences (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  eleve_id BIGINT UNSIGNED NOT NULL,
  statut ENUM('P','A','R') NOT NULL,
  date_presence DATE NOT NULL,
  created_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY presences_eleve_id_date_presence_unique (eleve_id, date_presence),
  KEY presences_eleve_id_foreign (eleve_id),
  CONSTRAINT presences_eleve_id_foreign
    FOREIGN KEY (eleve_id) REFERENCES eleves (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  eleve_id BIGINT UNSIGNED NOT NULL,
  type ENUM('Interro','Examen') NOT NULL,
  valeur DECIMAL(5,2) NOT NULL,
  date_note DATE NOT NULL,
  created_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id),
  KEY notes_eleve_id_foreign (eleve_id),
  CONSTRAINT notes_eleve_id_foreign
    FOREIGN KEY (eleve_id) REFERENCES eleves (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO migrations (migration, batch) VALUES
  ('2026_05_19_000001_create_eleves_table', 1),
  ('2026_05_19_000002_create_presences_table', 1),
  ('2026_05_19_000003_create_notes_table', 1);

INSERT INTO eleves (id, nom, classe, parent_phone, parent_email, created_at, updated_at) VALUES
  (1, 'Jean-Paul Kashala', '3eme IG', '+243829225086', 'zackmpete1@gmail.com', NOW(), NOW()),
  (2, 'Marie-Therese Mutombo', '3eme IG', '+243829225086', 'zackmpete1@gmail.com', NOW(), NOW()),
  (3, 'Isaac Newton', '3eme IG', '+243829225086', 'zackmpete1@gmail.com', NOW(), NOW()),
  (4, 'Sarah Malongo', '3eme IG', '+243829225086', 'zackmpete1@gmail.com', NOW(), NOW()),
  (5, 'Patrick Lumumba', '3eme IG', '+243829225086', 'zackmpete1@gmail.com', NOW(), NOW()),
  (6, 'Grace Nsimba', '3eme IG', '+243829225086', 'zackmpete1@gmail.com', NOW(), NOW()),
  (7, 'Francois Tshilombo', '3eme IG', '+243829225086', 'zackmpete1@gmail.com', NOW(), NOW()),
  (8, 'Esther Kabongo', '3eme IG', '+243829225086', 'zackmpete1@gmail.com', NOW(), NOW()),
  (9, 'Emmanuel Kunda', '4eme IG', '+243829225086', 'zackmpete1@gmail.com', NOW(), NOW()),
  (10, 'Sophie Mbuyi', '4eme IG', '+243829225086', 'zackmpete1@gmail.com', NOW(), NOW()),
  (11, 'Daniel Kabila', '4eme IG', '+243829225086', 'zackmpete1@gmail.com', NOW(), NOW()),
  (12, 'Catherine Tshiala', '4eme IG', '+243829225086', 'zackmpete1@gmail.com', NOW(), NOW()),
  (13, 'Michel Kabengele', '5eme IG', '+243829225086', 'zackmpete1@gmail.com', NOW(), NOW()),
  (14, 'Jeanne Mputu', '5eme IG', '+243829225086', 'zackmpete1@gmail.com', NOW(), NOW()),
  (15, 'Joseph Ilunga', '5eme IG', '+243829225086', 'zackmpete1@gmail.com', NOW(), NOW()),
  (16, 'Marie Kabedi', '6eme IG', '+243829225086', 'zackmpete1@gmail.com', NOW(), NOW()),
  (17, 'Robert Masamba', '6eme IG', '+243829225086', 'zackmpete1@gmail.com', NOW(), NOW()),
  (18, 'Alice Kalonji', '6eme IG', '+243829225086', 'zackmpete1@gmail.com', NOW(), NOW()),
  (19, 'Thomas Kanza', '6eme IG', '+243829225086', 'zackmpete1@gmail.com', NOW(), NOW()),
  (20, 'Julie Nkulu', '3eme IG', '+243829225086', 'zackmpete1@gmail.com', NOW(), NOW()),
  (21, 'Paul Mulumba', '4eme IG', '+243829225086', 'zackmpete1@gmail.com', NOW(), NOW()),
  (22, 'Nicole Badibanga', '5eme IG', '+243829225086', 'zackmpete1@gmail.com', NOW(), NOW()),
  (23, 'Victor Musafiri', '3eme IG', '+243829225086', 'zackmpete1@gmail.com', NOW(), NOW()),
  (24, 'Laura Mpoyi', '6eme IG', '+243829225086', 'zackmpete1@gmail.com', NOW(), NOW()),
  (25, 'Henri Mukendi', '4eme IG', '+243829225086', 'zackmpete1@gmail.com', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  nom = VALUES(nom),
  classe = VALUES(classe),
  parent_phone = VALUES(parent_phone),
  parent_email = VALUES(parent_email),
  updated_at = VALUES(updated_at);
