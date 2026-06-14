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

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(191) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('parent','enseignant','admin') NOT NULL,
  created_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY users_email_unique (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS classes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nom VARCHAR(60) NOT NULL,
  niveau VARCHAR(60) NULL DEFAULT NULL,
  description TEXT NULL DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY classes_nom_unique (nom)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS devoirs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  titre VARCHAR(255) NOT NULL,
  classe VARCHAR(60) NOT NULL,
  matiere VARCHAR(120) NOT NULL,
  description TEXT NULL DEFAULT NULL,
  date_limite DATE NULL DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id),
  KEY devoirs_classe_index (classe),
  KEY devoirs_date_limite_index (date_limite)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO migrations (migration, batch) VALUES
  ('2026_05_19_000001_create_eleves_table', 1),
  ('2026_05_19_000002_create_presences_table', 1),
  ('2026_05_19_000003_create_notes_table', 1),
  ('2026_05_19_000004_create_users_table', 1),
  ('2026_05_19_000005_create_classes_table', 1),
  ('2026_05_19_000006_create_devoirs_table', 1);

INSERT INTO eleves (id, nom, classe, parent_phone, parent_email, created_at, updated_at) VALUES
  (1, 'Jean-Paul Kashala', '3eme IG', '+243895646979', 'skykayumbabokomo@gmail.com', NOW(), NOW()),
  (2, 'Marie-Therese Mutombo', '3eme IG', '+243895646979', 'skykayumbabokomo@gmail.com', NOW(), NOW()),
  (3, 'Isaac Newton', '3eme IG', '+243895646979', 'skykayumbabokomo@gmail.com', NOW(), NOW()),
  (4, 'Sarah Malongo', '3eme IG', '+243895646979', 'skykayumbabokomo@gmail.com', NOW(), NOW()),
  (5, 'Patrick Lumumba', '3eme IG', '+243895646979', 'skykayumbabokomo@gmail.com', NOW(), NOW()),
  (6, 'Grace Nsimba', '3eme IG', '+243895646979', 'skykayumbabokomo@gmail.com', NOW(), NOW()),
  (7, 'Francois Tshilombo', '3eme IG', '+243895646979', 'skykayumbabokomo@gmail.com', NOW(), NOW()),
  (8, 'Esther Kabongo', '3eme IG', '+243895646979', 'skykayumbabokomo@gmail.com', NOW(), NOW()),
  (9, 'Emmanuel Kunda', '4eme IG', '+243895646979', 'skykayumbabokomo@gmail.com', NOW(), NOW()),
  (10, 'Sophie Mbuyi', '4eme IG', '+243895646979', 'skykayumbabokomo@gmail.com', NOW(), NOW()),
  (11, 'Daniel Kabila', '4eme IG', '+243895646979', 'skykayumbabokomo@gmail.com', NOW(), NOW()),
  (12, 'Catherine Tshiala', '4eme IG', '+243895646979', 'skykayumbabokomo@gmail.com', NOW(), NOW()),
  (13, 'Michel Kabengele', '5eme IG', '+243895646979', 'skykayumbabokomo@gmail.com', NOW(), NOW()),
  (14, 'Jeanne Mputu', '5eme IG', '+243895646979', 'skykayumbabokomo@gmail.com', NOW(), NOW()),
  (15, 'Joseph Ilunga', '5eme IG', '+243895646979', 'skykayumbabokomo@gmail.com', NOW(), NOW()),
  (16, 'Marie Kabedi', '6eme IG', '+243895646979', 'skykayumbabokomo@gmail.com', NOW(), NOW()),
  (17, 'Robert Masamba', '6eme IG', '+243895646979', 'skykayumbabokomo@gmail.com', NOW(), NOW()),
  (18, 'Alice Kalonji', '6eme IG', '+243895646979', 'skykayumbabokomo@gmail.com', NOW(), NOW()),
  (19, 'Thomas Kanza', '6eme IG', '+243895646979', 'skykayumbabokomo@gmail.com', NOW(), NOW()),
  (20, 'Julie Nkulu', '3eme IG', '+243895646979', 'skykayumbabokomo@gmail.com', NOW(), NOW()),
  (21, 'Paul Mulumba', '4eme IG', '+243895646979', 'skykayumbabokomo@gmail.com', NOW(), NOW()),
  (22, 'Nicole Badibanga', '5eme IG', '+243895646979', 'skykayumbabokomo@gmail.com', NOW(), NOW()),
  (23, 'Victor Musafiri', '3eme IG', '+243895646979', 'skykayumbabokomo@gmail.com', NOW(), NOW()),
  (24, 'Laura Mpoyi', '6eme IG', '+243895646979', 'skykayumbabokomo@gmail.com', NOW(), NOW()),
  (25, 'Henri Mukendi', '4eme IG', '+243895646979', 'skykayumbabokomo@gmail.com', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  nom = VALUES(nom),
  classe = VALUES(classe),
  parent_phone = VALUES(parent_phone),
  parent_email = VALUES(parent_email),
  updated_at = VALUES(updated_at);

INSERT INTO classes (nom, niveau, description, created_at, updated_at) VALUES
  ('3eme IG', '3eme IG', 'Classe 3eme IG', NOW(), NOW()),
  ('4eme IG', '4eme IG', 'Classe 4eme IG', NOW(), NOW()),
  ('5eme IG', '5eme IG', 'Classe 5eme IG', NOW(), NOW()),
  ('6eme IG', '6eme IG', 'Classe 6eme IG', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  niveau = VALUES(niveau),
  description = VALUES(description),
  updated_at = VALUES(updated_at);

INSERT INTO users (id, name, email, password, role, created_at, updated_at) VALUES
  (1, 'Administrateur EduTrack', 'admin@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', NOW(), NOW()),
  (2, 'Enseignant EduTrack', 'enseignant@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'enseignant', NOW(), NOW()),
  (3, 'Parent EduTrack', 'skykayumbabokomo@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'parent', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  email = VALUES(email),
  password = VALUES(password),
  role = VALUES(role),
  updated_at = VALUES(updated_at);
